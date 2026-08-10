import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const cssPath = path.join(site, 'apple-design.css');
const jsPath = path.join(site, 'apple-design.js');

if (!fs.existsSync(path.join(site, 'index.html'))) {
  throw new Error('site/index.html is missing before Apple Design enhancement.');
}

const css = String.raw`/* Axante Apple Design fluid layer — restraint, direct feedback, material depth */
:root{
  --ax-response-fast:.24s;
  --ax-response:.38s;
  --ax-response-slow:.52s;
  --ax-fluid:cubic-bezier(.22,1,.36,1);
  --ax-material:rgba(12,10,15,.58);
  --ax-material-heavy:rgba(9,8,12,.78);
  --ax-material-edge:rgba(255,255,255,.17);
  --ax-material-highlight:rgba(255,255,255,.08);
}
html{font-optical-sizing:auto;text-rendering:optimizeLegibility}
body{-webkit-tap-highlight-color:transparent}
button,a,[role="button"]{touch-action:manipulation}
.kinetic-title,.section-head h2,.reel-heading h2,.cta-panel h2,.page-hero h1,.case-copy h2{text-wrap:balance;font-optical-sizing:auto}
p{font-optical-sizing:auto}

/* Floating chrome: hierarchy without consuming a hard strip */
.site-header{background:transparent!important;border-bottom:0!important;transition:padding var(--ax-response) var(--ax-fluid)!important}
.site-header .nav-wrap{
  position:relative;
  padding:8px 10px 8px 18px;
  border:1px solid rgba(255,255,255,.10);
  border-radius:24px;
  background:rgba(10,8,13,.34);
  -webkit-backdrop-filter:blur(20px) saturate(145%);
  backdrop-filter:blur(20px) saturate(145%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 8px 35px rgba(0,0,0,.10);
  transition:background var(--ax-response) var(--ax-fluid),border-color var(--ax-response) var(--ax-fluid),box-shadow var(--ax-response) var(--ax-fluid),backdrop-filter var(--ax-response) var(--ax-fluid)
}
.site-header.scrolled .nav-wrap{
  background:var(--ax-material);
  border-color:var(--ax-material-edge);
  -webkit-backdrop-filter:blur(30px) saturate(175%);
  backdrop-filter:blur(30px) saturate(175%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 18px 55px rgba(0,0,0,.28)
}
.site-header:after{
  content:"";
  position:absolute;
  z-index:-1;
  left:0;right:0;top:0;height:115px;
  pointer-events:none;
  opacity:0;
  background:linear-gradient(180deg,rgba(5,5,7,.48),rgba(5,5,7,0));
  transition:opacity var(--ax-response) var(--ax-fluid)
}
.site-header.scrolled:after{opacity:1}

/* Materials: larger surfaces read thicker, controls read lighter */
.button-secondary,.project-badge,.floating-code,.tags span,.main-nav.open{
  background:rgba(20,17,24,.54)!important;
  border-color:rgba(255,255,255,.16)!important;
  -webkit-backdrop-filter:blur(22px) saturate(165%)!important;
  backdrop-filter:blur(22px) saturate(165%)!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.10)
}
.capability-copy,.capability-stage,.review-feature,.proof-panel,.process-step,.fact,.case-study{
  box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 24px 75px rgba(0,0,0,.22);
  border-color:rgba(255,255,255,.14)!important
}
.reel-card,.project-frame{
  border-color:rgba(255,255,255,.17)!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 35px 100px rgba(0,0,0,.44)!important
}

/* Physical controls: feedback starts on press, not release */
.button,.header-cta,.menu-button,.reel-link,.whatsapp,.capability-node{
  will-change:translate,scale;
  transform-origin:center;
  -webkit-user-select:none;
  user-select:none
}
.button,.header-cta{
  box-shadow:inset 0 1px 0 rgba(255,255,255,.20),0 16px 44px rgba(0,0,0,.16);
  transition:border-color var(--ax-response-fast) var(--ax-fluid),box-shadow var(--ax-response-fast) var(--ax-fluid),background var(--ax-response-fast) var(--ax-fluid)!important
}
.button-primary{box-shadow:inset 0 1px 0 rgba(255,255,255,.32),0 20px 55px rgba(244,6,115,.25)!important}
.button:active,.header-cta:active,.menu-button:active,.reel-link:active,.whatsapp:active{scale:.975}
.button:focus-visible,.header-cta:focus-visible,.menu-button:focus-visible,.main-nav a:focus-visible,.reel-link:focus-visible,.capability-node:focus-visible,.whatsapp:focus-visible{
  outline:2px solid rgba(255,255,255,.92);
  outline-offset:4px
}

/* Source-anchored mobile sheet: reversible, no display pop */
@media(max-width:1080px){
  .site-header .nav-wrap{padding:7px 8px 7px 15px;border-radius:22px}
  .main-nav{
    display:grid!important;
    position:fixed!important;
    inset:78px 18px auto!important;
    padding:18px!important;
    border:1px solid var(--ax-material-edge)!important;
    border-radius:26px!important;
    background:var(--ax-material-heavy)!important;
    -webkit-backdrop-filter:blur(32px) saturate(170%)!important;
    backdrop-filter:blur(32px) saturate(170%)!important;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 28px 80px rgba(0,0,0,.42)!important;
    opacity:0;
    visibility:hidden;
    pointer-events:none;
    transform:translate3d(0,-10px,0) scale(.975);
    transform-origin:calc(100% - 26px) 0;
    transition:opacity var(--ax-response-fast) var(--ax-fluid),transform var(--ax-response-fast) var(--ax-fluid),visibility 0s linear var(--ax-response-fast)!important
  }
  .main-nav.open{
    opacity:1;
    visibility:visible;
    pointer-events:auto;
    transform:translate3d(0,0,0) scale(1);
    transition-delay:0s!important
  }
  .main-nav.open a{padding:13px 12px!important;border-radius:14px;transition:background var(--ax-response-fast) var(--ax-fluid),color var(--ax-response-fast) var(--ax-fluid)}
  .main-nav.open a:active{background:rgba(255,255,255,.08)}
}

/* Spatial continuity and materialization */
.page-transition{
  opacity:0;
  background:rgba(9,7,12,.88)!important;
  -webkit-backdrop-filter:blur(0) saturate(120%);
  backdrop-filter:blur(0) saturate(120%);
  transition:transform .46s var(--ax-fluid),opacity .30s var(--ax-fluid),backdrop-filter .46s var(--ax-fluid)!important
}
body.is-leaving .page-transition{opacity:1;-webkit-backdrop-filter:blur(18px) saturate(145%);backdrop-filter:blur(18px) saturate(145%)}

/* Less decorative noise, more content hierarchy */
body:after{opacity:.026!important;animation-duration:.42s!important}
.ambient-canvas{opacity:.48!important}
.project-frame img,.reel-card img,.capability-node img{transition:transform var(--ax-response-slow) var(--ax-fluid),filter var(--ax-response) var(--ax-fluid)!important}
.reel-link{transition:rotate var(--ax-response) var(--ax-fluid),scale var(--ax-response) var(--ax-fluid),background var(--ax-response-fast) var(--ax-fluid)!important}
.reel-card:hover .reel-link{transform:none!important;rotate:45deg;scale:1.06}
.whatsapp{transition:translate var(--ax-response) var(--ax-fluid),rotate var(--ax-response) var(--ax-fluid),scale var(--ax-response-fast) var(--ax-fluid)!important}
.whatsapp:hover{transform:none!important;translate:0 -5px;rotate:-4deg}

/* Clearer hierarchy and readable translucent text */
.button-secondary,.project-badge,.floating-code,.tags span{color:rgba(255,255,255,.94)}
.hero-copy,.section-head p,.reel-content p,.capability-copy p,.process-step p,.footer-brand p{letter-spacing:.002em}

@media(pointer:coarse){
  .cursor-dot,.cursor-ring{display:none!important}
  .ambient-canvas{opacity:.28!important}
  .button:active,.header-cta:active,.menu-button:active,.reel-link:active,.whatsapp:active{scale:.965}
}

@media(prefers-reduced-motion:reduce){
  .site-header,.site-header .nav-wrap,.main-nav,.page-transition,.button,.header-cta,.menu-button,.reel-link,.whatsapp{transition-duration:.16s!important}
  .main-nav{transform:none!important}
  .button:active,.header-cta:active,.menu-button:active,.reel-link:active,.whatsapp:active{scale:.985}
  .ambient-canvas{display:none!important}
}

@media(prefers-reduced-transparency:reduce){
  .site-header .nav-wrap,.main-nav,.button-secondary,.project-badge,.floating-code,.tags span{background:#0d0b10!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
}

@media(prefers-contrast:more){
  .site-header .nav-wrap,.main-nav,.button-secondary,.project-badge,.floating-code,.tags span,.capability-copy,.capability-stage,.review-feature,.proof-panel,.process-step,.fact{border-color:rgba(255,255,255,.48)!important}
  .hero-copy,.section-head p,.reel-content p,.capability-copy p,.process-step p,.footer-brand p{color:#d8d3da!important}
}
`;

