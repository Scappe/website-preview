import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots', 'portfolio');
fs.mkdirSync(out, { recursive: true });
const base = process.env.QA_BASE_URL;
if (!base) throw new Error('QA_BASE_URL is required.');
const url = new URL('portfolio/', base).href;
const viewports = [[320,760],[360,800],[390,844],[430,932],[768,1024],[1024,768],[1366,768],[1440,900]];
const failures = [];
const browser = await chromium.launch({ headless: true });

for (const [width,height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const errors = [];
  const badResponses = [];
  const failedRequests = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  page.on('response', response => {
    if (response.status() >= 400) badResponses.push(`${response.status()} ${response.request().resourceType()} ${response.url()}`);
  });
  page.on('requestfailed', request => failedRequests.push(`${request.resourceType()} ${request.url()} ${request.failure()?.errorText || 'failed'}`));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);

  // Force below-fold proof media through the real lazy-loading path before full-page evidence.
  for (const image of await page.locator('.case-visual img[loading="lazy"]').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(el => el.complete ? Promise.resolve() : new Promise(resolve => {
      el.addEventListener('load', resolve, { once:true });
      el.addEventListener('error', resolve, { once:true });
    }));
  }
  await page.evaluate(() => window.scrollTo({ top:0, behavior:'instant' }));
  await page.waitForTimeout(120);

  const metrics = await page.evaluate(() => {
    const rect = el => el?.getBoundingClientRect();
    const overlaps = (a,b) => a && b && a.left < b.right - 2 && a.right > b.left + 2 && a.top < b.bottom - 2 && a.bottom > b.top + 2;
    const keyTargets = [...document.querySelectorAll('.portfolio-hero-actions a,.case-links a,.portfolio-conversion-panel a,.menu-toggle')]
      .filter(el => { const r=rect(el); return r && r.width > 0 && r.height > 0; });
    const clipped = [...document.querySelectorAll('.portfolio-story h1,.portfolio-story h2,.portfolio-story p,.portfolio-story a,.portfolio-story figcaption')]
      .filter(el => {
        const style = getComputedStyle(el);
        const clipsX = /hidden|clip|auto|scroll/.test(style.overflowX);
        const clipsY = /hidden|clip|auto|scroll/.test(style.overflowY);
        return (clipsX && el.scrollWidth > el.clientWidth + 2) || (clipsY && el.scrollHeight > el.clientHeight + 2);
      }).length;
    const chapters = [...document.querySelectorAll('[data-case-chapter]')];
    const desktopCollisions = innerWidth >= 1366 ? chapters.filter(chapter => {
      const visual = rect(chapter.querySelector('.case-visual'));
      const copy = rect(chapter.querySelector('.case-copy'));
      return overlaps(visual, copy);
    }).length : 0;
    const feature = rect(document.querySelector('.portfolio-hero-feature'));
    const unloadedProof = [...document.querySelectorAll('.case-visual img')].filter(img => !img.complete || img.naturalWidth === 0).length;
    return {
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      clientWidth: document.documentElement.clientWidth,
      chapters: chapters.length,
      storySteps: document.querySelectorAll('.case-step').length,
      proofSteps: document.querySelectorAll('.case-step.is-proof').length,
      decisionSteps: [...document.querySelectorAll('.case-step small')].filter(el => el.textContent?.trim() === 'Decisione Axante').length,
      archiveCards: document.querySelectorAll('.archive-card').length,
      hero: document.querySelector('h1')?.textContent?.trim() || '',
      caseLabels: [...document.querySelectorAll('.case-number span')].map(el => el.textContent?.trim() || ''),
      cta: document.querySelector('.portfolio-conversion-panel')?.textContent || '',
      featureVisibleEarly: Boolean(feature && feature.width >= 200 && feature.height >= 120 && feature.top < innerHeight),
      smallTargets: keyTargets.filter(el => { const r=rect(el); return r.width < 44 || r.height < 44; }).map(el => `${el.className || el.tagName}:${el.textContent?.trim().slice(0,40)}`),
      clipped,
      desktopCollisions,
      unloadedProof
    };
  });
  if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
  if (metrics.chapters !== 3) failures.push(`${width}x${height}: expected 3 protagonist case chapters`);
  if (metrics.storySteps < 15 || metrics.proofSteps !== 3 || metrics.decisionSteps !== 3) failures.push(`${width}x${height}: case narrative/proof layers incomplete`);
  if (!metrics.hero.includes('Problemi reali') || !metrics.hero.includes('Sistemi costruiti')) failures.push(`${width}x${height}: wrong proof-first hero`);
  for (const name of ['Casa Rossa','Unicart Auctions','Carabetta']) if (!metrics.caseLabels.some(label => label.includes(name))) failures.push(`${width}x${height}: missing ${name}`);
  if (!metrics.featureVisibleEarly) failures.push(`${width}x${height}: real project proof is not visible in the first viewport`);
  if (metrics.archiveCards < 2) failures.push(`${width}x${height}: selected archive incomplete`);
  if (!metrics.cta.includes('Portaci il problema')) failures.push(`${width}x${height}: contextual conversion bridge missing`);
  if (width <= 1024 && metrics.smallTargets.length) failures.push(`${width}x${height}: key touch targets below 44px: ${metrics.smallTargets.join(' | ')}`);
  if (metrics.clipped) failures.push(`${width}x${height}: ${metrics.clipped} genuinely clipped copy/CTA elements`);
  if (metrics.desktopCollisions) failures.push(`${width}x${height}: ${metrics.desktopCollisions} case media/copy collisions`);
  if (metrics.unloadedProof) failures.push(`${width}x${height}: ${metrics.unloadedProof} proof images failed to load`);
  if (badResponses.length) failures.push(`${width}x${height}: HTTP failures ${[...new Set(badResponses)].join(' | ')}`);
  if (failedRequests.length) failures.push(`${width}x${height}: request failures ${[...new Set(failedRequests)].join(' | ')}`);
  const nonNetworkErrors = errors.filter(error => !/Failed to load resource: the server responded with a status of 404/i.test(error));
  if (nonNetworkErrors.length) failures.push(`${width}x${height}: console/page errors ${[...new Set(nonNetworkErrors)].join(' | ')}`);
  const contact = page.locator('.portfolio-conversion-panel a[href="/contatti"]');
  await contact.focus();
  if (!(await contact.evaluate(el => el === document.activeElement))) failures.push(`${width}x${height}: CTA keyboard focus failed`);
  await page.screenshot({ path:path.join(out, `portfolio-${width}x${height}.png`), fullPage:true });
  await context.close();
}

for (const [width,height] of [[390,844],[1366,768]]) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil:'networkidle' });
  const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-case-chapter]')].some(el => getComputedStyle(el).opacity === '0' || getComputedStyle(el).visibility === 'hidden'));
  if (hidden) failures.push(`${width}x${height}: reduced-motion hides case content`);
  await context.close();
}
await browser.close();
if (failures.length) { console.error('PORTFOLIO VISUAL QA FAILED'); failures.forEach(x=>console.error(`- ${x}`)); process.exit(1); }
console.log(`PORTFOLIO VISUAL QA PASSED: ${viewports.length} breakpoints, proof-first viewport, real lazy proof assets, collision/clipping/touch checks, keyboard focus and reduced-motion.`);