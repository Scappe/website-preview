import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const homePath = path.join(site, 'index.html');
if (!fs.existsSync(homePath)) throw new Error('site/index.html missing before live proof enhancement.');

const hero = String.raw`<section class="lp-hero" aria-labelledby="lp-title">
  <div class="container lp-grid">
    <div class="lp-copy">
      <span class="eyebrow">Strategia · Design · Tecnologia · Roma</span>
      <h1 id="lp-title" class="lp-title">
        <span>UN SOLO PARTNER.</span>
        <span>DALLA STRATEGIA</span>
        <span>AL <em>RISULTATO.</em></span>
      </h1>
      <p class="lp-lead">Non vendiamo servizi in scatola. Partiamo dal problema e costruiamo il sistema che serve: <strong>identità, contenuti, prodotto digitale, sviluppo e crescita</strong>, coordinati dallo stesso team.</p>
      <div class="lp-actions">
        <a class="button button-primary" href="/contatti#audit">Parliamo del tuo progetto <span>↗</span></a>
        <a class="button button-secondary" href="/portfolio">Guarda i casi reali <span>→</span></a>
      </div>
      <div class="lp-proofline" aria-label="Come lavoriamo">
        <span>01 · Capire il problema</span><span>02 · Disegnare il sistema</span><span>03 · Costruire e misurare</span>
      </div>
    </div>

    <section class="lp-workspace" aria-label="Progetti reali Axante">
      <div class="lp-workspace-top">
        <div><span class="lp-live-dot" aria-hidden="true"></span><strong>LIVE PROOF</strong><small>Progetti reali, non mockup</small></div>
        <span class="lp-state-count" data-lp-count>01 / 03</span>
      </div>

      <div class="lp-media" aria-live="off">
        <img class="lp-image is-active" data-lp-image="casarossa" src="/assets/media/casarossa.jpg" width="1200" height="900" fetchpriority="high" decoding="async" alt="Casa Rossa, e-commerce realizzato da Axante">
        <img class="lp-image" data-lp-image="unicart" src="/assets/media/unicart.jpg" width="1200" height="900" loading="eager" decoding="async" alt="Unicart Auctions, piattaforma digitale realizzata da Axante">
        <img class="lp-image" data-lp-image="carabetta" src="/assets/media/carabetta.jpg" width="1200" height="900" loading="eager" decoding="async" alt="Carabetta, esperienza fashion e commerce realizzata da Axante">
        <div class="lp-media-shade" aria-hidden="true"></div>
        <div class="lp-project-mark"><span data-lp-kind>E-commerce internazionale</span><strong data-lp-project>Casa Rossa</strong></div>
      </div>

      <div class="lp-info" id="lp-panel" role="tabpanel" tabindex="0" aria-labelledby="lp-tab-casarossa">
        <div class="lp-problem"><small>IL PROBLEMA</small><p data-lp-problem>Trasformare prodotto e territorio in un’esperienza digitale capace di raccontare e vendere.</p></div>
        <div class="lp-outcome"><small>IL SISTEMA</small><p data-lp-outcome>E-commerce, racconto editoriale, multilingua e sviluppo coordinati in un’unica esperienza.</p></div>
        <div class="lp-disciplines" data-lp-disciplines><span>Strategy</span><span>UX/UI</span><span>E-commerce</span><span>Development</span></div>
        <a class="lp-project-link" data-lp-link href="/portfolio#casarossa">Vedi il caso <span>↗</span></a>
      </div>

      <div class="lp-tabs" role="tablist" aria-label="Seleziona un progetto">
        <button id="lp-tab-casarossa" class="lp-tab is-active" type="button" role="tab" aria-selected="true" aria-controls="lp-panel" tabindex="0" data-lp-key="casarossa"><span>01</span><strong>Casa Rossa</strong></button>
        <button id="lp-tab-unicart" class="lp-tab" type="button" role="tab" aria-selected="false" aria-controls="lp-panel" tabindex="-1" data-lp-key="unicart"><span>02</span><strong>Unicart</strong></button>
        <button id="lp-tab-carabetta" class="lp-tab" type="button" role="tab" aria-selected="false" aria-controls="lp-panel" tabindex="-1" data-lp-key="carabetta"><span>03</span><strong>Carabetta</strong></button>
      </div>
    </section>
  </div>
  <div class="lp-bridge" aria-hidden="true"><span>Un problema non ha bisogno di un catalogo di servizi.</span><i></i><span>Ha bisogno delle competenze giuste, insieme.</span></div>
</section>`;

