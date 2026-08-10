import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const homePath = path.join(site, 'index.html');
const cssSource = path.join(root, 'home-proof-spine.css');
const jsSource = path.join(root, 'home-proof-spine.js');

for (const file of [homePath, cssSource, jsSource]) {
  if (!fs.existsSync(file)) throw new Error(`Missing Proof Spine source: ${path.basename(file)}`);
}

let html = fs.readFileSync(homePath, 'utf8');

const proof = `<section class="proof-spine" data-proof-spine aria-labelledby="proof-spine-title"><div class="container"><div class="proof-intro"><div><span class="section-eyebrow">Proof spine · casi reali</span><h2 id="proof-spine-title">Tre problemi.<br><span class="text-gradient">Tre sistemi. Tre prove.</span></h2></div><p>Non partiamo da un elenco di servizi. Partiamo da ciò che deve cambiare e combiniamo strategia, design e tecnologia intorno a quel risultato.</p></div><div class="proof-layout"><div class="proof-index" role="tablist" aria-label="Casi studio in evidenza" aria-orientation="vertical"><button class="proof-tab" type="button" role="tab" id="proof-tab-casa" aria-controls="proof-panel-casa" aria-selected="true" data-proof-tab><small>01 · Vendere meglio</small><strong>Casa Rossa</strong><i aria-hidden="true"></i></button><button class="proof-tab" type="button" role="tab" id="proof-tab-unicart" aria-controls="proof-panel-unicart" aria-selected="false" tabindex="-1" data-proof-tab><small>02 · Semplificare</small><strong>Unicart Auctions</strong><i aria-hidden="true"></i></button><button class="proof-tab" type="button" role="tab" id="proof-tab-carabetta" aria-controls="proof-panel-carabetta" aria-selected="false" tabindex="-1" data-proof-tab><small>03 · Desiderabilità</small><strong>Carabetta</strong><i aria-hidden="true"></i></button></div><div class="proof-panels"><article class="proof-panel is-active" id="proof-panel-casa" role="tabpanel" aria-labelledby="proof-tab-casa" data-proof-panel><div class="proof-visual"><img src="/assets/media/casarossa.jpg" width="1400" height="1000" loading="lazy" decoding="async" alt="E-commerce Casa Rossa progettato da Axante"><div class="proof-visual-meta"><span>E-commerce</span><span>Multilingua</span><span>SEO</span></div></div><div class="proof-copy"><div><div class="proof-kicker"><span>Vendere meglio</span><b>01</b></div><h3>Casa Rossa</h3><div class="proof-story"><div class="proof-block"><small>Problema</small><p>Portare la vendita online senza trasformare la gestione quotidiana in un nuovo problema.</p></div><div class="proof-block"><small>Sistema Axante</small><p>E-commerce, architettura multilingua, SEO e autonomia editoriale progettati come un unico sistema.</p><div class="proof-tags"><span>UX</span><span>E-commerce</span><span>SEO</span><span>Development</span></div></div><div class="proof-block proof-outcome"><small>Prova reale</small><p>Una struttura di vendita internazionale chiara e gestibile in autonomia, costruita per evolvere dopo il lancio.</p></div></div></div><a class="proof-link" href="/portfolio#casa-rossa"><span>Apri il caso Casa Rossa</span><span>↗</span></a></div></article><article class="proof-panel" id="proof-panel-unicart" role="tabpanel" aria-labelledby="proof-tab-unicart" data-proof-panel><div class="proof-visual"><img src="/assets/media/unicart.jpg" width="1400" height="1000" loading="lazy" decoding="async" alt="Piattaforma Unicart Auctions progettata da Axante"><div class="proof-visual-meta"><span>Product UX</span><span>Marketplace</span><span>Development</span></div></div><div class="proof-copy"><div><div class="proof-kicker"><span>Rendere semplice la complessità</span><b>02</b></div><h3>Unicart Auctions</h3><div class="proof-story"><div class="proof-block"><small>Problema</small><p>Un'asta online contiene regole, stati e azioni complesse. L'utente non deve percepire tutta quella complessità.</p></div><div class="proof-block"><small>Sistema Axante</small><p>Architettura informativa, UX, struttura di prodotto e sviluppo coordinati intorno alle azioni essenziali.</p><div class="proof-tags"><span>UX</span><span>Product structure</span><span>UI</span><span>Development</span></div></div><div class="proof-block proof-outcome"><small>Prova reale</small><p>Un flusso complesso reso più comprensibile e utilizzabile, con stati e azioni importanti sempre leggibili.</p></div></div></div><a class="proof-link" href="/portfolio#unicart"><span>Guarda il sistema Unicart</span><span>↗</span></a></div></article><article class="proof-panel" id="proof-panel-carabetta" role="tabpanel" aria-labelledby="proof-tab-carabetta" data-proof-panel><div class="proof-visual"><img src="/assets/media/carabetta.jpg" width="1400" height="1000" loading="lazy" decoding="async" alt="Esperienza e-commerce Carabetta progettata da Axante"><div class="proof-visual-meta"><span>Fashion</span><span>Brand expression</span><span>E-commerce</span></div></div><div class="proof-copy"><div><div class="proof-kicker"><span>Costruire desiderabilità</span><b>03</b></div><h3>Carabetta</h3><div class="proof-story"><div class="proof-block"><small>Problema</small><p>Trasformare una collezione in un'esperienza d'acquisto coerente, riconoscibile e desiderabile.</p></div><div class="proof-block"><small>Sistema Axante</small><p>Brand expression, UX/UI ed e-commerce lavorano insieme per dare ritmo alla scoperta e chiarezza all'acquisto.</p><div class="proof-tags"><span>Brand</span><span>UX/UI</span><span>E-commerce</span></div></div><div class="proof-block proof-outcome"><small>Prova reale</small><p>Un'esperienza contemporanea che porta l'identità del progetto dentro il percorso commerciale, senza separare estetica e funzione.</p></div></div></div><a class="proof-link" href="/portfolio#carabetta"><span>Apri il progetto Carabetta</span><span>↗</span></a></div></article></div></div><div class="proof-close"><div><span class="section-eyebrow">Il punto</span><h3>Non è quale servizio comprare.<br>È quale sistema serve per cambiare il risultato.</h3></div><div class="proof-close-actions"><a class="btn btn-primary" href="/contatti">Raccontaci il problema <span>↗</span></a><a class="btn btn-secondary" href="/portfolio">Esplora tutti i casi <span>→</span></a></div></div></div></section>`;

