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
const officialLogo = 'https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png';
const realProjectImages = [
  'https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg',
  'https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg',
  'https://www.axante.it/wp-content/uploads/2021/08/copertina-sito-carabetta.jpg'
];

if (!home.includes(officialLogo)) throw new Error('The official Axante logo is missing from the homepage.');
for (const image of realProjectImages) {
  if (!home.includes(image)) throw new Error(`Missing real project image: ${image}`);
}

if (!fs.existsSync(path.join(output, 'home-v4.css'))) throw new Error('home-v4.css was not published.');
if (!fs.existsSync(path.join(output, 'home-v4.js'))) throw new Error('home-v4.js was not published.');

console.log('Published Axante v4 with official logo and real WordPress imagery preserved.');