const js = String.raw`(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const TAU = Math.PI * 2;

  function makeSpring(initial, options) {
    const config = options || {};
    const response = config.response || 0.38;
    const dampingRatio = config.dampingRatio == null ? 1 : config.dampingRatio;
    const omega = TAU / response;
    const stiffness = omega * omega;
    const damping = 2 * dampingRatio * omega;
    let value = initial;
    let velocity = 0;
    let target = initial;
    let frame = 0;
    let lastTime = 0;

    const tick = function(now) {
      if (!lastTime) lastTime = now;
      const dt = Math.min(Math.max((now - lastTime) / 1000, 1 / 240), 1 / 30);
      lastTime = now;
      const acceleration = stiffness * (target - value) - damping * velocity;
      velocity += acceleration * dt;
      value += velocity * dt;
      if (config.onUpdate) config.onUpdate(value, velocity);
      if (Math.abs(target - value) < 0.002 && Math.abs(velocity) < 0.01) {
        value = target;
        velocity = 0;
        frame = 0;
        lastTime = 0;
        if (config.onUpdate) config.onUpdate(value, velocity);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    return {
      set: function(next, initialVelocity) {
        target = next;
        if (Number.isFinite(initialVelocity)) velocity = initialVelocity;
        if (!frame) frame = requestAnimationFrame(tick);
      },
      snap: function(next) {
        target = next;
        value = next;
        velocity = 0;
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        if (config.onUpdate) config.onUpdate(value, velocity);
      },
      get: function() { return value; }
    };
  }

  function installPressSpring(element) {
    if (reduceMotion || element.dataset.applePress === '1') return;
    element.dataset.applePress = '1';
    const spring = makeSpring(1, {
      response: 0.24,
      dampingRatio: 1,
      onUpdate: function(value) { element.style.scale = String(value); }
    });
    const downScale = coarsePointer ? 0.965 : 0.978;
    element.addEventListener('pointerdown', function() { spring.set(downScale); }, { passive: true });
    element.addEventListener('pointerup', function() { spring.set(1); }, { passive: true });
    element.addEventListener('pointercancel', function() { spring.set(1); }, { passive: true });
    element.addEventListener('pointerleave', function() { spring.set(1); }, { passive: true });
  }

  document.querySelectorAll('.button,.header-cta,.menu-button,.reel-link,.whatsapp,.capability-node').forEach(installPressSpring);

  if (!reduceMotion && !coarsePointer) {
    document.querySelectorAll('[data-magnetic],.button,.header-cta').forEach(function(element) {
      if (element.dataset.appleMagnetic === '1') return;
      element.dataset.appleMagnetic = '1';
      const xSpring = makeSpring(0, {
        response: 0.40,
        dampingRatio: 1,
        onUpdate: apply
      });
      const ySpring = makeSpring(0, {
        response: 0.40,
        dampingRatio: 1,
        onUpdate: apply
      });
      let x = 0;
      let y = 0;

      function apply() {
        x = xSpring.get();
        y = ySpring.get();
        element.style.transform = 'none';
        element.style.translate = x.toFixed(2) + 'px ' + y.toFixed(2) + 'px';
      }

      element.addEventListener('pointermove', function(event) {
        const rect = element.getBoundingClientRect();
        const dx = event.clientX - rect.left - rect.width / 2;
        const dy = event.clientY - rect.top - rect.height / 2;
        xSpring.set(dx * 0.085);
        ySpring.set(dy * 0.095);
      }, { passive: true });

      element.addEventListener('pointerleave', function() {
        xSpring.set(0);
        ySpring.set(0);
      }, { passive: true });
    });
  }

  const capabilityStage = document.querySelector('[data-capability-stage]');
  if (capabilityStage && !reduceMotion) {
    const animatedTargets = [
      document.querySelector('[data-capability-title]'),
      document.querySelector('[data-capability-copy]'),
      document.querySelector('[data-capability-index]'),
      capabilityStage.querySelector('[data-core-title]'),
      capabilityStage.querySelector('[data-core-copy]')
    ].filter(Boolean);

    capabilityStage.querySelectorAll('.capability-node').forEach(function(node) {
      const animateContent = function() {
        requestAnimationFrame(function() {
          animatedTargets.forEach(function(target, index) {
            target.animate([
              { opacity: 0.42, transform: 'translateY(' + (index < 3 ? 7 : 4) + 'px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
          });
        });
      };
      node.addEventListener('pointerenter', animateContent, { passive: true });
      node.addEventListener('focus', animateContent, { passive: true });
    });
  }

  document.documentElement.dataset.appleDesign = 'fluid-v1';
})();
`;

fs.writeFileSync(cssPath, css);
fs.writeFileSync(jsPath, js);

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    let html = fs.readFileSync(fullPath, 'utf8');
    if (!html.includes('/apple-design.css')) {
      html = html.replace('</head>', '<link rel="stylesheet" href="/apple-design.css?v=1.0"></head>');
    }
    if (!html.includes('/apple-design.js')) {
      html = html.replace('</body>', '<script src="/apple-design.js?v=1.0" defer></script></body>');
    }
    fs.writeFileSync(fullPath, html);
  }
}

walk(site);
console.log('Applied Axante Apple Design fluid interaction layer to every page.');
