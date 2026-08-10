import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
if (!fs.existsSync(path.join(site, 'index.html'))) throw new Error('site/index.html is missing before Apple Design V2 enhancement.');

const css = String.raw`
/* Axante Apple Design V2 — visible spatial redesign */
:root{
  --axv2-glass:rgba(17,15,21,.62);
  --axv2-glass-strong:rgba(12,10,15,.80);
  --axv2-edge:rgba(255,255,255,.16);
  --axv2-highlight:rgba(255,255,255,.09);
  --axv2-shadow:0 40px 110px rgba(0,0,0,.44);
  --axv2-spring:cubic-bezier(.22,1,.36,1);
}
html{background:#050507}
body.apple-v2{background:
 radial-gradient(circle at 12% 8%,rgba(244,6,115,.12),transparent 24rem),
 radial-gradient(circle at 90% 10%,rgba(138,92,255,.13),transparent 30rem),
 linear-gradient(180deg,#050507 0%,#08070a 48%,#050507 100%)}
body.apple-v2:after{opacity:.018!important}
body.apple-v2 .ambient-canvas{opacity:.22!important}

/* floating capsule header */
body.apple-v2 .site-header{padding:14px 0!important;background:transparent!important;border:0!important}
body.apple-v2 .site-header .nav-wrap{
  width:min(calc(100% - 40px),1180px)!important;
  min-height:66px;
  padding:9px 10px 9px 18px!important;
  border:1px solid var(--axv2-edge)!important;
  border-radius:24px!important;
  background:rgba(12,10,15,.46)!important;
  backdrop-filter:blur(24px) saturate(165%)!important;
  -webkit-backdrop-filter:blur(24px) saturate(165%)!important;
  box-shadow:inset 0 1px 0 var(--axv2-highlight),0 12px 45px rgba(0,0,0,.14)!important;
  transition:width .42s var(--axv2-spring),background .35s var(--axv2-spring),box-shadow .35s var(--axv2-spring),transform .35s var(--axv2-spring)!important
}
body.apple-v2 .site-header.scrolled .nav-wrap{
  width:min(calc(100% - 56px),1040px)!important;
  background:rgba(10,9,13,.78)!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.11),0 22px 70px rgba(0,0,0,.32)!important
}
body.apple-v2 .brand{width:142px!important}
body.apple-v2 .main-nav{gap:8px!important;padding:5px;border-radius:999px;background:rgba(255,255,255,.035)}
body.apple-v2 .main-nav a{padding:8px 13px!important;border-radius:999px;color:#cfc9d2!important;transition:background .2s,color .2s,transform .2s!important}
body.apple-v2 .main-nav a:after{display:none!important}
body.apple-v2 .main-nav a:hover,body.apple-v2 .main-nav a[aria-current=page]{background:rgba(255,255,255,.085);color:#fff!important}
body.apple-v2 .header-cta{min-height:46px!important;padding:0 19px!important;border-radius:16px!important;background:#fff!important;color:#08070a!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.65),0 10px 30px rgba(0,0,0,.18)!important}

/* hero becomes one spatial composition */
body.apple-v2 .hero{min-height:100svh;padding:126px 0 82px!important;overflow:clip!important}
body.apple-v2 .hero:before{opacity:.46;font-size:clamp(150px,25vw,390px)!important;bottom:-.2em!important}
body.apple-v2 .hero-grid{grid-template-columns:minmax(0,.88fr) minmax(520px,1.12fr)!important;gap:58px!important}
body.apple-v2 .hero-copy-column{position:relative;z-index:5}
body.apple-v2 .eyebrow{letter-spacing:.15em!important}
body.apple-v2 .kinetic-title{font-size:clamp(70px,7.7vw,122px)!important;line-height:.82!important;letter-spacing:-.075em!important;margin:23px 0 28px!important}
body.apple-v2 .hero-copy{max-width:620px!important;font-size:clamp(18px,1.45vw,21px)!important;color:#bdb6c1!important}
body.apple-v2 .hero-actions{margin-top:30px!important}
body.apple-v2 .button{min-height:56px!important;border-radius:18px!important;padding:0 22px!important}
body.apple-v2 .button-primary{background:linear-gradient(125deg,#ff0a78,#df248e 48%,#8a5cff)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 22px 55px rgba(244,6,115,.27)!important}
body.apple-v2 .button-secondary{background:rgba(255,255,255,.055)!important;border-color:rgba(255,255,255,.15)!important;backdrop-filter:blur(18px)!important}
body.apple-v2 .micro-proof{margin-top:25px!important;gap:10px!important}
body.apple-v2 .micro-proof span{padding:8px 11px;border:1px solid rgba(255,255,255,.09);border-radius:999px;background:rgba(255,255,255,.025)}

body.apple-v2 .hero-art{
  min-height:700px!important;
  border:1px solid rgba(255,255,255,.12);
  border-radius:46px;
  background:
    radial-gradient(circle at var(--hx,65%) var(--hy,25%),rgba(255,255,255,.12),transparent 18rem),
    radial-gradient(circle at 76% 30%,rgba(244,6,115,.15),transparent 22rem),
    linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.012));
  box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 45px 130px rgba(0,0,0,.42);
  backdrop-filter:blur(18px);
  transform-style:preserve-3d;
}
body.apple-v2 .hero-art:before{content:'';position:absolute;inset:18px;border:1px solid rgba(255,255,255,.06);border-radius:34px;pointer-events:none}
body.apple-v2 .hero-art:after{content:'LIVE WORKSPACE';position:absolute;left:28px;top:24px;z-index:8;padding:8px 11px;border:1px solid rgba(255,255,255,.11);border-radius:999px;background:rgba(8,7,10,.52);backdrop-filter:blur(18px);font:800 9px/1 'DM Sans',sans-serif;letter-spacing:.16em;color:#d9d3db}
body.apple-v2 .hero-orbit{inset:9% 9% 8%!important;border-color:rgba(255,255,255,.07)!important;animation:none!important}
body.apple-v2 .project-main{
  inset:82px 52px 84px 48px!important;
  border-radius:34px!important;
  transform:perspective(1400px) rotateY(-5deg) rotateX(2deg) translateZ(15px)!important;
  box-shadow:0 44px 110px rgba(0,0,0,.45)!important
}
body.apple-v2 .project-main:after{left:20px!important;bottom:20px!important;border-radius:14px!important;background:rgba(7,6,9,.62)!important}
body.apple-v2 .project-satellite{
  width:46%!important;height:190px!important;right:-34px!important;bottom:22px!important;border-radius:26px!important;
  transform:rotateZ(3deg) translateZ(80px)!important
}
body.apple-v2 .project-badge{
  left:-28px!important;bottom:58px!important;width:205px!important;border-radius:22px!important;
  background:rgba(14,12,17,.70)!important;backdrop-filter:blur(26px)!important;transform:translateZ(110px) rotate(-2deg)!important
}
body.apple-v2 .floating-code{
  right:18px!important;top:30px!important;border-radius:16px!important;background:rgba(10,9,12,.66)!important;transform:translateZ(120px)!important;animation:none!important
}

/* marquee becomes a refined information rail */
body.apple-v2 .marquee{transform:none!important;border-block-color:rgba(255,255,255,.08)!important;background:rgba(255,255,255,.018)!important}
body.apple-v2 .marquee-track{padding:17px 0!important;animation-duration:34s!important}
body.apple-v2 .marquee-track span{font-size:15px!important;letter-spacing:.08em;color:#a9a2ad!important}
body.apple-v2 .marquee-track span:after{font-size:10px}

/* sections feel like stacked spatial planes */
body.apple-v2 .section{padding:128px 0!important}
body.apple-v2 .section-head{margin-bottom:52px!important}
body.apple-v2 .section-head h2{font-size:clamp(48px,5.8vw,84px)!important;line-height:.94!important;letter-spacing:-.062em!important}
body.apple-v2 .section-head p{max-width:520px;color:#aaa3ae!important}
body.apple-v2 .capability-shell{gap:18px!important;grid-template-columns:.72fr 1.28fr!important}
body.apple-v2 .capability-copy,body.apple-v2 .capability-stage{
  border-radius:38px!important;border-color:rgba(255,255,255,.12)!important;
  background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.018))!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 34px 90px rgba(0,0,0,.28)!important
}
body.apple-v2 .capability-copy{padding:38px!important}
body.apple-v2 .capability-stage{background:radial-gradient(circle at 50% 50%,rgba(244,6,115,.13),transparent 22%),radial-gradient(circle at 60% 40%,rgba(138,92,255,.13),transparent 45%),rgba(10,8,13,.70)!important}
body.apple-v2 .capability-stage:before,body.apple-v2 .capability-stage:after{opacity:.55}
body.apple-v2 .capability-core{width:275px!important;background:linear-gradient(145deg,rgba(244,6,115,.24),rgba(138,92,255,.17)),rgba(13,10,16,.88)!important;box-shadow:0 0 0 18px rgba(255,255,255,.018),0 35px 90px rgba(0,0,0,.44)!important}
body.apple-v2 .capability-node .node-media{border-width:1px!important;box-shadow:0 24px 60px rgba(0,0,0,.38)!important}
body.apple-v2 .capability-node b{letter-spacing:.09em!important}

/* selected work gets cinematic cards and stronger scale hierarchy */
body.apple-v2 .sticky-projects{background:radial-gradient(circle at 50% 50%,rgba(138,92,255,.05),transparent 40%)}
body.apple-v2 .reel-heading{margin-bottom:24px!important}
body.apple-v2 .reel-card{
  width:min(76vw,1080px)!important;height:min(68vh,720px)!important;
  border-radius:44px!important;border-color:rgba(255,255,255,.14)!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 50px 120px rgba(0,0,0,.48)!important;
  transform:scale(.965);opacity:.72;transition:transform .55s var(--axv2-spring),opacity .55s var(--axv2-spring),border-color .35s!important
}
body.apple-v2 .reel-card.in-view{transform:scale(1);opacity:1;border-color:rgba(255,255,255,.22)!important}
body.apple-v2 .reel-card:after{background:linear-gradient(180deg,rgba(4,4,6,.02) 20%,rgba(4,4,6,.92) 100%)!important}
body.apple-v2 .reel-content{padding:42px!important}
body.apple-v2 .reel-link{width:58px!important;height:58px!important;border-radius:18px!important;background:rgba(255,255,255,.92)!important;backdrop-filter:blur(10px)}
body.apple-v2 .tags span{border-radius:999px!important;background:rgba(9,8,11,.5)!important}

/* process/proof become cleaner, less template-like */
body.apple-v2 .process-line{gap:12px!important}
body.apple-v2 .process-step,body.apple-v2 .review-feature,body.apple-v2 .proof-panel,body.apple-v2 .fact{
  border-radius:30px!important;border-color:rgba(255,255,255,.11)!important;
  background:linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.015))!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 24px 70px rgba(0,0,0,.20)!important
}
body.apple-v2 .process-step{min-height:300px;padding:88px 24px 26px!important}
body.apple-v2 .process-step:before{background:rgba(10,9,12,.84)!important;backdrop-filter:blur(16px)}
body.apple-v2 .proof-grid{gap:14px!important}
body.apple-v2 .cta-panel{
  border-radius:46px!important;
  background:radial-gradient(circle at var(--x,80%) var(--y,20%),rgba(255,255,255,.17),transparent 18rem),linear-gradient(135deg,#29081f 0%,#5a0e3d 44%,#392368 100%)!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 45px 120px rgba(47,8,38,.40)!important
}

/* tactile state */
body.apple-v2 .button,body.apple-v2 .header-cta,body.apple-v2 .menu-button,body.apple-v2 .reel-link,body.apple-v2 .whatsapp{transform-origin:center;will-change:transform,translate,scale}
body.apple-v2 .button:active,body.apple-v2 .header-cta:active,body.apple-v2 .menu-button:active,body.apple-v2 .reel-link:active,body.apple-v2 .whatsapp:active{scale:.968}

@media(max-width:1080px){
  body.apple-v2 .site-header .nav-wrap,body.apple-v2 .site-header.scrolled .nav-wrap{width:min(calc(100% - 28px),760px)!important}
  body.apple-v2 .main-nav{position:fixed!important;inset:88px 14px auto!important;padding:14px!important;border-radius:28px!important;background:rgba(10,9,13,.88)!important;backdrop-filter:blur(30px) saturate(170%)!important;box-shadow:0 28px 90px rgba(0,0,0,.42)!important}
  body.apple-v2 .main-nav a{padding:14px!important;border-radius:16px!important}
  body.apple-v2 .hero-grid{grid-template-columns:1fr!important}
  body.apple-v2 .hero-art{min-height:620px!important;margin-top:22px}
  body.apple-v2 .reel-card{width:100%!important;opacity:1;transform:none!important}
}
@media(max-width:680px){
  body.apple-v2 .site-header{padding:10px 0!important}
  body.apple-v2 .site-header .nav-wrap,body.apple-v2 .site-header.scrolled .nav-wrap{width:calc(100% - 20px)!important;min-height:60px;border-radius:20px!important;padding:7px 8px 7px 13px!important}
  body.apple-v2 .brand{width:128px!important}
  body.apple-v2 .hero{padding:108px 0 48px!important}
  body.apple-v2 .kinetic-title{font-size:clamp(58px,17.2vw,78px)!important;line-height:.84!important}
  body.apple-v2 .hero-copy{font-size:16.5px!important}
  body.apple-v2 .micro-proof{display:flex!important;overflow:auto;flex-wrap:nowrap!important;padding-bottom:4px;scrollbar-width:none}
  body.apple-v2 .micro-proof::-webkit-scrollbar{display:none}
  body.apple-v2 .micro-proof span{white-space:nowrap}
  body.apple-v2 .hero-art{min-height:500px!important;border-radius:32px!important;margin-top:32px}
  body.apple-v2 .hero-art:before{inset:10px;border-radius:24px}
  body.apple-v2 .hero-art:after{left:18px;top:16px}
  body.apple-v2 .project-main{inset:58px 14px 82px 20px!important;border-radius:26px!important}
  body.apple-v2 .project-satellite{width:51%!important;height:132px!important;right:-10px!important;bottom:18px!important;border-radius:20px!important}
  body.apple-v2 .project-badge{left:-6px!important;bottom:28px!important;width:158px!important;padding:13px!important}
  body.apple-v2 .floating-code{display:none!important}
  body.apple-v2 .section{padding:88px 0!important}
  body.apple-v2 .section-head h2{font-size:clamp(43px,13vw,60px)!important}
  body.apple-v2 .capability-copy,body.apple-v2 .capability-stage{border-radius:30px!important}
  body.apple-v2 .reel-card{height:510px!important;border-radius:30px!important}
  body.apple-v2 .reel-content{padding:25px!important}
  body.apple-v2 .cta-panel{border-radius:32px!important}
}
@media(prefers-reduced-motion:reduce){
  body.apple-v2 .reel-card{transform:none!important;opacity:1!important}
  body.apple-v2 .site-header .nav-wrap{transition:none!important}
}
@media(prefers-reduced-transparency:reduce){
  body.apple-v2 .site-header .nav-wrap,body.apple-v2 .hero-art,body.apple-v2 .main-nav{background:#0d0b10!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
}
`;

