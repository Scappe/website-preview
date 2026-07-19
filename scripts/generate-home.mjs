import fs from 'node:fs';
import path from 'node:path';

const site=path.join(process.cwd(),'site');
fs.mkdirSync(site,{recursive:true});

const html=String.raw`<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Axante | Web agency Roma per siti, marketing e brand</title>
<meta name="description" content="Axante è la web agency di Roma che unisce strategia, design, siti web, e-commerce, marketing, social, branding e sviluppo per produrre risultati concreti.">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#07070a">
<link rel="canonical" href="https://www.axante.it/">
<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="Axante | Il digitale che porta risultati">
<meta property="og:description" content="Strategia, design e tecnologia coordinate da un unico partner.">
<meta property="og:url" content="https://www.axante.it/">
<meta property="og:image" content="https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg">
<link rel="preconnect" href="https://www.axante.it">
<link rel="stylesheet" href="/home-v4.css">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfessionalService","name":"Axante","url":"https://www.axante.it/","logo":"https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png","image":"https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg","telephone":"+39 06 3397 3984","email":"hello@axante.it","address":{"@type":"PostalAddress","streetAddress":"Via Innocenzo XI 40","postalCode":"00165","addressLocality":"Roma","addressCountry":"IT"},"areaServed":"Italia"}</script>
</head>
<body>
<a class="skip-link" href="#contenuto">Vai al contenuto</a>
<header class="site-header">
  <div class="container nav-wrap">
    <a class="brand" href="/" aria-label="Axante, home"><img src="https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png" width="200" height="45" alt="Axante"></a>
    <nav class="main-nav" aria-label="Navigazione principale">
      <a href="/servizi">Servizi</a><a href="/portfolio">Portfolio</a><a href="/chi-siamo">Chi siamo</a><a href="/contatti">Contatti</a>
    </nav>
    <a class="header-cta" href="/contatti#audit">Audit gratuito <span>↗</span></a>
    <button class="menu-button" type="button" aria-label="Apri il menu" aria-expanded="false"><span></span></button>
  </div>
</header>
<main id="contenuto">
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="eyebrow reveal">Web agency e studio creativo · Roma</span>
      <h1 class="reveal"><span class="gradient">Il digitale</span><br>che porta risultati.</h1>
      <p class="hero-copy reveal">Non ti serve un sito semplicemente bello. Ti serve un sistema capace di <strong>farti trovare, convincere e vendere</strong>. Strategia, identità, contenuti, campagne e sviluppo coordinati da un unico partner.</p>
      <div class="hero-actions reveal"><a class="button button-primary" href="/contatti#audit">Richiedi un audit gratuito <span>↗</span></a><a class="button button-secondary" href="/portfolio">Guarda i progetti <span>→</span></a></div>
      <div class="micro-proof reveal"><span>Consulenza iniziale gratuita</span><span>Pagamenti ad avanzamento</span><span>Garanzia minima di un anno</span></div>
    </div>
    <div class="hero-art reveal" aria-label="Una selezione di progetti reali Axante">
      <figure class="showcase showcase-main"><img src="https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg" width="1200" height="900" fetchpriority="high" alt="Sito e-commerce Casa Rossa sviluppato da Axante"></figure>
      <figure class="showcase showcase-small"><img src="https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg" width="900" height="650" alt="Piattaforma Unicart Auctions realizzata da Axante"></figure>
      <div class="showcase-logo"><small>Brand nel portfolio</small><img src="https://www.axante.it/wp-content/uploads/2021/08/carabetta-logo.png" width="230" height="70" alt="Carabetta"></div>
    </div>
  </div>
</section>
<section class="trust-strip" aria-label="Alcuni clienti Axante">
  <div class="container trust-inner"><p>Hanno lavorato con noi</p><div class="client-logos">
    <img src="https://www.axante.it/wp-content/uploads/2021/08/logo-expert-city.png" width="220" height="70" loading="lazy" alt="Expert City">
    <img src="https://www.axante.it/wp-content/uploads/2021/08/Black-Unicart-logo-completo-path-sfondo-bianco.png" width="220" height="70" loading="lazy" alt="Unicart Auctions">
    <img src="https://www.axante.it/wp-content/uploads/2021/08/carabetta-logo.png" width="220" height="70" loading="lazy" alt="Carabetta">
    <img src="https://www.axante.it/wp-content/uploads/2021/08/logo-medicum.png" width="220" height="70" loading="lazy" alt="Medicum">
  </div></div>
</section>
<section class="section section-soft">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Il tuo ufficio digitale</span><h2>Competenze diverse.<br>Una sola direzione.</h2></div><p>Non vendiamo strumenti a catalogo. Partiamo dal problema, definiamo le priorità e costruiamo la combinazione di servizi più utile alla crescita.</p></div>
    <div class="service-grid">
      <article class="service-card big reveal"><span class="service-no">01 · WEB & COMMERCE</span><h3>Siti ed e-commerce progettati per convertire.</h3><p>Strategia, UX, copy, sviluppo, SEO tecnica, tracciamento e integrazioni. Dal sito vetrina al marketplace.</p><a href="/siti-web">Scopri siti ed e-commerce →</a><img class="service-visual" src="https://www.axante.it/wp-content/uploads/2021/08/Group-20.png" width="520" height="390" loading="lazy" alt="Illustrazione siti web"></article>
      <article class="service-card side reveal"><span class="service-no">02 · BRAND & DESIGN</span><h3>Un’identità che si riconosce e si ricorda.</h3><p>Logo, brand identity, grafica, editoria, packaging, stampa e sistemi visivi coerenti.</p><a href="/branding">Scopri brand e grafica →</a><img class="service-visual" src="https://www.axante.it/wp-content/uploads/2021/12/logo-design.png" width="520" height="390" loading="lazy" alt="Illustrazione logo e brand identity"></article>
      <article class="service-card third reveal"><span class="service-no">03 · SOCIAL & CONTENT</span><h3>Contenuti che fermano lo scroll.</h3><p>Strategia editoriale, foto, video, reel, creator e community.</p><a href="/marketing#content">Social e contenuti →</a><img class="service-visual" src="https://www.axante.it/wp-content/uploads/2021/08/Group-11-Copy.png" width="420" height="320" loading="lazy" alt="Illustrazione social media"></article>
      <article class="service-card third reveal"><span class="service-no">04 · SEO & ADV</span><h3>Visibilità che diventa domanda.</h3><p>SEO, Google Ads, Meta Ads, landing page e misurazione del ritorno.</p><a href="/marketing">Marketing e advertising →</a><img class="service-visual" src="https://www.axante.it/wp-content/uploads/2021/08/Group-13-Copy.png" width="420" height="320" loading="lazy" alt="Illustrazione crescita digitale"></article>
      <article class="service-card third reveal"><span class="service-no">05 · TECH & AUTOMATION</span><h3>La tecnologia elimina lavoro inutile.</h3><p>Plugin, applicazioni, gestionali, integrazioni e automazioni su misura.</p><a href="/sviluppo">Sviluppo e automazioni →</a><img class="service-visual" src="https://www.axante.it/wp-content/uploads/2021/08/Group-17.png" width="420" height="320" loading="lazy" alt="Illustrazione sviluppo digitale"></article>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Selected work</span><h2>Il lavoro vero<br>al centro del sito.</h2></div><p>Niente mockup generici: qui mostriamo progetti, prodotti e identità realmente sviluppati o seguiti da Axante.</p></div>
    <div class="work-list">
      <a class="work-card reveal" href="/portfolio#casarossa"><div class="work-media"><img src="https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg" width="1400" height="1000" loading="lazy" alt="Casa Rossa, e-commerce multilingua"></div><div class="work-content"><div class="tags"><span>E-commerce</span><span>Multilingua</span><span>Development</span></div><h3>Casa Rossa</h3><p>Una piattaforma internazionale per raccontare un’eccellenza siciliana e trasformare il racconto del territorio in un’esperienza d’acquisto completa.</p><span class="work-link">Esplora il progetto ↗</span></div></a>
      <a class="work-card reverse reveal" href="/portfolio#unicart"><div class="work-content"><div class="tags"><span>Marketplace</span><span>Aste online</span><span>UX/UI</span></div><h3>Unicart Auctions</h3><p>Catalogo, registrazione, offerte e dinamiche d’asta organizzati in un’interfaccia chiara e in una base tecnica scalabile.</p><span class="work-link">Esplora il progetto ↗</span></div><div class="work-media"><img src="https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg" width="1400" height="1000" loading="lazy" alt="Unicart Auctions"></div></a>
      <a class="work-card reveal" href="/portfolio#carabetta"><div class="work-media"><img src="https://www.axante.it/wp-content/uploads/2021/08/copertina-sito-carabetta.jpg" width="1400" height="1000" loading="lazy" alt="E-commerce Carabetta"></div><div class="work-content"><div class="tags"><span>Fashion</span><span>E-commerce</span><span>Brand experience</span></div><h3>Carabetta</h3><p>Un’esperienza visiva elegante e immediata, costruita per valorizzare la collezione e ridurre l’attrito verso l’acquisto.</p><span class="work-link">Esplora il progetto ↗</span></div></a>
    </div>
    <div class="hero-actions" style="justify-content:center;margin-top:38px"><a class="button button-secondary" href="/portfolio">Vedi tutto il portfolio →</a></div>
  </div>
</section>
<section class="section section-soft">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Perché Axante</span><h2>Creatività con<br>responsabilità.</h2></div><p>La qualità non è soltanto estetica: significa chiarezza, tempi rispettati, prestazioni, assistenza e risultati verificabili.</p></div>
    <div class="facts"><div class="fact reveal"><strong>360°</strong><span>strategia, creatività e tecnologia</span></div><div class="fact reveal"><strong>1 anno</strong><span>garanzia minima sui siti web</span></div><div class="fact reveal"><strong>7/7</strong><span>assistenza per le urgenze</span></div><div class="fact reveal"><strong>1 team</strong><span>dal concept alla misurazione</span></div></div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head"><div><span class="eyebrow">Recensioni</span><h2>La parte che<br>non scriviamo noi.</h2></div><p>Il valore di un partner digitale si misura anche nel modo in cui segue il progetto prima, durante e dopo la consegna.</p></div>
    <div class="reviews"><article class="review-main reveal"><div class="stars">★★★★★</div><blockquote>“Progetto seguito con un ottimo risultato nei tempi previsti. Assistenza anche successiva e risposte rapide.”</blockquote><div class="review-person"><strong>Tracciati d’Arte</strong><span>Rivista d’arte e cultura</span></div></article><div class="review-stack"><article class="review-small reveal"><div class="stars">★★★★★</div><p>“Ogni loro lavoro è studiato bene e organizzato nel migliore dei modi.”</p><div class="review-person"><strong>Francesco S.</strong><span>Architetto</span></div></article><article class="review-small reveal"><div class="stars">★★★★★</div><p>“Squadra di professionisti. Hanno sempre il consiglio giusto al momento giusto.”</p><div class="review-person"><strong>Barbara G.</strong><span>Ingegnere</span></div></article></div></div>
  </div>
</section>
<section class="cta-section">
  <div class="container"><div class="cta-panel reveal"><span class="eyebrow">Il prossimo passo</span><h2>Facciamo funzionare meglio il tuo digitale.</h2><p>Raccontaci cosa vuoi ottenere e cosa oggi non sta funzionando. Il primo confronto è gratuito, concreto e senza impegno.</p><div class="hero-actions"><a class="button button-primary" href="/contatti#audit">Richiedi l’audit gratuito ↗</a><a class="button button-secondary" href="https://wa.me/393271706981">Scrivici su WhatsApp →</a></div></div></div>
</section>
</main>
<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><img src="https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png" width="200" height="45" alt="Axante"><p>Web agency e studio creativo a Roma. Strategia, design e tecnologia per trasformare la presenza digitale in crescita concreta.</p></div><div class="footer-col"><strong>Esplora</strong><a href="/servizi">Servizi</a><a href="/portfolio">Portfolio</a><a href="/chi-siamo">Chi siamo</a><a href="/lavora-con-noi">Lavora con noi</a></div><div class="footer-col"><strong>Servizi</strong><a href="/siti-web">Siti ed e-commerce</a><a href="/marketing">Marketing e social</a><a href="/branding">Brand e grafica</a><a href="/sviluppo">Sviluppo</a></div><div class="footer-col"><strong>Contatti</strong><a href="tel:+390633973984">06 3397 3984</a><a href="https://wa.me/393271706981">+39 327 170 6981</a><a href="mailto:hello@axante.it">hello@axante.it</a><span>Via Innocenzo XI, 40 · Roma</span></div></div><div class="footer-bottom"><span>© <span data-year>2026</span> Axante S.r.l. · P.IVA 16200861009</span><span>Axante è un marchio registrato · <a href="https://www.axante.it/privacy-policy/">Privacy Policy</a></span></div></div></footer>
<a class="whatsapp" href="https://wa.me/393271706981" target="_blank" rel="noopener" aria-label="Scrivi ad Axante su WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" d="M16 4a12 12 0 0 0-10.2 18.3L4 28l5.9-1.7A12 12 0 1 0 16 4Zm0 21.8c-1.8 0-3.5-.5-5-1.3l-.4-.2-3.5 1 1-3.4-.2-.4A9.8 9.8 0 1 1 16 25.8Zm5.4-7.3c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.7-.3-.5.3-.5.9-1.7.1-.2.1-.5 0-.7-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.4-.3-.7-.5Z"/></svg></a>
<script src="/home-v4.js" defer></script>
</body></html>`;

fs.writeFileSync(path.join(site,'index.html'),html);
console.log('Generated image-led Axante v4 homepage.');
