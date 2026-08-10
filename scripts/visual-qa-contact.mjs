import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots', 'contact');
fs.mkdirSync(out, { recursive: true });
const base = process.env.QA_BASE_URL;
if (!base) throw new Error('QA_BASE_URL is required.');
const url = new URL('contatti/', base).href;
const viewports = [[360,800],[390,844],[430,932],[768,1024],[1024,768],[1366,768],[1440,900]];
const failures = [];
const browser = await chromium.launch({ headless: true });

for (const [width,height] of viewports) {
  const context = await browser.newContext({ viewport:{width,height} });
  const page = await context.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(url, { waitUntil:'networkidle' });
  await page.waitForTimeout(250);
  const metrics = await page.evaluate(() => ({
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    clientWidth: document.documentElement.clientWidth,
    steps: document.querySelectorAll('[data-intake-step]').length,
    active: document.querySelectorAll('[data-intake-step].is-active').length,
    problems: document.querySelectorAll('input[name="problem"]').length,
    hero: document.querySelector('h1')?.textContent?.trim() || ''
  }));
  if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
  if (metrics.steps !== 3 || metrics.active !== 1) failures.push(`${width}x${height}: intake step state invalid`);
  if (metrics.problems !== 5) failures.push(`${width}x${height}: expected 5 problem choices`);
  if (!metrics.hero.includes('Portaci il problema')) failures.push(`${width}x${height}: wrong hero`);
  if (errors.length) failures.push(`${width}x${height}: console/page errors ${errors.join(' | ')}`);

  await page.locator('input[name="problem"]').first().check();
  await page.locator('[data-next-step]').first().click();
  if (await page.locator('[data-intake-step="2"]').getAttribute('hidden') !== null) failures.push(`${width}x${height}: step 1→2 failed`);
  await page.locator('#message').fill('Il sito non genera richieste e vogliamo capire dove intervenire.');
  await page.locator('[data-intake-step="2"] [data-next-step]').click();
  if (await page.locator('[data-intake-step="3"]').getAttribute('hidden') !== null) failures.push(`${width}x${height}: step 2→3 failed`);
  await page.locator('[data-intake-step="3"] [data-prev-step]').click();
  if (await page.locator('[data-intake-step="2"]').getAttribute('hidden') !== null) failures.push(`${width}x${height}: back navigation failed`);

  await page.screenshot({ path:path.join(out, `contact-${width}x${height}.png`), fullPage:true });
  await context.close();
}

for (const [width,height] of [[390,844],[1366,768]]) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil:'networkidle' });
  const hiddenReveal = await page.evaluate(() => [...document.querySelectorAll('.reveal')].some(el => getComputedStyle(el).opacity === '0'));
  if (hiddenReveal) failures.push(`${width}x${height}: reduced-motion hides content`);
  await context.close();
}
await browser.close();
if (failures.length) { console.error('CONTACT VISUAL QA FAILED'); failures.forEach(x=>console.error(`- ${x}`)); process.exit(1); }
console.log(`CONTACT VISUAL QA PASSED: ${viewports.length} breakpoints, intake navigation and reduced-motion.`);