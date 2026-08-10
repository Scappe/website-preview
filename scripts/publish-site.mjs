import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'site');
const sharedAssets = path.join(root, 'assets');
const output = path.join(root, 'dist');
const socialImageUrl = 'https://website-preview-murex.vercel.app/assets/media/axante-share-v1.png';
const canonicalLogo = '/assets/media/axante-logo.png';
const foundationMarker = 'data-global-component-version="13.1"';

if (!fs.existsSync(path.join(source, 'index.html'))) throw new Error('site/index.html is missing.');
fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, { recursive: true });
if (fs.existsSync(sharedAssets)) {
  fs.mkdirSync(path.join(output, 'assets'), { recursive: true });
  fs.cpSync(sharedAssets, path.join(output, 'assets'), { recursive: true });
}

const home = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
const portfolio = fs.readFileSync(path.join(output, 'portfolio', 'index.html'), 'utf8');
const services = fs.readFileSync(path.join(output, 'servizi', 'index.html'), 'utf8');
const requiredHomeAssets = [canonicalLogo,'/assets/media/casarossa.jpg','/assets/media/unicart.jpg','/assets/media/carabetta.jpg','/home-v5.css?v=6.3','/home-v5.js?v=6.3','/fixes-v6.css?v=6.3','/fixes-v6.js?v=6.3','/apple-design.css?v=1.0','/apple-design.js?v=1.0',socialImageUrl,'<meta property="og:image:width" content="1200">','<meta property="og:image:height" content="630">',foundationMarker,'/foundation-mobile-hotfix.css?v=13.1'];
for (const asset of requiredHomeAssets) if (!home.includes(asset)) throw new Error(`Homepage is missing required foundation/current asset or metadata: ${asset}`);

if (!portfolio.includes('/portfolio-mobile-performance.css?v=6.3')) throw new Error('Portfolio is missing the mobile performance layer.');
if (!portfolio.includes('/apple-design.css?v=1.0') || !portfolio.includes('/apple-design.js?v=1.0')) throw new Error('Portfolio is missing the Apple fluid interaction layer.');
if (!portfolio.includes(socialImageUrl)) throw new Error('Portfolio is missing the branded Axante social preview.');
if (!portfolio.includes(canonicalLogo) || !portfolio.includes(foundationMarker)) throw new Error('Portfolio is missing canonical foundation globals.');

for (const token of ['/servizi-premium.css?v=16.0','/servizi-premium.js?v=16.0','Service Proof Spine','casarossa-store.jpg','casarossa-product.jpg','unicart-catalog.jpg','unicart-auctions.jpg','carabetta-category.jpg','carabetta-new.jpg',foundationMarker]) {
  if (!services.includes(token)) throw new Error(`Services proof spine missing published token: ${token}`);
}

const requiredFiles = ['home-v5.css','home-v5.js','portfolio-v5.css','portfolio-mobile-performance.css','fixes-v6.css','fixes-v6.js','apple-design.css','apple-design.js','foundation-mobile-hotfix.css','servizi-premium.css','servizi-premium.js','assets/asset-manifest.json','assets/media/axante-logo.png','assets/media/axante-share-v1.png','assets/media/casarossa.jpg','assets/media/casarossa-store.jpg','assets/media/casarossa-product.jpg','assets/media/unicart.jpg','assets/media/unicart-catalog.jpg','assets/media/unicart-auctions.jpg','assets/media/carabetta.jpg','assets/media/carabetta-category.jpg','assets/media/carabetta-new.jpg','assets/media/weblab.jpg','assets/media/tda.jpg'];
for (const relative of requiredFiles) if (!fs.existsSync(path.join(output, relative))) throw new Error(`Published file is missing: ${relative}`);

const manifest = JSON.parse(fs.readFileSync(path.join(output, 'assets', 'asset-manifest.json'), 'utf8'));
if (manifest.version !== '13.1' || manifest.canonicalLogo !== canonicalLogo || !Array.isArray(manifest.assets)) throw new Error('Asset manifest is missing foundation v13.1 metadata.');

console.log(`Published Axante foundation v13.1 + Service Proof Spine v16 with ${manifest.assets.length} catalogued assets.`);