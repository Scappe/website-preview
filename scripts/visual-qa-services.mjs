import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots', 'services');
fs.mkdirSync(out, { recursive: true });
const base = process.env.QA_BASE_URL;
if (!base) throw new Error('QA_BASE_URL is required.');
const url = new URL('servizi/', base).href;
const viewports = [[320,760],[360,800],[390,844],[430,932],[768,1024],[1024,768],[1366,768],[1440,900]];
const failures = [];
const browser = await chromium.launch({ headless: true });
const requiredAssets = ['casarossa-store.jpg','casarossa-product.jpg','unicart-catalog.jpg','unicart-auctions.jpg','carabetta.jpg','carabetta-logo.png'];

for (const [width,height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);

  const metrics = await page.evaluate(() => {
    const visible = el => { const s=getComputedStyle(el); const r=el.getBoundingClientRect(); return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0; };
    const essential=[...document.querySelectorAll('h1,h2,.services-hero .btn,.problem-track,.proof-panel,.proof-media,.system-line,.capability-lines a,.services-final .btn,.site-header .logo,.site-header .menu-toggle')].filter(visible);
    const clipped=essential.filter(el=>{const r=el.getBoundingClientRect(); return r.left < -2 || r.right > innerWidth + 2;}).map(el=>({tag:el.tagName,cls:el.className,text:(el.textContent||'').trim().slice(0,60)}));
    const overlaps=[];
    const checkPairs = nodes => {
      for (let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++) {
        const a=nodes[i].getBoundingClientRect(), b=nodes[j].getBoundingClientRect();
        const x=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left));
        const y=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
        if (x*y > 24) overlaps.push([(nodes[i].textContent||'').trim().slice(0,24),(nodes[j].textContent||'').trim().slice(0,24)]);
      }
    };
    if (innerWidth <= 700) {
      checkPairs([...document.querySelectorAll('.services-hero .actions .btn')].filter(visible));
      checkPairs([...document.querySelectorAll('.services-final .actions .btn')].filter(visible));
    }
    const targets=[...document.querySelectorAll('.proof-tab,.services-hero .btn,.services-final .btn')].filter(visible).map(el=>{const r=el.getBoundingClientRect();return {text:(el.textContent||'').trim().slice(0,35),w:r.width,h:r.height};});
    const problemBg=getComputedStyle(document.querySelector('.problem-field')).backgroundColor;
    const proofBg=getComputedStyle(document.querySelector('.proof-spine')).backgroundColor;
    const systemBg=getComputedStyle(document.querySelector('.system-orchestra')).backgroundColor;
    const heroBg=getComputedStyle(document.querySelector('.services-hero')).backgroundColor;
    const activeMedia=document.querySelector('.proof-panel.is-active .proof-media')?.getBoundingClientRect();
    return {
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      clientWidth: document.documentElement.clientWidth,
      panels: document.querySelectorAll('[data-proof-panel]').length,
      visiblePanels: [...document.querySelectorAll('[data-proof-panel]')].filter(visible).length,
      tabs: document.querySelectorAll('[data-proof-tab]').length,
      problems: document.querySelectorAll('.problem-track').length,
      systemLines: document.querySelectorAll('.system-line').length,
      capabilityLines: document.querySelectorAll('.capability-lines a').length,
      hero: document.querySelector('h1')?.textContent?.trim() || '',
      assets: [...document.querySelectorAll('.proof-media img')].map(img=>img.getAttribute('src')||''),
      clipped, overlaps, targets,
      surfaces:{heroBg,problemBg,proofBg,systemBg},
      activeMediaWidth:activeMedia?.width||0,
      mobileMenuVisible: (()=>{const el=document.querySelector('.menu-toggle'); return el ? visible(el) : false;})(),
      desktopNavVisible: (()=>{const el=document.querySelector('.nav'); return el ? visible(el) : false;})()
    };
  });

  if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
  if (metrics.clipped.length) failures.push(`${width}x${height}: clipped essentials ${JSON.stringify(metrics.clipped)}`);
  if (metrics.overlaps.length) failures.push(`${width}x${height}: overlapping CTAs ${JSON.stringify(metrics.overlaps)}`);
  if (metrics.panels !== 3 || metrics.tabs !== 3) failures.push(`${width}x${height}: expected 3 proof panels/tabs, got ${metrics.panels}/${metrics.tabs}`);
  if (metrics.problems !== 4) failures.push(`${width}x${height}: expected 4 problem tracks, got ${metrics.problems}`);
  if (metrics.systemLines !== 5 || metrics.capabilityLines !== 5) failures.push(`${width}x${height}: incomplete system/capability coverage ${metrics.systemLines}/${metrics.capabilityLines}`);
  if (!metrics.hero.includes('Partiamo dal problema')) failures.push(`${width}x${height}: wrong hero`);
  for (const name of requiredAssets) if (!metrics.assets.some(src=>src.includes(name))) failures.push(`${width}x${height}: missing proof asset ${name}`);
  if (metrics.assets.some(src=>/^https?:/i.test(src))) failures.push(`${width}x${height}: runtime hotlink in proof assets`);
  if (width <= 700 && metrics.visiblePanels !== 3) failures.push(`${width}x${height}: mobile must expose all proof chapters`);
  if (width > 700 && metrics.visiblePanels !== 1) failures.push(`${width}x${height}: desktop/tablet must expose one proof chapter`);
  if (width <= 1024 && (!metrics.mobileMenuVisible || metrics.desktopNavVisible)) failures.push(`${width}x${height}: global mobile header regression`);
  if (metrics.surfaces.problemBg === metrics.surfaces.proofBg || metrics.surfaces.systemBg === metrics.surfaces.proofBg) failures.push(`${width}x${height}: scene surface differentiation missing ${JSON.stringify(metrics.surfaces)}`);
  if (width >= 1366 && metrics.activeMediaWidth < width * .78) failures.push(`${width}x${height}: media-led proof is not materially viewport-scale (${metrics.activeMediaWidth}px)`);
  if (metrics.targets.some(t => t.h < 44 || t.w < 44)) failures.push(`${width}x${height}: undersized primary control ${JSON.stringify(metrics.targets.filter(t=>t.h<44||t.w<44))}`);
  if (errors.length) failures.push(`${width}x${height}: console/page errors ${errors.join(' | ')}`);

  if (width > 700) {
    const tabs = page.locator('[data-proof-tab]');
    for (const index of [0,1,2,0,2,1]) await tabs.nth(index).click({ force:true });
    await page.waitForTimeout(750);
    const state = await page.evaluate(() => ({
      selected:[...document.querySelectorAll('[data-proof-tab]')].findIndex(x=>x.getAttribute('aria-selected')==='true'),
      active:[...document.querySelectorAll('[data-proof-panel]')].findIndex(x=>x.classList.contains('is-active')),
      visible:[...document.querySelectorAll('[data-proof-panel]')].filter(x=>!x.hidden && getComputedStyle(x).display!=='none').length,
      ariaVisible:[...document.querySelectorAll('[data-proof-panel]')].filter(x=>x.getAttribute('aria-hidden')==='false').length,
      running:[...document.querySelectorAll('[data-proof-panel]')].reduce((n,x)=>n+x.getAnimations({subtree:true}).filter(a=>a.playState==='running').length,0)
    }));
    if (state.selected!==1 || state.active!==1 || state.visible!==1 || state.ariaVisible!==1 || state.running!==0) failures.push(`${width}x${height}: rapid interaction not deterministic ${JSON.stringify(state)}`);
    await tabs.nth(1).focus(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(700);
    if (await tabs.nth(2).getAttribute('aria-selected') !== 'true') failures.push(`${width}x${height}: keyboard interaction failed`);
  }

  await page.screenshot({ path:path.join(out, `services-${width}x${height}.png`), fullPage:true });
  await context.close();
}

