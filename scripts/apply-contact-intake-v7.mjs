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
  ['href="contact-intake.css"', 'href="/contact-intake.css?v=7.2"'],
  ['src="script.js"', 'src="/script.js"'],
  ['src="contact-intake.js"', 'src="/contact-intake.js?v=7.1"'],
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
  'Portaci ciò che',
  'data-project-intake',
  'Tre cose ci bastano per iniziare bene.',
  'Cosa succede dopo',
  'Prepara il messaggio',
  'Casa Rossa, Unicart e Carabetta',
  'href="/portfolio"',
  '/contact-intake.css?v=7.2',
  '/contact-intake.js?v=7.1',
  socialImageUrl,
  'summary_large_image'
];
for (const check of checks) {
  if (!html.includes(check)) throw new Error(`Contact intake missing required content: ${check}`);
}
if (html.includes('data-intake-step') || html.includes('data-progress-segment')) {
  throw new Error('Contact source regressed to hidden multi-step wizard markup.');
}

console.log('Applied Axante Project Intake v7.2 authored conversion scene.');