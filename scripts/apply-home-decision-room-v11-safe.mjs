import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const homePath = path.join(site, 'index.html');
const cssSource = path.join(root, 'home-decision-room.css');
const jsSource = path.join(root, 'home-decision-room.js');
const sourcePath = path.join(root, 'scripts', 'apply-home-decision-room-v11.mjs');

for (const file of [homePath, cssSource, jsSource, sourcePath]) {
  if (!fs.existsSync(file)) throw new Error(`Missing Decision Room source: ${path.basename(file)}`);
}

let html = fs.readFileSync(homePath, 'utf8');
const source = fs.readFileSync(sourcePath, 'utf8');
const markupMatch = source.match(/const decisionRoom = `([\s\S]*?)`;\n\nconst sections/);
if (!markupMatch) throw new Error('Decision Room markup source not found.');
// Desktop starts in a deterministic enhanced state before first paint. Inactive
// panels carry `hidden` in the generated DOM, while the mobile runtime expands
// every panel below 681px. This prevents a flash of five overlapping tabpanels.
const decisionRoom = markupMatch[1]
  .replace('class="decision-room"', 'class="decision-room is-enhanced"')
  .replace(/<article class="decision-panel" id=/g, '<article class="decision-panel" hidden id=');

if (!html.includes('data-proof-spine')) throw new Error('Proof Spine missing before Decision Room transform.');

// Remove whatever legacy lower-funnel variants survived the previous build steps.
// Trust Proof v5 is fully superseded here: Decision Room already owns delivery proof,
// objections and conversion, so retaining it would duplicate the funnel and reserve
// a large content-visibility intrinsic block after the final CTA.
const sections = /<section\b[^>]*>[\s\S]*?<\/section>/g;
html = html.replace(sections, section => {
  if (section.includes('data-proof-spine')) return section;
  if (section.includes('class="tp-section"')) return '';
  if (section.includes('Metodo Axante') || section.includes('process-grid') || section.includes('process-section')) return '';
  if (section.includes('testimonial-feature') || section.includes('testimonial-layout') || section.includes('class="testimonials"') || section.includes('Recensioni')) return '';
  if (section.includes('Domande frequenti') || section.includes('faq-list') || section.includes('class="faq"')) return '';
  if (section.includes('Il prossimo progetto può funzionare meglio.') || section.includes('cta-panel')) return '';
  return section;
});

// Remove dead inline resources that belonged exclusively to the superseded Trust Proof v5 section.
html = html.replace(/<style id="tp-styles">[\s\S]*?<\/style>/g, '');
html = html.replace(/<script id="tp-script">[\s\S]*?<\/script>/g, '');

// Insert directly after Proof Spine: this is the stable narrative anchor.
const proofStart = html.indexOf('<section class="proof-spine"');
if (proofStart < 0) throw new Error('Proof Spine section start not found.');
const proofEnd = html.indexOf('</section>', proofStart);
if (proofEnd < 0) throw new Error('Proof Spine section end not found.');
html = html.slice(0, proofEnd + 10) + decisionRoom + html.slice(proofEnd + 10);

if (!html.includes('/home-decision-room.css?v=11.0')) html = html.replace('</head>', '<link rel="stylesheet" href="/home-decision-room.css?v=11.0"></head>');
if (!html.includes('/home-decision-room.js?v=11.0')) html = html.replace('</body>', '<script src="/home-decision-room.js?v=11.0" defer></script></body>');

fs.writeFileSync(homePath, html);
fs.copyFileSync(cssSource, path.join(site, 'home-decision-room.css'));
fs.copyFileSync(jsSource, path.join(site, 'home-decision-room.js'));

const required = ['data-proof-spine','data-decision-room','class="decision-room is-enhanced"','hidden id="decision-panel-2"','Problema','Direzione','Prototipo','Build','Release','Tracciati d’Arte','Francesco S.','Quattro dubbi','Portaci il problema.','/contatti','/chi-siamo'];
for (const token of required) if (!html.includes(token)) throw new Error(`Decision Room missing required token: ${token}`);
for (const legacy of ['Metodo Axante','process-grid','testimonial-feature','Domande frequenti','Il prossimo progetto può funzionare meglio.','class="tp-section"','id="tp-styles"','id="tp-script"']) if (html.includes(legacy)) throw new Error(`Legacy lower-funnel token still present: ${legacy}`);

const proofIndex = html.indexOf('data-proof-spine');
const decisionIndex = html.indexOf('data-decision-room');
if (decisionIndex <= proofIndex) throw new Error('Decision Room is not positioned after Proof Spine.');

console.log('Applied Axante Home Decision Room v11.4 from stable Proof Spine anchor.');
