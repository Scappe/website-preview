import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'site');
const repoAssetsRoot = path.join(root, 'assets');
const CANONICAL_LOGO = '/assets/media/axante-logo.png';
const FOUNDATION_VERSION = '13.0';

if (!fs.existsSync(siteRoot)) throw new Error('site directory is missing');
if (!fs.existsSync(path.join(siteRoot, 'assets', 'media', 'axante-logo.png'))) {
  throw new Error('Canonical Axante logo is missing: site/assets/media/axante-logo.png');
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function routeFor(file) {
  const relative = path.relative(siteRoot, file).replaceAll('\\', '/');
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404';
  return `/${relative.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
}

function currentAttr(route, target) {
  if (target === '/' && route === '/') return ' aria-current="page"';
  if (target !== '/' && (route === target || route.startsWith(`${target}/`))) return ' aria-current="page"';
  return '';
}

function header(route) {
  const nav = [
    ['/', 'Home'],
    ['/servizi', 'Servizi'],
    ['/portfolio', 'Portfolio'],
    ['/chi-siamo', 'Chi siamo'],
    ['/contatti', 'Contatti']
  ].map(([href, label]) => `<a href="${href}"${currentAttr(route, href)}>${label}</a>`).join('');

  return `<header class="site-header" data-global-component="header" data-global-component-version="${FOUNDATION_VERSION}"><div class="container nav-wrap"><a class="logo" href="/" aria-label="Axante, home"><img src="${CANONICAL_LOGO}" width="198" height="76" alt="Axante"></a><nav class="nav" aria-label="Navigazione principale">${nav}</nav><a class="nav-cta" href="/contatti">Audit gratuito <span>↗</span></a><button class="menu-toggle" type="button" aria-label="Apri il menu" aria-expanded="false"><span></span></button></div></header>`;
}

function footer() {
  return `<footer class="site-footer" data-global-component="footer" data-global-component-version="${FOUNDATION_VERSION}"><div class="container"><div class="footer-grid"><div class="footer-brand"><img src="${CANONICAL_LOGO}" width="198" height="76" alt="Axante"><p>Strategia, design e tecnologia per trasformare la presenza digitale in uno strumento di crescita concreto.</p></div><div><div class="footer-title">Esplora</div><div class="footer-links"><a href="/servizi">Servizi</a><a href="/portfolio">Portfolio</a><a href="/chi-siamo">Chi siamo</a><a href="/contatti">Contatti</a><a href="/lavora-con-noi">Lavora con noi</a></div></div><div><div class="footer-title">Servizi</div><div class="footer-links"><a href="/servizi#web">Siti ed e-commerce</a><a href="/servizi#marketing">Advertising e social</a><a href="/servizi#brand">Brand identity</a><a href="/servizi#development">Development</a></div></div><div><div class="footer-title">Contatti</div><div class="footer-links"><a href="tel:+390633973984">06 3397 3984</a><a href="mailto:hello@axante.it">hello@axante.it</a><span>Via Innocenzo XI 40 · Roma</span></div></div></div></div></footer>`;
}

const htmlFiles = walk(siteRoot).filter(file => file.endsWith('.html'));
let normalized = 0;
for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  const route = routeFor(file);

  if (/<header\b[^>]*class="[^"]*site-header[^"]*"[\s\S]*?<\/header>/i.test(html)) {
    html = html.replace(/<header\b[^>]*class="[^"]*site-header[^"]*"[\s\S]*?<\/header>/i, header(route));
  }
  if (/<footer\b[^>]*class="[^"]*site-footer[^"]*"[\s\S]*?<\/footer>/i.test(html)) {
    html = html.replace(/<footer\b[^>]*class="[^"]*site-footer[^"]*"[\s\S]*?<\/footer>/i, footer());
  }

  // No generated page may reference an alternative Axante logo after this pass.
  html = html
    .replace(/src="\/assets\/axante-logo\.svg"/g, `src="${CANONICAL_LOGO}"`)
    .replace(/src="https:\/\/www\.axante\.it\/wp-content\/uploads\/2021\/08\/axante-logo\.png"/g, `src="${CANONICAL_LOGO}"`);

  if (html !== before) {
    fs.writeFileSync(file, html);
    normalized += 1;
  }
}

const origins = {
  'axante-logo.png': 'https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png',
  'casarossa.jpg': 'https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg',
  'unicart.jpg': 'https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg',
  'carabetta.jpg': 'https://www.axante.it/wp-content/uploads/2021/08/copertina-sito-carabetta.jpg',
  'carabetta-logo.png': 'https://www.axante.it/wp-content/uploads/2021/08/carabetta-logo.png',
  'weblab.jpg': 'https://www.axante.it/wp-content/uploads/2021/08/weblab.jpg',
  'tda.jpg': 'https://www.axante.it/wp-content/uploads/2021/08/tda.jpg'
};

function classify(name) {
  if (/logo/i.test(name)) return 'logos';
  if (/casarossa|unicart|carabetta|weblab|tda/i.test(name)) return 'portfolio';
  if (/share|og-/i.test(name)) return 'social';
  if (/texture|noise|grain/i.test(name)) return 'textures';
  return 'decorative';
}

const manifestAssets = [];
const seen = new Set();
for (const [dir, publicBase, source] of [
  [path.join(siteRoot, 'assets', 'media'), '/assets/media', 'site-media'],
  [repoAssetsRoot, '/assets', 'repo-static']
]) {
  for (const file of walk(dir)) {
    const relative = path.relative(dir, file).replaceAll('\\', '/');
    const publicPath = `${publicBase}/${relative}`;
    if (seen.has(publicPath)) continue;
    seen.add(publicPath);
    const name = path.basename(file);
    manifestAssets.push({
      path: publicPath,
      category: classify(name),
      bytes: fs.statSync(file).size,
      source,
      origin: origins[name] || null
    });
  }
}

manifestAssets.sort((a, b) => a.path.localeCompare(b.path));
const manifest = {
  version: FOUNDATION_VERSION,
  generatedBy: 'scripts/apply-foundation-v13.mjs',
  canonicalLogo: CANONICAL_LOGO,
  hosting: 'repository + Vercel static delivery',
  maintenance: 'automatic build-time catalog; no manual hosting required',
  assets: manifestAssets
};
fs.mkdirSync(path.join(siteRoot, 'assets'), { recursive: true });
fs.writeFileSync(path.join(siteRoot, 'assets', 'asset-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Foundation v${FOUNDATION_VERSION}: normalized ${normalized}/${htmlFiles.length} HTML pages; catalogued ${manifestAssets.length} assets.`);
