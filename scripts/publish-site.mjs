import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'site');
const sharedAssets = path.join(root, 'assets');
const output = path.join(root, 'dist');
const qaOutput = path.join(root, 'qa-screenshots');
const socialImageUrl = 'https://website-preview-murex.vercel.app/assets/media/axante-share-v1.png';
const canonicalLogo = '/assets/media/axante-logo.png';
const foundationMarker = 'data-global-component-version="13.1"';
const fieldRoutes = ['/', '/servizi/', '/portfolio/', '/chi-siamo/', '/contatti/', '/lavora-con-noi/'];

function parseVercelObservabilityConfig() {
  const raw = process.env.VERCEL_OBSERVABILITY_CLIENT_CONFIG || '';
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch { return null; }
}

function routeFile(route) {
  return route === '/'
    ? path.join(output, 'index.html')
    : path.join(output, route.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function installFieldCwvInstrumentation() {
  const config = parseVercelObservabilityConfig();
  const speedInsights = config?.speedInsights || null;
  const scriptSrc = typeof speedInsights?.scriptSrc === 'string' ? speedInsights.scriptSrc : '';
  const endpoint = typeof speedInsights?.endpoint === 'string' ? speedInsights.endpoint : '';
  const sameOriginScript = scriptSrc.startsWith('/') && !scriptSrc.startsWith('//');
  const instrumentationActive = Boolean(sameOriginScript);
  const marker = 'data-axante-field-cwv="vercel-speed-insights"';

  if (instrumentationActive) {
    const bootstrap = `<script ${marker}>window.si=window.si||function(){(window.siq=window.siq||[]).push(arguments);};</script><script defer ${marker} src="${scriptSrc}"></script>`;
    for (const route of fieldRoutes) {
      const file = routeFile(route);
      if (!fs.existsSync(file)) continue;
      const html = fs.readFileSync(file, 'utf8');
      if (html.includes(marker)) continue;
      if (!html.includes('</body>')) throw new Error(`${route}: unable to inject field CWV instrumentation before </body>`);
      fs.writeFileSync(file, html.replace('</body>', `${bootstrap}</body>`));
    }
  }

  const evidence = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    kind: 'FIELD — EVIDENCE PIPELINE STATUS',
    source: 'Vercel Speed Insights',
    instrumentationStatus: instrumentationActive ? 'ACTIVE' : 'READY_CONFIG_REQUIRED',
    fieldVerdict: 'INSUFFICIENT SAMPLE',
    fieldAndLabSeparated: true,
    thresholds: {
      percentile: 75,
      LCP_ms_max: 2500,
      INP_ms_max: 200,
      CLS_max: 0.1
    },
    routes: fieldRoutes,
    attribution: {
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'build',
      gitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || null,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || null,
      routeAndDeviceAvailableInProvider: instrumentationActive
    },
    publicCrux: {
      productionOrigin: 'https://www.axante.it',
      representativeOfCurrentFrontend: process.env.AXANTE_PRODUCTION_FRONTEND_VERIFIED === '1',
      status: process.env.AXANTE_PRODUCTION_FRONTEND_VERIFIED === '1'
        ? 'DISCOVERY REQUIRED'
        : 'NOT REPRESENTATIVE OF CURRENT FRONTEND'
    },
    privacy: {
      pii: false,
      formContent: false,
      fingerprinting: false,
      sessionReplay: false
    },
    provider: {
      sameOriginScript: instrumentationActive,
      endpointConfigured: Boolean(endpoint)
    },
    note: 'This build status never claims field CWV compliance. p75 promotion requires sufficient real-user field evidence; otherwise the verdict remains INSUFFICIENT SAMPLE.'
  };

  fs.mkdirSync(qaOutput, { recursive: true });
  const serialized = `${JSON.stringify(evidence, null, 2)}\n`;
  fs.writeFileSync(path.join(output, 'field-cwv-evidence.json'), serialized);
  fs.writeFileSync(path.join(qaOutput, 'field-cwv-evidence.json'), serialized);
  return evidence;
}

if (!fs.existsSync(path.join(source, 'index.html'))) throw new Error('site/index.html is missing.');
fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, { recursive: true });
if (fs.existsSync(sharedAssets)) {
  fs.mkdirSync(path.join(output, 'assets'), { recursive: true });
  fs.cpSync(sharedAssets, path.join(output, 'assets'), { recursive: true });
}

