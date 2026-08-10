import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const homePath = path.join(site, 'index.html');
if (!fs.existsSync(homePath)) throw new Error('site/index.html missing before trust proof enhancement.');

const section = String.raw`<section class="tp-section" aria-labelledby="tp-title">
  <div class="container tp-shell">
    <header class="tp-head">
      <div>
        <span class="eyebrow">Fiducia, prima del contratto</span>
        <h2 id="tp-title">Prima di affidarci il tuo progetto,<br><span>guarda come lavoriamo quando qualcuno ce lo affida davvero.</span></h2>
      </div>
      <p>Clienti reali, parole reali e impegni concreti. Non una collezione di badge: il modo in cui riduciamo il rischio di scegliere il partner sbagliato.</p>
    </header>

    <div class="tp-clients" aria-label="Alcuni clienti Axante">
      <span>HANNO LAVORATO CON NOI</span>
      <div class="tp-client-rail">
        <b>Carabetta</b><b>Unicart Auctions</b><b>Tracciati d’Arte</b><b>Medicum</b><b>Expert City</b>
      </div>
    </div>

    <div class="tp-grid">
      <article class="tp-stage" aria-label="Testimonianze clienti">
        <div class="tp-stage-top"><span>CLIENT VOICE</span><span data-tp-count>01 / 03</span></div>
        <div class="tp-quote-wrap" id="tp-panel" role="tabpanel" aria-labelledby="tp-tab-tracciati" tabindex="0">
          <div class="tp-mark" aria-hidden="true">“</div>
          <blockquote data-tp-quote>Progetto seguito da Daniele, un ottimo risultato nei tempi previsti. Assistenza anche successiva e risposte rapide anche in orari non comodi. Grazie, continuate così!</blockquote>
          <div class="tp-person"><strong data-tp-name>Tracciati d’Arte</strong><span data-tp-role>Rivista d’Arte e Cultura</span></div>
        </div>
        <div class="tp-tabs" role="tablist" aria-label="Scegli una testimonianza">
          <button id="tp-tab-tracciati" class="tp-tab is-active" type="button" role="tab" aria-selected="true" aria-controls="tp-panel" tabindex="0" data-tp-key="tracciati"><span>01</span><strong>Tracciati d’Arte</strong></button>
          <button id="tp-tab-francesco" class="tp-tab" type="button" role="tab" aria-selected="false" aria-controls="tp-panel" tabindex="-1" data-tp-key="francesco"><span>02</span><strong>Francesco S.</strong></button>
          <button id="tp-tab-barbara" class="tp-tab" type="button" role="tab" aria-selected="false" aria-controls="tp-panel" tabindex="-1" data-tp-key="barbara"><span>03</span><strong>Barbara G.</strong></button>
        </div>
      </article>

      <aside class="tp-operating" aria-label="Come lavoriamo davvero">
        <div class="tp-operating-head"><span>COME LAVORIAMO DAVVERO</span><b>04 impegni</b></div>
        <div class="tp-proof-list">
          <div class="tp-proof"><strong>1 anno</strong><p>Garanzia minima sui siti: la consegna non coincide con la sparizione del team.</p></div>
          <div class="tp-proof"><strong>7/7</strong><p>Assistenza per le urgenze, con contatto diretto quando serve davvero.</p></div>
          <div class="tp-proof"><strong>Per fasi</strong><p>Pagamento ad avanzamento: il progetto cresce insieme alla fiducia.</p></div>
          <div class="tp-proof"><strong>1 team</strong><p>Strategia, design e tecnologia coordinate senza rimbalzi tra fornitori.</p></div>
        </div>
        <div class="tp-human">
          <div class="tp-human-copy"><small>LE PERSONE DIETRO IL PROGETTO</small><p><strong>Daniele</strong> · Project Manager<br><strong>Elias</strong> · Web Designer</p></div>
          <div class="tp-human-badge" aria-hidden="true"><i>D</i><i>E</i></div>
        </div>
      </aside>
    </div>

    <footer class="tp-close">
      <p><strong>Il punto non è convincerti che siamo perfetti.</strong> È farti capire come affrontiamo il lavoro prima che tu decida di affidarci il tuo.</p>
      <div><a class="button button-primary" href="/contatti#audit">Richiedi l’audit gratuito <span>↗</span></a><a class="tp-secondary" href="/portfolio">Guarda i casi reali <span>→</span></a></div>
    </footer>
  </div>
</section>`;

