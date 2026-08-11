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
    <div class="portfolio-hero-copyblock">
      <div class="breadcrumb"><a href="/">Home</a><span>/</span><span>Portfolio</span></div>
      <span class="section-eyebrow">Proof, non vetrina</span>
      <h1 id="portfolio-title">Problemi reali.<br><span class="text-gradient">Sistemi costruiti.</span></h1>
      <p class="portfolio-hero-copy">Tre progetti mostrano il nostro lavoro nel modo più utile: il problema da risolvere, le decisioni prese, ciò che abbiamo costruito e la prova che puoi osservare.</p>
      <div class="portfolio-hero-actions"><a class="btn btn-primary" href="#casa-rossa">Entra nei casi <span>↓</span></a><a class="portfolio-proof-link" href="/contatti">Hai un problema simile? Raccontacelo <span>↗</span></a></div>
    </div>
    <a class="portfolio-hero-feature" href="#casa-rossa" aria-label="Vai al caso Casa Rossa">
      <figure class="portfolio-hero-media"><img src="/assets/media/casarossa.jpg" width="1400" height="1000" decoding="async" alt="Interfaccia dell'e-commerce Casa Rossa, progetto Axante"><figcaption>Casa Rossa · e-commerce, multilingua, gestione editoriale</figcaption></figure>
      <div class="portfolio-hero-feature-copy"><span>01 · Caso in evidenza</span><strong>Vendere online senza rendere più complessa la gestione.</strong><small>Problema → sistema → prova</small></div>
    </a>
  </div>
</section>