const fieldCwvEvidence = installFieldCwvInstrumentation();

const home = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
const portfolio = fs.readFileSync(path.join(output, 'portfolio', 'index.html'), 'utf8');
const services = fs.readFileSync(path.join(output, 'servizi', 'index.html'), 'utf8');
const requiredHomeAssets = [canonicalLogo,'/assets/media/casarossa.jpg','/assets/media/unicart.jpg','/assets/media/carabetta.jpg','/home-v5.css?v=6.3','/home-v5.js?v=6.3','/fixes-v6.css?v=6.3','/fixes-v6.js?v=6.3','/apple-design.css?v=1.0','/apple-design.js?v=1.0',socialImageUrl,'<meta property="og:image:width" content="1200">','<meta property="og:image:height" content="630">',foundationMarker,'/foundation-mobile-hotfix.css?v=13.1'];
for (const asset of requiredHomeAssets) if (!home.includes(asset)) throw new Error(`Homepage is missing required foundation/current asset or metadata: ${asset}`);

if (!portfolio.includes('/portfolio-mobile-performance.css?v=6.3')) throw new Error('Portfolio is missing the mobile performance layer.');
if (!portfolio.includes('/apple-design.css?v=1.0') || !portfolio.includes('/apple-design.js?v=1.0')) throw new Error('Portfolio is missing the Apple fluid interaction layer.');
if (!portfolio.includes(socialImageUrl)) throw new Error('Portfolio is missing the branded Axante social preview.');
if (!portfolio.includes(canonicalLogo) || !portfolio.includes(foundationMarker)) throw new Error('Portfolio is missing canonical foundation globals.');

for (const token of ['/servizi-premium.css?v=17.0','/servizi-premium.js?v=17.0','Partiamo dal problema','problem-field','data-service-proof','Output osservabile','system-orchestra','capability-index','casarossa-store.jpg','casarossa-product.jpg','unicart-catalog.jpg','unicart-auctions.jpg','carabetta.jpg','carabetta-logo.png',foundationMarker]) {
  if (!services.includes(token)) throw new Error(`Services decision journey missing published token: ${token}`);
}

const requiredFiles = ['home-v5.css','home-v5.js','portfolio-v5.css','portfolio-mobile-performance.css','fixes-v6.css','fixes-v6.js','apple-design.css','apple-design.js','foundation-mobile-hotfix.css','servizi-premium.css','servizi-premium.js','field-cwv-evidence.json','assets/asset-manifest.json','assets/media/axante-logo.png','assets/media/axante-share-v1.png','assets/media/casarossa.jpg','assets/media/casarossa-store.jpg','assets/media/casarossa-product.jpg','assets/media/unicart.jpg','assets/media/unicart-catalog.jpg','assets/media/unicart-auctions.jpg','assets/media/carabetta.jpg','assets/media/carabetta-logo.png','assets/media/carabetta-category.jpg','assets/media/carabetta-new.jpg','assets/media/weblab.jpg','assets/media/tda.jpg'];
for (const relative of requiredFiles) if (!fs.existsSync(path.join(output, relative))) throw new Error(`Published file is missing: ${relative}`);

const manifest = JSON.parse(fs.readFileSync(path.join(output, 'assets', 'asset-manifest.json'), 'utf8'));
if (manifest.version !== '13.1' || manifest.canonicalLogo !== canonicalLogo || !Array.isArray(manifest.assets)) throw new Error('Asset manifest is missing foundation v13.1 metadata.');

console.log(`Published Axante foundation v13.1 + Services Decision Journey v17 with ${manifest.assets.length} catalogued assets. Field CWV pipeline: ${fieldCwvEvidence.instrumentationStatus}; verdict: ${fieldCwvEvidence.fieldVerdict}.`);
