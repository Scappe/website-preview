import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const homePath = path.join(site, 'index.html');
const cssSource = path.join(root, 'home-reactor.css');
const jsSource = path.join(root, 'home-reactor.js');

for (const file of [homePath, cssSource, jsSource]) {
  if (!fs.existsSync(file)) throw new Error(`Missing reactor source: ${path.basename(file)}`);
}

let html = fs.readFileSync(homePath, 'utf8');

const hero = `<section class="reactor-hero" data-reactor aria-labelledby="reactor-title"><div class="container reactor-grid"><div class="reactor-copy"><span class="kicker reveal"><span class="kicker-dot"></span>Studio digitale · Roma</span><h1 id="reactor-title" class="reveal">Non ti serve più digitale.<br><span class="text-gradient">Ti serve quello giusto.</span></h1><p class="hero-copy reveal">Axante trasforma problemi di crescita, vendita e operatività in <strong>sistemi digitali progettati e costruiti da un unico team</strong>. Strategia, design, growth e tecnologia lavorano insieme, dall'idea al post-lancio.</p><div class="actions reveal"><a class="btn btn-primary" href="/contatti">Richiedi un audit gratuito <span>↗</span></a><a class="btn btn-secondary" href="/portfolio#casa-rossa">Apri il caso Casa Rossa <span>→</span></a></div><div class="reactor-proof reveal" aria-label="Impegni Axante"><span>Strategia + execution</span><span>Pagamento ad avanzamento</span><span>Assistenza diretta</span></div></div><div class="reactor-stage reveal" aria-label="Tre progetti reali Axante"><div class="reactor-shell"><div class="reactor-axis" aria-hidden="true"></div><article class="reactor-scene is-active" data-reactor-scene><div class="reactor-top"><div class="reactor-client"><span class="reactor-dot"></span><div><strong>Casa Rossa</strong><span>E-commerce · Multilingua</span></div></div><span class="reactor-counter">01 / 03</span></div><div class="reactor-media"><img src="/assets/media/casarossa.jpg" width="1200" height="800" alt="Sito e-commerce Casa Rossa realizzato da Axante"><div class="reactor-mobile-crop"><img src="/assets/media/casarossa.jpg" width="600" height="900" alt="Dettaglio mobile del progetto Casa Rossa"></div><div class="reactor-caption"><span>Problema → sistema</span><strong>Vendere online senza complicare la gestione.</strong></div></div></article><article class="reactor-scene" data-reactor-scene><div class="reactor-top"><div class="reactor-client"><span class="reactor-dot"></span><div><strong>Unicart Auctions</strong><span>Piattaforma · Aste online</span></div></div><span class="reactor-counter">02 / 03</span></div><div class="reactor-media"><img src="/assets/media/unicart.jpg" width="1200" height="800" alt="Piattaforma Unicart Auctions realizzata da Axante"><div class="reactor-mobile-crop"><img src="/assets/media/unicart.jpg" width="600" height="900" alt="Dettaglio UI del progetto Unicart Auctions"></div><div class="reactor-caption"><span>Complessità → chiarezza</span><strong>Un sistema ordinato per un flusso d'asta complesso.</strong></div></div></article><article class="reactor-scene" data-reactor-scene><div class="reactor-top"><div class="reactor-client"><span class="reactor-dot"></span><div><strong>Carabetta</strong><span>Fashion · E-commerce</span></div></div><span class="reactor-counter">03 / 03</span></div><div class="reactor-media"><img src="/assets/media/carabetta.jpg" width="1200" height="800" alt="E-commerce Carabetta realizzato da Axante"><div class="reactor-mobile-crop"><img src="/assets/media/carabetta.jpg" width="600" height="900" alt="Dettaglio editoriale del progetto Carabetta"></div><div class="reactor-caption"><span>Prodotto → desiderabilità</span><strong>Una collezione trasformata in esperienza d'acquisto.</strong></div></div></article><div class="reactor-controls" role="tablist" aria-label="Seleziona progetto"><button class="reactor-tab" type="button" role="tab" aria-selected="true" data-reactor-tab><small>01</small><strong>Casa Rossa</strong></button><button class="reactor-tab" type="button" role="tab" aria-selected="false" tabindex="-1" data-reactor-tab><small>02</small><strong>Unicart</strong></button><button class="reactor-tab" type="button" role="tab" aria-selected="false" tabindex="-1" data-reactor-tab><small>03</small><strong>Carabetta</strong></button></div></div></div></div></section><section class="reactor-bridge" aria-labelledby="reactor-bridge-title"><div class="container"><div class="reactor-bridge-head"><div><span class="section-eyebrow">Prima il problema</span><h2 id="reactor-bridge-title">Non partiamo dal deliverable.<br>Partiamo da ciò che deve cambiare.</h2></div><p>Strategia, design e tecnologia entrano solo dove servono. Il punto è costruire il sistema giusto per il risultato.</p></div><div class="reactor-paths"><a class="reactor-path" href="/servizi"><span>01 · VISIBILITÀ</span><strong>Farti trovare</strong><i>Scopri il sistema →</i></a><a class="reactor-path" href="/servizi"><span>02 · CREDIBILITÀ</span><strong>Convincere meglio</strong><i>Scopri il sistema →</i></a><a class="reactor-path" href="/servizi"><span>03 · CRESCITA / OPERATIVITÀ</span><strong>Vendere o lavorare meglio</strong><i>Scopri il sistema →</i></a></div></div></section>`;

const target = /<section class="evidence-hero"[\s\S]*?<\/section><section class="evidence-bridge"[\s\S]*?<\/section>/;
if (!target.test(html)) throw new Error('Evidence hero + bridge target not found for reactor replacement.');
html = html.replace(target, hero);

if (!html.includes('/home-reactor.css?v=14.0')) html = html.replace('</head>', '<link rel="stylesheet" href="/home-reactor.css?v=14.0"></head>');
if (!html.includes('/home-reactor.js?v=14.0')) html = html.replace('</body>', '<script src="/home-reactor.js?v=14.0" defer></script></body>');

fs.writeFileSync(homePath, html);
fs.copyFileSync(cssSource, path.join(site, 'home-reactor.css'));
fs.copyFileSync(jsSource, path.join(site, 'home-reactor.js'));

for (const token of ['data-reactor','casarossa.jpg','unicart.jpg','carabetta.jpg','data-reactor-tab','Non partiamo dal deliverable.','/home-reactor.css?v=14.0','/home-reactor.js?v=14.0']) {
  if (!html.includes(token)) throw new Error(`Reactor output missing ${token}`);
}
if (html.includes('class="evidence-flow"')) throw new Error('Legacy evidence card flow survived reactor replacement.');
console.log('Applied Axante Real Work Reactor v14.0.');
