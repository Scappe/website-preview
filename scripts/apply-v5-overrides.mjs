import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const replacements = new Map([
  ['https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png', '/assets/media/axante-logo.png'],
  ['https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg', '/assets/media/casarossa.jpg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg', '/assets/media/unicart.jpg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/copertina-sito-carabetta.jpg', '/assets/media/carabetta.jpg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/carabetta-logo.png', '/assets/media/carabetta-logo.png'],
  ['https://www.axante.it/wp-content/uploads/2021/08/weblab.jpg', '/assets/media/weblab.jpg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/tda.jpg', '/assets/media/tda.jpg']
]);

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!entry.isFile() || entry.name !== 'index.html') continue;

    let html = fs.readFileSync(fullPath, 'utf8');
    for (const [remote, local] of replacements) html = html.split(remote).join(local);

    html = html.replace('width=device-width,initial-scale=1"', 'width=device-width,initial-scale=1,viewport-fit=cover"');
    html = html.replaceAll('class="case-media clip-reveal"', 'class="case-media"');
    html = html.replaceAll('<div class="page-transition" aria-hidden="true"></div>', '<div class="page-transition" aria-hidden="true"><span>AXANTE</span></div>');
    html = html.replace(/(<img[^>]+src="\/assets\/media\/axante-logo\.png"[^>]*?)\sheight="[^"]+"/g, '$1');
    html = html.replace(/(<img[^>]+src="\/assets\/media\/(?:casarossa|unicart|carabetta|weblab|tda)\.jpg"[^>]*)(>)/g, (match, start, end) => start.includes('decoding=') ? match : `${start} decoding="async"${end}`);
    html = html.replace('/portfolio-v5.css"', '/portfolio-v5.css?v=6.0"');
    html = html.replace('/home-v5.css"', '/home-v5.css?v=6.0"');
    html = html.replace('/home-v5.js"', '/home-v5.js?v=6.0"');

    const isHome = fullPath === path.join(site, 'index.html');
    const isPortfolio = fullPath === path.join(site, 'portfolio', 'index.html');
    if (!isHome && !isPortfolio) {
      if (!html.includes('/enhance-v5.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/enhance-v5.css?v=6.0"></head>');
      if (!html.includes('/enhance-v5.js')) html = html.replace('</body>', '<script src="/enhance-v5.js?v=6.0" defer></script></body>');
      html = html.replace('class="page-hero"', 'class="page-hero" data-ghost="AXANTE"');
    }

    if (!html.includes('/fixes-v6.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/fixes-v6.css?v=6.0"></head>');
    if (!html.includes('/fixes-v6.js')) html = html.replace('</body>', '<script src="/fixes-v6.js?v=6.0" defer></script></body>');

    fs.writeFileSync(fullPath, html);
  }
}

walk(site);
console.log('Applied Axante v6 local assets, repairs, mobile effects and cache-busting.');
