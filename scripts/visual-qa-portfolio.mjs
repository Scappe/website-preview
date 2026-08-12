import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots', 'portfolio');
fs.mkdirSync(out, { recursive:true });
const base = process.env.QA_BASE_URL;
if (!base) throw new Error('QA_BASE_URL is required.');
const url = new URL('portfolio/', base).href;
const viewports = [[320,760],[360,800],[390,844],[430,932],[768,1024],[1024,768],[1366,768],[1440,900]];
const failures = [];
const browser = await chromium.launch({ headless:true });

for (const [width,height] of viewports) {
  const context = await browser.newContext({ viewport:{width,height} });
  const page = await context.newPage();
  const errors = [], badResponses = [], failedRequests = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  page.on('response', response => { if (response.status() >= 400) badResponses.push(`${response.status()} ${response.request().resourceType()} ${response.url()}`); });
  page.on('requestfailed', request => failedRequests.push(`${request.resourceType()} ${request.url()} ${request.failure()?.errorText || 'failed'}`));
  await page.goto(url, { waitUntil:'networkidle' });

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
    const chapters = [...document.querySelectorAll('[data-case-chapter]')];
    const targets = [...document.querySelectorAll('.portfolio-proof-link,.case-links a,.portfolio-principle-links a,.portfolio-conversion-panel a,.menu-toggle')]
      .filter(el => { const r=rect(el); return r && r.width > 0 && r.height > 0; });
    const conversionTargets = [...document.querySelectorAll('.portfolio-conversion-panel .actions a')].map(rect).filter(Boolean);
    const crowdedConversionTargets = conversionTargets.some((a,i) => conversionTargets.slice(i+1).some(b => {
      if (overlaps(a,b)) return true;
      const v = a.top < b.bottom && a.bottom > b.top;
      const h = a.left < b.right && a.right > b.left;
      const hg = Math.max(0, Math.max(a.left,b.left) - Math.min(a.right,b.right));
      const vg = Math.max(0, Math.max(a.top,b.top) - Math.min(a.bottom,b.bottom));
      return (v && hg < 8) || (h && vg < 8);
    }));
    const clipped = [...document.querySelectorAll('.portfolio-story h1,.portfolio-story h2,.portfolio-story p,.portfolio-story a,.portfolio-story figcaption')].filter(el => {
      const s=getComputedStyle(el); const x=/hidden|clip|auto|scroll/.test(s.overflowX); const y=/hidden|clip|auto|scroll/.test(s.overflowY);
      return (x && el.scrollWidth > el.clientWidth + 2) || (y && el.scrollHeight > el.clientHeight + 2);
    }).length;
    const chapterCollisions = innerWidth >= 1366 ? chapters.filter(ch => overlaps(rect(ch.querySelector('.case-visual')), rect(ch.querySelector('.case-copy')))).length : 0;
    const casaMedia = rect(document.querySelector('.case-casa-media'));
    const casaSection = rect(document.querySelector('.case-casa'));
    const mobileProof = innerWidth < 700;
    const proofDominance = Boolean(casaMedia && casaSection && casaMedia.width >= innerWidth * (mobileProof ? .94 : .82) && casaMedia.height >= (mobileProof ? innerWidth * .68 : Math.min(innerHeight * .55, 420)));
    return {
      scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth), clientWidth:document.documentElement.clientWidth,
      chapters:chapters.length,
      surfaces:[...new Set(chapters.map(x=>x.dataset.surface).filter(Boolean))],
      compositions:[...new Set(chapters.map(x=>x.dataset.composition).filter(Boolean))],
      steps:document.querySelectorAll('.case-step').length,
      proofSteps:document.querySelectorAll('.case-step.is-proof').length,
      decisions:[...document.querySelectorAll('.case-step small')].filter(el=>el.textContent?.trim()==='Decisione Axante').length,
      labels:[...document.querySelectorAll('.case-number span')].map(el=>el.textContent?.trim()||''),
      hero:document.querySelector('h1')?.textContent?.trim()||'',
      principle:document.querySelector('.portfolio-principle')?.textContent||'',
      cta:document.querySelector('.portfolio-conversion-panel')?.textContent||'',
      proofDominance,
      smallTargets:targets.filter(el=>{const r=rect(el);return r.width<44||r.height<44}).map(el=>el.textContent?.trim().slice(0,42)||el.tagName),
      crowdedConversionTargets, clipped, chapterCollisions,
      unloadedProof:[...document.querySelectorAll('.case-visual img')].filter(img=>!img.complete||img.naturalWidth===0).length,
      fakeArchive:document.querySelectorAll('.archive-card,.selected-archive').length
    };
  });

  if (metrics.scrollWidth > metrics.clientWidth + 2) failures.push(`${width}x${height}: overflow ${metrics.scrollWidth}>${metrics.clientWidth}`);
  if (metrics.chapters !== 3) failures.push(`${width}x${height}: expected 3 protagonist case chapters`);
  if (metrics.surfaces.length !== 3 || metrics.compositions.length !== 3) failures.push(`${width}x${height}: case scene families are not materially distinct`);
  if (metrics.steps < 12 || metrics.proofSteps !== 3 || metrics.decisions !== 3) failures.push(`${width}x${height}: case problem/decision/output/proof layers incomplete`);
  if (!metrics.hero.includes('Problemi reali') || !metrics.hero.includes('Decisioni visibili')) failures.push(`${width}x${height}: wrong proof-first hero`);
  for (const name of ['Casa Rossa','Unicart Auctions','Carabetta']) if (!metrics.labels.some(label=>label.includes(name))) failures.push(`${width}x${height}: missing ${name}`);
  if (!metrics.proofDominance && width >= 390) failures.push(`${width}x${height}: Casa Rossa proof does not materially dominate its chapter`);
  if (!metrics.principle.includes('Problema') || !metrics.principle.includes('decisione') || !metrics.principle.includes('Come prendiamo decisioni e lavoriamo')) failures.push(`${width}x${height}: operating-proof bridge incomplete`);
  if (!metrics.cta.includes('Portaci il problema')) failures.push(`${width}x${height}: contextual conversion bridge missing`);
  if (metrics.fakeArchive) failures.push(`${width}x${height}: legacy archive/card-grid language reintroduced`);
  if (width <= 1024 && metrics.smallTargets.length) failures.push(`${width}x${height}: touch targets below 44px: ${metrics.smallTargets.join(' | ')}`);
  if (metrics.crowdedConversionTargets) failures.push(`${width}x${height}: conversion CTAs overlap or have less than 8px separation`);
  if (metrics.clipped) failures.push(`${width}x${height}: ${metrics.clipped} clipped copy/CTA elements`);
  if (metrics.chapterCollisions) failures.push(`${width}x${height}: ${metrics.chapterCollisions} media/copy collisions`);
  if (metrics.unloadedProof) failures.push(`${width}x${height}: ${metrics.unloadedProof} proof images failed to load`);
  if (badResponses.length) failures.push(`${width}x${height}: HTTP failures ${[...new Set(badResponses)].join(' | ')}`);
  if (failedRequests.length) failures.push(`${width}x${height}: request failures ${[...new Set(failedRequests)].join(' | ')}`);
  const nonNetworkErrors = errors.filter(error=>!/Failed to load resource: the server responded with a status of 404/i.test(error));
  if (nonNetworkErrors.length) failures.push(`${width}x${height}: console/page errors ${[...new Set(nonNetworkErrors)].join(' | ')}`);

  const contact = page.locator('.portfolio-conversion-panel a[href="/contatti"]');
  await contact.focus();
  if (!(await contact.evaluate(el=>el===document.activeElement))) failures.push(`${width}x${height}: CTA keyboard focus failed`);
  await page.screenshot({ path:path.join(out,`portfolio-${width}x${height}.png`), fullPage:true });
  await context.close();
}

for (const [width,height] of [[390,844],[1366,768]]) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'reduce' });
  const page = await context.newPage();
  await page.goto(url,{waitUntil:'networkidle'});
  const hidden = await page.evaluate(()=>[...document.querySelectorAll('[data-case-chapter]')].some(el=>getComputedStyle(el).opacity==='0'||getComputedStyle(el).visibility==='hidden'));
  if (hidden) failures.push(`${width}x${height}: reduced-motion hides case content`);
  await context.close();
}
await browser.close();

if (failures.length) {
  console.error('PORTFOLIO VISUAL QA FAILED'); failures.forEach(x=>console.error(`- ${x}`));
  console.log(`::error title=Portfolio visual QA::${failures.join(' | ').replaceAll('%','%25').replaceAll('\r','%0D').replaceAll('\n','%0A')}`);
  process.exit(1);
}
console.log(`PORTFOLIO VISUAL QA PASSED: ${viewports.length} breakpoints, 3 distinct authored chapters, proof dominance, geometry/touch/collision checks, keyboard and reduced-motion.`);
