import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import * as tar from 'tar';

const root = process.cwd();
const bundleDir = path.join(root, 'bundle');
const workDir = path.join(root, '.bundle-build');
const extractDir = path.join(workDir, 'extracted');
const outputDir = path.join(root, 'dist');

fs.rmSync(workDir, { recursive: true, force: true });
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(extractDir, { recursive: true });
fs.mkdirSync(outputDir, { recursive: true });

const parts = fs.readdirSync(bundleDir)
  .filter((name) => /^part-.*\.b64$/i.test(name))
  .sort()
  .map((name) => ({
    name,
    text: fs.readFileSync(path.join(bundleDir, name), 'utf8').replace(/\s+/g, '')
  }));

if (!parts.length) {
  throw new Error('No bundle parts found in bundle/.');
}

const candidates = [
  {
    name: 'single base64 stream',
    buffer: Buffer.from(parts.map((part) => part.text).join(''), 'base64')
  },
  {
    name: 'individually encoded chunks',
    buffer: Buffer.concat(parts.map((part) => Buffer.from(part.text, 'base64')))
  }
];

let archivePath = null;
let selected = null;

for (const candidate of candidates) {
  try {
    if (candidate.buffer[0] !== 0x1f || candidate.buffer[1] !== 0x8b) {
      throw new Error('missing gzip signature');
    }
    zlib.gunzipSync(candidate.buffer);
    const file = path.join(workDir, `axante-${selected ? 'fallback' : 'candidate'}.tar.gz`);
    fs.writeFileSync(file, candidate.buffer);
    await tar.t({ file, strict: true });
    archivePath = file;
    selected = candidate.name;
    break;
  } catch (error) {
    console.log(`Bundle strategy failed (${candidate.name}): ${error.message}`);
  }
}

if (!archivePath) {
  throw new Error('Unable to reconstruct a valid tar.gz archive from the bundle parts.');
}

console.log(`Bundle reconstructed using: ${selected}`);
await tar.x({ file: archivePath, cwd: extractDir, strict: true });

function findFiles(directory, filename, depth = 0, results = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      findFiles(fullPath, filename, depth + 1, results);
    } else if (entry.isFile() && entry.name === filename) {
      results.push({ fullPath, depth });
    }
  }
  return results;
}

const indexFiles = findFiles(extractDir, 'index.html').sort((a, b) => a.depth - b.depth);
if (!indexFiles.length) {
  throw new Error('The reconstructed archive does not contain index.html.');
}

const siteRoot = path.dirname(indexFiles[0].fullPath);
fs.cpSync(siteRoot, outputDir, { recursive: true });

function removeDsStore(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) removeDsStore(fullPath);
    if (entry.isFile() && entry.name === '.DS_Store') fs.rmSync(fullPath);
  }
}
removeDsStore(outputDir);

if (!fs.existsSync(path.join(outputDir, 'index.html'))) {
  throw new Error('Build completed without dist/index.html.');
}

const publishedFiles = [];
function listFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) listFiles(fullPath);
    else publishedFiles.push(path.relative(outputDir, fullPath));
  }
}
listFiles(outputDir);
console.log(`Axante v2 published to dist/ (${publishedFiles.length} files).`);
console.log(publishedFiles.slice(0, 100).join('\n'));
