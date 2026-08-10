import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const homePath = path.join(site, 'index.html');
const cssSource = path.join(root, 'home-evidence.css');
const jsSource = path.join(root, 'home-evidence.js');

for (const file of [homePath, cssSource, jsSource]) {
  if (!fs.existsSync(file)) throw new Error(`Missing homepage evidence source: ${path.basename(file)}`);
}

let html = fs.readFileSync(homePath, 'utf8');

const hero = `<section class="evidence-hero" data-evidence-hero aria-labelledby="evidence-title"><div class="container evidence-grid"><div class="evidence-copy"><span class="kicker reveal"><span class="kicker-dot"></span>Studio digitale · Roma</span><h1 id="evidence-title" class="reveal">Non ti serve più digitale.<br><span class="text-gradient">Ti serve quello giusto.</span></h1><p class="hero-copy reveal">Axante trasforma problemi di crescita, vendita e operatività in <strong>sistemi digitali progettati e costruiti da un unico team</strong>. Strategia, design, growth e tecnologia lavorano insieme, dall'idea al post-lancio.</p><div class="actions reveal"><a class="btn btn-primary" href="/contatti">Richiedi un audit gratuito <span>↗</span></a><a class="btn btn-secondary" href="/portfolio#casa-rossa">Apri il caso Casa Rossa <span>→</span></a></div><div class="evidence-proof reveal" aria-label="Impegni Axante"><span>Strategia + execution nello stesso team</span><span>Pagamento ad avanzamento</span><span>Assistenza diretta post-lancio</span></div></div><div class="evidence-surface reveal" aria-label="Come Axante ha affrontato il progetto Casa Rossa"><div class="evidence-surface-head"><div class="evidence-client"><span class="evidence-mark">CR</span><div><strong>Casa Rossa</strong><span>Case study · e-commerce</span></div></div><a class="evidence-case-link" href="/portfolio#casa-rossa">Vedi il caso completo ↗</a></div><div class="evidence-flow" role="tablist" aria-label="Dal problema al sistema"><button class="evidence-state" type="button" role="tab" data-evidence-state data-label="Problema" data-detail="Portare la vendita online senza trasformare la gestione quotidiana in un nuovo problema." aria-selected="true"><span class="evidence-step">01 · Problema</span><strong>Vendere online, senza complicarsi.</strong><p>Un'esperienza commerciale chiara e una gestione sostenibile.</p></button><button class="evidence-state" type="button" role="tab" data-evidence-state data-label="Direzione" data-detail="Una direzione unica: e-commerce, struttura multilingua e SEO pensati insieme invece che come attività separate." aria-selected="false"><span class="evidence-step">02 · Direzione</span><strong>E-commerce + multilingua + SEO.</strong><p>Le decisioni di canale diventano un'unica architettura.</p></button><button class="evidence-state" type="button" role="tab" data-evidence-state data-label="Sistema" data-detail="Catalogo, checkout, contenuti, misurazione e CMS vengono progettati come parti dello stesso sistema operativo." aria-selected="false"><span class="evidence-step">03 · Sistema</span><strong>Un ecosistema, non una somma di plugin.</strong><p>Catalogo · checkout · contenuti · analytics · CMS.</p></button><button class="evidence-state" type="button" role="tab" data-evidence-state data-label="Outcome" data-detail="Il risultato verificabile è una struttura più chiara, scalabile e gestibile in autonomia, pronta a evolvere dopo il lancio." aria-selected="false"><span class="evidence-step">04 · Outcome</span><strong>Più chiaro. Scalabile. Autonomo.</strong><p>Una base digitale che può crescere senza essere rifatta.</p></button></div><div class="evidence-detail" aria-live="polite"><span class="evidence-detail-label" data-evidence-detail-label>Problema</span><p data-evidence-detail>Portare la vendita online senza trasformare la gestione quotidiana in un nuovo problema.</p></div></div></div></section><section class="evidence-bridge" aria-labelledby="bridge-title"><div class="container"><div class="evidence-bridge-head"><div><span class="section-eyebrow">Prima il problema</span><h2 id="bridge-title">Non partiamo dal deliverable.<br>Partiamo da ciò che deve cambiare.</h2></div><p>Se il punto di partenza è chiaro, strategia, design e tecnologia smettono di essere servizi separati e diventano una direzione unica.</p></div><div class="problem-entry-grid"><a class="problem-entry" href="/servizi"><span>01 · VISIBILITÀ</span><strong>Farti trovare</strong><i>Scopri il sistema →</i></a><a class="problem-entry" href="/servizi"><span>02 · CREDIBILITÀ</span><strong>Convincere meglio</strong><i>Scopri il sistema →</i></a><a class="problem-entry" href="/servizi"><span>03 · CRESCITA / OPERATIVITÀ</span><strong>Vendere o lavorare meglio</strong><i>Scopri il sistema →</i></a></div></div></section>`;

const heroPattern = /<section class="hero(?:\s|\")?[\s\S]*?<\/section>/;
if (!heroPattern.test(html)) throw new Error('Homepage hero target not found.');
html = html.replace(heroPattern, hero);

if (!html.includes('/home-evidence.css?v=9.0')) {
  html = html.replace('</head>', '<link rel="stylesheet" href="/home-evidence.css?v=9.0"></head>');
}
if (!html.includes('/home-evidence.js?v=9.0')) {
  html = html.replace('</body>', '<script src="/home-evidence.js?v=9.0" defer></script></body>');
}

fs.writeFileSync(homePath, html);
fs.copyFileSync(cssSource, path.join(site, 'home-evidence.css'));
fs.copyFileSync(jsSource, path.join(site, 'home-evidence.js'));

const checks = [
  'Non ti serve più digitale.',
  'data-evidence-hero',
  'Casa Rossa',
  'Problema',
  'Direzione',
  'Sistema',
  'Outcome',
  'Non partiamo dal deliverable.',
  '/home-evidence.css?v=9.0',
  '/home-evidence.js?v=9.0',
  'href="/contatti"',
  'href="/portfolio#casa-rossa"'
];
for (const check of checks) {
  if (!html.includes(check)) throw new Error(`Evidence-first homepage missing required content: ${check}`);
}
if (html.includes('Axante growth dashboard')) throw new Error('Legacy generic growth dashboard is still present in homepage hero.');

console.log('Applied Axante Evidence-First Growth Story v9.0.');