<section class="case-gallery" aria-label="Case study in evidenza">
  <div class="container">
    <article class="case-chapter case-casa" id="casa-rossa" data-case="casa-rossa" data-case-chapter>
      <div class="case-visual case-visual-editorial"><figure><img src="/assets/media/casarossa.jpg" width="1400" height="1000" decoding="async" alt="E-commerce Casa Rossa realizzato da Axante"><figcaption>Proof · un unico ambiente per catalogo, contenuti e vendita multilingua.</figcaption></figure></div>
      <div class="case-copy"><div class="case-number"><span>01 · Casa Rossa</span></div><p class="case-kicker">Commerce / Multilingua / Development</p><h2>Vendere online.<br>Senza aggiungere attrito operativo.</h2><div class="case-story">
        <div class="case-step"><small>Contesto</small><p>Casa Rossa aveva bisogno di una presenza digitale capace di raccontare il prodotto e supportare la vendita online.</p></div>
        <div class="case-step"><small>Problema</small><p>Portare e-commerce e contenuti in più lingue senza trasformare aggiornamenti, ordini e gestione quotidiana in un sistema frammentato.</p></div>
        <div class="case-step"><small>Decisione Axante</small><p>Trattare commerce, struttura dei contenuti, multilingua e sviluppo come un solo prodotto, così che l’esperienza cliente e quella di gestione restassero coerenti.</p></div>
        <div class="case-step"><small>Output</small><p>Sviluppo tecnico dell’e-commerce, struttura multilingua e impostazione SEO integrate in una base gestibile in autonomia.</p></div>
        <div class="case-step is-proof"><small>Prova osservabile</small><p>Catalogo, contenuti multilingua e flusso di vendita convivono nella stessa piattaforma invece di essere esperienze separate.</p></div>
      </div><div class="case-links"><a href="/servizi#web">Vedi come affrontiamo siti ed e-commerce <span>→</span></a><a href="/contatti">Hai una complessità simile? Parliamone <span>↗</span></a></div></div>
    </article>

    <article class="case-chapter case-unicart" id="unicart" data-case="unicart" data-case-chapter>
      <div class="case-copy"><div class="case-number"><span>02 · Unicart Auctions</span></div><p class="case-kicker">Product UX / Marketplace / Development</p><h2>La complessità resta nel sistema.<br>Non sull’utente.</h2><div class="case-story">
        <div class="case-step"><small>Contesto</small><p>Un prodotto d’asta online deve coordinare catalogo, registrazione, offerte e stati che cambiano nel tempo.</p></div>
        <div class="case-step"><small>Problema</small><p>Rendere comprensibile un flusso operativo articolato senza costringere l’utente a imparare la complessità tecnica che lo sostiene.</p></div>
        <div class="case-step"><small>Decisione Axante</small><p>Organizzare la UX intorno alle azioni e ai feedback realmente necessari in ogni momento, facendo emergere priorità e stato prima delle funzioni secondarie.</p></div>
        <div class="case-step"><small>Output</small><p>Struttura di prodotto, UX/UI e sviluppo coordinati per registrazione, catalogo, offerte e gestione degli stati d’asta.</p></div>
        <div class="case-step is-proof"><small>Prova osservabile</small><p>L’interfaccia rende leggibili passaggi e gerarchie di un processo che, sotto la superficie, resta ad alta complessità operativa.</p></div>
      </div><div class="case-links"><a href="/servizi#development">Approfondisci development e sistemi su misura <span>→</span></a><a href="/contatti">Devi semplificare un flusso complesso? Raccontacelo <span>↗</span></a></div></div>
      <div class="case-visual case-visual-tall"><figure><img src="/assets/media/unicart.jpg" width="1400" height="1000" loading="lazy" decoding="async" alt="Piattaforma Unicart Auctions realizzata da Axante"><figcaption>Proof · gerarchie, azioni e stati d’asta resi leggibili in un’unica interfaccia.</figcaption></figure></div>
    </article>

    <article class="case-chapter case-carabetta" id="carabetta" data-case="carabetta" data-case-chapter>
      <div class="case-visual case-visual-bleed"><figure><img src="/assets/media/carabetta.jpg" width="1400" height="1000" loading="lazy" decoding="async" alt="Esperienza e-commerce Carabetta realizzata da Axante"><figcaption>Proof · prodotto, immagine e azioni di acquisto condividono la stessa gerarchia.</figcaption></figure></div>
      <div class="case-copy"><div class="case-number"><span>03 · Carabetta</span></div><p class="case-kicker">Brand expression / UX/UI / E-commerce</p><h2>Desiderabilità e acquisto.<br>Nella stessa esperienza.</h2><div class="case-story">
        <div class="case-step"><small>Contesto</small><p>Nel fashion commerce il prodotto deve restare protagonista senza rendere il percorso d’acquisto fragile o dispersivo.</p></div>
        <div class="case-step"><small>Problema</small><p>Trasformare una collezione in un’esperienza riconoscibile e desiderabile mantenendo chiare navigazione, prodotto e azioni commerciali.</p></div>
        <div class="case-step"><small>Decisione Axante</small><p>Portare l’identità dentro la gerarchia dell’esperienza, invece di aggiungerla come decorazione sopra una struttura e-commerce generica.</p></div>
        <div class="case-step"><small>Output</small><p>Brand expression, UX/UI ed e-commerce coordinati in un percorso che alterna scoperta, dettaglio e acquisto.</p></div>
        <div class="case-step is-proof"><small>Prova osservabile</small><p>Il visual non vive separato dalla funzione: immagini, tipografia e interazioni sostengono la lettura del prodotto e le azioni di acquisto.</p></div>
      </div><div class="case-links"><a href="/servizi#brand">Vedi come lavoriamo su brand ed experience <span>→</span></a><a href="/contatti">Vuoi rendere più desiderabile un prodotto? Parliamone <span>↗</span></a></div></div>
    </article>
  </div>
</section>

<section class="portfolio-principle" aria-labelledby="portfolio-principle-title"><div class="container portfolio-principle-grid"><span class="section-eyebrow">Il criterio dietro i casi</span><h2 id="portfolio-principle-title">Non partiamo dal deliverable.<br><span class="text-gradient">Partiamo da ciò che deve cambiare.</span></h2><div class="portfolio-principle-flow" aria-label="Metodo Axante"><span>Problema</span><b>→</b><span>Priorità</span><b>→</b><span>Sistema</span><b>→</b><span>Release</span><b>→</b><span>Evoluzione</span></div><p>Per questo due progetti con la stessa tecnologia possono avere struttura, ritmo e priorità completamente diversi. Il servizio è un mezzo; la decisione nasce dal contesto.</p></div></section>

