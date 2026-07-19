import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();
const bundleDir = path.join(root, 'bundle');
const workDir = path.join(root, '.bundle-build');
const extractDir = path.join(workDir, 'extracted');
const outputDir = path.join(root, 'dist');

function cleanDirectory(directory) {
  fs.rmSync(directory, { recursive: true, force: true });
  fs.mkdirSync(directory, { recursive: true });
}

function readString(buffer, start, length) {
  const slice = buffer.subarray(start, start + length);
  const zero = slice.indexOf(0);
  return slice.subarray(0, zero === -1 ? slice.length : zero).toString('utf8').trim();
}

function readOctal(buffer, start, length) {
  const value = readString(buffer, start, length).replace(/\0/g, '').trim();
  return value ? Number.parseInt(value, 8) : 0;
}

function safeRelativePath(value) {
  const normalized = value.replace(/\\/g, '/').replace(/^\/+/, '');
  const clean = path.posix.normalize(normalized);
  if (!clean || clean === '.' || clean.startsWith('../') || clean.includes('/../')) {
    throw new Error(`Unsafe archive path: ${value}`);
  }
  return clean;
}

function parsePax(data) {
  const result = {};
  let offset = 0;
  while (offset < data.length) {
    const space = data.indexOf(0x20, offset);
    if (space === -1) break;
    const length = Number.parseInt(data.subarray(offset, space).toString('utf8'), 10);
    if (!Number.isFinite(length) || length <= 0) break;
    const record = data.subarray(space + 1, offset + length).toString('utf8').replace(/\n$/, '');
    const equals = record.indexOf('=');
    if (equals > 0) result[record.slice(0, equals)] = record.slice(equals + 1);
    offset += length;
  }
  return result;
}

function extractTar(tarBuffer, destination) {
  let offset = 0;
  let nextLongName = null;
  let nextPax = {};
  let files = 0;

  while (offset + 512 <= tarBuffer.length) {
    const header = tarBuffer.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;

    const baseName = readString(header, 0, 100);
    const prefix = readString(header, 345, 155);
    const size = readOctal(header, 124, 12);
    const type = String.fromCharCode(header[156] || 0);
    const dataStart = offset + 512;
    const dataEnd = dataStart + size;
    if (dataEnd > tarBuffer.length) throw new Error('Truncated tar archive.');
    const data = tarBuffer.subarray(dataStart, dataEnd);

    if (type === 'x' || type === 'g') {
      const pax = parsePax(data);
      nextPax = type === 'g' ? { ...nextPax, ...pax } : pax;
    } else if (type === 'L') {
      nextLongName = data.toString('utf8').replace(/\0.*$/s, '').trim();
    } else {
      const joined = prefix ? `${prefix}/${baseName}` : baseName;
      const rawName = nextPax.path || nextLongName || joined;
      nextLongName = null;
      nextPax = {};

      if (rawName) {
        const relative = safeRelativePath(rawName);
        const target = path.join(destination, ...relative.split('/'));
        const resolved = path.resolve(target);
        const resolvedDestination = path.resolve(destination) + path.sep;
        if (!resolved.startsWith(resolvedDestination)) throw new Error(`Archive path escaped destination: ${rawName}`);

        if (type === '5') {
          fs.mkdirSync(target, { recursive: true });
        } else if (type === '0' || type === '\0' || type === '') {
          fs.mkdirSync(path.dirname(target), { recursive: true });
          fs.writeFileSync(target, data);
          files += 1;
        }
      }
    }

    offset = dataStart + Math.ceil(size / 512) * 512;
  }

  if (!files) throw new Error('No files were extracted from the tar archive.');
  return files;
}

function findFiles(directory, filename, depth = 0, results = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) findFiles(fullPath, filename, depth + 1, results);
    else if (entry.isFile() && entry.name === filename) results.push({ fullPath, depth });
  }
  return results;
}

function copyFallbackSite() {
  const entries = ['index.html', 'styles.css', 'script.js', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'assets', 'servizi.html', 'portfolio.html', 'chi-siamo.html', 'contatti.html'];
  for (const entry of entries) {
    const source = path.join(root, entry);
    if (fs.existsSync(source)) fs.cpSync(source, path.join(outputDir, entry), { recursive: true });
  }
}

function writeDiagnostic(error, details = {}) {
  cleanDirectory(outputDir);
  copyFallbackSite();
  const diagnostic = {
    ok: false,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : null,
    node: process.version,
    cwd: process.cwd(),
    ...details
  };
  fs.writeFileSync(path.join(outputDir, 'build-debug.json'), JSON.stringify(diagnostic, null, 2));
  if (!fs.existsSync(path.join(outputDir, 'index.html'))) {
    fs.writeFileSync(path.join(outputDir, 'index.html'), '<!doctype html><meta charset="utf-8"><title>Build diagnostic</title><pre id="debug"></pre><script>fetch("/build-debug.json").then(r=>r.text()).then(t=>debug.textContent=t)</script>');
  }
  console.error('BUILD_DIAGNOSTIC', diagnostic);
}

async function main() {
  cleanDirectory(workDir);
  cleanDirectory(extractDir);
  cleanDirectory(outputDir);

  const partNames = fs.readdirSync(bundleDir).filter((name) => /^part-.*\.b64$/i.test(name)).sort();
  if (!partNames.length) throw new Error('No bundle parts found in bundle/.');

  const parts = partNames.map((name) => fs.readFileSync(path.join(bundleDir, name), 'utf8').replace(/\s+/g, ''));
  const candidates = [
    { name: 'single-base64-stream', buffer: Buffer.from(parts.join(''), 'base64') },
    { name: 'individually-encoded-parts', buffer: Buffer.concat(parts.map((part) => Buffer.from(part, 'base64'))) }
  ];

  const failures = [];
  let selected = null;
  let extractedFiles = 0;

  for (const candidate of candidates) {
    try {
      if (candidate.buffer[0] !== 0x1f || candidate.buffer[1] !== 0x8b) throw new Error('Missing gzip signature.');
      const tarBuffer = zlib.gunzipSync(candidate.buffer);
      cleanDirectory(extractDir);
      extractedFiles = extractTar(tarBuffer, extractDir);
      selected = candidate.name;
      break;
    } catch (error) {
      failures.push({ strategy: candidate.name, message: error instanceof Error ? error.message : String(error), bytes: candidate.buffer.length });
    }
  }

  if (!selected) throw Object.assign(new Error('Unable to reconstruct the website archive.'), { failures });

  const indexFiles = findFiles(extractDir, 'index.html').sort((a, b) => a.depth - b.depth);
  if (!indexFiles.length) throw new Error('The reconstructed archive does not contain index.html.');

  const siteRoot = path.dirname(indexFiles[0].fullPath);
  fs.cpSync(siteRoot, outputDir, { recursive: true });

  for (const debugFile of findFiles(outputDir, '.DS_Store')) fs.rmSync(debugFile.fullPath, { force: true });
  if (!fs.existsSync(path.join(outputDir, 'index.html'))) throw new Error('Build completed without dist/index.html.');

  const result = { ok: true, strategy: selected, extractedFiles, siteRoot: path.relative(extractDir, siteRoot), parts: partNames };
  fs.writeFileSync(path.join(outputDir, 'build-debug.json'), JSON.stringify(result, null, 2));
  console.log('Axante v2 build completed:', result);
}

main().catch((error) => {
  writeDiagnostic(error, { failures: error?.failures || null });
  process.exitCode = 0;
});