const js = String.raw`
(() => {
  'use strict';
  document.body.classList.add('apple-v2');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  const hero = document.querySelector('.hero-art');
  if (hero && !reduce) {
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const layers = [...hero.querySelectorAll('[data-depth]')];
    const render = () => {
      x += (tx - x) * .09;
      y += (ty - y) * .09;
      hero.style.setProperty('--hx', `${65 + x * 18}%`);
      hero.style.setProperty('--hy', `${25 + y * 14}%`);
      if (!coarse) {
        layers.forEach(layer => {
          const d = Number(layer.dataset.depth || 1);
          layer.style.translate = `${(x * d * 13).toFixed(2)}px ${(y * d * 10).toFixed(2)}px`;
        });
      }
      if (Math.abs(tx - x) > .001 || Math.abs(ty - y) > .001) raf = requestAnimationFrame(render); else raf = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(render); };
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * 2;
      ty = ((e.clientY - r.top) / r.height - .5) * 2;
      wake();
    }, {passive:true});
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; wake(); }, {passive:true});
  }

  if (!reduce) {
    const cards = [...document.querySelectorAll('.reel-card')];
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('in-view', e.isIntersecting)), {threshold:.42});
      cards.forEach(card => io.observe(card));
    } else cards.forEach(card => card.classList.add('in-view'));
  }

  document.querySelectorAll('.button,.header-cta,.menu-button,.reel-link,.whatsapp').forEach(el => {
    let sx = 1, sv = 0, target = 1, frame = 0, last = 0;
    const tick = now => {
      if (!last) last = now;
      const dt = Math.min((now-last)/1000,1/30); last=now;
      const stiffness=230, damping=28;
      sv += (stiffness*(target-sx)-damping*sv)*dt;
      sx += sv*dt;
      el.style.scale = sx.toFixed(4);
      if (Math.abs(target-sx)<.001 && Math.abs(sv)<.01){sx=target;sv=0;frame=0;last=0;el.style.scale=String(target);return;}
      frame=requestAnimationFrame(tick);
    };
    const set = value => {target=value;if(!frame) frame=requestAnimationFrame(tick);};
    el.addEventListener('pointerdown',()=>set(coarse?.962:.974),{passive:true});
    ['pointerup','pointercancel','pointerleave'].forEach(name=>el.addEventListener(name,()=>set(1),{passive:true}));
  });
})();
`;

fs.writeFileSync(path.join(site, 'apple-design-v2.css'), css);
fs.writeFileSync(path.join(site, 'apple-design-v2.js'), js);

function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full);
    else if(entry.isFile() && entry.name.endsWith('.html')){
      let html=fs.readFileSync(full,'utf8');
      if(!html.includes('/apple-design-v2.css')) html=html.replace('</head>','<link rel="stylesheet" href="/apple-design-v2.css?v=2.0"></head>');
      if(!html.includes('/apple-design-v2.js')) html=html.replace('</body>','<script src="/apple-design-v2.js?v=2.0" defer></script></body>');
      fs.writeFileSync(full,html);
    }
  }
}
walk(site);
console.log('Applied Axante Apple Design V2 visible spatial redesign to every page.');
