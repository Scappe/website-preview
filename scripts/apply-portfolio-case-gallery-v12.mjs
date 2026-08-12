import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const pagePath = path.join(site, 'portfolio', 'index.html');
const cssSource = path.join(root, 'portfolio-case-gallery.css');
const jsSource = path.join(root, 'portfolio-case-gallery.js');

for (const file of [pagePath, cssSource, jsSource]) {
  if (!fs.existsSync(file)) throw new Error(`Missing Portfolio v12 source: ${path.basename(file)}`);
}

let html = fs.readFileSync(pagePath, 'utf8');
const main = `<main id="contenuto" class="portfolio-story">
<section class="portfolio-hero" aria-labelledby="portfolio-title">
  <div class="container portfolio-hero-grid">
    <div>
      <div class="breadcrumb"><a href="/">Home</a><span>/</span><span>Portfolio</span></div>
      <span class="section-eyebrow">Proof, non vetrina</span>
      <h1 id="portfolio-title">Problemi reali.<br><span class="text-gradient">Decisioni visibili.</span></h1>
    </div>
    <div class="portfolio-hero-aside">
      <p>Tre casi mostrano come lavoriamo quando il digitale deve risolvere qualcosa di concreto: problema, decisione, output e prova osservabile.</p>
      <a class="portfolio-proof-link" href="#casa-rossa">Inizia da Casa Rossa <span>↓</span></a>
    </div>
  </div>
</section>

<section class="case-gallery" aria-label="Tre case chapter Axante">
  <article class="case-chapter case-casa" id="casa-rossa" data-case="casa-rossa" data-case-chapter data-surface="dark" data-composition="full-bleed">
    <div class="case-casa-media case-visual"><figure><img src="/assets/media/casarossa.jpg" width="1400" height="1000" decoding="async" alt="E-commerce Casa Rossa realizzato da Axante"><figcaption>Casa Rossa · un unico ambiente per catalogo, contenuti e vendita multilingua.</figcaption></figure></div>
    <div class="container case-casa-copywrap">
      <div class="case-copy"><div class="case-number"><span>01 · Casa Rossa</span></div><p class="case-kicker">Commerce / Multilingua / Development</p><h2>Vendere online senza moltiplicare la complessità.</h2></div>
      <div class="case-story">
        <div class="case-step"><small>Problema</small><p>Portare e-commerce e contenuti in più lingue senza frammentare aggiornamenti, ordini e gestione quotidiana.</p></div>
        <div class="case-step"><small>Decisione Axante</small><p>Trattare commerce, struttura dei contenuti, multilingua e sviluppo come un solo prodotto.</p></div>
        <div class="case-step"><small>Output</small><p>E-commerce, struttura multilingua e impostazione SEO integrate in una base gestibile in autonomia.</p></div>
        <div class="case-step is-proof"><small>Prova osservabile</small><p>Catalogo, contenuti e vendita convivono nello stesso sistema invece di essere esperienze separate.</p></div>
      </div>
      <div class="case-links"><a href="/servizi#web">Come affrontiamo siti ed e-commerce <span>→</span></a><a href="/contatti">Hai una complessità simile? <span>↗</span></a></div>
    </div>
  </article>

  <article class="case-chapter case-unicart" id="unicart" data-case="unicart" data-case-chapter data-surface="light" data-composition="asymmetric-split">
    <div class="container case-unicart-grid">
      <div class="case-copy"><div class="case-number"><span>02 · Unicart Auctions</span></div><p class="case-kicker">Product UX / Marketplace / Development</p><h2>La complessità resta nel sistema. Non sull’utente.</h2><div class="case-story">
        <div class="case-step"><small>Problema</small><p>Rendere leggibile un prodotto d’asta che coordina registrazione, catalogo, offerte e stati che cambiano nel tempo.</p></div>
        <div class="case-step"><small>Decisione Axante</small><p>Organizzare la UX intorno alle azioni e ai feedback necessari in ogni momento, facendo emergere priorità e stato.</p></div>
        <div class="case-step"><small>Output</small><p>Struttura di prodotto, UX/UI e sviluppo coordinati per registrazione, catalogo, offerte e gestione degli stati d’asta.</p></div>
        <div class="case-step is-proof"><small>Prova osservabile</small><p>L’interfaccia rende leggibili passaggi e gerarchie di un processo ad alta complessità operativa.</p></div>
      </div><div class="case-links"><a href="/servizi#development">Development e sistemi su misura <span>→</span></a><a href="/contatti">Devi semplificare un flusso complesso? <span>↗</span></a></div></div>
      <div class="case-visual case-visual-unicart"><figure><img src="/assets/media/unicart.jpg" width="1400" height="1000" loading="lazy" decoding="async" alt="Piattaforma Unicart Auctions realizzata da Axante"><figcaption>Unicart Auctions · gerarchie, azioni e stati d’asta in un’unica interfaccia.</figcaption></figure></div>
    </div>
  </article>

  <article class="case-chapter case-carabetta" id="carabetta" data-case="carabetta" data-case-chapter data-surface="lilac" data-composition="layered-crop">
    <div class="container case-carabetta-grid">
      <div class="case-visual case-visual-carabetta">
        <figure class="carabetta-main"><img src="/assets/media/carabetta.jpg" width="1400" height="1000" loading="lazy" decoding="async" alt="Esperienza e-commerce Carabetta realizzata da Axante"><figcaption>Carabetta · prodotto, immagine e azioni di acquisto nella stessa gerarchia.</figcaption></figure>
        <figure class="carabetta-crop" aria-hidden="true"><img src="/assets/media/carabetta.jpg" width="1400" height="1000" loading="lazy" decoding="async" alt=""></figure>
      </div>
      <div class="case-copy"><div class="case-number"><span>03 · Carabetta</span></div><p class="case-kicker">Brand expression / UX/UI / E-commerce</p><h2>Desiderabilità e acquisto nella stessa esperienza.</h2><div class="case-story">
        <div class="case-step"><small>Problema</small><p>Trasformare una collezione in un’esperienza riconoscibile mantenendo chiare navigazione, prodotto e azioni commerciali.</p></div>
        <div class="case-step"><small>Decisione Axante</small><p>Portare l’identità dentro la gerarchia dell’esperienza, invece di appoggiarla sopra una struttura e-commerce generica.</p></div>
        <div class="case-step"><small>Output</small><p>Brand expression, UX/UI ed e-commerce coordinati in un percorso che alterna scoperta, dettaglio e acquisto.</p></div>
        <div class="case-step is-proof"><small>Prova osservabile</small><p>Immagini, tipografia e interazioni sostengono insieme la lettura del prodotto e le azioni di acquisto.</p></div>
      </div><div class="case-links"><a href="/servizi#brand">Brand ed experience come sistema <span>→</span></a><a href="/contatti">Vuoi rendere più forte un prodotto? <span>↗</span></a></div></div>
    </div>
  </article>
</section>

<section class="portfolio-principle" aria-labelledby="portfolio-principle-title"><div class="container portfolio-principle-grid"><span class="section-eyebrow">Il pattern dietro i casi</span><h2 id="portfolio-principle-title">Problema → decisione → sistema → prova.</h2><div><p>Il deliverable viene dopo. Prima capiamo cosa deve cambiare, quali vincoli contano e quale sistema può reggere nel tempo.</p><div class="portfolio-principle-links"><a href="/servizi">Vedi i problemi che affrontiamo <span>→</span></a><a href="/chi-siamo">Come prendiamo decisioni e lavoriamo <span>→</span></a></div></div></div></section>

<section class="portfolio-conversion"><div class="container"><div class="portfolio-conversion-panel"><span class="section-eyebrow">Dal proof al tuo contesto</span><h2>Non serve avere già la soluzione.<br>Portaci il problema.</h2><p>Raccontaci cosa oggi non funziona, cosa vuoi rendere più semplice o dove il digitale non sta sostenendo il business.</p><div class="actions"><a class="btn btn-primary" href="/contatti">Raccontaci il problema <span>↗</span></a><a class="btn btn-secondary" href="/servizi">Esplora i servizi <span>→</span></a></div></div></div></section>
</main>`;

