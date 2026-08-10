import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');

const patch = (relative, transform) => {
  const file = path.join(site, relative);
  if (!fs.existsSync(file)) throw new Error(`Missing ${relative}`);
  const before = fs.readFileSync(file, 'utf8');
  const after = transform(before);
  if (after === before) console.warn(`No mobile runtime patch applied to ${relative}`);
  fs.writeFileSync(file, after);
};

// Stop continuous paint/composite work on touch devices.
patch('home-v5.js', source => source
  .replace('if (canvas && !reduceMotion) {', 'if (canvas && !reduceMotion && !coarsePointer && window.innerWidth > 900) {'));

// Disable the legacy per-scroll mobile depth loop and tap particles.
patch('fixes-v6.js', source => source
  .replace('if (coarsePointer || window.innerWidth <= 680) {', 'if (false && (coarsePointer || window.innerWidth <= 680)) {'));

// Keep the V2 spatial pointer scene desktop-only and avoid spring RAF loops on touch.
patch('apple-design-v2.js', source => source
  .replace('if (hero && !reduce) {', 'if (hero && !reduce && !coarse && window.innerWidth > 900) {')
  .replace("document.querySelectorAll('.button,.header-cta,.menu-button,.reel-link,.whatsapp').forEach(function(el) {", "if (!coarse && window.innerWidth > 900) document.querySelectorAll('.button,.header-cta,.menu-button,.reel-link,.whatsapp').forEach(function(el) {"));

