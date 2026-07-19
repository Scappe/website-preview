import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const skip = new Set([
  path.join(site, 'index.html'),
  path.join(site, 'portfolio', 'index.html')
]);

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!entry.isFile() || entry.name !== 'index.html' || skip.has(fullPath)) continue;
    let html = fs.readFileSync(fullPath, 'utf8');
    if (!html.includes('/enhance-v5.css')) {
      html = html.replace('</head>', '<link rel="stylesheet" href="/enhance-v5.css"></head>');
    }
    if (!html.includes('/enhance-v5.js')) {
      html = html.replace('</body>', '<script src="/enhance-v5.js" defer></script></body>');
    }
    html = html.replace('class="page-hero"', 'class="page-hero" data-ghost="AXANTE"');
    fs.writeFileSync(fullPath, html);
  }
}

walk(site);

const homeJs = path.join(site, 'home-v5.js');
if (fs.existsSync(homeJs)) {
  let js = fs.readFileSync(homeJs, 'utf8');
  js = js.replace(
`      node.addEventListener('click', event => {
        if (!node.classList.contains('active')) {
          event.preventDefault();
          activate(node);
        }
      });`,
`      node.addEventListener('pointerdown', () => activate(node));`
  );
  fs.writeFileSync(homeJs, js);
}

console.log('Applied Axante v5 visual layer and interaction safeguards.');
