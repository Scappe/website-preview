import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots', 'services');
fs.mkdirSync(out, { recursive: true });
const base = process.env.QA_BASE_URL;
if (!base) throw new Error('QA_BASE_URL is required.');
const url = new URL('servizi/', base).href;
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
  await page.waitForTimeout(350);
  const metrics = await page.evaluate(() => ({
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    clientWidth: document.documentElement.clientWidth,
    problems: document.querySelectorAll('[data-problem-panel]').length,
    visibleProblems: [...document.querySelectorAll('[data-problem-panel]')].filter(x => !x.hidden).length,
    capabilities: document.querySelectorAll('.capability-item').length,
    hero: document.querySelector('h1')?.textContent?.trim() || ''
  }));
  if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
  if (metrics.problems !== 4) failures.push(`${width}x${height}: expected 4 problem panels`);
  if (metrics.capabilities !== 12) failures.push(`${width}x${height}: expected 12 capabilities`);
  if (!metrics.hero.includes('Scegli cosa deve cambiare')) failures.push(`${width}x${height}: wrong hero`);
  if (width <= 700 && metrics.visibleProblems !== 4) failures.push(`${width}x${height}: mobile must expose all problem paths`);
  if (width > 700 && metrics.visibleProblems !== 1) failures.push(`${width}x${height}: desktop must expose one active panel`);
  if (errors.length) failures.push(`${width}x${height}: console/page errors ${errors.join(' | ')}`);
  if (width > 700) {
    const tabs = page.locator('[data-problem-tab]');
    await tabs.nth(2).click();
    const selected = await tabs.nth(2).getAttribute('aria-selected');
    const panelHidden = await page.locator('#panel-sell').getAttribute('hidden');
    if (selected !== 'true' || panelHidden !== null) failures.push(`${width}x${height}: mouse interaction failed`);
    await tabs.nth(2).press('ArrowRight');
    if (await tabs.nth(3).getAttribute('aria-selected') !== 'true') failures.push(`${width}x${height}: keyboard interaction failed`);
  }
  await page.screenshot({ path:path.join(out, `services-${width}x${height}.png`), fullPage:true });
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
if (failures.length) { console.error('SERVICES VISUAL QA FAILED'); failures.forEach(x=>console.error(`- ${x}`)); process.exit(1); }
console.log(`SERVICES VISUAL QA PASSED: ${viewports.length} breakpoints, interactions and reduced-motion.`);