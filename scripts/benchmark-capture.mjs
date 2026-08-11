import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.QA_BASE_URL;
if (!base) throw new Error('QA_BASE_URL is required.');

const out = path.join(process.cwd(), 'qa-screenshots', 'benchmark');
fs.mkdirSync(out, { recursive:true });
const sha = process.env.GITHUB_SHA || 'local';
const targets = [
  { id:'axante-about', url:new URL('chi-siamo/', base).href, required:true },
  { id:'y-vision', url:'https://y-vision.co.kr/', required:false },
  { id:'lacrapule', url:'https://www.lacrapulestudio.com/', required:false }
];
const viewports = [[390,844],[1440,900]];
const results = [];
const browser = await chromium.launch({ headless:true });

for (const target of targets) {
  for (const [width,height] of viewports) {
    const context = await browser.newContext({ viewport:{width,height}, locale:'en-US' });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const record = { target:target.id, url:target.url, width, height, sha, capturedAt:new Date().toISOString(), status:'PENDING' };
    try {
      const response = await page.goto(target.url, { waitUntil:'domcontentloaded', timeout:15000 });
      const status = response?.status() ?? 0;
      if (status >= 400) throw new Error(`HTTP ${status}`);
      await page.waitForTimeout(target.required ? 500 : 1800);
      await page.screenshot({ path:path.join(out,`${target.id}-${width}x${height}.png`), fullPage:true });
      record.status='CAPTURED';
      record.httpStatus=status;
    } catch (error) {
      record.status='BLOCKED BY TARGET';
      record.error=String(error.message || error).split('\n')[0];
      if (target.required) {
        results.push(record);
        await context.close();
        await browser.close();
        fs.writeFileSync(path.join(out,'benchmark-metadata.json'), JSON.stringify({ sha, results }, null, 2));
        throw error;
      }
    }
    results.push(record);
    await context.close();
  }
}

await browser.close();
fs.writeFileSync(path.join(out,'benchmark-metadata.json'), JSON.stringify({ sha, results }, null, 2));
console.log('Benchmark capture harness complete. External targets may report BLOCKED BY TARGET without fabricating evidence.');