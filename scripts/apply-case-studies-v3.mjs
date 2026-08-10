import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const homePath = path.join(site, 'index.html');
if (!fs.existsSync(homePath)) throw new Error('site/index.html is missing before case-study enhancement.');

const css = String.raw`
/* Axante Selected Work V3 — narrative case-study chapters */
.case-studies-v3{position:relative;padding:128px 0 118px;overflow:clip;background:radial-gradient(circle at 50% 18%,rgba(138,92,255,.06),transparent 34rem)}
.case-studies-v3 .case-intro{display:grid;grid-template-columns:1fr .62fr;align-items:end;gap:64px;margin-bottom:48px}
.case-studies-v3 .case-intro h2{margin:14px 0 0;font-family:'Manrope',sans-serif;font-size:clamp(50px,6.1vw,88px);line-height:.91;letter-spacing:-.07em;text-wrap:balance}
.case-studies-v3 .case-intro p{margin:0;max-width:540px;color:#aaa3af;font-size:17px;line-height:1.7}
.case-studies-v3 .case-progress{position:sticky;z-index:20;top:102px;display:flex;align-items:center;gap:13px;width:max-content;margin:0 0 18px auto;padding:9px 12px;border:1px solid rgba(255,255,255,.11);border-radius:999px;background:rgba(10,9,13,.76);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:inset 0 1px rgba(255,255,255,.08);font:800 10px/1 'DM Sans',sans-serif;letter-spacing:.14em;color:#cfc9d2}
.case-studies-v3 .case-progress i{display:block;width:46px;height:2px;overflow:hidden;border-radius:9px;background:rgba(255,255,255,.10)}
.case-studies-v3 .case-progress i:after{content:'';display:block;width:100%;height:100%;background:linear-gradient(90deg,#f40673,#8a5cff);transform:scaleX(var(--case-progress,.333));transform-origin:left;transition:transform .42s cubic-bezier(.22,1,.36,1)}
.case-chapters{display:grid;gap:30px}
.case-chapter{position:relative;display:grid;grid-template-columns:minmax(0,1.58fr) minmax(310px,.72fr);gap:0;min-height:min(78vh,760px);overflow:hidden;border:1px solid rgba(255,255,255,.13);border-radius:42px;background:#0a080d;box-shadow:inset 0 1px rgba(255,255,255,.07),0 44px 110px rgba(0,0,0,.38);opacity:.72;transform:translateY(24px) scale(.985);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1),border-color .4s ease}
.case-chapter.is-active{opacity:1;transform:none;border-color:rgba(255,255,255,.21)}
.case-chapter:nth-child(even){grid-template-columns:minmax(310px,.72fr) minmax(0,1.58fr)}
.case-chapter:nth-child(even) .case-visual{order:2}.case-chapter:nth-child(even) .case-copy{order:1}
.case-visual{position:relative;min-height:100%;overflow:hidden;background:#111}
.case-visual img{width:100%;height:100%;object-fit:cover;transition:transform 1.15s cubic-bezier(.22,1,.36,1),filter .6s ease;filter:saturate(.86) contrast(1.02)}
.case-chapter.is-active .case-visual img{transform:scale(1.018);filter:saturate(1) contrast(1.01)}
.case-visual:after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(5,5,7,.28))}
.case-visual-meta{position:absolute;z-index:2;left:20px;top:20px;display:flex;gap:7px;flex-wrap:wrap}
.case-visual-meta span{padding:8px 10px;border:1px solid rgba(255,255,255,.17);border-radius:999px;background:rgba(7,6,9,.58);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#f7f3f8;font:800 9px/1 'DM Sans',sans-serif;letter-spacing:.11em;text-transform:uppercase}
.case-copy{position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(30px,3.7vw,52px);background:linear-gradient(155deg,rgba(255,255,255,.045),rgba(255,255,255,.012))}
.case-copy-head{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:32px;color:#8f8793;font:800 10px/1 'DM Sans',sans-serif;letter-spacing:.15em;text-transform:uppercase}
.case-copy-head strong{color:#ff91c5;font-size:11px}.case-copy h3{margin:0 0 24px;font-family:'Manrope',sans-serif;font-size:clamp(40px,4.2vw,64px);line-height:.92;letter-spacing:-.055em}
.case-story{display:grid;gap:21px}.case-story-block{padding-top:18px;border-top:1px solid rgba(255,255,255,.09)}
.case-story-block small{display:block;margin-bottom:7px;color:#8e8792;font-size:9px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}
.case-story-block p{margin:0;color:#d2cbd5;font-size:14px;line-height:1.6}.case-story-block.result p{color:#fff;font-size:15px;font-weight:600}
.case-interventions{display:flex;flex-wrap:wrap;gap:7px;margin-top:2px}.case-interventions span{padding:7px 9px;border:1px solid rgba(255,255,255,.11);border-radius:10px;background:rgba(255,255,255,.035);color:#bbb3bf;font-size:10px;font-weight:800}
.case-link{display:inline-flex;align-items:center;justify-content:space-between;gap:18px;width:100%;margin-top:28px;padding:15px 16px;border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(255,255,255,.045);color:#fff;font:800 12px/1 'Manrope',sans-serif;transition:background .22s,transform .22s,border-color .22s}
.case-link:hover{background:rgba(255,255,255,.085);border-color:rgba(255,255,255,.24)}.case-link:active{transform:scale(.985)}.case-link:focus-visible{outline:2px solid #fff;outline-offset:4px}
.case-close{display:grid;grid-template-columns:1fr auto;align-items:end;gap:38px;margin-top:40px;padding:42px;border:1px solid rgba(255,255,255,.13);border-radius:34px;background:linear-gradient(125deg,rgba(244,6,115,.12),rgba(138,92,255,.10) 54%,rgba(255,255,255,.025));box-shadow:inset 0 1px rgba(255,255,255,.08)}
.case-close h3{max-width:820px;margin:10px 0 0;font-family:'Manrope',sans-serif;font-size:clamp(38px,4.7vw,66px);line-height:.95;letter-spacing:-.055em}.case-close p{max-width:680px;margin:18px 0 0;color:#aaa3af;font-size:15px}
.case-close .button{margin:0;white-space:nowrap}

@media(max-width:1080px){
 .case-studies-v3{padding:104px 0 94px}.case-studies-v3 .case-intro{grid-template-columns:1fr;gap:20px;margin-bottom:34px}.case-studies-v3 .case-progress{position:relative;top:auto;margin:0 0 16px auto;backdrop-filter:none;-webkit-backdrop-filter:none;background:#0d0b10}.case-chapter,.case-chapter:nth-child(even){grid-template-columns:1fr;min-height:0;border-radius:34px;opacity:1;transform:none}.case-chapter:nth-child(even) .case-visual,.case-chapter:nth-child(even) .case-copy{order:initial}.case-visual{min-height:420px}.case-copy{padding:34px}.case-close{grid-template-columns:1fr;align-items:start}.case-close .button{width:max-content}
}
@media(max-width:680px){
 .case-studies-v3{padding:84px 0 76px;overflow:hidden}.case-studies-v3 .container{width:min(calc(100% - 22px),var(--max))}.case-studies-v3 .case-intro h2{font-size:clamp(43px,13vw,59px);line-height:.94}.case-studies-v3 .case-intro p{font-size:15.5px}.case-progress{display:none!important}.case-chapters{gap:18px}.case-chapter,.case-chapter:nth-child(even){display:block;width:100%;border-radius:28px;box-shadow:0 20px 56px rgba(0,0,0,.28);opacity:1!important;transform:none!important;transition:none!important}.case-visual{min-height:0;aspect-ratio:1.12/1}.case-visual img,.case-chapter.is-active .case-visual img{transform:none!important;transition:none!important;filter:none!important}.case-visual-meta{left:13px;top:13px}.case-visual-meta span{backdrop-filter:none;-webkit-backdrop-filter:none;background:rgba(7,6,9,.82)}.case-copy{padding:24px 20px 21px}.case-copy-head{margin-bottom:24px}.case-copy h3{font-size:42px;margin-bottom:20px}.case-story{gap:16px}.case-story-block{padding-top:14px}.case-story-block p{font-size:13.5px}.case-interventions{gap:6px}.case-link{margin-top:22px}.case-close{margin-top:20px;padding:28px 22px;border-radius:27px}.case-close h3{font-size:40px}.case-close .button{width:100%}
}
@media(prefers-reduced-motion:reduce){.case-chapter{opacity:1!important;transform:none!important;transition:none!important}.case-visual img{transform:none!important;transition:none!important}.case-progress i:after{transition:none!important}.case-link{transition:none!important}}
`;

