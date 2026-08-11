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

const hero = `<section class="reactor-hero" data-reactor aria-labelledby="reactor-title"><div class="container reactor-grid"><div class="reactor-copy"><span class="kicker reveal"><span class="kicker-dot"></span>Studio digitale · Roma</span><h1 id="reactor-title" class="reveal">Non ti serve più digitale.<br><span class="text-gradient">Ti serve quello giusto.</span></h1><p class="hero-copy reveal">Axante trasforma problemi di crescita, vendita e operatività in <strong>sistemi digitali progettati e costruiti da un unico team</strong>. Strategia, design, growth e tecnologia lavorano insieme, dall'idea al post-lancio.</p><div class="actions reveal"><a class="btn btn-primary" href="/contatti">Richiedi un audit gratuito <span>↗</span></a><a class="btn btn-secondary" href="/portfolio#casa-rossa">Apri il caso Casa Rossa <span>→</span></a></div><div class="reactor-proof reveal" aria-label="Impegni Axante"><span>Strategia + execution</span><span>Pagamento ad avanzamento</span><span>Assistenza diretta</span></div></div><div class="reactor-stage reveal" aria-label="Tre progetti reali Axante"><div class="reactor-shell"><article class="reactor-scene is-active" data-reactor-scene aria-hidden="false"><div class="reactor-top"><div class="reactor-client"><span class="reactor-dot"></span><div><strong>Casa Rossa</strong><span>E-commerce · Multilingua</span></div></div><span class="reactor-counter">01 / 03</span></div><div class="reactor-media"><img class="reactor-primary" data-reactor-primary src="/assets/media/casarossa.jpg" width="1200" height="800" alt="Sito e-commerce Casa Rossa realizzato da Axante"><div class="reactor-detail" data-reactor-detail><img src="/assets/media/casarossa-detail.jpg" width="900" height="1200" alt="Fotografia prodotto Casa Rossa utilizzata nel progetto e-commerce"><span class="reactor-detail-label">Dettaglio prodotto</span></div><div class="reactor-caption"><span>Problema → sistema</span><strong>Vendere online senza complicare la gestione.</strong><p>Architettura, UX, SEO e gestione editoriale lavorano dentro un unico e-commerce pensato per restare governabile dopo il lancio.</p></div></div></article><article class="reactor-scene" data-reactor-scene aria-hidden="true"><div class="reactor-top"><div class="reactor-client"><span class="reactor-dot"></span><div><strong>Unicart Auctions</strong><span>Piattaforma · Aste online</span></div></div><span class="reactor-counter">02 / 03</span></div><div class="reactor-media"><img class="reactor-primary" data-reactor-primary src="/assets/media/unicart.jpg" width="1200" height="800" alt="Piattaforma Unicart Auctions realizzata da Axante"><div class="reactor-detail" data-reactor-detail><img src="/assets/media/unicart-detail.jpg" width="1200" height="900" alt="Vista reale della homepage Unicart Auctions con contenuti d'asta"><span class="reactor-detail-label">Catalogo e asta live</span></div><div class="reactor-caption"><span>Complessità → chiarezza</span><strong>Un flusso d'asta complesso, reso leggibile.</strong><p>Architettura informativa, product UX e sviluppo coordinano stati e azioni importanti senza scaricare la complessità sull'utente.</p></div></div></article><article class="reactor-scene" data-reactor-scene aria-hidden="true"><div class="reactor-top"><div class="reactor-client"><span class="reactor-dot"></span><div><strong>Carabetta</strong><span>Commerce · Brand expression</span></div></div><span class="reactor-counter">03 / 03</span></div><div class="reactor-media"><img class="reactor-primary" data-reactor-primary src="/assets/media/carabetta.jpg" width="1200" height="800" alt="E-commerce Carabetta realizzato da Axante"><div class="reactor-detail" data-reactor-detail><img src="/assets/media/carabetta-detail.jpg" width="900" height="900" alt="Categoria biancheria letto del catalogo Carabetta"><span class="reactor-detail-label">Categoria prodotto</span></div><div class="reactor-caption"><span>Prodotto → desiderabilità</span><strong>La collezione diventa esperienza d'acquisto.</strong><p>Brand expression, UX/UI ed e-commerce portano l'identità del progetto dentro il percorso commerciale, senza separare estetica e funzione.</p></div></div></article><div class="reactor-controls" role="tablist" aria-label="Seleziona progetto"><button class="reactor-tab" type="button" role="tab" aria-selected="true" tabindex="0" data-reactor-tab><small>01</small><strong>Casa Rossa</strong></button><button class="reactor-tab" type="button" role="tab" aria-selected="false" tabindex="-1" data-reactor-tab><small>02</small><strong>Unicart</strong></button><button class="reactor-tab" type="button" role="tab" aria-selected="false" tabindex="-1" data-reactor-tab><small>03</small><strong>Carabetta</strong></button></div></div></div></div></section><section class="reactor-bridge" aria-labelledby="reactor-bridge-title"><div class="container"><div class="reactor-bridge-head"><div><span class="section-eyebrow">Prima il problema</span><h2 id="reactor-bridge-title">Il deliverable viene dopo.<br>Prima decidiamo cosa deve cambiare.</h2></div><p>Visibilità, credibilità, vendita o operatività: partiamo dal risultato da sbloccare e costruiamo soltanto il sistema necessario.</p></div><div class="reactor-paths"><a class="reactor-path" href="/servizi"><span>01 · VISIBILITÀ</span><strong>Farti trovare</strong><i>Strategia, contenuti, SEO e campagne →</i></a><a class="reactor-path" href="/servizi"><span>02 · CREDIBILITÀ</span><strong>Convincere meglio</strong><i>Brand, UX e presenza digitale →</i></a><a class="reactor-path" href="/servizi"><span>03 · CRESCITA / OPERATIVITÀ</span><strong>Vendere o lavorare meglio</strong><i>Commerce, sviluppo e automazioni →</i></a></div></div></section>`;

