import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const sourceHtml = path.join(root, 'servizi.html');
const sourceCss = path.join(root, 'servizi-premium.css');
const sourceJs = path.join(root, 'servizi-premium.js');
const socialImageUrl = 'https://website-preview-murex.vercel.app/assets/media/axante-share-v1.png';

for (const file of [sourceHtml, sourceCss, sourceJs]) {
  if (!fs.existsSync(file)) throw new Error(`Missing services source: ${path.basename(file)}`);
}

let html = fs.readFileSync(sourceHtml, 'utf8');
const replacements = [
  ['href="styles.css"', 'href="/styles.css"'],
  ['href="servizi-premium.css"', 'href="/servizi-premium.css?v=17.0"'],
  ['src="script.js"', 'src="/script.js"'],
  ['src="servizi-premium.js"', 'src="/servizi-premium.js?v=17.0"'],
  ['href="index.html"', 'href="/"'],
  ['href="servizi.html"', 'href="/servizi"'],
  ['href="portfolio.html', 'href="/portfolio'],
  ['href="chi-siamo.html"', 'href="/chi-siamo"'],
  ['href="contatti.html"', 'href="/contatti"'],
  ['href="lavora-con-noi.html"', 'href="/lavora-con-noi"'],
  ['src="assets/', 'src="/assets/']
];
for (const [from, to] of replacements) html = html.split(from).join(to);

const socialMeta = `<meta property="og:image" content="${socialImageUrl}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${socialImageUrl}">`;
if (!html.includes('property="og:image"')) html = html.replace('</head>', `${socialMeta}</head>`);

const serviceDir = path.join(site, 'servizi');
fs.mkdirSync(serviceDir, { recursive: true });
fs.writeFileSync(path.join(serviceDir, 'index.html'), html);
fs.copyFileSync(sourceCss, path.join(site, 'servizi-premium.css'));
fs.copyFileSync(sourceJs, path.join(site, 'servizi-premium.js'));

const checks = [
  'Partiamo dal problema',
  'problem-field',
  'data-service-proof',
  'Output osservabile',
  'system-orchestra',
  'capability-index',
  'casarossa-store.jpg',
  'casarossa-product.jpg',
  'unicart-catalog.jpg',
  'unicart-auctions.jpg',
  'carabetta.jpg',
  'carabetta-logo.png',
  '/servizi-premium.css?v=17.0',
  '/servizi-premium.js?v=17.0',
  socialImageUrl
];
for (const check of checks) {
  if (!html.includes(check)) throw new Error(`Services decision journey missing required content: ${check}`);
}

console.log('Applied Axante Services Decision Journey v17.0.');
