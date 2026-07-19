import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
fs.mkdirSync(site, { recursive: true });

const logo = 'https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png';
const whatsapp = `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" d="M16 4a12 12 0 0 0-10.2 18.3L4 28l5.9-1.7A12 12 0 1 0 16 4Zm0 21.8c-1.8 0-3.5-.5-5-1.3l-.4-.2-3.5 1 1-3.4-.2-.4A9.8 9.8 0 1 1 16 25.8Zm5.4-7.3c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.7-.3-.5.3-.5.9-1.7.1-.2.1-.5 0-.7-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.4-.3-.7-.5Z"/></svg>`;

const html = String.raw`<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Axante | Web agency Roma per siti, marketing e brand</title>
<meta name="description" content="Axante è la web agency di Roma che unisce strategia, design, siti web, e-commerce, marketing, social, branding e sviluppo per produrre risultati concreti.">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#050507">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="https://www.axante.it/">
<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="Axante | Il digitale che porta risultati">
<meta property="og:description" content="Strategia, design e tecnologia coordinate da un unico partner.">
<meta property="og:url" content="https://www.axante.it/">
<meta property="og:image" content="https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg">
<link rel="preconnect" href="https://www.axante.it">
<link rel="preload" as="image" href="https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg">
<link rel="stylesheet" href="/home-v5.css">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfessionalService","name":"Axante","url":"https://www.axante.it/","logo":"${logo}","image":"https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg","telephone":"+39 06 3397 3984","email":"hello@axante.it","address":{"@type":"PostalAddress","streetAddress":"Via Innocenzo XI 40","postalCode":"00165","addressLocality":"Roma","addressCountry":"IT"},"areaServed":"Italia"}</script>
</head>
<body>
<div class="page-transition" aria-hidden="true"></div>
<div class="scroll-progress" aria-hidden="true"></div>
<canvas class="ambient-canvas" aria-hidden="true"></canvas>
<div class="cursor-dot" aria-hidden="true"></div><div class="cursor-ring" aria-hidden="true"></div>
<a class="skip-link" href="#contenuto">Vai al contenuto</a>
<header class="site-header">
  <div class="container nav-wrap">
    <a class="brand" data-magnetic href="/" aria-label="Axante, home"><img src="${logo}" width="198" alt="Axante"></a>
    <nav class="main-nav" aria-label="Navigazione principale"><a href="/servizi">Servizi</a><a href="/portfolio">Portfolio</a><a href="/chi-siamo">Chi siamo</a><a href="/contatti">Contatti</a></nav>
    <a class="header-cta" data-magnetic href="/contatti#audit">Audit gratuito <span>↗</span></a>
    <button class="menu-button" type="button" aria-label="Apri il menu" aria-expanded="false"><span></span></button>
  </div>
</header>
<main id="contenuto">
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy-column">
      <span class="eyebrow">Web agency e studio creativo · Roma</span>
      <h1 class="kinetic-title" aria-label="Il digitale che porta risultati">
        <span class="title-line"><span>IL <span class="gradient-word">DIGITALE</span></span></span>
        <span class="title-line"><span>CHE PORTA</span></span>
        <span class="title-line"><span>RISULTATI.</span></span>
      </h1>
      <p class="hero-copy reveal">Non ti serve soltanto qualcosa di bello online. Ti serve un sistema capace di <strong>farti trovare, convincere e vendere</strong>. Strategia, identità, contenuti, campagne e sviluppo coordinati da un unico partner.</p>
      <div class="hero-actions reveal"><a class="button button-primary" data-magnetic href="/contatti#audit">Richiedi un audit gratuito <span>↗</span></a><a class="button button-secondary" data-magnetic href="/portfolio">Entra nel portfolio <span>→</span></a></div>
      <div class="micro-proof reveal"><span>Consulenza iniziale gratuita</span><span>Pagamento ad avanzamento</span><span>Garanzia minima di un anno</span></div>
      <div class="scroll-cue reveal"><i></i><span>Scorri per esplorare</span></div>
    </div>
    <div class="hero-art reveal" aria-label="Progetti reali realizzati da Axante">
      <div class="hero-orbit" data-depth=".35"></div>
      <figure class="project-frame project-main" data-depth="1.1" data-tilt><img src="https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg" width="1200" height="900" fetchpriority="high" alt="Casa Rossa, e-commerce realizzato da Axante"></figure>
      <figure class="project-frame project-satellite" data-depth="1.8" data-tilt><img src="https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg" width="900" height="650" alt="Unicart Auctions"></figure>
      <div class="project-badge" data-depth="2.2"><small>Brand nel portfolio</small><img src="https://www.axante.it/wp-content/uploads/2021/08/carabetta-logo.png" width="230" alt="Carabetta"></div>
      <div class="floating-code" data-depth="2.5"><b>01</b> strategy<br><b>02</b> design<br><b>03</b> technology</div>
    </div>
  </div>
</section>
<div class="marquee" aria-label="Servizi Axante"><div class="marquee-track"><span>STRATEGIA</span><span>WEB DESIGN</span><span>E-COMMERCE</span><span>BRAND IDENTITY</span><span>CONTENUTI</span><span>ADVERTISING</span><span>SEO</span><span>AUTOMAZIONI</span><span>STRATEGIA</span><span>WEB DESIGN</span><span>E-COMMERCE</span><span>BRAND IDENTITY</span><span>CONTENUTI</span><span>ADVERTISING</span><span>SEO</span><span>AUTOMAZIONI</span></div></div>

<section class="section capabilities">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow reveal">Un solo partner, molte competenze</span><h2 class="reveal">Non un catalogo.<br><span class="gradient">Un universo operativo.</span></h2></div><p class="reveal">Muovi il cursore tra le competenze. Ogni progetto combina soltanto ciò che serve per trasformare un problema in un risultato misurabile.</p></div>
    <div class="capability-shell">
      <article class="capability-copy spotlight reveal">
        <div><span class="eyebrow">Competenza attiva</span><h3 data-capability-title>Siti ed e-commerce</h3><p data-capability-copy>Strategia, UX, copy, sviluppo, SEO tecnica, tracciamento e integrazioni: dal primo clic alla conversione.</p><a class="button button-secondary" data-capability-link href="/siti-web">Esplora il servizio <span>↗</span></a></div>
        <div class="service-index" data-capability-index>01</div>
      </article>
      <div class="capability-stage reveal" data-capability-stage>
        <div class="capability-core"><div class="capability-core-inner"><small>Axante system</small><strong data-core-title>Siti ed e-commerce</strong><span data-core-copy>Esperienze digitali che convertono.</span></div></div>
        <a class="capability-node node-web active" href="/siti-web" data-index="01" data-title="Siti ed e-commerce" data-short="Esperienze digitali che convertono." data-copy="Strategia, UX, copy, sviluppo, SEO tecnica, tracciamento e integrazioni: dal primo clic alla conversione." data-href="/siti-web"><span class="node-media"><img src="https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg" alt="Web ed e-commerce"></span><b>Web & commerce</b></a>
        <a class="capability-node node-brand" href="/branding" data-index="02" data-title="Brand e design" data-short="Identità che diventano memoria." data-copy="Logo, sistemi visivi, grafica, packaging e materiali capaci di rendere il brand riconoscibile prima ancora di leggerne il nome." data-href="/branding"><span class="node-media"><img src="https://www.axante.it/wp-content/uploads/2021/08/copertina-sito-carabetta.jpg" alt="Brand e design"></span><b>Brand & design</b></a>
        <a class="capability-node node-growth" href="/marketing" data-index="03" data-title="Growth e contenuti" data-short="Attenzione trasformata in domanda." data-copy="SEO, campagne, social, foto, video e funnel collegati a metriche reali, non a numeri vanitosi." data-href="/marketing"><span class="node-media"><img src="https://www.axante.it/wp-content/uploads/2021/08/tda.jpg" alt="Marketing e contenuti"></span><b>Growth & content</b></a>
        <a class="capability-node node-tech" href="/sviluppo" data-index="04" data-title="Tech e automazioni" data-short="La complessità lavora dietro le quinte." data-copy="Applicazioni, plugin, gestionali e automazioni su misura per eliminare attriti, errori e attività ripetitive." data-href="/sviluppo"><span class="node-media"><img src="https://www.axante.it/wp-content/uploads/2021/08/weblab.jpg" alt="Sviluppo e automazioni"></span><b>Tech & automation</b></a>
      </div>
    </div>
  </div>
</section>

<section class="project-reel" data-horizontal>
  <div class="sticky-projects">
    <div class="reel-heading"><div><span class="eyebrow">Selected work</span><h2>Il lavoro vero.<br><span class="gradient">A tutto schermo.</span></h2></div><span class="reel-counter" data-reel-counter>01 / 04</span></div>
    <div class="project-track">
      <article class="reel-card"><img src="https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg" width="1400" height="1000" loading="lazy" alt="Casa Rossa"><a class="reel-link" href="/portfolio#casarossa" aria-label="Apri Casa Rossa">↗</a><div class="reel-content"><div class="tags"><span>E-commerce</span><span>Multilingua</span><span>Development</span></div><h3>Casa Rossa</h3><p>Un’eccellenza siciliana trasformata in un’esperienza internazionale di racconto, prodotto e acquisto.</p></div></article>
      <article class="reel-card"><img src="https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg" width="1400" height="1000" loading="lazy" alt="Unicart Auctions"><a class="reel-link" href="/portfolio#unicart" aria-label="Apri Unicart Auctions">↗</a><div class="reel-content"><div class="tags"><span>Marketplace</span><span>Aste online</span><span>UX/UI</span></div><h3>Unicart Auctions</h3><p>Una piattaforma complessa resa semplice da usare, capire e far crescere.</p></div></article>
      <article class="reel-card"><img src="https://www.axante.it/wp-content/uploads/2021/08/copertina-sito-carabetta.jpg" width="1400" height="1000" loading="lazy" alt="Carabetta"><a class="reel-link" href="/portfolio#carabetta" aria-label="Apri Carabetta">↗</a><div class="reel-content"><div class="tags"><span>Fashion</span><span>E-commerce</span><span>Brand experience</span></div><h3>Carabetta</h3><p>Un’esperienza editoriale elegante che accompagna la collezione verso la conversione.</p></div></article>
      <article class="reel-card"><img src="https://www.axante.it/wp-content/uploads/2021/08/tda.jpg" width="1400" height="1000" loading="lazy" alt="Tracciati d’Arte"><a class="reel-link" href="/portfolio#tda" aria-label="Apri Tracciati d’Arte">↗</a><div class="reel-content"><div class="tags"><span>Magazine</span><span>Art direction</span><span>Content</span></div><h3>Tracciati d’Arte</h3><p>Un ecosistema editoriale che mette opere, autori e lettura al centro della scena.</p></div></article>
    </div>
  </div>
</section>

<section class="section process-section">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow reveal">Il metodo</span><h2 class="reveal">La magia si vede.<br><span class="gradient">Il metodo resta solido.</span></h2></div><p class="reveal">Dietro ogni effetto memorabile ci sono ricerca, priorità, prototipi e verifiche. Il risultato sorprende perché ogni scelta ha una ragione.</p></div>
    <div class="process-line">
      <article class="process-step reveal" data-step="01"><h3>Scopriamo il problema</h3><p>Mercato, pubblico, offerta, dati e attriti reali prima di parlare di colori o strumenti.</p></article>
      <article class="process-step reveal" data-step="02"><h3>Disegniamo il sistema</h3><p>Architettura, messaggi, direzione visiva e tecnologia vengono progettati insieme.</p></article>
      <article class="process-step reveal" data-step="03"><h3>Costruiamo e testiamo</h3><p>Prototipi, sviluppo, contenuti e tracciamento avanzano per cicli verificabili.</p></article>
      <article class="process-step reveal" data-step="04"><h3>Misuriamo e miglioriamo</h3><p>Il lancio non è il finale: dati e feedback indicano la prossima evoluzione.</p></article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow reveal">Prova sociale</span><h2 class="reveal">Creatività con<br><span class="gradient">responsabilità.</span></h2></div><p class="reveal">La qualità non si ferma all’effetto wow: significa tempi, assistenza, prestazioni e risultati che continuano dopo la consegna.</p></div>
    <div class="proof-grid">
      <article class="review-feature reveal"><div class="stars">★★★★★</div><blockquote>“Progetto seguito con un ottimo risultato nei tempi previsti. Assistenza anche successiva e risposte rapide.”</blockquote><div class="review-person"><strong>Tracciati d’Arte</strong><span>Rivista d’arte e cultura</span></div></article>
      <div class="proof-panel reveal"><div class="fact"><strong>360°</strong><span>strategia, creatività e tecnologia</span></div><div class="fact"><strong>1 anno</strong><span>garanzia minima sui siti</span></div><div class="fact"><strong>7/7</strong><span>assistenza per le urgenze</span></div><div class="fact"><strong>1 team</strong><span>dal concept alla misurazione</span></div></div>
    </div>
  </div>
</section>

<section class="cta-section"><div class="container"><div class="cta-panel spotlight reveal"><span class="eyebrow">Il prossimo progetto</span><h2>Facciamo qualcosa che i tuoi concorrenti non saprebbero copiare.</h2><p>Raccontaci obiettivo, problema o idea. Il primo confronto è gratuito, concreto e senza impegno.</p><div class="hero-actions"><a class="button button-primary" data-magnetic href="/contatti#audit">Richiedi l’audit gratuito ↗</a><a class="button button-secondary" data-magnetic href="https://wa.me/393271706981">WhatsApp →</a></div></div></div></section>
</main>
<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><img src="${logo}" width="198" alt="Axante"><p>Web agency e studio creativo a Roma. Strategia, design e tecnologia per trasformare la presenza digitale in crescita concreta.</p></div><div class="footer-col"><strong>Esplora</strong><a href="/servizi">Servizi</a><a href="/portfolio">Portfolio</a><a href="/chi-siamo">Chi siamo</a><a href="/lavora-con-noi">Lavora con noi</a></div><div class="footer-col"><strong>Servizi</strong><a href="/siti-web">Siti ed e-commerce</a><a href="/marketing">Marketing e social</a><a href="/branding">Brand e grafica</a><a href="/sviluppo">Sviluppo</a></div><div class="footer-col"><strong>Contatti</strong><a href="tel:+390633973984">06 3397 3984</a><a href="https://wa.me/393271706981">+39 327 170 6981</a><a href="mailto:hello@axante.it">hello@axante.it</a><span>Via Innocenzo XI, 40 · Roma</span></div></div><div class="footer-bottom"><span>© <span data-year>2026</span> Axante S.r.l. · P.IVA 16200861009</span><span>Axante è un marchio registrato · <a href="https://www.axante.it/privacy-policy/">Privacy Policy</a></span></div></div></footer>
<a class="whatsapp" href="https://wa.me/393271706981" target="_blank" rel="noopener" aria-label="Scrivi ad Axante su WhatsApp">${whatsapp}</a>
<script src="/home-v5.js" defer></script>
</body></html>`;

fs.writeFileSync(path.join(site, 'index.html'), html);
console.log('Generated cinematic interactive Axante v5 homepage.');
