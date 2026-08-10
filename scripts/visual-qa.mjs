import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const baseURL = process.env.QA_BASE_URL;
if (!baseURL) throw new Error('QA_BASE_URL is required.');

const viewports = [
  [320,720], [360,800], [390,844], [430,932], [768,1024], [1024,768], [1366,768], [1440,900]
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

  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(700);

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const essential = [...document.querySelectorAll('h1,.button,.btn,.header-cta,.menu-button,.proof-panel,.proof-tab,.cta-panel')];
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
      proofCount: document.querySelectorAll('[data-proof-panel]').length,
      canvasDisplay: document.querySelector('.ambient-canvas') ? getComputedStyle(document.querySelector('.ambient-canvas')).display : 'missing'
    };
  });

  if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: horizontal overflow ${metrics.scrollWidth} > ${metrics.clientWidth}`);
  if (metrics.clipped.length) failures.push(`${width}x${height}: clipped essential elements ${JSON.stringify(metrics.clipped)}`);
  if (metrics.proofCount !== 3) failures.push(`${width}x${height}: expected 3 Proof Spine panels, got ${metrics.proofCount}`);
  if (width <= 768 && metrics.canvasDisplay !== 'none') failures.push(`${width}x${height}: ambient canvas still active on mobile/tablet`);
  if (consoleErrors.length) failures.push(`${width}x${height}: console errors ${consoleErrors.join(' | ')}`);

  if (width <= 680) {
    const mobileProof = await page.evaluate(() => [...document.querySelectorAll('[data-proof-panel]')].map(panel => {
      const r = panel.getBoundingClientRect();
      const s = getComputedStyle(panel);
      return { hidden: panel.getAttribute('aria-hidden'), display: s.display, visibility: s.visibility, width: r.width };
    }));
    if (mobileProof.some(p => p.hidden === 'true' || p.display === 'none' || p.visibility === 'hidden' || p.width <= 0)) failures.push(`${width}x${height}: mobile Proof Spine does not expose all cases ${JSON.stringify(mobileProof)}`);
  } else {
    const tabs = page.locator('[data-proof-tab]');
    if (await tabs.count() !== 3) failures.push(`${width}x${height}: Proof Spine tab controls missing`);
    else {
      await tabs.nth(1).click();
      await page.waitForTimeout(380);
      const clickState = await page.evaluate(() => ({
        selected: document.querySelectorAll('[data-proof-tab][aria-selected="true"]').length,
        selectedText: document.querySelector('[data-proof-tab][aria-selected="true"]')?.textContent || '',
        activePanel: document.querySelector('[data-proof-panel].is-active')?.id || ''
      }));
      if (clickState.selected !== 1 || !clickState.selectedText.includes('Unicart') || clickState.activePanel !== 'proof-panel-unicart') failures.push(`${width}x${height}: click interaction failed ${JSON.stringify(clickState)}`);
      await tabs.nth(1).focus();
      await page.keyboard.press('ArrowRight');
      const keyboardState = await page.evaluate(() => ({ selectedText: document.querySelector('[data-proof-tab][aria-selected="true"]')?.textContent || '', active: document.activeElement?.textContent || '' }));
      if (!keyboardState.selectedText.includes('Carabetta') || !keyboardState.active.includes('Carabetta')) failures.push(`${width}x${height}: keyboard interaction failed ${JSON.stringify(keyboardState)}`);
    }
  }

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

for (const [width,height] of [[390,844],[1366,768]]) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const state = await page.evaluate(() => {
    const reveals = [...document.querySelectorAll('.reveal,.clip-reveal')];
    const proofPanels = [...document.querySelectorAll('[data-proof-panel]')];
    return {
      revealsVisible: reveals.every(el => { const s = getComputedStyle(el); return s.opacity !== '0' && s.visibility !== 'hidden'; }),
      proofCount: proofPanels.length,
      transition: proofPanels[0] ? getComputedStyle(proofPanels[0]).transitionDuration : ''
    };
  });
  if (!state.revealsVisible) failures.push(`${width}x${height} reduced-motion: hidden reveal content detected`);
  if (state.proofCount !== 3) failures.push(`${width}x${height} reduced-motion: Proof Spine content missing`);
  if (state.transition && state.transition.split(',').some(v => parseFloat(v) > 0)) failures.push(`${width}x${height} reduced-motion: Proof Spine transition still active (${state.transition})`);
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
console.log(`VISUAL QA PASSED: ${viewports.length} breakpoints + Proof Spine interaction + reduced-motion checks.`);
