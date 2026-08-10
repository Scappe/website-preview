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
      tabs:document.querySelectorAll('[data-operating-room] [role="tab"]').length,
      panels:document.querySelectorAll('[data-operating-room] [role="tabpanel"]').length,
      selected:document.querySelectorAll('[data-operating-room] [role="tab"][aria-selected="true"]').length,
      people:document.querySelectorAll('.team-editorial .person').length,
      commitments:document.querySelectorAll('.commitments .commitment').length
    }));
    if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
    if (!metrics.hero.includes('Cinque competenze')) failures.push(`${width}x${height}: wrong hero`);
    if (metrics.tabs !== 5 || metrics.panels !== 5 || metrics.selected !== 1) failures.push(`${width}x${height}: operating room state invalid`);
    if (metrics.people !== 5) failures.push(`${width}x${height}: expected 5 team profiles`);
    if (metrics.commitments !== 4) failures.push(`${width}x${height}: expected 4 commitments`);
    if (errors.length) failures.push(`${width}x${height}: console/page errors ${errors.join(' | ')}`);

    const second = page.locator('[role="tab"]').nth(1);
    await second.click();
    if ((await second.getAttribute('aria-selected')) !== 'true') failures.push(`${width}x${height}: click/tap did not activate phase 2`);
    if (!(await page.locator('#phase-panel-2').isVisible())) failures.push(`${width}x${height}: phase 2 panel not visible`);

    if (width >= 768) {
      await second.focus();
      await page.keyboard.press('ArrowDown');
      const third = page.locator('[role="tab"]').nth(2);
      if ((await third.getAttribute('aria-selected')) !== 'true') failures.push(`${width}x${height}: keyboard ArrowDown failed`);
      await page.keyboard.press('End');
      const fifth = page.locator('[role="tab"]').nth(4);
      if ((await fifth.getAttribute('aria-selected')) !== 'true') failures.push(`${width}x${height}: keyboard End failed`);
    }

    const clipped = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,.phase-tab,.btn')].some(el => {
      const r=el.getBoundingClientRect(); return r.width > innerWidth + 2 || r.right > innerWidth + 2 || r.left < -2;
    }));
    if (clipped) failures.push(`${width}x${height}: key content clipped outside viewport`);
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
    selected:document.querySelectorAll('[data-operating-room] [role="tab"][aria-selected="true"]').length,
    visiblePanels:[...document.querySelectorAll('[data-operating-room] [role="tabpanel"]')].filter(el => !el.hidden).length,
    scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),
    clientWidth:document.documentElement.clientWidth
  }));
  if (state.selected !== 1 || state.visiblePanels !== 1) failures.push(`${width}x${height}: reduced-motion operating room invalid`);
  if (state.scrollWidth > state.clientWidth + 2) failures.push(`${width}x${height}: reduced-motion overflow`);
  await context.close();
}

await browser.close();
if (failures.length) {
  console.error('ABOUT VISUAL QA FAILED');
  failures.forEach(x => console.error(`::error title=About visual QA::${x}`));
  process.exit(1);
}
console.log(`ABOUT VISUAL QA PASSED: ${viewports.length} breakpoints, touch/click, keyboard and reduced-motion.`);