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

const replacements = new Map([
  ['https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png', '/assets/axante-logo.svg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/copertina-sito-carabetta.jpg', '/assets/project-carabetta.svg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg', '/assets/project-unicart.svg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/weblab.jpg', '/assets/project-weblab.svg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/tda.jpg', '/assets/project-tda.svg']
]);

function localizeHtml(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      localizeHtml(fullPath);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    let html = fs.readFileSync(fullPath, 'utf8');
    for (const [remote, local] of replacements) html = html.split(remote).join(local);
    fs.writeFileSync(fullPath, html);
  }
}
localizeHtml(output);

if (!fs.existsSync(path.join(output, 'index.html'))) {
  throw new Error('dist/index.html was not created.');
}

for (const required of ['axante-logo.svg','project-carabetta.svg','project-unicart.svg','project-weblab.svg','project-tda.svg']) {
  if (!fs.existsSync(path.join(output, 'assets', required))) throw new Error(`Missing published asset: ${required}`);
}

console.log('Published real website files with local logo and project assets.');
