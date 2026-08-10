import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const htmlSource = path.join(root, 'contatti.html');
const cssSource = path.join(root, 'contact-intake.css');
const jsSource = path.join(root, 'contact-intake.js');
const socialImageUrl = 'https://website-preview-murex.vercel.app/assets/media/axante-share-v1.png';

for (const file of [htmlSource, cssSource, jsSource]) {
  if (!fs.existsSync(file)) throw new Error(`Missing contact intake source: ${path.basename(file)}`);
}

let html = fs.readFileSync(htmlSource, 'utf8');
const replacements = [
  ['href="styles.css"', 'href="/styles.css"'],
  ['href="contact-intake.css"', 'href="/contact-intake.css?v=7.0"'],
  ['src="script.js"', 'src="/script.js"'],
  ['src="contact-intake.js"', 'src="/contact-intake.js?v=7.0"'],
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

const contactDir = path.join(site, 'contatti');
fs.mkdirSync(contactDir, { recursive: true });
fs.writeFileSync(path.join(contactDir, 'index.html'), html);
fs.copyFileSync(cssSource, path.join(site, 'contact-intake.css'));
fs.copyFileSync(jsSource, path.join(site, 'contact-intake.js'));

const checks = [
  'Portaci il problema.',
  'data-project-intake',
  'Farmi trovare',
  'Convincere meglio',
  'Vendere di più',
  'Lavorare meglio',
  'Invia richiesta di audit',
  '/contact-intake.css?v=7.0',
  '/contact-intake.js?v=7.0',
  socialImageUrl,
  'summary_large_image'
];
for (const check of checks) {
  if (!html.includes(check)) throw new Error(`Contact intake missing required content: ${check}`);
}

console.log('Applied Axante Project Intake v7.0.');