if (!/<main id="contenuto"[\s\S]*?<\/main>/.test(html)) throw new Error('Portfolio main target not found.');
html = html.replace(/<main id="contenuto"[\s\S]*?<\/main>/, main);
html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Portfolio Axante | Problemi reali, decisioni e sistemi digitali</title>');
html = html.replace(/<meta\b[^>]*name=["']description["'][^>]*>/i, '<meta name="description" content="Casa Rossa, Unicart Auctions e Carabetta: problemi reali, decisioni Axante, output e proof osservabile del lavoro digitale.">');
html = html.replace(/<meta\b[^>]*property=["']og:title["'][^>]*>/i, '<meta property="og:title" content="Portfolio Axante | Problemi reali, decisioni visibili">');
html = html.replace(/<meta\b[^>]*property=["']og:description["'][^>]*>/i, '<meta property="og:description" content="Tre case chapter mostrano problema, decisione, output e proof del lavoro Axante.">');
html = html.replace(/<link rel="stylesheet" href="\/portfolio-case-gallery\.css\?v=[^"]+">/g, '');
html = html.replace(/<script src="\/portfolio-case-gallery\.js\?v=[^"]+" defer><\/script>/g, '');
html = html.replace('</head>', '<link rel="stylesheet" href="/portfolio-case-gallery.css?v=12.2"></head>');
html = html.replace('</body>', '<script src="/portfolio-case-gallery.js?v=12.2" defer></script></body>');

fs.writeFileSync(pagePath, html);
fs.copyFileSync(cssSource, path.join(site, 'portfolio-case-gallery.css'));
fs.copyFileSync(jsSource, path.join(site, 'portfolio-case-gallery.js'));

const required = ['Proof, non vetrina','Problemi reali.','Casa Rossa','Unicart Auctions','Carabetta','Decisione Axante','Prova osservabile','Il pattern dietro i casi','/chi-siamo','/portfolio-case-gallery.css?v=12.2'];
for (const token of required) if (!html.includes(token)) throw new Error(`Portfolio v12.2 missing token: ${token}`);
for (const legacy of ['selected-archive','archive-card','portfolio-grid','Il prossimo case study']) if (html.includes(legacy)) throw new Error(`Legacy portfolio token still present: ${legacy}`);
console.log('Applied Axante Portfolio Case Chapters v12.2.');
