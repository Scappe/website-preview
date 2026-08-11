import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'dist');
const productionOrigin = 'https://www.axante.it';
const failures = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes:true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))?.[1]?.trim() || '';
}
function first(html, regex) { return html.match(regex)?.[1]?.trim() || ''; }
function normalizeCanonical(value) {
  try {
    const url = new URL(value);
    let pathname = url.pathname.replace(/\/index\.html$/i, '/');
    if (pathname !== '/' && !pathname.endsWith('/')) pathname += '/';
    return `${url.origin}${pathname}`;
  } catch { return ''; }
}
function routeForFile(file) {
  const relative = path.relative(root, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'/index.html'.length)}/`;
  return null;
}
function routeToFile(route) {
  if (route === '/') return path.join(root, 'index.html');
  return path.join(root, route.replace(/^\//,'').replace(/\/$/,''), 'index.html');
}

const htmlFiles = walk(root).filter(file => file.endsWith('.html'));
const pages = [];
for (const file of htmlFiles) {
  const route = routeForFile(file);
  if (!route || route === '/404.html') continue;
  const html = fs.readFileSync(file, 'utf8');
  const title = first(html, /<title>([\s\S]*?)<\/title>/i).replace(/\s+/g,' ');
  const descriptionTag = html.match(/<meta\b[^>]*name=["']description["'][^>]*>/i)?.[0] || '';
  const robotsTag = html.match(/<meta\b[^>]*name=["']robots["'][^>]*>/i)?.[0] || '';
  const canonicalTag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || '';
  const ogUrlTag = html.match(/<meta\b[^>]*property=["']og:url["'][^>]*>/i)?.[0] || '';
  const ogTitleTag = html.match(/<meta\b[^>]*property=["']og:title["'][^>]*>/i)?.[0] || '';
  const ogDescriptionTag = html.match(/<meta\b[^>]*property=["']og:description["'][^>]*>/i)?.[0] || '';
  const description = attr(descriptionTag,'content');
  const robots = attr(robotsTag,'content').toLowerCase();
  const canonical = attr(canonicalTag,'href');
  const ogUrl = attr(ogUrlTag,'content');
  const ogTitle = attr(ogTitleTag,'content');
  const ogDescription = attr(ogDescriptionTag,'content');
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const indexable = !robots.includes('noindex');

  if (!title) failures.push(`${route}: missing title`);
  if (!description) failures.push(`${route}: missing meta description`);
  if (h1s.length !== 1) failures.push(`${route}: expected exactly one H1, found ${h1s.length}`);
  if (indexable) {
    const expected = `${productionOrigin}${route}`;
    if (!canonical) failures.push(`${route}: missing canonical`);
    if (normalizeCanonical(canonical) !== normalizeCanonical(expected)) failures.push(`${route}: canonical not production-equivalent (${canonical || 'missing'})`);
    if (ogUrl && normalizeCanonical(ogUrl) !== normalizeCanonical(canonical)) failures.push(`${route}: og:url differs from canonical`);
  }
  if (ogTitle && ogTitle !== title) failures.push(`${route}: og:title differs from title`);
  if (ogDescription && ogDescription !== description) failures.push(`${route}: og:description differs from meta description`);

  for (const block of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(block[1]); } catch(error) { failures.push(`${route}: invalid JSON-LD (${error.message})`); }
  }

  pages.push({ route, html, title, description, canonical, indexable });
}

const indexablePages = pages.filter(page => page.indexable);
for (const field of ['title','description']) {
  const groups = new Map();
  for (const page of indexablePages) {
    const value = page[field];
    if (!value) continue;
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(page.route);
  }
  for (const [value,routes] of groups) if (routes.length > 1) failures.push(`Duplicate ${field} across ${routes.join(', ')}: ${value}`);
}

const sitemapPath = path.join(root, 'sitemap.xml');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath,'utf8') : '';
if (!sitemap) failures.push('sitemap.xml missing');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(match => normalizeCanonical(match[1]));
const duplicateSitemapUrls = sitemapUrls.filter((url,index) => sitemapUrls.indexOf(url) !== index);
if (duplicateSitemapUrls.length) failures.push(`sitemap.xml contains duplicate URLs: ${[...new Set(duplicateSitemapUrls)].join(', ')}`);
for (const page of indexablePages) {
  const canonical = normalizeCanonical(page.canonical);
  if (canonical && !sitemapUrls.includes(canonical)) failures.push(`${page.route}: indexable canonical omitted from sitemap`);
}
for (const sitemapUrl of sitemapUrls) {
  let url;
  try { url = new URL(sitemapUrl); } catch { failures.push(`sitemap.xml invalid URL: ${sitemapUrl}`); continue; }
  if (url.origin !== productionOrigin) failures.push(`sitemap.xml non-production URL: ${sitemapUrl}`);
  const localFile = routeToFile(url.pathname);
  if (!fs.existsSync(localFile)) failures.push(`sitemap.xml URL has no built route: ${sitemapUrl}`);
}

const robotsPath = path.join(root, 'robots.txt');
const robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath,'utf8') : '';
if (!robots) failures.push('robots.txt missing');
if (/disallow:\s*\/$/im.test(robots)) failures.push('robots.txt blocks the whole production site');
const sitemapDirective = robots.match(/^sitemap:\s*(\S+)/im)?.[1] || '';
if (!sitemapDirective) failures.push('robots.txt missing Sitemap directive');
else if (normalizeCanonical(sitemapDirective) !== normalizeCanonical(`${productionOrigin}/sitemap.xml`)) failures.push(`robots.txt sitemap directive is not production sitemap: ${sitemapDirective}`);

const incoming = new Map(indexablePages.map(page => [page.route, 0]));
for (const page of pages) {
  for (const match of page.html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|javascript:|#)/i.test(href)) continue;
    let pathname;
    try { pathname = new URL(href, productionOrigin).pathname; } catch { continue; }
    if (/\.[a-z0-9]+$/i.test(pathname)) continue;
    if (pathname !== '/' && !pathname.endsWith('/')) pathname += '/';
    const file = routeToFile(pathname);
    if (!fs.existsSync(file)) failures.push(`${page.route}: broken internal page link ${href}`);
    if (incoming.has(pathname) && pathname !== page.route) incoming.set(pathname, incoming.get(pathname) + 1);
  }
}
for (const route of ['/', '/servizi/', '/portfolio/', '/chi-siamo/', '/contatti/']) {
  if (route !== '/' && incoming.has(route) && incoming.get(route) === 0) failures.push(`${route}: critical indexable route is orphaned`);
}

const about = pages.find(page => page.route === '/chi-siamo/');
if (!about) failures.push('/chi-siamo/: missing from built HTML corpus');
else {
  for (const phrase of ['Axante è una squadra','Come lavoriamo','Le persone','Impegni operativi']) if (!about.html.includes(phrase)) failures.push(`/chi-siamo/: essential static content missing: ${phrase}`);
  for (const href of ['/portfolio','/servizi','/contatti']) if (!about.html.includes(`href="${href}"`)) failures.push(`/chi-siamo/: missing descriptive internal path ${href}`);
}

if (failures.length) {
  console.error('\nSEARCH/AI QA FAILED');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`SEARCH/AI QA PASSED: ${indexablePages.length} indexable routes, unique metadata, canonical/sitemap parity, robots, JSON-LD parseability and critical internal-link coverage.`);