const js = String.raw`(() => {
 'use strict';
 const root = document.querySelector('.case-studies-v3');
 if (!root) return;
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const chapters = Array.from(root.querySelectorAll('.case-chapter'));
 const current = root.querySelector('[data-case-current]');
 if (!chapters.length) return;
 if (reduced || !('IntersectionObserver' in window)) {
   chapters.forEach(c => c.classList.add('is-active'));
   return;
 }
 const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
     if (!entry.isIntersecting) return;
     const chapter = entry.target;
     chapters.forEach(c => c.classList.toggle('is-active', c === chapter));
     const index = chapters.indexOf(chapter);
     root.style.setProperty('--case-progress', String((index + 1) / chapters.length));
     if (current) current.textContent = String(index + 1).padStart(2, '0');
   });
 }, { threshold: .46, rootMargin: '-8% 0px -20%' });
 chapters.forEach(c => observer.observe(c));
 chapters[0].classList.add('is-active');
})();`;

const section = String.raw`<section class="case-studies-v3" aria-labelledby="case-studies-title">
 <div class="container">
  <div class="case-intro">
   <div><span class="eyebrow">Selected work · prove, non promesse</span><h2 id="case-studies-title">Tre problemi reali.<br><span class="gradient">Tre sistemi costruiti attorno.</span></h2></div>
   <p>Un buon progetto non nasce da un template o da un servizio da vendere. Parte da ciò che non funziona e costruisce intorno una risposta precisa: strategia, design e tecnologia nella dose necessaria.</p>
  </div>
  <div class="case-progress" aria-hidden="true"><span><b data-case-current>01</b> / 03</span><i></i></div>
  <div class="case-chapters">
   <article class="case-chapter" id="case-casarossa">
    <div class="case-visual"><img src="/assets/media/casarossa.jpg" width="1400" height="1000" loading="lazy" decoding="async" alt="E-commerce Casa Rossa realizzato da Axante"><div class="case-visual-meta"><span>E-commerce</span><span>Multilingua</span><span>Development</span></div></div>
    <div class="case-copy"><div><div class="case-copy-head"><span>Case study</span><strong>01</strong></div><h3>Casa Rossa</h3><div class="case-story"><div class="case-story-block"><small>La sfida</small><p>Portare un’eccellenza siciliana online senza ridurla a un catalogo: prodotto, territorio e acquisto dovevano parlare la stessa lingua.</p></div><div class="case-story-block"><small>L’intervento Axante</small><div class="case-interventions"><span>UX & struttura</span><span>E-commerce</span><span>Multilingua</span><span>Development</span></div></div><div class="case-story-block result"><small>Il risultato</small><p>Un’esperienza internazionale che racconta il prodotto mentre accompagna con chiarezza verso l’acquisto.</p></div></div></div><a class="case-link" href="/portfolio#casarossa"><span>Vedi il progetto</span><span>↗</span></a></div>
   </article>
   <article class="case-chapter" id="case-unicart">
    <div class="case-visual"><img src="/assets/media/unicart.jpg" width="1400" height="1000" loading="lazy" decoding="async" alt="Piattaforma Unicart Auctions realizzata da Axante"><div class="case-visual-meta"><span>Marketplace</span><span>Aste online</span><span>UX/UI</span></div></div>
    <div class="case-copy"><div><div class="case-copy-head"><span>Case study</span><strong>02</strong></div><h3>Unicart Auctions</h3><div class="case-story"><div class="case-story-block"><small>La sfida</small><p>Una piattaforma d’aste contiene regole, stati e azioni complesse. Il rischio era far percepire all’utente tutta quella complessità.</p></div><div class="case-story-block"><small>L’intervento Axante</small><div class="case-interventions"><span>Information architecture</span><span>UX/UI</span><span>Marketplace</span><span>Interaction design</span></div></div><div class="case-story-block result"><small>Il risultato</small><p>Una piattaforma complessa resa più semplice da capire e usare, con le azioni importanti sempre leggibili.</p></div></div></div><a class="case-link" href="/portfolio#unicart"><span>Scopri il case</span><span>↗</span></a></div>
   </article>
   <article class="case-chapter" id="case-carabetta">
    <div class="case-visual"><img src="/assets/media/carabetta.jpg" width="1400" height="1000" loading="lazy" decoding="async" alt="Esperienza digitale Carabetta realizzata da Axante"><div class="case-visual-meta"><span>Fashion</span><span>E-commerce</span><span>Brand experience</span></div></div>
    <div class="case-copy"><div><div class="case-copy-head"><span>Case study</span><strong>03</strong></div><h3>Carabetta</h3><div class="case-story"><div class="case-story-block"><small>La sfida</small><p>Tradurre un’identità fashion in digitale senza perdere eleganza, ma senza lasciare che l’estetica rallentasse il percorso verso il prodotto.</p></div><div class="case-story-block"><small>L’intervento Axante</small><div class="case-interventions"><span>Art direction</span><span>UX/UI</span><span>E-commerce</span><span>Brand experience</span></div></div><div class="case-story-block result"><small>Il risultato</small><p>Un’esperienza editoriale coerente con la collezione che mantiene prodotto, navigazione e conversione nello stesso racconto.</p></div></div></div><a class="case-link" href="/portfolio#carabetta"><span>Vedi il progetto</span><span>↗</span></a></div>
   </article>
  </div>
  <div class="case-close"><div><span class="eyebrow">Il tuo progetto non è un menu</span><h3>Non ti serve scegliere un servizio. <span class="gradient">Partiamo dal problema.</span></h3><p>Raccontaci dove vuoi arrivare e cosa oggi ti sta fermando. Il primo confronto serve a capire cosa costruire davvero, non a venderti un pacchetto.</p></div><a class="button button-primary" href="/contatti#audit">Raccontaci il problema <span>↗</span></a></div>
 </div>
</section>`;

let html = fs.readFileSync(homePath, 'utf8');
const oldSection = /<section class="project-reel" data-horizontal>[\s\S]*?<\/section>/;
if (!oldSection.test(html)) throw new Error('Legacy Selected Work section was not found.');
html = html.replace(oldSection, section);
if (!html.includes('/case-studies-v3.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/case-studies-v3.css?v=1.0"></head>');
if (!html.includes('/case-studies-v3.js')) html = html.replace('</body>', '<script src="/case-studies-v3.js?v=1.0" defer></script></body>');
fs.writeFileSync(homePath, html);
fs.writeFileSync(path.join(site, 'case-studies-v3.css'), css);
fs.writeFileSync(path.join(site, 'case-studies-v3.js'), js);
console.log('Rebuilt Selected Work as three narrative case-study chapters.');
