import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots', 'portfolio');
fs.mkdirSync(out, { recursive: true });
const base = process.env.QA_BASE_URL;
if (!base) throw new Error('QA_BASE_URL is required.');
const url = new URL('portfolio/', base).href;
const viewports = [[360,800],[390,844],[430,932],[768,1024],[1024,768],[1366,768],[1440,900]];
const failures = [];
const browser = await chromium.launch({ headless: true });

for (const [width,height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const metrics = await page.evaluate(() => ({
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    clientWidth: document.documentElement.clientWidth,
    stories: document.querySelectorAll('.story').length,
    evidence: document.querySelectorAll('.evidence-block').length,
    hero: document.querySelector('h1')?.textContent?.trim() || '',
    featured: document.querySelector('.featured-title')?.textContent?.trim() || '',
    badTargets: [...document.querySelectorAll('a,button')].filter(el => { const r=el.getBoundingClientRect(); return r.width < 40 || r.height < 40; }).length
  }));
  if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
  if (metrics.stories !== 3) failures.push(`${width}x${height}: expected 3 project stories`);
  if (metrics.evidence < 5) failures.push(`${width}x${height}: featured evidence incomplete`);
  if (!metrics.hero.includes('Mostriamo cosa risolviamo')) failures.push(`${width}x${height}: wrong hero`);
  if (metrics.featured !== 'Casa Rossa') failures.push(`${width}x${height}: missing featured Casa Rossa`);
  if (errors.length) failures.push(`${width}x${height}: console/page errors ${errors.join(' | ')}`);
  await page.locator('a[href="#casa-rossa"]').focus();
  if (!(await page.locator('a[href="#casa-rossa"]').evaluate(el => el === document.activeElement))) failures.push(`${width}x${height}: keyboard focus failed`);
  await page.screenshot({ path:path.join(out, `portfolio-${width}x${height}.png`), fullPage:true });
  await context.close();
}

for (const [width,height] of [[390,844],[1366,768]]) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil:'networkidle' });
  const hidden = await page.evaluate(() => [...document.querySelectorAll('.reveal-lite')].some(el => getComputedStyle(el).opacity === '0'));
  if (hidden) failures.push(`${width}x${height}: reduced-motion hides content`);
  await context.close();
}
await browser.close();
if (failures.length) { console.error('PORTFOLIO VISUAL QA FAILED'); failures.forEach(x=>console.error(`- ${x}`)); process.exit(1); }
console.log(`PORTFOLIO VISUAL QA PASSED: ${viewports.length} breakpoints, keyboard focus and reduced-motion.`);
