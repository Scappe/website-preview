import fs from 'node:fs';
import path from 'node:path';

const debugPath = path.join(process.cwd(), 'dist', 'build-debug.json');

if (!fs.existsSync(debugPath)) {
  throw new Error('Missing dist/build-debug.json after build.');
}

const result = JSON.parse(fs.readFileSync(debugPath, 'utf8'));

if (!result.ok) {
  console.error('Axante v2 extraction failed:', result);
  process.exit(1);
}

if (!fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))) {
  throw new Error('Missing dist/index.html after successful extraction.');
}

console.log('Axante v2 extraction verified:', result);