const css = String.raw`/* Axante Live Proof Hero v4 */
.lp-hero{position:relative;min-height:100svh;padding:124px 0 34px;overflow:clip;background:radial-gradient(circle at 77% 24%,rgba(244,6,115,.12),transparent 28rem),radial-gradient(circle at 92% 66%,rgba(138,92,255,.11),transparent 30rem)}
.lp-grid{display:grid;grid-template-columns:minmax(0,.88fr) minmax(540px,1.12fr);gap:52px;align-items:center}
.lp-copy{position:relative;z-index:2;padding:30px 0}
.lp-title{margin:22px 0 28px;font-family:'Manrope',sans-serif;font-size:clamp(64px,7.1vw,110px);font-weight:800;line-height:.84;letter-spacing:-.078em;text-wrap:balance}
.lp-title span{display:block}.lp-title em{font-style:normal;background:linear-gradient(100deg,#fff 5%,#ff72b5 48%,#a77cff);-webkit-background-clip:text;background-clip:text;color:transparent}
.lp-lead{max-width:670px;margin:0;color:#bbb4bf;font-size:clamp(17px,1.35vw,21px);line-height:1.62}.lp-lead strong{color:#fff;font-weight:600}
.lp-actions{display:flex;flex-wrap:wrap;gap:11px;margin-top:30px}.lp-actions .button{border-radius:17px;min-height:54px}
.lp-proofline{display:flex;flex-wrap:wrap;gap:7px;margin-top:25px}.lp-proofline span{padding:7px 10px;border:1px solid rgba(255,255,255,.09);border-radius:999px;color:#8f8893;background:rgba(255,255,255,.02);font-size:10px;font-weight:800;letter-spacing:.07em;text-transform:uppercase}
.lp-workspace{position:relative;min-width:0;border:1px solid rgba(255,255,255,.14);border-radius:38px;padding:14px;background:linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.018));box-shadow:inset 0 1px rgba(255,255,255,.09),0 44px 120px rgba(0,0,0,.4)}
.lp-workspace-top{display:flex;justify-content:space-between;align-items:center;min-height:50px;padding:2px 8px 10px}.lp-workspace-top>div{display:grid;grid-template-columns:auto auto;column-gap:8px;align-items:center}.lp-workspace-top strong{font-size:10px;letter-spacing:.15em}.lp-workspace-top small{grid-column:2;color:#77717c;font-size:10px}.lp-live-dot{grid-row:1/3;width:8px;height:8px;border-radius:50%;background:#6ff2c4;box-shadow:0 0 0 6px rgba(111,242,196,.08),0 0 18px rgba(111,242,196,.35)}.lp-state-count{font:800 10px/1 'Manrope';color:#8c8590;letter-spacing:.12em}
.lp-media{position:relative;overflow:hidden;aspect-ratio:1.43;border:1px solid rgba(255,255,255,.11);border-radius:27px;background:#0b090d;isolation:isolate}
.lp-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.025);transition:opacity .36s cubic-bezier(.22,1,.36,1),transform .62s cubic-bezier(.22,1,.36,1)}.lp-image.is-active{opacity:1;transform:scale(1)}
.lp-media-shade{position:absolute;z-index:2;inset:0;background:linear-gradient(180deg,transparent 38%,rgba(5,5,7,.86) 100%);pointer-events:none}.lp-project-mark{position:absolute;z-index:3;left:20px;bottom:18px;display:flex;flex-direction:column;gap:2px}.lp-project-mark span{color:#d2cad4;font-size:10px;font-weight:800;letter-spacing:.11em;text-transform:uppercase}.lp-project-mark strong{font-family:'Manrope';font-size:clamp(28px,3vw,44px);line-height:1;letter-spacing:-.045em}
.lp-info{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:13px 3px 2px;outline:none}.lp-info>div{min-width:0;padding:11px 12px;border-left:1px solid rgba(255,255,255,.09)}.lp-info small{display:block;margin-bottom:5px;color:#817a86;font-size:9px;font-weight:900;letter-spacing:.14em}.lp-info p{margin:0;color:#c2bbc5;font-size:12px;line-height:1.46}.lp-info.is-switching>div,.lp-info.is-switching>.lp-project-link{animation:lp-info-in .34s cubic-bezier(.22,1,.36,1) both}@keyframes lp-info-in{from{opacity:.25;transform:translateY(7px)}to{opacity:1;transform:none}}
.lp-disciplines{grid-column:1/3!important;display:flex;gap:6px;flex-wrap:wrap!important;border-left:0!important;padding:4px 4px 0!important}.lp-disciplines span{padding:6px 8px;border:1px solid rgba(255,255,255,.1);border-radius:999px;color:#aaa3ad;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.07em}.lp-project-link{grid-column:1/3;justify-self:end;padding:4px 6px 1px;color:#fff;font-size:11px;font-weight:800}.lp-project-link span{color:#ff6ab6}
.lp-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px}.lp-tab{appearance:none;display:flex;align-items:center;gap:8px;min-width:0;min-height:48px;padding:8px 11px;border:1px solid rgba(255,255,255,.09);border-radius:14px;background:rgba(255,255,255,.025);color:#8e8792;cursor:pointer;text-align:left;transition:background .22s,border-color .22s,color .22s,transform .14s}.lp-tab span{font-size:9px;font-weight:900}.lp-tab strong{overflow:hidden;text-overflow:ellipsis;font-size:11px;white-space:nowrap}.lp-tab:hover{background:rgba(255,255,255,.055);color:#d7d1d9}.lp-tab:active{transform:scale(.975)}.lp-tab.is-active{border-color:rgba(255,106,182,.42);background:linear-gradient(135deg,rgba(244,6,115,.15),rgba(138,92,255,.09));color:#fff}.lp-tab:focus-visible{outline:2px solid #fff;outline-offset:3px}
.lp-bridge{display:flex;align-items:center;justify-content:center;gap:17px;width:min(calc(100% - 48px),1320px);margin:30px auto 0;padding-top:18px;border-top:1px solid rgba(255,255,255,.08);color:#77717d;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.lp-bridge i{width:38px;height:1px;background:linear-gradient(90deg,#f40673,#8a5cff)}
@media(max-width:1180px){.lp-grid{grid-template-columns:1fr;gap:20px}.lp-hero{padding-top:110px}.lp-copy{padding-bottom:4px}.lp-title{font-size:clamp(62px,10vw,92px);max-width:900px}.lp-lead{max-width:760px}.lp-workspace{max-width:900px;width:100%;margin-inline:auto}.lp-media{aspect-ratio:1.7}}
@media(max-width:680px){.lp-hero{min-height:auto;padding:94px 0 28px;background:radial-gradient(circle at 75% 22%,rgba(244,6,115,.09),transparent 20rem)}.lp-grid{width:calc(100% - 24px)!important;gap:24px}.lp-copy{padding:20px 0 0}.lp-title{margin:17px 0 20px;font-size:clamp(49px,15.3vw,68px);line-height:.88;letter-spacing:-.068em}.lp-lead{font-size:16px;line-height:1.56}.lp-actions{display:grid;gap:9px;margin-top:24px}.lp-actions .button{width:100%;min-height:52px}.lp-proofline{display:grid;grid-template-columns:1fr;margin-top:17px}.lp-proofline span:nth-child(n+3){display:none}.lp-workspace{padding:9px;border-radius:25px;background:rgba(255,255,255,.025);box-shadow:0 24px 65px rgba(0,0,0,.3);backdrop-filter:none!important;-webkit-backdrop-filter:none!important}.lp-workspace-top{padding:3px 5px 8px}.lp-media{aspect-ratio:1.18;border-radius:19px}.lp-image{transition:opacity .24s ease,transform .34s cubic-bezier(.22,1,.36,1)}.lp-project-mark{left:14px;bottom:13px}.lp-project-mark strong{font-size:30px}.lp-info{grid-template-columns:1fr;gap:5px;padding-top:8px}.lp-info>div{padding:8px 9px}.lp-outcome{border-top:1px solid rgba(255,255,255,.07)}.lp-disciplines,.lp-project-link{grid-column:1!important}.lp-info p{font-size:12.5px}.lp-disciplines{padding-left:8px!important}.lp-tabs{gap:5px;margin-top:8px}.lp-tab{justify-content:center;min-height:46px;padding:7px 5px;border-radius:12px}.lp-tab span{display:none}.lp-tab strong{font-size:10px}.lp-bridge{width:calc(100% - 24px);gap:9px;margin-top:24px;font-size:8px;line-height:1.35;text-align:center}.lp-bridge i{flex:0 0 22px}.ambient-canvas{display:none!important}}
@media(prefers-reduced-motion:reduce){.lp-image,.lp-tab{transition:none!important}.lp-info.is-switching>div,.lp-info.is-switching>.lp-project-link{animation:none!important}}
`;

