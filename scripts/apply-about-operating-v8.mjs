import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const htmlSource = path.join(root, 'chi-siamo.html');
const cssSource = path.join(root, 'about-operating.css');
const jsSource = path.join(root, 'about-operating.js');
const socialImageUrl = 'https://website-preview-murex.vercel.app/assets/media/axante-share-v1.png';

for (const file of [htmlSource, cssSource, jsSource]) {
  if (!fs.existsSync(file)) throw new Error(`Missing about operating source: ${path.basename(file)}`);
}

let html = fs.readFileSync(htmlSource, 'utf8');
const replacements = [
  ['href="styles.css"', 'href="/styles.css"'],
  ['href="about-operating.css"', 'href="/about-operating.css?v=8.0"'],
  ['src="script.js"', 'src="/script.js"'],
  ['src="about-operating.js"', 'src="/about-operating.js?v=8.0"'],
  ['href="index.html"', 'href="/"'],
  ['href="servizi.html"', 'href="/servizi"'],
  ['href="portfolio.html"', 'href="/portfolio"'],
  ['href="chi-siamo.html"', 'href="/chi-siamo"'],
  ['href="contatti.html"', 'href="/contatti"'],
  ['href="lavora-con-noi.html"', 'href="/lavora-con-noi"'],
  ['src="assets/', 'src="/assets/']
];
for (const [from, to] of replacements) html = html.split(from).join(to);

const socialMeta = `<meta property="og:image" content="${socialImageUrl}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${socialImageUrl}">`;
if (!html.includes('property="og:image"')) html = html.replace('</head>', `${socialMeta}</head>`);

const aboutDir = path.join(site, 'chi-siamo');
fs.mkdirSync(aboutDir, { recursive: true });
fs.writeFileSync(path.join(aboutDir, 'index.html'), html);
fs.copyFileSync(cssSource, path.join(site, 'about-operating.css'));
fs.copyFileSync(jsSource, path.join(site, 'about-operating.js'));

const checks = [
  'Cinque competenze.',
  'data-operating-room',
  'Prima il problema, poi il servizio.',
  'Dopo il lancio non spariamo.',
  'Daniele', 'Bianca', 'Gabriele', 'Lisa', 'Pietro',
  '/about-operating.css?v=8.0',
  '/about-operating.js?v=8.0',
  socialImageUrl,
  'summary_large_image'
];
for (const check of checks) {
  if (!html.includes(check)) throw new Error(`About operating story missing required content: ${check}`);
}

console.log('Applied Axante Studio Operating Story v8.0.');