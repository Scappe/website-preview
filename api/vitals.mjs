const ROUTES = new Set([
  '/',
  '/servizi/',
  '/portfolio/',
  '/chi-siamo/',
  '/contatti/',
  '/lavora-con-noi/'
]);
const DEVICES = new Set(['mobile', 'tablet', 'desktop']);
const METRICS = new Set(['CLS', 'INP', 'LCP']);

function validValue(metric, value) {
  if (!Number.isFinite(value) || value < 0) return false;
  if (metric === 'CLS') return value <= 10;
  return value <= 120000;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ACTIVE',
      provider: 'axante-same-origin-rum',
      schemaVersion: 1,
      fieldVerdict: 'INSUFFICIENT SAMPLE'
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end();
  }

  const body = typeof req.body === 'string' ? (() => {
    try { return JSON.parse(req.body); } catch { return null; }
  })() : req.body;

  if (!body || body.schemaVersion !== 1 || !ROUTES.has(body.route) || !DEVICES.has(body.deviceClass) || !METRICS.has(body.metric) || !validValue(body.metric, Number(body.value))) {
    return res.status(400).json({ error: 'invalid metric payload' });
  }

  const sample = {
    schemaVersion: 1,
    route: body.route,
    deviceClass: body.deviceClass,
    metric: body.metric,
    value: Number(body.value),
    deployment: process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_URL || null,
    recordedAt: new Date().toISOString()
  };

  console.log(`AXANTE_FIELD_CWV ${JSON.stringify(sample)}`);
  return res.status(204).end();
}
