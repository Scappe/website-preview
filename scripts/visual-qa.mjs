import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const baseURL = process.env.QA_BASE_URL;
if (!baseURL) throw new Error('QA_BASE_URL is required.');

const viewports = [
  [320,760], [360,800], [390,844], [430,932], [768,1024], [1024,768], [1366,768], [1440,900]
];

const browser = await chromium.launch({ headless: true });
const failures = [];
const report = [];

const reactorState = async page => page.evaluate(() => ({
  activeScenes: document.querySelectorAll('[data-reactor-scene].is-active').length,
  visibleScenes: [...document.querySelectorAll('[data-reactor-scene]')].filter(scene => scene.getAttribute('aria-hidden') === 'false').length,
  selectedTabs: document.querySelectorAll('[data-reactor-tab][aria-selected="true"]').length,
  selectedIndex: [...document.querySelectorAll('[data-reactor-tab]')].findIndex(tab => tab.getAttribute('aria-selected') === 'true'),
  activeIndex: [...document.querySelectorAll('[data-reactor-scene]')].findIndex(scene => scene.classList.contains('is-active')),
  runningAnimations: [...document.querySelectorAll('[data-reactor-scene],[data-reactor-primary],[data-reactor-detail]')].reduce((sum, node) => sum + node.getAnimations().filter(a => a.playState === 'running').length, 0)
}));

const validateReactorState = (label, state, expected) => {
  if (state.activeScenes !== 1 || state.visibleScenes !== 1 || state.selectedTabs !== 1 || state.selectedIndex !== expected || state.activeIndex !== expected || state.runningAnimations !== 0) {
    failures.push(`${label}: Reactor state is not deterministic ${JSON.stringify(state)}, expected index ${expected}`);
  }
};

for (const [width,height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(350);

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const essential = [...document.querySelectorAll('h1,.button,.btn,.header-cta,.menu-button,.reactor-stage,.reactor-controls,.cta-panel')];
    const clipped = essential.filter(el => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
      return r.right > innerWidth + 2 || r.left < -2;
    }).map(el => ({ tag: el.tagName, cls: el.className, text: (el.textContent || '').trim().slice(0,80) }));
    const reactorScenes = [...document.querySelectorAll('[data-reactor-scene]')];
    return {
      scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
      clientWidth: doc.clientWidth,
      clipped,
      proofCount: document.querySelectorAll('[data-proof-panel]').length,
      reactorCount: reactorScenes.length,
      reactorTabs: document.querySelectorAll('[data-reactor-tab]').length,
      reactorAssets: reactorScenes.map(scene => ({
        primary: scene.querySelector('[data-reactor-primary]')?.getAttribute('src') || '',
        detail: scene.querySelector('[data-reactor-detail] img')?.getAttribute('src') || ''
      })),
      canvasDisplay: document.querySelector('.ambient-canvas') ? getComputedStyle(document.querySelector('.ambient-canvas')).display : 'missing'
    };
  });

  if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: horizontal overflow ${metrics.scrollWidth} > ${metrics.clientWidth}`);
  if (metrics.clipped.length) failures.push(`${width}x${height}: clipped essential elements ${JSON.stringify(metrics.clipped)}`);
  if (metrics.proofCount !== 3) failures.push(`${width}x${height}: expected 3 Proof Spine panels, got ${metrics.proofCount}`);
  if (metrics.reactorCount !== 3 || metrics.reactorTabs !== 3) failures.push(`${width}x${height}: expected 3 Reactor scenes/tabs, got ${metrics.reactorCount}/${metrics.reactorTabs}`);
  for (const asset of metrics.reactorAssets) {
    if (!asset.primary || !asset.detail || asset.primary === asset.detail) failures.push(`${width}x${height}: Reactor scene lacks distinct primary/detail asset ${JSON.stringify(asset)}`);
    if (/^https?:/i.test(asset.primary) || /^https?:/i.test(asset.detail)) failures.push(`${width}x${height}: Reactor runtime hotlink detected ${JSON.stringify(asset)}`);
  }
  if (width <= 768 && metrics.canvasDisplay !== 'none') failures.push(`${width}x${height}: ambient canvas still active on mobile/tablet`);
  if (consoleErrors.length) failures.push(`${width}x${height}: console errors ${consoleErrors.join(' | ')}`);

  const reactorTabs = page.locator('[data-reactor-tab]');
  if (await reactorTabs.count() === 3) {
    for (const index of [0,1,2,0,2,1]) await reactorTabs.nth(index).click({ force: true });
    await page.waitForTimeout(width <= 600 ? 560 : 690);
    validateReactorState(`${width}x${height} rapid-click`, await reactorState(page), 1);

    await reactorTabs.nth(0).focus();
    for (const key of ['ArrowRight','ArrowRight','Home','End','ArrowLeft']) await page.keyboard.press(key);
    await page.waitForTimeout(width <= 600 ? 560 : 690);
    validateReactorState(`${width}x${height} rapid-keyboard`, await reactorState(page), 1);
  }

  if (width <= 680) {
    const mobileProof = await page.evaluate(() => [...document.querySelectorAll('[data-proof-panel]')].map(panel => {
      const r = panel.getBoundingClientRect();
      const s = getComputedStyle(panel);
      return { hidden: panel.getAttribute('aria-hidden'), display: s.display, visibility: s.visibility, width: r.width };
    }));
    if (mobileProof.some(p => p.hidden === 'true' || p.display === 'none' || p.visibility === 'hidden' || p.width <= 0)) failures.push(`${width}x${height}: mobile Proof Spine does not expose all cases ${JSON.stringify(mobileProof)}`);
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
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(200);

  const tabs = page.locator('[data-reactor-tab]');
  if (await tabs.count() === 3) {
    for (const index of [1,2,0,2]) await tabs.nth(index).click({ force: true });
    await page.waitForTimeout(40);
    validateReactorState(`${width}x${height} reduced-motion`, await reactorState(page), 2);
  }

  const state = await page.evaluate(() => {
    const reveals = [...document.querySelectorAll('.reveal,.clip-reveal')];
    return {
      revealsVisible: reveals.every(el => { const s = getComputedStyle(el); return s.opacity !== '0' && s.visibility !== 'hidden'; }),
      reactorTransitions: [...document.querySelectorAll('[data-reactor-scene]')].map(el => getComputedStyle(el).transitionDuration)
    };
  });
  if (!state.revealsVisible) failures.push(`${width}x${height} reduced-motion: hidden reveal content detected`);
  if (state.reactorTransitions.some(value => value.split(',').some(v => parseFloat(v) > 0))) failures.push(`${width}x${height} reduced-motion: Reactor CSS transition still active ${JSON.stringify(state.reactorTransitions)}`);
  if (errors.length) failures.push(`${width}x${height} reduced-motion: page errors ${errors.join(' | ')}`);
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
console.log(`VISUAL QA PASSED: ${viewports.length} breakpoints + Reactor spam click/keyboard + distinct assets + reduced-motion checks.`);
