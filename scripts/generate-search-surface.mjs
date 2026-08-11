import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const productionOrigin = 'https://www.axante.it';
const meaningfulLastmod = new Map([
  ['https://www.axante.it/', '2026-07-19'],
  ['https://www.axante.it/servizi/', '2026-07-19'],
  ['https://www.axante.it/portfolio/', '2026-07-19'],
  ['https://www.axante.it/chi-siamo/', '2026-08-11'],
  ['https://www.axante.it/contatti/', '2026-07-19'],
  ['https://www.axante.it/lavora-con-noi/', '2026-07-19']
]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes:true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))?.[1]?.trim() || '';
}
function routeForFile(file) {
  const relative = path.relative(site, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'/index.html'.length)}/`;
  return null;
}
function normalize(value) {
  const url = new URL(value);
  let pathname = url.pathname.replace(/\/index\.html$/i, '/');
  if (pathname !== '/' && !pathname.endsWith('/')) pathname += '/';
  return `${url.origin}${pathname}`;
}

const canonicalPages = [];
for (const file of walk(site).filter(file => file.endsWith('.html'))) {
  const route = routeForFile(file);
  if (!route || route === '/404.html') continue;
  const html = fs.readFileSync(file,'utf8');
  const robotsTag = html.match(/<meta\b[^>]*name=["']robots["'][^>]*>/i)?.[0] || '';
  if (attr(robotsTag,'content').toLowerCase().includes('noindex')) continue;
  const canonicalTag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || '';
  const canonical = attr(canonicalTag,'href');
  if (!canonical) continue;
  let normalized;
  try { normalized = normalize(canonical); } catch { continue; }
  const expected = normalize(`${productionOrigin}${route}`);
  if (normalized === expected) canonicalPages.push(normalized);
}

canonicalPages.sort((a,b) => {
  if (a === `${productionOrigin}/`) return -1;
  if (b === `${productionOrigin}/`) return 1;
  return a.localeCompare(b, 'it');
});

const entries = canonicalPages.map(url => {
  const lastmod = meaningfulLastmod.get(url);
  return `  <url><loc>${url}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
}).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
fs.writeFileSync(path.join(site,'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(site,'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${productionOrigin}/sitemap.xml\n`);

console.log(`Generated canonical search surface from final HTML: ${canonicalPages.length} sitemap URLs; meaningful lastmod preserved.`);