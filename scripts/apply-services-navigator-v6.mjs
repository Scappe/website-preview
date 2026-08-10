import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const sourceHtml = path.join(root, 'servizi.html');
const sourceCss = path.join(root, 'servizi-premium.css');
const sourceJs = path.join(root, 'servizi-premium.js');
const socialImageUrl = 'https://website-preview-murex.vercel.app/assets/media/axante-share-v1.png';

for (const file of [sourceHtml, sourceCss, sourceJs]) {
  if (!fs.existsSync(file)) throw new Error(`Missing services navigator source: ${path.basename(file)}`);
}

let html = fs.readFileSync(sourceHtml, 'utf8');
const replacements = [
  ['href="styles.css"', 'href="/styles.css"'],
  ['href="servizi-premium.css"', 'href="/servizi-premium.css?v=6.9"'],
  ['src="script.js"', 'src="/script.js"'],
  ['src="servizi-premium.js"', 'src="/servizi-premium.js?v=6.9"'],
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
  'Scegli cosa deve cambiare',
  'Devo farmi trovare',
  'Devo convincere meglio',
  'Devo vendere di più',
  'Devo lavorare meglio',
  '/servizi-premium.css?v=6.9',
  '/servizi-premium.js?v=6.9',
  socialImageUrl,
  'summary_large_image'
];
for (const check of checks) {
  if (!html.includes(check)) throw new Error(`Services navigator missing required content: ${check}`);
}

console.log('Applied Axante Problem-to-System Navigator v6.9.');