const sections = /<section\b[^>]*>[\s\S]*?<\/section>/g;
let replacedProof = false;
html = html.replace(sections, section => {
  if (section.includes('Competenze integrate')) return '';
  if (section.includes('Bello da vedere.') && section.includes('12+')) return '';
  if (section.includes('case-studies-v3') || section.includes('Selected work · prove, non promesse') || (section.includes('Selected work') && section.includes('portfolio'))) {
    if (replacedProof) return '';
    replacedProof = true;
    return proof;
  }
  return section;
});

if (!replacedProof) throw new Error('Selected Work / case-study section target not found for Proof Spine.');

if (!html.includes('/home-proof-spine.css?v=10.0')) html = html.replace('</head>', '<link rel="stylesheet" href="/home-proof-spine.css?v=10.0"></head>');
if (!html.includes('/home-proof-spine.js?v=10.0')) html = html.replace('</body>', '<script src="/home-proof-spine.js?v=10.0" defer></script></body>');

fs.writeFileSync(homePath, html);
fs.copyFileSync(cssSource, path.join(site, 'home-proof-spine.css'));
fs.copyFileSync(jsSource, path.join(site, 'home-proof-spine.js'));

const required = ['data-proof-spine','Tre problemi.','Casa Rossa','Unicart Auctions','Carabetta','Problema','Sistema Axante','Prova reale','/portfolio#casa-rossa','/portfolio#unicart','/portfolio#carabetta','/contatti','/home-proof-spine.css?v=10.0','/home-proof-spine.js?v=10.0'];
for (const token of required) if (!html.includes(token)) throw new Error(`Proof Spine missing required token: ${token}`);
for (const legacy of ['12+','competenze integrate','Bello da vedere.']) if (html.includes(legacy)) throw new Error(`Legacy generic middle-funnel token still present: ${legacy}`);

console.log('Applied Axante Home Proof Spine v10.0.');
