import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots', 'contact');
fs.mkdirSync(out, { recursive: true });
const base = process.env.QA_BASE_URL;
if (!base) throw new Error('QA_BASE_URL is required.');
const url = new URL('contatti/', base).href;
const viewports = [[320,760],[360,800],[390,844],[430,932],[768,1024],[1024,768],[1366,768],[1440,900]];
const failures = [];
const browser = await chromium.launch({ headless: true });

const unique = values => [...new Set(values)];

for (const [width,height] of viewports) {
  const context = await browser.newContext({ viewport:{width,height} });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  const badResponses = [];
  const failedRequests = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  page.on('response', response => { if (response.status() >= 400) badResponses.push(`${response.status()} ${response.request().resourceType()} ${response.url()}`); });
  page.on('requestfailed', request => failedRequests.push(`${request.resourceType()} ${request.url()} ${request.failure()?.errorText || 'failed'}`));
  await page.addInitScript(() => {
    window.__contactOpenCalls = [];
    window.open = (...args) => { window.__contactOpenCalls.push(args); return {}; };
  });

  try {
    await page.goto(url, { waitUntil:'networkidle' });
    await page.waitForTimeout(180);

    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const visible = element => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const clipping = [...document.querySelectorAll('h1,h2,h3,.btn,.problem-option,.direct-contact-list a')]
        .filter(visible)
        .filter(element => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
        .map(element => element.textContent?.trim().slice(0,80));
      const outside = [...document.querySelectorAll('a,button,input,textarea')]
        .filter(visible)
        .map(element => ({ text:element.textContent?.trim().slice(0,60) || element.getAttribute('name') || element.tagName, rect:element.getBoundingClientRect().toJSON() }))
        .filter(item => item.rect.left < -2 || item.rect.right > innerWidth + 2);
      const targetHeights = [...document.querySelectorAll('.btn,.problem-option,.direct-contact-list a')]
        .filter(visible)
        .map(element => ({ text:element.textContent?.trim().slice(0,60), height:element.getBoundingClientRect().height }));
      const inputFonts = [...document.querySelectorAll('.contact-form input,.contact-form textarea')]
        .filter(visible)
        .map(element => ({ name:element.name, size:parseFloat(getComputedStyle(element).fontSize) }));
      return {
        scrollWidth:Math.max(root.scrollWidth, document.body.scrollWidth),
        clientWidth:root.clientWidth,
        h1s:document.querySelectorAll('h1').length,
        hero:document.querySelector('h1')?.textContent?.trim() || '',
        forms:document.querySelectorAll('form[data-project-intake]').length,
        wizardSteps:document.querySelectorAll('[data-intake-step],[data-progress-segment]').length,
        problems:document.querySelectorAll('input[name="problem"]').length,
        afterBeats:document.querySelectorAll('.after-flow article').length,
        portfolioLinks:[...document.querySelectorAll('a[href]')].filter(a => /portfolio/.test(a.getAttribute('href') || '')).length,
        clipping,outside,targetHeights,inputFonts
      };
    });

    if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
    if (metrics.h1s !== 1 || !metrics.hero.includes('Portaci ciò che')) failures.push(`${width}x${height}: contact H1 contract invalid`);
    if (metrics.forms !== 1) failures.push(`${width}x${height}: expected one editorial intake form`);
    if (metrics.wizardSteps !== 0) failures.push(`${width}x${height}: hidden wizard/progress markup still present`);
    if (metrics.problems !== 5) failures.push(`${width}x${height}: expected 5 problem choices`);
    if (metrics.afterBeats !== 3) failures.push(`${width}x${height}: expected 3 static next-step beats`);
    if (!metrics.portfolioLinks) failures.push(`${width}x${height}: missing descriptive portfolio proof link`);
    if (metrics.clipping.length) failures.push(`${width}x${height}: internal clipping ${metrics.clipping.join(' | ')}`);
    if (metrics.outside.length) failures.push(`${width}x${height}: interactive outside viewport ${metrics.outside.map(x => x.text).join(' | ')}`);
    if (width <= 1024) {
      const tooSmall = metrics.targetHeights.filter(item => item.height < 43.5);
      if (tooSmall.length) failures.push(`${width}x${height}: touch target <44px ${tooSmall.map(x => `${x.text}=${x.height.toFixed(1)}`).join(' | ')}`);
    }
    if (width <= 430) {
      const smallInputs = metrics.inputFonts.filter(item => item.size < 16);
      if (smallInputs.length) failures.push(`${width}x${height}: mobile input font <16px ${smallInputs.map(x => `${x.name}=${x.size}`).join(' | ')}`);
    }

    const form = page.locator('form[data-project-intake]');
    await form.locator('[type="submit"]').click();
    const emptyErrors = await form.locator('.field-error').filter({ hasText:/\S/ }).count();
    if (emptyErrors < 3) failures.push(`${width}x${height}: empty submit did not expose required errors`);
    if ((await page.evaluate(() => window.__contactOpenCalls.length)) !== 0) failures.push(`${width}x${height}: invalid form opened WhatsApp`);

    const options = form.locator('.problem-option');
    await options.nth(0).click();
    await options.nth(3).click();
    await options.nth(1).click();
    if (!(await form.locator('input[name="problem"]').nth(1).isChecked())) failures.push(`${width}x${height}: rapid problem input final state wrong`);
    await form.locator('#message').fill('Il sito non rende chiara la proposta e vogliamo capire cosa cambiare prima.');
    await form.locator('#name').fill('QA Axante');
    await form.locator('#email').fill('email-non-valida');
    await form.locator('[type="submit"]').click();
    if (!(await form.locator('#email').getAttribute('aria-invalid'))?.includes('true')) failures.push(`${width}x${height}: invalid email state missing`);
    if ((await form.locator('#message').inputValue()).length < 20) failures.push(`${width}x${height}: recoverable error lost message input`);
    await form.locator('#email').fill('qa@example.com');

    await page.evaluate(() => {
      const form = document.querySelector('form[data-project-intake]');
      form.requestSubmit();
      form.requestSubmit();
    });
    await page.waitForTimeout(120);
    const success = await form.evaluate(element => ({ state:element.dataset.state, calls:window.__contactOpenCalls.length, disabled:element.querySelector('[type="submit"]').disabled }));
    if (success.state !== 'success' || success.calls !== 1 || success.disabled) failures.push(`${width}x${height}: deterministic/double-submit state invalid ${JSON.stringify(success)}`);

    await page.evaluate(() => { window.open = () => null; });
    await form.locator('[type="submit"]').click();
    await page.waitForTimeout(120);
    const errorState = await form.getAttribute('data-state');
    if (errorState !== 'error') failures.push(`${width}x${height}: blocked-popup error state missing`);
    if ((await form.locator('#name').inputValue()) !== 'QA Axante') failures.push(`${width}x${height}: error state lost entered values`);

    if (badResponses.length) failures.push(`${width}x${height}: HTTP failures ${unique(badResponses).join(' | ')}`);
    if (failedRequests.length) failures.push(`${width}x${height}: request failures ${unique(failedRequests).join(' | ')}`);
    const nonNetworkErrors = errors.filter(error => !/Failed to load resource: the server responded with a status of 404/i.test(error));
    if (nonNetworkErrors.length) failures.push(`${width}x${height}: console/page errors ${unique(nonNetworkErrors).join(' | ')}`);

    await page.screenshot({ path:path.join(out, `contact-${width}x${height}.png`), fullPage:true });
  } catch (error) {
    failures.push(`${width}x${height}: QA exception ${error.message.split('\n')[0]}`);
  }
  await context.close();
}

for (const [width,height] of [[390,844],[1366,768]]) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil:'networkidle' });
  const reduced = await page.evaluate(() => ({
    h1:document.querySelector('h1')?.getBoundingClientRect().height || 0,
    form:document.querySelector('[data-project-intake]')?.getBoundingClientRect().height || 0,
    after:document.querySelector('.after-flow')?.getBoundingClientRect().height || 0
  }));
  if (!reduced.h1 || !reduced.form || !reduced.after) failures.push(`${width}x${height}: reduced-motion hides essential contact content`);
  await context.close();
}

await browser.close();
if (failures.length) {
  console.error('CONTACT VISUAL QA FAILED');
  failures.forEach(x => console.error(`::error title=Contact visual QA::${x}`));
  process.exit(1);
}
console.log(`CONTACT VISUAL QA PASSED: ${viewports.length} breakpoints, editorial geometry, invalid/success/error/double-submit and reduced-motion.`);