const css = String.raw`
/* Axante Apple V2 — mobile performance guardrail */
@media (max-width:900px), (pointer:coarse) {
  html,body{scroll-behavior:auto!important;overscroll-behavior-y:auto}
  body.apple-v2:after{animation:none!important;background-image:none!important;opacity:0!important}
  body.apple-v2 .ambient-canvas,.cursor-dot,.cursor-ring{display:none!important}

  body.apple-v2 *,body.apple-v2 *:before,body.apple-v2 *:after{
    will-change:auto!important
  }

  /* Mobile chrome: same hierarchy, no expensive live blur. */
  body.apple-v2 .site-header .nav-wrap,
  body.apple-v2 .site-header.scrolled .nav-wrap{
    background:rgba(11,10,14,.96)!important;
    -webkit-backdrop-filter:none!important;
    backdrop-filter:none!important;
    box-shadow:0 10px 30px rgba(0,0,0,.24)!important;
    transition:none!important
  }
  body.apple-v2 .main-nav{
    background:#0d0b10!important;
    -webkit-backdrop-filter:none!important;
    backdrop-filter:none!important;
    box-shadow:0 18px 48px rgba(0,0,0,.34)!important
  }

  /* Hero: fully contained, static composition; no 3D layers escaping viewport. */
  body.apple-v2 .hero{overflow:hidden!important}
  body.apple-v2 .hero-art{
    min-height:470px!important;
    overflow:hidden!important;
    border-radius:28px!important;
    background:linear-gradient(145deg,#151119,#0b0910)!important;
    -webkit-backdrop-filter:none!important;
    backdrop-filter:none!important;
    box-shadow:0 22px 56px rgba(0,0,0,.30)!important;
    transform:none!important;
    perspective:none!important
  }
  body.apple-v2 .hero-art:before{display:none!important}
  body.apple-v2 .hero-orbit{display:none!important}
  body.apple-v2 .hero-art [data-depth]{translate:none!important}
  body.apple-v2 .project-frame{box-shadow:0 16px 34px rgba(0,0,0,.32)!important}
  body.apple-v2 .project-main{
    inset:50px 12px 86px 12px!important;
    transform:none!important;
    border-radius:22px!important
  }
  body.apple-v2 .project-main:after{left:12px!important;bottom:12px!important;padding:9px 11px!important}
  body.apple-v2 .project-satellite{
    width:46%!important;height:118px!important;
    right:12px!important;bottom:16px!important;
    transform:none!important;border-radius:18px!important
  }
  body.apple-v2 .project-badge{
    left:12px!important;bottom:16px!important;width:148px!important;padding:12px!important;
    transform:none!important;background:#17131b!important;
    -webkit-backdrop-filter:none!important;backdrop-filter:none!important;
    box-shadow:0 12px 30px rgba(0,0,0,.28)!important
  }
  body.apple-v2 .floating-code{display:none!important}

  body.apple-v2 .micro-proof{
    display:flex!important;overflow:visible!important;flex-wrap:wrap!important;
    gap:7px!important;padding:0!important
  }
  body.apple-v2 .micro-proof span{white-space:normal!important;font-size:11px!important}

  /* Remove all continuous decorative animations while scrolling. */
  body.apple-v2 .marquee-track,
  body.apple-v2 .capability-stage:before,
  body.apple-v2 .capability-stage:after,
  body.apple-v2 .capability-core:before,
  body.apple-v2 .floating-code,
  body.apple-v2 .gradient-word,
  body.apple-v2 .scroll-cue i:after{
    animation:none!important
  }

  body.apple-v2 .button-secondary,
  body.apple-v2 .project-badge,
  body.apple-v2 .tags span,
  body.apple-v2 .reel-link,
  body.apple-v2 .process-step:before{
    -webkit-backdrop-filter:none!important;
    backdrop-filter:none!important
  }

  body.apple-v2 .capability-copy,
  body.apple-v2 .capability-stage,
  body.apple-v2 .review-feature,
  body.apple-v2 .proof-panel,
  body.apple-v2 .process-step,
  body.apple-v2 .fact,
  body.apple-v2 .cta-panel{
    box-shadow:0 16px 42px rgba(0,0,0,.22)!important
  }
  body.apple-v2 .capability-stage{min-height:540px!important}
  body.apple-v2 .capability-core{width:210px!important;box-shadow:0 18px 46px rgba(0,0,0,.30)!important}
  body.apple-v2 .capability-node .node-media{box-shadow:0 12px 26px rgba(0,0,0,.28)!important}

  /* Portfolio reel must be native vertical flow on mobile. */
  body.apple-v2 .project-reel{height:auto!important}
  body.apple-v2 .sticky-projects{position:relative!important;height:auto!important;overflow:visible!important}
  body.apple-v2 .project-track{
    display:grid!important;width:auto!important;transform:none!important;
    padding:0 14px!important;gap:14px!important
  }
  body.apple-v2 .reel-card{
    width:100%!important;height:500px!important;
    transform:none!important;translate:none!important;rotate:none!important;scale:1!important;
    opacity:1!important;border-radius:26px!important;
    box-shadow:0 18px 46px rgba(0,0,0,.30)!important;
    transition:none!important
  }
  body.apple-v2 .reel-card img{transform:none!important;transition:none!important}
  body.apple-v2 .reel-link{border-radius:16px!important;background:#fff!important}

  body.apple-v2 .page-transition{display:none!important}
}

@media (max-width:680px) {
  body.apple-v2 .hero{padding:102px 0 42px!important}
  body.apple-v2 .kinetic-title{font-size:clamp(54px,16vw,72px)!important;line-height:.86!important}
  body.apple-v2 .hero-art{min-height:440px!important;margin-top:24px!important}
  body.apple-v2 .project-main{inset:46px 10px 78px!important}
  body.apple-v2 .project-satellite{height:104px!important;right:10px!important;bottom:14px!important}
  body.apple-v2 .project-badge{left:10px!important;bottom:14px!important;width:138px!important}
  body.apple-v2 .section{padding:76px 0!important}
  body.apple-v2 .section-head{gap:18px!important;margin-bottom:34px!important}
  body.apple-v2 .section-head h2{font-size:clamp(40px,12vw,54px)!important}
  body.apple-v2 .capability-stage{min-height:500px!important}
  body.apple-v2 .capability-node{width:92px!important}
  body.apple-v2 .reel-card{height:460px!important}
  body.apple-v2 .reel-content{padding:22px!important}
  body.apple-v2 .reel-content h3{font-size:42px!important}
  body.apple-v2 .process-step{min-height:0!important}
  body.apple-v2 .cta-panel{border-radius:26px!important}
}
`;

fs.writeFileSync(path.join(site, 'mobile-performance-v2.css'), css);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      if (!html.includes('/mobile-performance-v2.css')) {
        html = html.replace('</head>', '<link rel="stylesheet" href="/mobile-performance-v2.css?v=1.0"></head>');
      }
      fs.writeFileSync(full, html);
    }
  }
}
walk(site);
console.log('Applied Axante mobile performance guardrail: native scroll, no mobile RAF depth/canvas, contained layout.');
