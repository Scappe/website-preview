import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'dist');
const qaOutput = path.join(process.cwd(), 'qa-screenshots');
const failures = [];
const routes = ['/', '/servizi/', '/portfolio/', '/chi-siamo/', '/contatti/', '/lavora-con-noi/'];
const budgets = {
  stylesheetBytesMax: 180000,
  scriptBytesMax: 140000,
  stylesheetCountMax: 16,
  scriptCountMax: 16
};

function routeFile(route) {
  return route === '/'
    ? path.join(root, 'index.html')
    : path.join(root, route.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function localAssetFile(url) {
  const clean = url.split('?')[0].split('#')[0];
  if (!clean.startsWith('/') || clean.startsWith('//')) return null;
  return path.join(root, clean.slice(1));
}

function bytesFor(url) {
  const file = localAssetFile(url);
  return file && fs.existsSync(file) ? fs.statSync(file).size : 0;
}

const evidencePath = path.join(root, 'field-cwv-evidence.json');
if (!fs.existsSync(evidencePath)) {
  failures.push('field-cwv-evidence.json missing');
} else {
  try {
    const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
    if (evidence.kind !== 'FIELD — EVIDENCE PIPELINE STATUS') failures.push('field evidence kind is not explicit');
    if (evidence.fieldVerdict !== 'INSUFFICIENT SAMPLE') failures.push('build-time field report must not claim field compliance');
    if (evidence.fieldAndLabSeparated !== true) failures.push('field and lab evidence are not explicitly separated');
    if (evidence.thresholds?.percentile !== 75 || evidence.thresholds?.LCP_ms_max !== 2500 || evidence.thresholds?.INP_ms_max !== 200 || evidence.thresholds?.CLS_max !== 0.1) failures.push('field CWV thresholds/p75 contract changed');
    for (const route of routes) if (!evidence.routes?.includes(route)) failures.push(`field evidence missing route ${route}`);
    for (const key of ['pii', 'formContent', 'fingerprinting', 'sessionReplay']) if (evidence.privacy?.[key] !== false) failures.push(`field privacy contract violated: ${key}`);
    if (evidence.publicCrux?.representativeOfCurrentFrontend !== false && process.env.AXANTE_PRODUCTION_FRONTEND_VERIFIED !== '1') failures.push('public CrUX cannot represent the new frontend before production cutover is explicitly verified');
    if (!['ACTIVE', 'READY_CONFIG_REQUIRED'].includes(evidence.instrumentationStatus)) failures.push(`unexpected field instrumentation status: ${evidence.instrumentationStatus}`);

    for (const route of routes) {
      const file = routeFile(route);
      if (!fs.existsSync(file)) { failures.push(`field route missing from build: ${route}`); continue; }
      const html = fs.readFileSync(file, 'utf8');
      const markers = (html.match(/data-axante-field-cwv="vercel-speed-insights"/g) || []).length;
      if (evidence.instrumentationStatus === 'ACTIVE' && markers < 2) failures.push(`${route}: active field instrumentation marker/script missing`);
      if (evidence.instrumentationStatus === 'READY_CONFIG_REQUIRED' && markers !== 0) failures.push(`${route}: field instrumentation present without provider config`);
      if (/data-axante-field-cwv=["'][^"']+["'][^>]+src=["']https?:\/\//i.test(html)) failures.push(`${route}: field instrumentation must not hotlink a third-party runtime script`);
    }
  } catch (error) {
    failures.push(`field-cwv-evidence.json invalid: ${error.message}`);
  }
}

const lab = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  kind: 'LAB — QA/PERF DIAGNOSTIC',
  fieldComplianceClaim: false,
  budgets,
  routes: []
};

for (const route of routes) {
  const file = routeFile(route);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const stylesheets = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map(match => match[1]);
  const scripts = [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(match => match[1]);
  const externalStyles = stylesheets.filter(url => /^https?:\/\//i.test(url));
  const externalScripts = scripts.filter(url => /^https?:\/\//i.test(url));
  const stylesheetBytes = stylesheets.reduce((sum, url) => sum + bytesFor(url), 0);
  const scriptBytes = scripts.reduce((sum, url) => sum + bytesFor(url), 0);
  const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || '';
  const firstMainImage = main.match(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/i)?.[1] || null;
  const sizedImages = [...html.matchAll(/<img\b[^>]*>/gi)].every(match => /\bwidth=["']\d+["']/i.test(match[0]) && /\bheight=["']\d+["']/i.test(match[0]));

  if (externalStyles.length) failures.push(`${route}: external render-blocking stylesheet introduced: ${externalStyles.join(', ')}`);
  if (externalScripts.length) failures.push(`${route}: external runtime script introduced: ${externalScripts.join(', ')}`);
  if (stylesheetBytes > budgets.stylesheetBytesMax) failures.push(`${route}: stylesheet budget exceeded (${stylesheetBytes} > ${budgets.stylesheetBytesMax})`);
  if (scriptBytes > budgets.scriptBytesMax) failures.push(`${route}: script budget exceeded (${scriptBytes} > ${budgets.scriptBytesMax})`);
  if (stylesheets.length > budgets.stylesheetCountMax) failures.push(`${route}: stylesheet count budget exceeded (${stylesheets.length})`);
  if (scripts.length > budgets.scriptCountMax) failures.push(`${route}: script count budget exceeded (${scripts.length})`);
  if (!sizedImages) failures.push(`${route}: CLS guard failed because an image lacks explicit width/height`);

  lab.routes.push({
    route,
    stylesheetCount: stylesheets.length,
    stylesheetBytes,
    scriptCount: scripts.length,
    scriptBytes,
    externalRenderBlockingStylesheets: externalStyles.length,
    externalRuntimeScripts: externalScripts.length,
    imageDimensionGuard: sizedImages ? 'PASS' : 'FAIL',
    lcpCandidateDiagnostic: firstMainImage,
    note: 'Static/lab guardrail only; this is not an LCP, INP or CLS field measurement.'
  });
}

fs.mkdirSync(qaOutput, { recursive: true });
fs.writeFileSync(path.join(qaOutput, 'page-experience-lab.json'), `${JSON.stringify(lab, null, 2)}\n`);

if (failures.length) {
  console.error('\nPAGE EXPERIENCE QA FAILED');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`PAGE EXPERIENCE QA PASSED: ${routes.length} routes; field evidence remains explicitly sample-gated and lab budgets are separate from field CWV.`);