<section class="selected-archive" aria-labelledby="archive-title"><div class="container"><div class="archive-head"><div><span class="section-eyebrow">Selected archive</span><h2 id="archive-title">Altri contesti.<br>Stessa responsabilità.</h2></div><p>Non tutto richiede un case study esteso. Questi lavori restano consultabili come prova secondaria, senza competere con i tre capitoli principali.</p></div><div class="archive-grid"><article class="archive-card"><div class="archive-thumb"><img src="/assets/project-tracciati.svg" width="1200" height="800" loading="lazy" alt="Progetto Tracciati d'Arte"></div><div><div class="archive-tags"><span>Editoriale</span><span>Content platform</span></div><h3>Tracciati d’Arte</h3><p>Un ecosistema editoriale in cui identità e fruizione dei contenuti lavorano insieme.</p></div></article><article class="archive-card"><div class="archive-thumb"><img src="/assets/project-weblab.svg" width="1200" height="800" loading="lazy" alt="Progetto WebLab TdA"></div><div><div class="archive-tags"><span>B2B</span><span>Lead generation</span></div><h3>WebLab TdA</h3><p>Un percorso digitale costruito per spiegare un’offerta complessa e accompagnare verso il contatto.</p></div></article></div></div></section>

<section class="portfolio-conversion"><div class="container"><div class="portfolio-conversion-panel"><span class="section-eyebrow">Dal proof al tuo contesto</span><h2>Non serve avere già la soluzione.<br><span class="text-gradient">Portaci il problema.</span></h2><p>Raccontaci cosa oggi non funziona, cosa vuoi rendere più semplice o dove senti che il digitale non sta sostenendo il business. Il primo passo è mettere a fuoco la priorità.</p><div class="actions"><a class="btn btn-primary" href="/contatti">Raccontaci il problema <span>↗</span></a><a class="btn btn-secondary" href="/servizi">Esplora i percorsi per obiettivo <span>→</span></a></div></div></div></section>
</main>`;

if (!/<main id="contenuto"[\s\S]*?<\/main>/.test(html)) throw new Error('Portfolio main target not found.');
html = html.replace(/<main id="contenuto"[\s\S]*?<\/main>/, main);
html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Portfolio Axante | Problemi reali, sistemi digitali costruiti</title>');
html = html.replace(/<meta\b[^>]*name=["']description["'][^>]*>/i, '<meta name="description" content="Casa Rossa, Unicart Auctions e Carabetta: problemi reali, decisioni Axante, sistemi digitali costruiti e proof osservabile.">');
html = html.replace(/<meta\b[^>]*property=["']og:title["'][^>]*>/i, '<meta property="og:title" content="Portfolio Axante | Problemi reali, sistemi costruiti">');
html = html.replace(/<meta\b[^>]*property=["']og:description["'][^>]*>/i, '<meta property="og:description" content="Tre casi mostrano problema, decisioni, output e proof del lavoro Axante.">');
if (!html.includes('/portfolio-case-gallery.css?v=12.1')) html = html.replace(/<link rel="stylesheet" href="\/portfolio-case-gallery\.css\?v=12\.0">|<\/head>/, match => match === '</head>' ? '<link rel="stylesheet" href="/portfolio-case-gallery.css?v=12.1"></head>' : '<link rel="stylesheet" href="/portfolio-case-gallery.css?v=12.1">');
if (!html.includes('/portfolio-case-gallery.js?v=12.1')) html = html.replace(/<script src="\/portfolio-case-gallery\.js\?v=12\.0" defer><\/script>|<\/body>/, match => match === '</body>' ? '<script src="/portfolio-case-gallery.js?v=12.1" defer></script></body>' : '<script src="/portfolio-case-gallery.js?v=12.1" defer></script>');

fs.writeFileSync(pagePath, html);
fs.copyFileSync(cssSource, path.join(site, 'portfolio-case-gallery.css'));
fs.copyFileSync(jsSource, path.join(site, 'portfolio-case-gallery.js'));

const required = ['Proof, non vetrina','Problemi reali.','Casa Rossa','Unicart Auctions','Carabetta','Decisione Axante','Prova osservabile','Il criterio dietro i casi','Raccontaci il problema','/portfolio-case-gallery.css?v=12.1'];
for (const token of required) if (!html.includes(token)) throw new Error(`Portfolio v12.1 missing token: ${token}`);
for (const legacy of ['portfolio-grid','Il risultato non è<br>solo estetico.','Il prossimo case study','Case study · proof first']) if (html.includes(legacy)) throw new Error(`Legacy portfolio token still present: ${legacy}`);
console.log('Applied Axante Portfolio Case Study Gallery v12.1.');
