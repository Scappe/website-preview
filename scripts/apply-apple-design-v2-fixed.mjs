import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const sourcePath = path.join(root, 'scripts', 'apply-apple-design-v2.mjs');
if (!fs.existsSync(path.join(site, 'index.html'))) throw new Error('site/index.html is missing before Apple Design V2 enhancement.');
if (!fs.existsSync(sourcePath)) throw new Error('Apple Design V2 source is missing.');

const source = fs.readFileSync(sourcePath, 'utf8');
const start = source.indexOf('const css = String.raw`');
const endMarker = '`;\n\nconst js = String.raw`';
const end = source.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error('Unable to extract Apple Design V2 CSS source.');
const css = source.slice(start + 'const css = String.raw`'.length, end);

const js = String.raw`(() => {
  'use strict';
  document.body.classList.add('apple-v2');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  const hero = document.querySelector('.hero-art');
  if (hero && !reduce) {
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const layers = Array.from(hero.querySelectorAll('[data-depth]'));
    const render = function() {
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      hero.style.setProperty('--hx', String(65 + x * 18) + '%');
      hero.style.setProperty('--hy', String(25 + y * 14) + '%');
      if (!coarse) {
        layers.forEach(function(layer) {
          const d = Number(layer.dataset.depth || 1);
          layer.style.translate = (x * d * 13).toFixed(2) + 'px ' + (y * d * 10).toFixed(2) + 'px';
        });
      }
      if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(render);
      else raf = 0;
    };
    const wake = function() { if (!raf) raf = requestAnimationFrame(render); };
    hero.addEventListener('pointermove', function(e) {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      wake();
    }, { passive: true });
    hero.addEventListener('pointerleave', function() { tx = 0; ty = 0; wake(); }, { passive: true });
  }

  if (!reduce) {
    const cards = Array.from(document.querySelectorAll('.reel-card'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) { entry.target.classList.toggle('in-view', entry.isIntersecting); });
      }, { threshold: 0.42 });
      cards.forEach(function(card) { io.observe(card); });
    } else cards.forEach(function(card) { card.classList.add('in-view'); });
  }

  document.querySelectorAll('.button,.header-cta,.menu-button,.reel-link,.whatsapp').forEach(function(el) {
    let sx = 1, sv = 0, target = 1, frame = 0, last = 0;
    const tick = function(now) {
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const stiffness = 230, damping = 28;
      sv += (stiffness * (target - sx) - damping * sv) * dt;
      sx += sv * dt;
      el.style.scale = sx.toFixed(4);
      if (Math.abs(target - sx) < 0.001 && Math.abs(sv) < 0.01) {
        sx = target; sv = 0; frame = 0; last = 0; el.style.scale = String(target); return;
      }
      frame = requestAnimationFrame(tick);
    };
    const set = function(value) { target = value; if (!frame) frame = requestAnimationFrame(tick); };
    el.addEventListener('pointerdown', function() { set(coarse ? 0.962 : 0.974); }, { passive: true });
    ['pointerup','pointercancel','pointerleave'].forEach(function(name) {
      el.addEventListener(name, function() { set(1); }, { passive: true });
    });
  });
})();`;

fs.writeFileSync(path.join(site, 'apple-design-v2.css'), css);
fs.writeFileSync(path.join(site, 'apple-design-v2.js'), js);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      if (!html.includes('/apple-design-v2.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/apple-design-v2.css?v=2.0"></head>');
      if (!html.includes('/apple-design-v2.js')) html = html.replace('</body>', '<script src="/apple-design-v2.js?v=2.0" defer></script></body>');
      fs.writeFileSync(full, html);
    }
  }
}
walk(site);
console.log('Applied Axante Apple Design V2 visible spatial redesign to every page.');
