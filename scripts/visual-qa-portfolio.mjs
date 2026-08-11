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
  const metrics = await page.evaluate(() => ({
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    clientWidth: document.documentElement.clientWidth,
    chapters: document.querySelectorAll('[data-case-chapter]').length,
    storySteps: document.querySelectorAll('.case-step').length,
    proofSteps: document.querySelectorAll('.case-step.is-proof').length,
    archiveCards: document.querySelectorAll('.archive-card').length,
    hero: document.querySelector('h1')?.textContent?.trim() || '',
    cases: [...document.querySelectorAll('.case-chapter h2')].map(el => el.textContent?.trim()),
    cta: document.querySelector('.portfolio-conversion-panel')?.textContent || '',
    badTargets: [...document.querySelectorAll('a,button')].filter(el => { const r=el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 40 || r.height < 40); }).length
  }));
  if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
  if (metrics.chapters !== 3) failures.push(`${width}x${height}: expected 3 protagonist case chapters`);
  if (metrics.storySteps < 12 || metrics.proofSteps !== 3) failures.push(`${width}x${height}: case narrative incomplete`);
  if (!metrics.hero.includes('Mostriamo cosa cambia')) failures.push(`${width}x${height}: wrong proof-first hero`);
  for (const name of ['Casa Rossa','Unicart Auctions','Carabetta']) if (!metrics.cases.includes(name)) failures.push(`${width}x${height}: missing ${name}`);
  if (metrics.archiveCards < 2) failures.push(`${width}x${height}: selected archive incomplete`);
  if (!metrics.cta.includes('Portaci il problema')) failures.push(`${width}x${height}: contextual conversion bridge missing`);
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
console.log(`PORTFOLIO VISUAL QA PASSED: ${viewports.length} breakpoints, keyboard focus and reduced-motion.`);