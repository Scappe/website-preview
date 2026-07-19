import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'site');
const sharedAssets = path.join(root, 'assets');
const output = path.join(root, 'dist');

if (!fs.existsSync(path.join(source, 'index.html'))) {
  throw new Error('site/index.html is missing.');
}

fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, { recursive: true });

if (fs.existsSync(sharedAssets)) {
  fs.mkdirSync(path.join(output, 'assets'), { recursive: true });
  fs.cpSync(sharedAssets, path.join(output, 'assets'), { recursive: true });
}

const home = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
const portfolio = fs.readFileSync(path.join(output, 'portfolio', 'index.html'), 'utf8');
const requiredHomeAssets = [
  '/assets/media/axante-logo.png',
  '/assets/media/casarossa.jpg',
  '/assets/media/unicart.jpg',
  '/assets/media/carabetta.jpg',
  '/home-v5.css?v=6.2',
  '/home-v5.js?v=6.2',
  '/fixes-v6.css?v=6.2',
  '/fixes-v6.js?v=6.2'
];

for (const asset of requiredHomeAssets) {
  if (!home.includes(asset)) throw new Error(`Homepage is missing required v6.2 asset: ${asset}`);
}

if (!portfolio.includes('/portfolio-mobile-performance.css?v=6.2')) {
  throw new Error('Portfolio is missing the mobile performance layer.');
}

const requiredFiles = [
  'home-v5.css',
  'home-v5.js',
  'portfolio-v5.css',
  'portfolio-mobile-performance.css',
  'fixes-v6.css',
  'fixes-v6.js',
  'assets/media/axante-logo.png',
  'assets/media/casarossa.jpg',
  'assets/media/unicart.jpg',
  'assets/media/carabetta.jpg',
  'assets/media/weblab.jpg',
  'assets/media/tda.jpg'
];

for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(output, relative))) throw new Error(`Published file is missing: ${relative}`);
}

console.log('Published Axante v6.2 with native mobile portfolio scrolling and strict validation.');
