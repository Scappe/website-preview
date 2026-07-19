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

if (!fs.existsSync(path.join(output, 'index.html'))) {
  throw new Error('dist/index.html was not created.');
}

if (!fs.existsSync(path.join(output, 'assets', 'axante-logo.svg'))) {
  throw new Error('Axante logo asset was not published.');
}

console.log('Published real website files and local assets to dist/.');
