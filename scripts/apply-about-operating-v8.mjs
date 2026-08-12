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
  ['href="about-operating.css"', 'href="/about-operating.css?v=11.0"'],
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

const layoutIntegrity = `
/* About v11 — route-owned mobile visual reset. Keeps semantic content in DOM while reducing repeated visible density. */
@media(max-width:1024px){
  .about-v10 .operating-layout{grid-template-columns:minmax(0,1fr)}
  .about-v10 .operating-head,.about-v10 .process-story,.about-v10 .process-beat,.about-v10 .process-copy,.about-v10 .text-link{min-width:0}
  .about-v10 .text-link{width:fit-content;max-width:100%;overflow-wrap:anywhere}
  .about-v10 .people-signal{grid-template-columns:repeat(3,minmax(0,1fr))}
  .about-v10 .hero-person:nth-child(1),.about-v10 .hero-person:nth-child(5){grid-column:span 2}
  .about-v10 .team-list{padding-inline:clamp(20px,4vw,42px)}
}

@media(max-width:767px){
  .about-v10 .about-hero{min-height:100svh;padding:104px 0 0;align-items:stretch;overflow:hidden}
  .about-v10 .about-hero::before{background:radial-gradient(circle at 88% 18%,rgba(123,87,255,.22),transparent 22rem),radial-gradient(circle at 10% 72%,rgba(239,10,114,.2),transparent 24rem)}
  .about-v10 .about-hero-grid{display:flex;flex-direction:column;gap:30px;min-height:calc(100svh - 104px)}
  .about-v10 .about-hero-copyblock{padding-bottom:0}
  .about-v10 .about-hero h1{max-width:9ch;margin:14px 0 18px;font-size:clamp(3rem,13.3vw,4.35rem);line-height:.9;letter-spacing:-.066em}
  .about-v10 .about-hero-copy{max-width:34rem;margin-bottom:20px;font-size:1rem;line-height:1.55}
  .about-v10 .about-hero .actions{margin-bottom:0}
  .about-v10 .about-hero .btn{min-height:46px}

  .about-v10 .people-signal{display:grid;grid-template-columns:1.25fr .75fr;grid-auto-rows:minmax(82px,auto);gap:0;margin:auto -18px 0;padding:22px 18px 24px;background:#ef0a72;color:#10070c;border:0;min-height:42svh;align-content:center}
  .about-v10 .hero-person,.about-v10 .hero-person:nth-child(1),.about-v10 .hero-person:nth-child(5){display:flex;flex-direction:column;justify-content:flex-end;gap:5px;grid-column:auto;padding:16px 8px;border:0;min-width:0}
  .about-v10 .hero-person:nth-child(1){grid-column:1/-1;min-height:118px;padding-top:4px;border-bottom:1px solid rgba(16,7,12,.18)}
  .about-v10 .hero-person:nth-child(2),.about-v10 .hero-person:nth-child(4){border-right:1px solid rgba(16,7,12,.18)}
  .about-v10 .hero-person:nth-child(5){grid-column:1/-1;align-items:flex-end;text-align:right;border-top:1px solid rgba(16,7,12,.18)}
  .about-v10 .hero-person-index{display:none}
  .about-v10 .hero-person strong{font-size:clamp(2.25rem,12vw,4rem);line-height:.82;letter-spacing:-.07em;color:#10070c}
  .about-v10 .hero-person:nth-child(1) strong{font-size:clamp(3.5rem,18vw,5.6rem)}
  .about-v10 .hero-person>span:last-child{max-width:18ch;color:#4b0b28;font-size:.61rem;line-height:1.25;letter-spacing:.055em}

  .about-v10 .operating-story{padding:74px 0 78px}
  .about-v10 .operating-layout{gap:30px}
  .about-v10 .operating-head h2{max-width:8.2ch;margin:12px 0 18px;font-size:clamp(2.65rem,12vw,4rem);line-height:.92}
  .about-v10 .operating-head p{max-width:33rem;font-size:1rem;line-height:1.55}
  .about-v10 .process-story{border-top:1px solid var(--line-light)}
  .about-v10 .process-beat{grid-template-columns:30px minmax(0,1fr);gap:8px 12px;padding:28px 0 30px}
  .about-v10 .process-beat:nth-child(2),.about-v10 .process-beat:nth-child(4){display:none}
  .about-v10 .process-copy h3{max-width:10ch;font-size:clamp(2rem,9.5vw,3rem);line-height:.96}
  .about-v10 .process-copy p{font-size:1rem;line-height:1.5}
  .about-v10 .process-output{display:none}
  .about-v10 .text-link{grid-column:auto;margin-top:0;font-size:.94rem;line-height:1.35}

  .about-v10 .team-section{padding:70px 0 0;background:linear-gradient(155deg,#d8c2ff 0%,#f0e8ff 48%,#f4cedf 100%)}
  .about-v10 .team-head{margin-bottom:22px}
  .about-v10 .team-head h2{max-width:9ch;margin:10px 0 16px;font-size:clamp(2.65rem,12vw,4.1rem);line-height:.91}
  .about-v10 .team-head p{display:none}
  .about-v10 .team-list{display:grid;grid-template-columns:1fr 1fr;gap:0;padding:0 18px 28px;border-top:0}
  .about-v10 .person,.about-v10 .person:nth-child(2),.about-v10 .person:nth-child(4){display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;gap:8px;min-height:178px;padding:20px 10px;border:0;border-top:1px solid rgba(11,11,16,.17)}
  .about-v10 .person:nth-child(1){grid-column:1/-1;min-height:235px;padding-inline:0}
  .about-v10 .person:nth-child(2),.about-v10 .person:nth-child(4){border-right:1px solid rgba(11,11,16,.17)}
  .about-v10 .person:nth-child(5){align-items:flex-end;text-align:right}
  .about-v10 .person-index{font-size:.62rem}
  .about-v10 .person h3{font-size:clamp(2.15rem,10vw,3.3rem);line-height:.88}
  .about-v10 .person:nth-child(1) h3{font-size:clamp(4rem,19vw,6rem)}
  .about-v10 .person-role{max-width:17ch;font-size:.65rem;line-height:1.25}
  .about-v10 .person p{display:none}

  .about-v10 .about-proof-band{padding:74px 0 82px}
  .about-v10 .proof-heading{margin-bottom:22px}
  .about-v10 .proof-heading h2{max-width:9ch;margin:10px 0 16px;font-size:clamp(2.65rem,12vw,4rem);line-height:.91}
  .about-v10 .proof-heading p{font-size:1rem;line-height:1.55}
  .about-v10 .proof-stage{display:flex;flex-direction:column;gap:0;height:auto;margin:0;padding:0 18px;overflow:visible}
  .about-v10 .proof-piece,.about-v10 .proof-piece-a,.about-v10 .proof-piece-b,.about-v10 .proof-piece-c{position:relative;inset:auto;transform:none;border-radius:18px;box-shadow:0 22px 58px rgba(0,0,0,.38)}
  .about-v10 .proof-piece-a{width:calc(100% + 36px);height:74svh;max-height:650px;margin-left:-18px;aspect-ratio:auto;border-radius:0}
  .about-v10 .proof-piece-b{width:84%;aspect-ratio:1.08;margin:-38px 0 0 auto;z-index:2}
  .about-v10 .proof-piece-c{width:72%;aspect-ratio:1.12;margin:18px auto 0 0;z-index:3}
  .about-v10 .proof-piece img{object-fit:cover}
  .about-v10 .proof-link{justify-content:flex-start;margin-top:24px}
  .about-v10 .commitments-wrap{display:none}

  .about-v10 .about-final{padding:72px 0 82px}
  .about-v10 .about-final-grid{gap:18px}
  .about-v10 .about-final-grid h2{max-width:8.7ch;font-size:clamp(2.85rem,13vw,4.35rem);line-height:.9}
  .about-v10 .about-final-grid p{font-size:1rem;line-height:1.5}
  .about-v10 .about-final .actions{gap:10px}
  .about-v10 .about-final .btn{min-height:46px}
}

@media(max-width:360px){
  .about-v10 .people-signal{min-height:46svh}
  .about-v10 .hero-person strong{font-size:clamp(2rem,11vw,3.3rem)}
  .about-v10 .hero-person:nth-child(1) strong{font-size:clamp(3.1rem,17vw,4.8rem)}
  .about-v10 .team-list{padding-inline:14px}
  .about-v10 .person,.about-v10 .person:nth-child(2),.about-v10 .person:nth-child(4){min-height:160px;padding-inline:8px}
  .about-v10 .person-role{font-size:.61rem}
  .about-v10 .proof-stage{padding-inline:14px}
  .about-v10 .proof-piece-a{width:calc(100% + 28px);margin-left:-14px}
}

@media(prefers-reduced-motion:reduce){
  .about-v10 .person,.about-v10 .proof-piece{transition:none!important}
}
`;
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
  '/about-operating.css?v=11.0',
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

const mobileContracts = [
  '.about-v10 .process-beat:nth-child(2),.about-v10 .process-beat:nth-child(4){display:none}',
  '.about-v10 .proof-piece-a{width:calc(100% + 36px);height:74svh',
  '.about-v10 .commitments-wrap{display:none}',
  '.about-v10 .people-signal{display:grid;grid-template-columns:1.25fr .75fr'
];
for (const contract of mobileContracts) {
  if (!layoutIntegrity.includes(contract)) throw new Error(`About mobile reset contract missing: ${contract}`);
}

console.log('Applied Axante People-led Editorial Story v11 with 390-first people field, reduced visible process density and media-led proof composition.');