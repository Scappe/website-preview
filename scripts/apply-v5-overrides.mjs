import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const socialImage = 'https://website-preview-murex.vercel.app/assets/media/axante-share-v1.png';
const socialAlt = 'Axante — Il digitale che porta risultati';
const replacements = new Map([
  ['https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png', '/assets/media/axante-logo.png'],
  ['https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg', '/assets/media/casarossa.jpg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg', '/assets/media/unicart.jpg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/copertina-sito-carabetta.jpg', '/assets/media/carabetta.jpg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/carabetta-logo.png', '/assets/media/carabetta-logo.png'],
  ['https://www.axante.it/wp-content/uploads/2021/08/weblab.jpg', '/assets/media/weblab.jpg'],
  ['https://www.axante.it/wp-content/uploads/2021/08/tda.jpg', '/assets/media/tda.jpg']
]);

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function extract(html, pattern, fallback = '') {
  return html.match(pattern)?.[1]?.trim() || fallback;
}

function applySocialMetadata(html) {
  const title = extract(html, /<title>([^<]+)<\/title>/i, 'Axante | Il digitale che porta risultati');
  const description = extract(html, /<meta\s+name="description"\s+content="([^"]*)"/i, 'Strategia, design e tecnologia coordinate da un unico partner.');
  const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i, 'https://www.axante.it/');

  html = html.replace(/<meta\s+(?:property|name)="(?:og:(?:type|locale|title|description|url|image(?::(?:url|secure_url|type|width|height|alt))?)|twitter:(?:card|title|description|image))"[^>]*>\s*/gi, '');

  const socialTags = [
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="it_IT">',
    `<meta property="og:title" content="${escapeAttribute(title)}">`,
    `<meta property="og:description" content="${escapeAttribute(description)}">`,
    `<meta property="og:url" content="${escapeAttribute(canonical)}">`,
    `<meta property="og:image" content="${socialImage}">`,
    `<meta property="og:image:url" content="${socialImage}">`,
    `<meta property="og:image:secure_url" content="${socialImage}">`,
    '<meta property="og:image:type" content="image/png">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${escapeAttribute(socialAlt)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeAttribute(title)}">`,
    `<meta name="twitter:description" content="${escapeAttribute(description)}">`,
    `<meta name="twitter:image" content="${socialImage}">`
  ].join('');

  return html.replace('</head>', `${socialTags}</head>`);
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;

    let html = fs.readFileSync(fullPath, 'utf8');
    for (const [remote, local] of replacements) {
      html = html.split(`src="${remote}"`).join(`src="${local}"`);
    }

    html = html.replace('width=device-width,initial-scale=1"', 'width=device-width,initial-scale=1,viewport-fit=cover"');
    html = html.replaceAll('class="case-media clip-reveal"', 'class="case-media"');
    html = html.replaceAll('<div class="page-transition" aria-hidden="true"></div>', '<div class="page-transition" aria-hidden="true"><span>AXANTE</span></div>');
    html = html.replace(/(<img[^>]+src="\/assets\/media\/axante-logo\.png"[^>]*?)\sheight="[^"]+"/g, '$1');
    html = html.replace(/(<img[^>]+src="\/assets\/media\/(?:casarossa|unicart|carabetta|weblab|tda)\.jpg"[^>]*)(>)/g, (match, start, end) => start.includes('decoding=') ? match : `${start} decoding="async"${end}`);
    html = html.replace('src="/assets/media/casarossa.jpg" width="1400" height="1000" loading="lazy"', 'src="/assets/media/casarossa.jpg" width="1400" height="1000" loading="eager" fetchpriority="high"');
    html = html.replace(/\/portfolio-v5\.css(?:\?v=[^"]+)?"/, '/portfolio-v5.css?v=6.3"');
    html = html.replace(/\/home-v5\.css(?:\?v=[^"]+)?"/, '/home-v5.css?v=6.3"');
    html = html.replace(/\/home-v5\.js(?:\?v=[^"]+)?"/, '/home-v5.js?v=6.3"');

    const isHome = fullPath === path.join(site, 'index.html');
    const isPortfolio = fullPath === path.join(site, 'portfolio', 'index.html');
    const isStandalone404 = fullPath === path.join(site, '404.html');
    if (!isHome && !isPortfolio && !isStandalone404) {
      if (!html.includes('/enhance-v5.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/enhance-v5.css?v=6.3"></head>');
      if (!html.includes('/enhance-v5.js')) html = html.replace('</body>', '<script src="/enhance-v5.js?v=6.3" defer></script></body>');
      html = html.replace('class="page-hero"', 'class="page-hero" data-ghost="AXANTE"');
    }

    if (isPortfolio && !html.includes('/portfolio-mobile-performance.css')) {
      html = html.replace('</head>', '<link rel="stylesheet" href="/portfolio-mobile-performance.css?v=6.3"></head>');
    }

    if (!html.includes('/fixes-v6.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/fixes-v6.css?v=6.3"></head>');
    if (!html.includes('/fixes-v6.js')) html = html.replace('</body>', '<script src="/fixes-v6.js?v=6.3" defer></script></body>');

    html = applySocialMetadata(html);
    fs.writeFileSync(fullPath, html);
  }
}

walk(site);
console.log('Applied Axante v6.3 local assets, stable mobile behavior and branded social previews.');
