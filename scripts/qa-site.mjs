import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.join(process.cwd(), 'dist');
const failures = [];
const socialImage = 'https://website-preview-murex.vercel.app/assets/media/axante-share-v1.png';
const canonicalLogo = '/assets/media/axante-logo.png';
const foundationMarker = 'data-global-component-version="13.0"';
const requiredFiles = [
  'index.html',
  'home-v5.css',
  'home-v5.js',
  'portfolio-v5.css',
  'portfolio-mobile-performance.css',
  'fixes-v6.css',
  'fixes-v6.js',
  'styles.css',
  'script.js',
  'enhance-v5.css',
  'enhance-v5.js',
  'sitemap.xml',
  'robots.txt',
  '404.html',
  'assets/asset-manifest.json',
  'assets/media/axante-logo.png',
  'assets/media/axante-share-v1.png',
  'assets/media/casarossa.jpg',
  'assets/media/unicart.jpg',
  'assets/media/carabetta.jpg',
  'assets/media/carabetta-logo.png',
  'assets/media/weblab.jpg',
  'assets/media/tda.jpg'
];

for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(root, relative))) failures.push(`Missing required file: ${relative}`);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));

function resolvePublicPath(value) {
  const clean = value.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return null;
  if (clean === '/') return path.join(root, 'index.html');
  const direct = path.join(root, clean.slice(1));
  if (path.extname(clean)) return direct;
  return path.join(direct, 'index.html');
}

function principalPath(route) {
  if (route === '/') return path.join(root, 'index.html');
  return path.join(root, route.slice(1), 'index.html');
}

