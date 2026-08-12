import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const host = process.env.QA_HOST || '127.0.0.1';
const port = Number(process.env.QA_PORT || 4173);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function send(res, status, body = '', headers = {}) {
  res.writeHead(status, { 'cache-control': 'no-store', ...headers });
  res.end(body);
}

function serveVitals(req, res) {
  if (req.method === 'GET') {
    return send(res, 200, JSON.stringify({
      status: 'ACTIVE',
      provider: 'axante-same-origin-rum',
      schemaVersion: 1,
      fieldVerdict: 'INSUFFICIENT SAMPLE'
    }), { 'content-type': 'application/json; charset=utf-8' });
  }
  if (req.method === 'POST') {
    req.resume();
    return req.on('end', () => send(res, 204));
  }
  return send(res, 405, '', { allow: 'GET, POST' });
}

function resolveStaticPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const pathname = decoded.endsWith('/') ? `${decoded}index.html` : decoded;
  const candidate = path.resolve(root, `.${pathname}`);
  if (!candidate.startsWith(`${root}${path.sep}`) && candidate !== root) return null;
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  const htmlCandidate = `${candidate}.html`;
  if (fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) return htmlCandidate;
  return null;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || `${host}:${port}`}`);
  if (url.pathname === '/api/vitals') return serveVitals(req, res);
  if (!['GET', 'HEAD'].includes(req.method || 'GET')) return send(res, 405, '', { allow: 'GET, HEAD' });

  const file = resolveStaticPath(url.pathname);
  if (!file) return send(res, 404, 'Not found', { 'content-type': 'text/plain; charset=utf-8' });

  const headers = { 'content-type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream' };
  res.writeHead(200, headers);
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Axante QA preview server listening on http://${host}:${port}`);
});
