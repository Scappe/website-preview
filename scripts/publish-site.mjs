import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'site');
const output = path.join(root, 'dist');

if (!fs.existsSync(path.join(source, 'index.html'))) {
  throw new Error('site/index.html is missing.');
}

fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, { recursive: true });

if (!fs.existsSync(path.join(output, 'index.html'))) {
  throw new Error('dist/index.html was not created.');
}

console.log('Published real website files from site/ to dist/.');