const css = String.raw`<style id="tp-styles">
.tp-section{position:relative;padding:118px 0 112px;background:linear-gradient(180deg,rgba(255,255,255,.012),transparent 30%),#070608;content-visibility:auto;contain-intrinsic-size:1000px}
.tp-shell{position:relative}
.tp-head{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(280px,.65fr);gap:54px;align-items:end;margin-bottom:34px}.tp-head h2{margin:16px 0 0;font:800 clamp(45px,5.5vw,78px)/.96 'Manrope',sans-serif;letter-spacing:-.062em;max-width:1030px}.tp-head h2 span{color:#96909a}.tp-head>p{margin:0 0 5px;color:#aaa3ad;font-size:15px;line-height:1.65;max-width:430px}
.tp-clients{display:grid;grid-template-columns:auto 1fr;gap:25px;align-items:center;padding:18px 0 20px;border-block:1px solid rgba(255,255,255,.09)}.tp-clients>span{color:#77717c;font-size:9px;font-weight:900;letter-spacing:.15em;white-space:nowrap}.tp-client-rail{display:flex;align-items:center;justify-content:space-between;gap:20px;min-width:0;overflow:auto;scrollbar-width:none}.tp-client-rail::-webkit-scrollbar{display:none}.tp-client-rail b{flex:0 0 auto;color:#d9d4da;font:700 clamp(14px,1.45vw,19px)/1 'Manrope';letter-spacing:-.025em;white-space:nowrap}.tp-client-rail b:not(:last-child):after{content:'·';margin-left:25px;color:#4d4850}
.tp-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(330px,.75fr);gap:14px;margin-top:14px}.tp-stage,.tp-operating{border:1px solid rgba(255,255,255,.105);border-radius:34px;background:#0c0a0e;box-shadow:inset 0 1px rgba(255,255,255,.055)}
.tp-stage{display:flex;flex-direction:column;min-height:540px;padding:28px 30px 22px;background:radial-gradient(circle at 16% 20%,rgba(244,6,115,.075),transparent 26rem),#0c0a0e}.tp-stage-top,.tp-operating-head{display:flex;align-items:center;justify-content:space-between;color:#77717c;font-size:9px;font-weight:900;letter-spacing:.14em}.tp-stage-top span:last-child{color:#a59eaa}.tp-quote-wrap{position:relative;display:flex;flex:1;flex-direction:column;justify-content:center;min-height:310px;padding:44px 36px 34px;outline:none}.tp-mark{position:absolute;top:18px;left:0;color:#f40673;font:700 76px/.8 Georgia,serif;opacity:.8}.tp-quote-wrap blockquote{max-width:840px;margin:0;color:#f4f1f5;font:600 clamp(26px,3vw,44px)/1.2 'Manrope',sans-serif;letter-spacing:-.043em}.tp-person{display:flex;flex-direction:column;gap:3px;margin-top:28px}.tp-person strong{font-size:14px}.tp-person span{color:#85808a;font-size:11px}.tp-quote-wrap.is-switching blockquote,.tp-quote-wrap.is-switching .tp-person{animation:tp-in .32s cubic-bezier(.22,1,.36,1) both}@keyframes tp-in{from{opacity:.25;transform:translateY(7px)}to{opacity:1;transform:none}}
.tp-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.tp-tab{appearance:none;display:flex;align-items:center;gap:10px;min-height:50px;padding:9px 12px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:#100e12;color:#827c86;text-align:left;cursor:pointer;transition:background .2s,border-color .2s,color .2s,transform .14s}.tp-tab span{font-size:9px;font-weight:900}.tp-tab strong{overflow:hidden;text-overflow:ellipsis;font-size:11px;white-space:nowrap}.tp-tab:hover{background:#151218;color:#d9d4db}.tp-tab:active{transform:scale(.975)}.tp-tab.is-active{border-color:rgba(244,6,115,.42);background:linear-gradient(135deg,rgba(244,6,115,.13),rgba(138,92,255,.07));color:#fff}.tp-tab:focus-visible,.tp-quote-wrap:focus-visible{outline:2px solid #fff;outline-offset:3px}
.tp-operating{padding:27px 25px 22px}.tp-operating-head b{color:#a29ca6;font-size:9px}.tp-proof-list{display:grid;margin-top:20px}.tp-proof{display:grid;grid-template-columns:88px 1fr;gap:15px;padding:19px 0;border-top:1px solid rgba(255,255,255,.075)}.tp-proof strong{font:800 18px/1.15 'Manrope';letter-spacing:-.035em;color:#fff}.tp-proof p{margin:0;color:#aaa4ae;font-size:12px;line-height:1.55}.tp-human{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:15px;padding:16px;border:1px solid rgba(255,255,255,.08);border-radius:19px;background:rgba(255,255,255,.025)}.tp-human small{display:block;margin-bottom:8px;color:#77717c;font-size:8px;font-weight:900;letter-spacing:.12em}.tp-human p{margin:0;color:#a9a3ad;font-size:11px;line-height:1.65}.tp-human p strong{color:#fff}.tp-human-badge{display:flex}.tp-human-badge i{display:grid;place-items:center;width:38px;height:38px;border:2px solid #0c0a0e;border-radius:50%;background:linear-gradient(135deg,#26151f,#351b35);font:800 11px/1 'Manrope';font-style:normal}.tp-human-badge i+i{margin-left:-10px;background:linear-gradient(135deg,#201b32,#2b2249)}
.tp-close{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:30px;align-items:center;margin-top:14px;padding:24px 26px;border:1px solid rgba(255,255,255,.095);border-radius:24px;background:#0b090d}.tp-close p{max-width:750px;margin:0;color:#99939d;font-size:13px;line-height:1.58}.tp-close p strong{color:#e8e4e9}.tp-close>div{display:flex;align-items:center;gap:15px}.tp-close .button{min-height:50px;border-radius:16px}.tp-secondary{color:#d7d2d9;font-size:11px;font-weight:800;white-space:nowrap}.tp-secondary span{color:#ff6ab6}
.tp-section:not(.is-seen) .tp-stage,.tp-section:not(.is-seen) .tp-operating,.tp-section:not(.is-seen) .tp-close{opacity:0;transform:translateY(16px)}.tp-stage,.tp-operating,.tp-close{transition:opacity .5s cubic-bezier(.22,1,.36,1),transform .5s cubic-bezier(.22,1,.36,1)}.tp-operating{transition-delay:.06s}.tp-close{transition-delay:.11s}
@media(max-width:1024px){.tp-section{padding:94px 0}.tp-head{grid-template-columns:1fr;gap:18px}.tp-head>p{max-width:660px}.tp-grid{grid-template-columns:1fr}.tp-stage{min-height:500px}.tp-operating{display:grid;grid-template-columns:1fr 1fr;gap:0 24px}.tp-operating-head,.tp-human{grid-column:1/-1}.tp-proof-list{grid-column:1/-1;grid-template-columns:1fr 1fr;gap:0 24px}.tp-proof{grid-template-columns:78px 1fr}.tp-close{grid-template-columns:1fr}.tp-close>div{justify-content:flex-start}}
@media(max-width:680px){.tp-section{padding:78px 0 74px;content-visibility:visible}.tp-shell{width:calc(100% - 24px)!important}.tp-head{margin-bottom:23px}.tp-head h2{font-size:clamp(38px,11.4vw,52px);line-height:.99;letter-spacing:-.052em}.tp-head h2 br{display:none}.tp-head>p{font-size:14px;line-height:1.58}.tp-clients{grid-template-columns:1fr;gap:11px;padding:15px 0}.tp-client-rail{justify-content:flex-start;padding-right:12px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}.tp-client-rail b{scroll-snap-align:start;font-size:15px}.tp-client-rail b:not(:last-child):after{margin-left:18px}.tp-grid{gap:9px;margin-top:9px}.tp-stage,.tp-operating{border-radius:24px;box-shadow:none}.tp-stage{min-height:auto;padding:19px 14px 14px;background:#0c0a0e}.tp-quote-wrap{min-height:300px;padding:50px 7px 25px}.tp-mark{top:22px;left:5px;font-size:59px}.tp-quote-wrap blockquote{font-size:clamp(24px,7.4vw,32px);line-height:1.2}.tp-person{margin-top:22px}.tp-tabs{gap:5px}.tp-tab{justify-content:center;min-height:48px;padding:7px 5px;border-radius:12px}.tp-tab span{display:none}.tp-tab strong{font-size:10px}.tp-operating{display:block;padding:21px 16px 16px}.tp-proof-list{display:grid;grid-template-columns:1fr}.tp-proof{grid-template-columns:72px 1fr;padding:17px 0}.tp-proof p{font-size:12.5px}.tp-human{margin-top:10px;padding:14px}.tp-close{grid-template-columns:1fr;padding:19px 16px;border-radius:20px}.tp-close p{font-size:13px}.tp-close>div{display:grid;gap:13px}.tp-close .button{width:100%}.tp-secondary{text-align:center;padding:7px}.tp-section:not(.is-seen) .tp-stage,.tp-section:not(.is-seen) .tp-operating,.tp-section:not(.is-seen) .tp-close{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.tp-stage,.tp-operating,.tp-close,.tp-tab{transition:none!important}.tp-section:not(.is-seen) .tp-stage,.tp-section:not(.is-seen) .tp-operating,.tp-section:not(.is-seen) .tp-close{opacity:1;transform:none}.tp-quote-wrap.is-switching blockquote,.tp-quote-wrap.is-switching .tp-person{animation:none!important}}
</style>`;

