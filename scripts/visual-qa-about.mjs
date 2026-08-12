import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots', 'about');
fs.mkdirSync(out, { recursive: true });
const base = process.env.QA_BASE_URL;
if (!base) throw new Error('QA_BASE_URL is required.');
const url = new URL('chi-siamo/', base).href;
const viewports = [[320,760],[360,800],[390,844],[430,932],[768,1024],[1024,768],[1366,768],[1440,900]];
const failures = [];
const browser = await chromium.launch({ headless:true });

for (const [width,height] of viewports) {
  const context = await browser.newContext({ viewport:{width,height}, hasTouch:width < 768, isMobile:width < 768 });
  const page = await context.newPage();
  page.setDefaultTimeout(4500);
  const errors = [];
  const badResponses = [];
  const failedRequests = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  page.on('response', response => {
    if (response.status() >= 400) badResponses.push(`${response.status()} ${response.request().resourceType()} ${response.url()}`);
  });
  page.on('requestfailed', request => failedRequests.push(`${request.resourceType()} ${request.url()} ${request.failure()?.errorText || 'failed'}`));
  try {
    await page.goto(url, { waitUntil:'networkidle' });
    await page.waitForTimeout(200);
    const metrics = await page.evaluate(() => ({
      scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),
      clientWidth:document.documentElement.clientWidth,
      hero:document.querySelector('h1')?.textContent?.trim() || '',
      scenes:document.querySelectorAll('main .about-scene').length,
      heroPeople:document.querySelectorAll('.people-signal .hero-person').length,
      processes:document.querySelectorAll('.process-story .process-beat').length,
      people:document.querySelectorAll('.team-list .person').length,
      commitments:document.querySelectorAll('.commitments .commitment').length,
      proofPieces:document.querySelectorAll('.proof-stage .proof-piece').length,
      localProofImages:[...document.querySelectorAll('.proof-stage img')].every(img => !/^https?:/i.test(img.getAttribute('src') || '')),
      internalLinks:[...document.querySelectorAll('main a[href]')].map(a => a.getAttribute('href')),
      h1s:document.querySelectorAll('main h1').length,
      brokenImages:[...document.images].filter(img => !img.complete || img.naturalWidth === 0).length,
      staticPeopleReadable:[...document.querySelectorAll('.people-signal .hero-person,.team-list .person')].every(el => getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden')
    }));
    if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
    if (!metrics.hero.includes('Una squadra sola')) failures.push(`${width}x${height}: wrong hero`);
    if (metrics.scenes < 4) failures.push(`${width}x${height}: expected at least 4 material scenes`);
    if (metrics.heroPeople !== 5) failures.push(`${width}x${height}: expected 5 people in opening signal`);
    if (metrics.processes !== 5) failures.push(`${width}x${height}: expected 5 process beats`);
    if (metrics.people !== 5) failures.push(`${width}x${height}: expected 5 team profiles`);
    if (metrics.commitments !== 4) failures.push(`${width}x${height}: expected 4 commitments`);
    if (metrics.proofPieces < 3 || !metrics.localProofImages) failures.push(`${width}x${height}: proof stage invalid or hotlinked`);
    if (!metrics.staticPeopleReadable) failures.push(`${width}x${height}: people proof hidden by state`);
    if (metrics.h1s !== 1) failures.push(`${width}x${height}: expected one H1`);
    if (metrics.brokenImages) failures.push(`${width}x${height}: ${metrics.brokenImages} broken images`);
    for (const required of ['portfolio.html','servizi.html','contatti.html']) if (!metrics.internalLinks.some(href => href?.includes(required.replace('.html','')) || href === required)) failures.push(`${width}x${height}: missing internal link to ${required}`);
    if (badResponses.length) failures.push(`${width}x${height}: HTTP failures ${[...new Set(badResponses)].join(' | ')}`);
    if (failedRequests.length) failures.push(`${width}x${height}: request failures ${[...new Set(failedRequests)].join(' | ')}`);
    const nonNetworkErrors = errors.filter(error => !/Failed to load resource: the server responded with a status of 404/i.test(error));
    if (nonNetworkErrors.length) failures.push(`${width}x${height}: console/page errors ${[...new Set(nonNetworkErrors)].join(' | ')}`);

    const geometry = await page.evaluate(() => {
      const selectors = 'h1,h2,h3,.btn,.text-link,.proof-piece,.person,.commitment,.process-beat,.hero-person';
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
    heroPeople:document.querySelectorAll('.hero-person').length,
    processes:document.querySelectorAll('.process-beat').length,
    people:document.querySelectorAll('.person').length,
    scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),
    clientWidth:document.documentElement.clientWidth,
    essentialVisible:[...document.querySelectorAll('.hero-person,.process-beat,.person,.commitment')].every(el => getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden')
  }));
  if (state.heroPeople !== 5 || state.processes !== 5 || state.people !== 5 || !state.essentialVisible) failures.push(`${width}x${height}: reduced-motion content incomplete`);
  if (state.scrollWidth > state.clientWidth + 2) failures.push(`${width}x${height}: reduced-motion overflow`);
  await context.close();
}

await browser.close();
if (failures.length) {
  console.error('ABOUT VISUAL QA FAILED');
  failures.forEach(x => console.error(`::error title=About visual QA::${x}`));
  process.exit(1);
}
console.log(`ABOUT VISUAL QA PASSED: ${viewports.length} breakpoints, people-led scenes, local proof, geometry and reduced-motion.`);