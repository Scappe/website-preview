import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const viewports = [
  [360,800], [390,844], [430,932], [768,1024], [1024,768], [1366,768], [1440,900]
];

const browser = await chromium.launch({ headless: true });
const failures = [];
const report = [];

for (const [width,height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(600);

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const essential = [...document.querySelectorAll('h1,.button,.header-cta,.menu-button,.case-study,.capability-stage,.cta-panel')];
    const clipped = essential.filter(el => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
      return r.right > innerWidth + 2 || r.left < -2;
    }).map(el => ({ tag: el.tagName, cls: el.className, text: (el.textContent || '').trim().slice(0,80) }));
    return {
      scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
      clientWidth: doc.clientWidth,
      clipped,
      h1: document.querySelector('h1')?.getBoundingClientRect().toJSON?.() || null,
      canvasDisplay: document.querySelector('.ambient-canvas') ? getComputedStyle(document.querySelector('.ambient-canvas')).display : 'missing'
    };
  });

  if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: horizontal overflow ${metrics.scrollWidth} > ${metrics.clientWidth}`);
  if (metrics.clipped.length) failures.push(`${width}x${height}: clipped essential elements ${JSON.stringify(metrics.clipped)}`);
  if (width <= 768 && metrics.canvasDisplay !== 'none') failures.push(`${width}x${height}: ambient canvas still active on mobile/tablet`);
  if (consoleErrors.length) failures.push(`${width}x${height}: console errors ${consoleErrors.join(' | ')}`);

  if (width <= 1024) {
    const menu = page.locator('.menu-button');
    if (await menu.count()) {
      await menu.click();
      await page.waitForTimeout(220);
      const menuState = await page.evaluate(() => {
        const nav = document.querySelector('.main-nav');
        const b = nav?.getBoundingClientRect();
        return nav ? { open: nav.classList.contains('open'), left:b.left, right:b.right, top:b.top, bottom:b.bottom } : null;
      });
      if (!menuState?.open || menuState.left < -2 || menuState.right > width + 2) failures.push(`${width}x${height}: mobile menu out of viewport or not open`);
      await menu.click();
    }
  }

  await page.screenshot({ path: path.join(out, `home-${width}x${height}.png`), fullPage: true });
  report.push({ viewport: `${width}x${height}`, metrics, consoleErrors });
  await context.close();
}

// Reduced-motion verification at representative mobile + desktop widths.
for (const [width,height] of [[390,844],[1366,768]]) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  const visible = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.reveal,.clip-reveal')];
    return items.every(el => {
      const s = getComputedStyle(el); return s.opacity !== '0' && s.visibility !== 'hidden';
    });
  });
  if (!visible) failures.push(`${width}x${height} reduced-motion: hidden reveal content detected`);
  await page.screenshot({ path: path.join(out, `home-${width}x${height}-reduced-motion.png`), fullPage: true });
  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify({ report, failures }, null, 2));

if (failures.length) {
  console.error('VISUAL QA FAILED');
  failures.forEach(f => console.error(`- ${f}`));
  process.exit(1);
}
console.log(`VISUAL QA PASSED: ${viewports.length} breakpoints + reduced-motion checks.`);