const principalRoutes = ['/', '/servizi', '/portfolio', '/chi-siamo', '/contatti'];
for (const route of principalRoutes) {
  const file = principalPath(route);
  if (!fs.existsSync(file)) {
    failures.push(`Missing principal route: ${route}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const header = html.match(/<header\b[^>]*class="[^"]*site-header[^"]*"[\s\S]*?<\/header>/i)?.[0] || '';
  const footer = html.match(/<footer\b[^>]*class="[^"]*site-footer[^"]*"[\s\S]*?<\/footer>/i)?.[0] || '';
  if (!header) failures.push(`${route}: canonical site header missing`);
  if (!footer) failures.push(`${route}: canonical site footer missing`);
  if (!header.includes(foundationMarker) || !footer.includes(foundationMarker)) failures.push(`${route}: foundation v13 global marker missing`);
  if (!header.includes(`src="${canonicalLogo}"`)) failures.push(`${route}: header does not use canonical logo`);
  if (!footer.includes(`src="${canonicalLogo}"`)) failures.push(`${route}: footer does not use canonical logo`);
  if (/axante-logo\.svg|www\.axante\.it\/wp-content\/uploads\/2021\/08\/axante-logo\.png/i.test(header + footer)) {
    failures.push(`${route}: global components still reference a legacy logo`);
  }
}

for (const file of htmlFiles) {
  const relative = path.relative(root, file);
  const html = fs.readFileSync(file, 'utf8');
  const requiredTokens = ['<meta name="viewport"', '<meta name="description"', '<title>', '<h1'];
  for (const token of requiredTokens) {
    if (!html.includes(token)) failures.push(`${relative}: missing ${token}`);
  }
  if (!html.includes(`<meta property="og:image" content="${socialImage}">`)) failures.push(`${relative}: missing branded og:image`);
  if (!html.includes('<meta property="og:image:width" content="1200">')) failures.push(`${relative}: missing og:image width`);
  if (!html.includes('<meta property="og:image:height" content="630">')) failures.push(`${relative}: missing og:image height`);
  if (!html.includes('<meta property="og:image:type" content="image/png">')) failures.push(`${relative}: missing og:image MIME type`);
  if (!html.includes('<meta name="twitter:card" content="summary_large_image">')) failures.push(`${relative}: missing large Twitter card`);
  const socialTags = html.match(/<meta[^>]+(?:og:image|twitter:image)[^>]*>/gi)?.join('') || '';
  if (/casarossa-screenshot\.jpg/i.test(socialTags)) failures.push(`${relative}: Casa Rossa is still used as a social preview`);
  if (/class="case-media clip-reveal"/.test(html)) failures.push(`${relative}: project media can still be clipped invisible`);
  if (/src="https:\/\/www\.axante\.it\/wp-content\/uploads/i.test(html)) failures.push(`${relative}: runtime image still hotlinks WordPress`);
  if (/home-v4\.(css|js)|portfolio-v4\.css/.test(html)) failures.push(`${relative}: obsolete v4 asset reference`);
  if (/src="\/assets\/axante-logo\.svg"|src="https:\/\/www\.axante\.it\/wp-content\/uploads\/2021\/08\/axante-logo\.png"/i.test(html)) {
    failures.push(`${relative}: legacy Axante logo reference survived foundation pass`);
  }

  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map(match => match[0]);
  for (const tag of imageTags) {
    const src = tag.match(/src="([^"]+)"/i)?.[1] || '(unknown image)';
    const sized = (/\bwidth="\d+"/i.test(tag) && /\bheight="\d+"/i.test(tag)) || /style="[^"]*aspect-ratio/i.test(tag);
    if (!sized) failures.push(`${relative}: image lacks stable dimensions/aspect ratio: ${src}`);
  }

  const sources = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
  for (const source of sources) {
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/.test(source)) continue;
    const resolved = resolvePublicPath(source);
    if (resolved && !fs.existsSync(resolved)) failures.push(`${relative}: broken internal reference ${source}`);
  }
}

const css = fs.existsSync(path.join(root, 'home-v5.css')) ? fs.readFileSync(path.join(root, 'home-v5.css'), 'utf8') : '';
if (!/overflow-x:(?:clip|hidden)/.test(css)) failures.push('home-v5.css: no root horizontal overflow safeguard');
if (!/\.footer-brand img[^}]*height:auto/.test(css)) failures.push('home-v5.css: footer logo aspect ratio is not protected');

const portfolioHtml = fs.existsSync(path.join(root, 'portfolio', 'index.html')) ? fs.readFileSync(path.join(root, 'portfolio', 'index.html'), 'utf8') : '';
const performanceCss = fs.existsSync(path.join(root, 'portfolio-mobile-performance.css')) ? fs.readFileSync(path.join(root, 'portfolio-mobile-performance.css'), 'utf8') : '';
const fixesJs = fs.existsSync(path.join(root, 'fixes-v6.js')) ? fs.readFileSync(path.join(root, 'fixes-v6.js'), 'utf8') : '';
if (!portfolioHtml.includes('/portfolio-mobile-performance.css?v=6.3')) failures.push('portfolio/index.html: mobile performance layer is not linked');
if (!/\.portfolio-page \.case-study[^}]*transform:none!important/.test(performanceCss)) failures.push('portfolio-mobile-performance.css: cards are not protected from scroll transforms');
if (!fixesJs.includes("!element.closest('.portfolio-page')")) failures.push('fixes-v6.js: portfolio cards can re-enter the per-frame animation loop');

for (const asset of requiredFiles.filter(file => file.startsWith('assets/media/'))) {
  const bytes = fs.existsSync(path.join(root, asset)) ? fs.statSync(path.join(root, asset)).size : 0;
  if (bytes < 500) failures.push(`${asset}: file is empty or invalid (${bytes} bytes)`);
}

const manifestPath = path.join(root, 'assets', 'asset-manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.version !== '13.0') failures.push(`asset-manifest.json: expected version 13.0, found ${manifest.version}`);
    if (manifest.canonicalLogo !== canonicalLogo) failures.push('asset-manifest.json: canonicalLogo mismatch');
    if (!Array.isArray(manifest.assets) || manifest.assets.length < 7) failures.push('asset-manifest.json: asset catalog unexpectedly small');
    for (const asset of manifest.assets || []) {
      if (!asset.path || !asset.category || typeof asset.bytes !== 'number') failures.push('asset-manifest.json: invalid asset record');
    }
  } catch (error) {
    failures.push(`Unable to parse asset-manifest.json: ${error.message}`);
  }
}

const socialPath = path.join(root, 'assets/media/axante-share-v1.png');
if (fs.existsSync(socialPath)) {
  try {
    const metadata = await sharp(socialPath).metadata();
    if (metadata.width !== 1200 || metadata.height !== 630 || metadata.format !== 'png') {
      failures.push(`Social image has invalid metadata: ${metadata.width}x${metadata.height} ${metadata.format}`);
    }
  } catch (error) {
    failures.push(`Unable to inspect social image: ${error.message}`);
  }
}

if (failures.length) {
  console.error('\nSITE QA FAILED');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`SITE QA PASSED: ${htmlFiles.length} HTML pages, ${requiredFiles.length} critical files, canonical globals and ${principalRoutes.length} principal routes verified.`);
