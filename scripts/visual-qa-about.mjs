import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots', 'about');
fs.mkdirSync(out, { recursive: true });
const base = process.env.QA_BASE_URL;
if (!base) throw new Error('QA_BASE_URL is required.');
const url = new URL('chi-siamo/', base).href;
const viewports = [[360,800],[390,844],[430,932],[768,1024],[1024,768],[1366,768],[1440,900]];
const failures = [];
const browser = await chromium.launch({ headless:true });

for (const [width,height] of viewports) {
  const context = await browser.newContext({ viewport:{width,height}, hasTouch:width < 768, isMobile:width < 768 });
  const page = await context.newPage();
  page.setDefaultTimeout(4500);
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  try {
    await page.goto(url, { waitUntil:'networkidle' });
    await page.waitForTimeout(200);
    const metrics = await page.evaluate(() => ({
      scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),
      clientWidth:document.documentElement.clientWidth,
      hero:document.querySelector('h1')?.textContent?.trim() || '',
      processes:document.querySelectorAll('.process-story .process-beat').length,
      people:document.querySelectorAll('.team-list .person').length,
      commitments:document.querySelectorAll('.commitments .commitment').length,
      proofPieces:document.querySelectorAll('.proof-stage .proof-piece').length,
      localProofImages:[...document.querySelectorAll('.proof-stage img')].every(img => !/^https?:/i.test(img.getAttribute('src') || '')),
      internalLinks:[...document.querySelectorAll('main a[href]')].map(a => a.getAttribute('href')),
      h1s:document.querySelectorAll('main h1').length,
      brokenImages:[...document.images].filter(img => !img.complete || img.naturalWidth === 0).length
    }));
    if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
    if (!metrics.hero.includes('Il progetto resta uno')) failures.push(`${width}x${height}: wrong hero`);
    if (metrics.processes !== 5) failures.push(`${width}x${height}: expected 5 process beats`);
    if (metrics.people !== 5) failures.push(`${width}x${height}: expected 5 team profiles`);
    if (metrics.commitments !== 4) failures.push(`${width}x${height}: expected 4 commitments`);
    if (metrics.proofPieces < 3 || !metrics.localProofImages) failures.push(`${width}x${height}: proof stage invalid or hotlinked`);
    if (metrics.h1s !== 1) failures.push(`${width}x${height}: expected one H1`);
    if (metrics.brokenImages) failures.push(`${width}x${height}: ${metrics.brokenImages} broken images`);
    for (const required of ['portfolio.html','servizi.html','contatti.html']) if (!metrics.internalLinks.some(href => href?.includes(required.replace('.html','')) || href === required)) failures.push(`${width}x${height}: missing internal link to ${required}`);
    if (errors.length) failures.push(`${width}x${height}: console/page errors ${errors.join(' | ')}`);

    const geometry = await page.evaluate(() => {
      const selectors = 'h1,h2,h3,.btn,.text-link,.proof-piece,.person,.commitment,.process-beat';
      const clipped = [...document.querySelectorAll(selectors)].filter(el => {
        const r=el.getBoundingClientRect(); return r.width > innerWidth + 2 || r.right > innerWidth + 2 || r.left < -2;
      }).map(el => el.className || el.tagName);
      const touchTargets = innerWidth <= 1024 ? [...document.querySelectorAll('a.btn,button.menu-toggle')].filter(el => {
        const r=el.getBoundingClientRect(); return r.width < 44 || r.height < 44;
      }).length : 0;
      return { clipped, touchTargets };
    });
    if (geometry.clipped.length) failures.push(`${width}x${height}: key content clipped: ${geometry.clipped.slice(0,4).join(', ')}`);
    if (geometry.touchTargets) failures.push(`${width}x${height}: ${geometry.touchTargets} essential touch targets below 44px`);

    await page.screenshot({ path:path.join(out,`about-${width}x${height}.png`), fullPage:true });
  } catch (error) {
    failures.push(`${width}x${height}: QA exception ${error.message.split('\n')[0]}`);
  }
  await context.close();
}

for (const [width,height] of [[390,844],[1366,768]]) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil:'networkidle' });
  const state = await page.evaluate(() => ({
    processes:document.querySelectorAll('.process-beat').length,
    people:document.querySelectorAll('.person').length,
    scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),
    clientWidth:document.documentElement.clientWidth,
    essentialVisible:[...document.querySelectorAll('.process-beat,.person,.commitment')].every(el => getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden')
  }));
  if (state.processes !== 5 || state.people !== 5 || !state.essentialVisible) failures.push(`${width}x${height}: reduced-motion content incomplete`);
  if (state.scrollWidth > state.clientWidth + 2) failures.push(`${width}x${height}: reduced-motion overflow`);
  await context.close();
}

await browser.close();
if (failures.length) {
  console.error('ABOUT VISUAL QA FAILED');
  failures.forEach(x => console.error(`::error title=About visual QA::${x}`));
  process.exit(1);
}
console.log(`ABOUT VISUAL QA PASSED: ${viewports.length} breakpoints, editorial proof, geometry and reduced-motion.`);