const js = String.raw`(() => {
  'use strict';
  const root = document.querySelector('.lp-workspace');
  if (!root) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const data = {
    casarossa:{project:'Casa Rossa',kind:'E-commerce internazionale',problem:'Trasformare prodotto e territorio in un’esperienza digitale capace di raccontare e vendere.',outcome:'E-commerce, racconto editoriale, multilingua e sviluppo coordinati in un’unica esperienza.',disciplines:['Strategy','UX/UI','E-commerce','Development'],href:'/portfolio#casarossa',count:'01 / 03'},
    unicart:{project:'Unicart Auctions',kind:'Piattaforma digitale',problem:'Rendere comprensibile e utilizzabile una piattaforma d’aste con molte regole e interazioni complesse.',outcome:'Architettura, UX/UI e sviluppo trasformano la complessità operativa in un flusso chiaro per l’utente.',disciplines:['Product strategy','UX/UI','Marketplace','Development'],href:'/portfolio#unicart',count:'02 / 03'},
    carabetta:{project:'Carabetta',kind:'Fashion · Brand commerce',problem:'Portare identità e collezione dentro un’esperienza digitale coerente con il linguaggio del brand.',outcome:'Direzione visiva, esperienza editoriale ed e-commerce lavorano insieme dal racconto all’acquisto.',disciplines:['Art direction','Brand experience','E-commerce','UX/UI'],href:'/portfolio#carabetta',count:'03 / 03'}
  };
  const tabs=[...root.querySelectorAll('[role="tab"]')];
  const images=[...root.querySelectorAll('[data-lp-image]')];
  const panel=root.querySelector('#lp-panel');
  const project=root.querySelector('[data-lp-project]');
  const kind=root.querySelector('[data-lp-kind]');
  const problem=root.querySelector('[data-lp-problem]');
  const outcome=root.querySelector('[data-lp-outcome]');
  const disciplines=root.querySelector('[data-lp-disciplines]');
  const link=root.querySelector('[data-lp-link]');
  const count=root.querySelector('[data-lp-count]');
  let active='casarossa';

  function activate(key, focus=false){
    if(!data[key] || key===active && !focus) return;
    active=key; const item=data[key];
    tabs.forEach(tab=>{const selected=tab.dataset.lpKey===key;tab.classList.toggle('is-active',selected);tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected) panel.setAttribute('aria-labelledby',tab.id);});
    images.forEach(img=>img.classList.toggle('is-active',img.dataset.lpImage===key));
    project.textContent=item.project;kind.textContent=item.kind;problem.textContent=item.problem;outcome.textContent=item.outcome;count.textContent=item.count;link.href=item.href;
    disciplines.replaceChildren(...item.disciplines.map(label=>{const span=document.createElement('span');span.textContent=label;return span;}));
    if(!reduce){panel.classList.remove('is-switching');void panel.offsetWidth;panel.classList.add('is-switching');}
    if(focus) tabs.find(tab=>tab.dataset.lpKey===key)?.focus();
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(tab.dataset.lpKey));
    tab.addEventListener('keydown',event=>{
      let next=null;
      if(event.key==='ArrowRight'||event.key==='ArrowDown') next=(index+1)%tabs.length;
      if(event.key==='ArrowLeft'||event.key==='ArrowUp') next=(index-1+tabs.length)%tabs.length;
      if(event.key==='Home') next=0;if(event.key==='End') next=tabs.length-1;
      if(next!==null){event.preventDefault();activate(tabs[next].dataset.lpKey,true);}
    });
  });
})();`;

let html = fs.readFileSync(homePath, 'utf8');
const heroPattern = /<section class="hero">[\s\S]*?<\/section>\s*(?=<div class="marquee")/;
if (!heroPattern.test(html)) throw new Error('Unable to find legacy homepage hero.');
html = html.replace(heroPattern, hero + '\n');
if (!html.includes('/live-proof-v4.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/live-proof-v4.css?v=4.0"></head>');
if (!html.includes('/live-proof-v4.js')) html = html.replace('</body>', '<script src="/live-proof-v4.js?v=4.0" defer></script></body>');
fs.writeFileSync(homePath, html);
fs.writeFileSync(path.join(site, 'live-proof-v4.css'), css);
fs.writeFileSync(path.join(site, 'live-proof-v4.js'), js);
console.log('Applied Axante Live Proof Hero v4.');
