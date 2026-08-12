import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const htmlSource = path.join(root, 'chi-siamo.html');
const cssSource = path.join(root, 'about-operating.css');
const socialImageUrl = 'https://website-preview-murex.vercel.app/assets/media/axante-share-v1.png';
const proofAssets = ['project-carabetta.svg', 'project-unicart.svg', 'project-tracciati.svg'];

for (const file of [htmlSource, cssSource]) {
  if (!fs.existsSync(file)) throw new Error(`Missing about source: ${path.basename(file)}`);
}
for (const asset of proofAssets) {
  const source = path.join(root, 'assets', asset);
  if (!fs.existsSync(source)) throw new Error(`Missing about proof asset: ${asset}`);
}

let html = fs.readFileSync(htmlSource, 'utf8');
const replacements = [
  ['href="styles.css"', 'href="/styles.css"'],
  ['href="about-operating.css"', 'href="/about-operating.css?v=10.1"'],
  ['src="script.js"', 'src="/script.js"'],
  ['href="index.html"', 'href="/"'],
  ['href="servizi.html#web"', 'href="/servizi#web"'],
  ['href="servizi.html#marketing"', 'href="/servizi#marketing"'],
  ['href="servizi.html#brand"', 'href="/servizi#brand"'],
  ['href="servizi.html#development"', 'href="/servizi#development"'],
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
const siteAssets = path.join(site, 'assets');
fs.mkdirSync(aboutDir, { recursive: true });
fs.mkdirSync(siteAssets, { recursive: true });
fs.writeFileSync(path.join(aboutDir, 'index.html'), html);

const layoutIntegrity = `\n/* About v10.1 — mobile grid integrity: prevent max-content links from widening the process column. */\n@media(max-width:1024px){.about-v10 .operating-layout{grid-template-columns:minmax(0,1fr)}.about-v10 .operating-head,.about-v10 .process-story,.about-v10 .process-beat,.about-v10 .process-copy,.about-v10 .text-link{min-width:0}.about-v10 .text-link{width:fit-content;max-width:100%;overflow-wrap:anywhere}}\n`;
fs.writeFileSync(path.join(site, 'about-operating.css'), `${fs.readFileSync(cssSource, 'utf8')}${layoutIntegrity}`);

for (const asset of proofAssets) {
  fs.copyFileSync(path.join(root, 'assets', asset), path.join(siteAssets, asset));
}

const checks = [
  'Una squadra sola.',
  'class="people-signal"',
  'class="process-story"',
  'class="proof-stage"',
  'Prima il problema, poi il servizio.',
  'Dopo il lancio non spariamo.',
  'Daniele', 'Bianca', 'Gabriele', 'Lisa', 'Pietro',
  '/about-operating.css?v=10.1',
  'href="/servizi"',
  'href="/portfolio"',
  'href="/contatti"',
  socialImageUrl,
  'summary_large_image'
];
for (const check of checks) {
  if (!html.includes(check)) throw new Error(`About people-led editorial story missing required content: ${check}`);
}
for (const asset of proofAssets) {
  const published = path.join(siteAssets, asset);
  if (!fs.existsSync(published) || fs.statSync(published).size < 500) throw new Error(`About proof asset was not published correctly: ${asset}`);
}

console.log('Applied Axante People-led Editorial Story v10.1 with local proof assets and mobile process-grid integrity.');