const js = String.raw`<script id="tp-script">(() => {
  'use strict';
  const root = document.querySelector('.tp-section');
  if (!root) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const data = {
    tracciati:{quote:'Progetto seguito da Daniele, un ottimo risultato nei tempi previsti. Assistenza anche successiva e risposte rapide anche in orari non comodi. Grazie, continuate così!',name:'Tracciati d’Arte',role:'Rivista d’Arte e Cultura',count:'01 / 03'},
    francesco:{quote:'Agenzia fantastica, ogni loro lavoro è studiato bene e organizzato nel migliore dei modi, attualmente gestiscono il mio sito web.',name:'Francesco S.',role:'Architetto',count:'02 / 03'},
    barbara:{quote:'Squadra di professionisti nei social media. Hanno sempre il consiglio giusto al momento giusto.',name:'Barbara G.',role:'Ingegnere',count:'03 / 03'}
  };
  const tabs = [...root.querySelectorAll('.tp-tab')];
  const panel = root.querySelector('#tp-panel');
  const quote = root.querySelector('[data-tp-quote]');
  const name = root.querySelector('[data-tp-name]');
  const role = root.querySelector('[data-tp-role]');
  const count = root.querySelector('[data-tp-count]');
  function activate(key, focus){
    const item = data[key]; if (!item) return;
    tabs.forEach(tab => { const active=tab.dataset.tpKey===key; tab.classList.toggle('is-active',active); tab.setAttribute('aria-selected',String(active)); tab.tabIndex=active?0:-1; });
    if(!reduce){ panel.classList.remove('is-switching'); void panel.offsetWidth; panel.classList.add('is-switching'); }
    quote.textContent=item.quote; name.textContent=item.name; role.textContent=item.role; count.textContent=item.count;
    panel.setAttribute('aria-labelledby','tp-tab-'+key);
    if(focus){ const active=tabs.find(tab=>tab.dataset.tpKey===key); if(active) active.focus(); }
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(tab.dataset.tpKey,false));
    tab.addEventListener('keydown',e=>{ if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return; e.preventDefault(); let next=index; if(e.key==='ArrowRight') next=(index+1)%tabs.length; if(e.key==='ArrowLeft') next=(index-1+tabs.length)%tabs.length; if(e.key==='Home') next=0; if(e.key==='End') next=tabs.length-1; activate(tabs[next].dataset.tpKey,true); });
  });
  if(reduce || !('IntersectionObserver' in window)){ root.classList.add('is-seen'); }
  else { const io=new IntersectionObserver(entries=>{ if(entries.some(e=>e.isIntersecting)){root.classList.add('is-seen');io.disconnect();} },{threshold:.15}); io.observe(root); }
})();</script>`;

let html = fs.readFileSync(homePath, 'utf8');
const marker = '<span class="eyebrow reveal">Prova sociale</span>';
const markerIndex = html.indexOf(marker);
if (markerIndex < 0) throw new Error('Legacy social proof section marker not found.');
const start = html.lastIndexOf('<section class="section">', markerIndex);
const end = html.indexOf('<section class="cta-section">', markerIndex);
if (start < 0 || end < 0 || end <= start) throw new Error('Unable to isolate legacy social proof section.');
html = html.slice(0,start) + section + '\n\n' + html.slice(end);
html = html.replace('</head>', css + '</head>');
html = html.replace('</body>', js + '</body>');
fs.writeFileSync(homePath, html);
console.log('Applied Axante Trust & Proof Engine v5.');
