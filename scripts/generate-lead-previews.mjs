import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const inputDir = path.join(root, 'lead-engine', 'previews');
const outputDir = path.join(root, 'site', 'p');
const socialImage = 'https://website-preview-murex.vercel.app/assets/media/axante-share-v1.png';

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const safeColor = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
const safeSlug = value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || '') ? value : null;

function requireText(record, key) {
  if (typeof record[key] !== 'string' || record[key].trim().length < 2) {
    throw new Error(`${record.slug || 'record'}: missing or invalid ${key}`);
  }
}

function requireList(record, key, min = 3) {
  if (!Array.isArray(record[key]) || record[key].length < min || record[key].some(item => typeof item !== 'string' || item.trim().length < 2)) {
    throw new Error(`${record.slug || 'record'}: ${key} must contain at least ${min} valid items`);
  }
}

function renderList(items) {
  return items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function renderServices(items) {
  return items.map((service, index) => {
    if (!service || typeof service.title !== 'string' || typeof service.copy !== 'string') {
      throw new Error('Every service requires title and copy');
    }
    return `<article class="service-card reveal"><span class="service-number">${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.copy)}</p></article>`;
  }).join('');
}

function render(record) {
  const slug = safeSlug(record.slug);
  if (!slug) throw new Error('Invalid preview slug');
  ['company_name', 'sector', 'city', 'headline', 'subheadline', 'concept_title', 'concept_copy'].forEach(key => requireText(record, key));
  requireList(record, 'problems', 3);
  requireList(record, 'opportunities', 3);
  if (!Array.isArray(record.services) || record.services.length < 3) throw new Error(`${slug}: at least 3 services are required`);

  const accent = safeColor(record.theme?.accent, '#8b4dff');
  const accent2 = safeColor(record.theme?.accent2, '#ff4f8b');
  const company = escapeHtml(record.company_name);
  const proposalUrl = `/p/${slug}/`;
  const mailSubject = encodeURIComponent(`Concept digitale per ${record.company_name}`);

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${company} — Concept digitale Axante</title>
<meta name="description" content="Una proposta digitale personalizzata realizzata da Axante per ${company}.">
<meta name="robots" content="noindex,nofollow,noarchive,nosnippet">
<meta name="googlebot" content="noindex,nofollow,noarchive,nosnippet">
<meta name="theme-color" content="${accent}">
<meta property="og:type" content="website">
<meta property="og:title" content="${company} — proposta digitale Axante">
<meta property="og:description" content="Una direzione web personalizzata costruita intorno all'attività di ${company}.">
<meta property="og:image" content="${socialImage}">
<meta property="og:image:secure_url" content="${socialImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${socialImage}">
<link rel="stylesheet" href="/lead-preview.css?v=1">
<style>:root{--accent:${accent};--accent2:${accent2}}</style>
</head>
<body>
<div class="concept-bar">Concept realizzato da Axante · anteprima riservata e non indicizzata</div>
<header class="site-header"><div class="container nav"><a class="brand" href="${proposalUrl}">${company}<span>.</span></a><nav class="nav-links" aria-label="Navigazione"><a href="#analisi">Analisi</a><a href="#direzione">Direzione</a><a href="#intervento">Intervento</a></nav><a class="nav-cta" href="mailto:hello@axante.it?subject=${mailSubject}">Parliamone ↗</a></div></header>
<main>
<section class="hero"><div class="container hero-grid"><div><span class="eyebrow">${escapeHtml(record.sector)} · ${escapeHtml(record.city)}</span><h1>${escapeHtml(record.headline)}</h1><p class="hero-copy">${escapeHtml(record.subheadline)}</p><div class="hero-actions"><a class="button button-primary" href="#direzione">Scopri la proposta ↓</a><a class="button button-secondary" href="mailto:hello@axante.it?subject=${mailSubject}">Confrontiamoci ↗</a></div><div class="hero-proof"><span>Concept su misura</span><span>Mobile-first</span><span>Orientato alla conversione</span></div></div><div class="hero-visual" aria-hidden="true"><div class="visual-card visual-main"><span class="visual-kicker">Nuova direzione digitale</span><strong>${escapeHtml(record.visual_statement || record.company_name)}</strong><p>${escapeHtml(record.visual_copy || record.concept_copy)}</p></div><div class="visual-card visual-mini"><small>Priorità individuata</small><b>${escapeHtml(record.priority || 'Chiarezza e conversione')}</b></div><div class="visual-pill">Concept by Axante</div></div></div></section>
<section class="section" id="analisi"><div class="container"><div class="section-head reveal"><div><span class="eyebrow">Audit sintetico</span><h2>Da presenza online a strumento commerciale.</h2></div><p>Questa anteprima nasce da elementi osservati sulla presenza digitale attuale. Non è un template generico con un nome diverso.</p></div><div class="audit-grid"><article class="audit-card reveal"><span class="eyebrow">Attriti attuali</span><h3>Cosa oggi può frenare il risultato</h3><ul class="list">${renderList(record.problems)}</ul></article><article class="audit-card opportunity reveal"><span class="eyebrow">Spazio di crescita</span><h3>Cosa possiamo rendere più forte</h3><ul class="list">${renderList(record.opportunities)}</ul></article></div></div></section>
<section class="section" id="direzione"><div class="container"><article class="concept reveal"><span class="eyebrow">Direzione proposta</span><h2>${escapeHtml(record.concept_title)}</h2><p>${escapeHtml(record.concept_copy)}</p></article></div></section>
<section class="section" id="intervento"><div class="container"><div class="section-head reveal"><div><span class="eyebrow">Intervento Axante</span><h2>Una proposta concreta, non un esercizio grafico.</h2></div><p>Il progetto definitivo viene costruito sui contenuti reali, sugli obiettivi commerciali e sui dati dell'attività.</p></div><div class="service-grid">${renderServices(record.services)}</div></div></section>
<section class="cta"><div class="container"><div class="cta-box reveal"><div><h2>Ha senso approfondire?</h2><p>Possiamo trasformare questo concept in un progetto completo, definendo insieme priorità, tempi e investimento.</p></div><a class="button" href="mailto:hello@axante.it?subject=${mailSubject}">Parla con Axante ↗</a></div></div></section>
</main>
<footer><div class="container footer-row"><span>Concept riservato a ${company}</span><span>© <span data-year></span> Axante S.r.l. · Roma</span></div></footer>
<script src="/lead-preview.js?v=1" defer></script>
</body></html>`;
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

if (!fs.existsSync(inputDir)) {
  fs.mkdirSync(inputDir, { recursive: true });
  console.log('No lead preview records found.');
  process.exit(0);
}

const records = fs.readdirSync(inputDir)
  .filter(file => file.endsWith('.json'))
  .sort()
  .map(file => JSON.parse(fs.readFileSync(path.join(inputDir, file), 'utf8')));

const slugs = new Set();
for (const record of records) {
  if (slugs.has(record.slug)) throw new Error(`Duplicate preview slug: ${record.slug}`);
  slugs.add(record.slug);
  const destination = path.join(outputDir, record.slug);
  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(path.join(destination, 'index.html'), render(record));
}

console.log(`Generated ${records.length} lead preview page(s).`);