for (const [width,height] of [[390,844],[1366,768]]) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil:'networkidle' });
  const reduced = await page.evaluate(() => ({
    hiddenReveal:[...document.querySelectorAll('.reveal')].some(el=>getComputedStyle(el).opacity==='0'),
    transitions:[...document.querySelectorAll('.proof-tab,.capability-lines a')].map(el=>getComputedStyle(el).transitionDuration),
    panelCount:[...document.querySelectorAll('[data-proof-panel]')].filter(el=>getComputedStyle(el).display!=='none').length
  }));
  if (reduced.hiddenReveal) failures.push(`${width}x${height}: reduced-motion hides content`);
  if (reduced.transitions.some(v=>v.split(',').some(x=>parseFloat(x)>0))) failures.push(`${width}x${height}: reduced-motion transition remains active`);
  if (width===390 && reduced.panelCount!==3) failures.push(`${width}x${height}: reduced-motion mobile must expose all proof chapters`);
  await page.screenshot({ path:path.join(out, `services-${width}x${height}-reduced.png`), fullPage:true });
  await context.close();
}

await browser.close();
if (failures.length) { console.error('SERVICES VISUAL QA FAILED'); failures.forEach(x=>console.error(`- ${x}`)); process.exit(1); }
console.log(`SERVICES VISUAL QA PASSED: ${viewports.length} breakpoints, 5 scene families, viewport-scale proof, content coverage, touch/header geometry, rapid interaction and reduced-motion.`);