// Reactor owns the final Home hero directly. If an old Evidence build is encountered,
// replace it for backwards compatibility; otherwise replace the first generated Home section.
const legacyEvidenceTarget = /<section class="evidence-hero"[\s\S]*?<\/section><section class="evidence-bridge"[\s\S]*?<\/section>/;
const generatedHeroTarget = /(<main id="contenuto">\s*)<section\b[^>]*>[\s\S]*?<\/section>/;
if (legacyEvidenceTarget.test(html)) {
  html = html.replace(legacyEvidenceTarget, hero);
} else if (generatedHeroTarget.test(html)) {
  html = html.replace(generatedHeroTarget, `$1${hero}`);
} else {
  throw new Error('Generated homepage hero target not found for Reactor ownership.');
}

// Remove any stale Evidence resources from historical/intermediate builds.
html = html.replace(/<link rel="stylesheet" href="\/home-evidence\.css\?v=[^"]+">/g, '');
html = html.replace(/<script src="\/home-evidence\.js\?v=[^"]+" defer><\/script>/g, '');
html = html.replace(/<link rel="stylesheet" href="\/home-reactor\.css\?v=[^"]+">/g, '');
html = html.replace(/<script src="\/home-reactor\.js\?v=[^"]+" defer><\/script>/g, '');
html = html.replace('</head>', '<link rel="stylesheet" href="/home-reactor.css?v=15.1"></head>');
html = html.replace('</body>', '<script src="/home-reactor.js?v=15.1" defer></script></body>');

fs.writeFileSync(homePath, html);
fs.copyFileSync(cssSource, path.join(site, 'home-reactor.css'));
fs.copyFileSync(jsSource, path.join(site, 'home-reactor.js'));

for (const token of ['data-reactor','casarossa-detail.jpg','unicart-detail.jpg','carabetta-detail.jpg','data-reactor-detail','data-reactor-primary','data-reactor-tab','Il deliverable viene dopo.','/home-reactor.css?v=15.1','/home-reactor.js?v=15.1']) {
  if (!html.includes(token)) throw new Error(`Reactor output missing ${token}`);
}
for (const legacy of ['class="reactor-mobile-crop"','class="evidence-flow"','/home-evidence.css','/home-evidence.js']) {
  if (html.includes(legacy)) throw new Error(`Superseded Home Evidence/Reactor token survived final ownership: ${legacy}`);
}
console.log('Applied Axante Real Work Reactor v15.1 — direct Home hero owner.');
