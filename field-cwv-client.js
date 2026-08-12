import { onCLS, onINP, onLCP } from '/assets/vendor/web-vitals.js';

const allowedRoutes = new Set([
  '/',
  '/servizi/',
  '/portfolio/',
  '/chi-siamo/',
  '/contatti/',
  '/lavora-con-noi/'
]);

function normalizeRoute(pathname) {
  if (pathname === '/') return '/';
  const clean = pathname.replace(/\/+$/, '');
  return `${clean}/`;
}

function deviceClass() {
  if (window.matchMedia('(max-width: 767px)').matches) return 'mobile';
  if (window.matchMedia('(max-width: 1024px)').matches) return 'tablet';
  return 'desktop';
}

function report(metric) {
  const route = normalizeRoute(window.location.pathname);
  if (!allowedRoutes.has(route)) return;
  if (!['CLS', 'INP', 'LCP'].includes(metric.name)) return;
  if (!Number.isFinite(metric.value)) return;

  const payload = JSON.stringify({
    schemaVersion: 1,
    route,
    deviceClass: deviceClass(),
    metric: metric.name,
    value: metric.value
  });

  const endpoint = '/api/vitals';
  const blob = new Blob([payload], { type: 'application/json' });
  if (navigator.sendBeacon?.(endpoint, blob)) return;

  fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: payload,
    keepalive: true,
    credentials: 'same-origin'
  }).catch(() => {});
}

onCLS(report);
onINP(report);
onLCP(report);
