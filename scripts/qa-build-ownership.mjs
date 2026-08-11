import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const manifestPath = path.join(root, 'build-ownership.json');
const packagePath = path.join(root, 'package.json');
const distRoot = path.join(root, 'dist');

function fail(message) { failures.push(message); }
function read(relative) { return fs.readFileSync(path.join(root, relative), 'utf8'); }
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

if (!fs.existsSync(manifestPath)) fail('build-ownership.json is missing');
if (!fs.existsSync(packagePath)) fail('package.json is missing');
if (!fs.existsSync(distRoot)) fail('dist is missing; ownership QA must run after publish');

let manifest = null;
if (fs.existsSync(manifestPath)) {
  try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); }
  catch (error) { fail(`build-ownership.json is invalid JSON: ${error.message}`); }
}

const requiredFamilies = [
  'global-header-footer-logo',
  'typography-runtime-resources',
  'home-proof-spine',
  'home-decision-room',
  'home-signature-reactor',
  'search-surface',
  'published-output'
];

if (manifest) {
  for (const family of requiredFamilies) {
    const config = manifest.families?.[family];
    if (!config?.owner) fail(`${family}: final owner is missing`);
    else if (!fs.existsSync(path.join(root, config.owner))) fail(`${family}: owner does not exist: ${config.owner}`);
  }

  const owners = Object.entries(manifest.families || {}).map(([family, value]) => [family, value.owner]);
  const runtimeOwner = manifest.families?.['typography-runtime-resources']?.owner;
  const globalOwner = manifest.families?.['global-header-footer-logo']?.owner;
  if (runtimeOwner !== 'scripts/apply-foundation-v13.mjs') fail('runtime resources must be owned by foundation');
  if (globalOwner !== 'scripts/apply-foundation-v13.mjs') fail('global components must be owned by foundation');

  const duplicateFinalOutputOwners = owners.filter(([, owner]) => !owner);
  if (duplicateFinalOutputOwners.length) fail('one or more ownership families have no owner');
}

const pkg = fs.existsSync(packagePath) ? JSON.parse(fs.readFileSync(packagePath, 'utf8')) : {};
const build = pkg.scripts?.build || '';
for (const stage of [
  'scripts/apply-foundation-v13.mjs',
  'scripts/apply-home-reactor-v14.mjs',
  'scripts/generate-search-surface.mjs',
  'scripts/publish-site.mjs',
  'scripts/qa-site.mjs',
  'scripts/qa-build-ownership.mjs',
  'scripts/qa-search-ai.mjs'
]) if (!build.includes(stage)) fail(`build script missing required stage: ${stage}`);

const order = [
  'scripts/apply-foundation-v13.mjs',
  'scripts/apply-home-reactor-v14.mjs',
  'scripts/generate-search-surface.mjs',
  'scripts/publish-site.mjs',
  'scripts/qa-site.mjs',
  'scripts/qa-build-ownership.mjs',
  'scripts/qa-search-ai.mjs'
].map(stage => build.indexOf(stage));
for (let i = 1; i < order.length; i += 1) if (order[i] <= order[i - 1]) fail('final build ownership stages are out of order');

// Superseded passes are allowed to remain in repository history, but they may not
// re-enter the canonical build and reclaim a component already owned downstream.
for (const superseded of manifest?.families?.['home-signature-reactor']?.superseded || []) {
  if (build.includes(superseded)) fail(`superseded Home stage re-entered canonical build: ${superseded}`);
}

const earlyOverride = read('scripts/apply-v5-overrides.mjs');
if (/fonts\.(?:googleapis|gstatic)\.com/i.test(earlyOverride)) fail('apply-v5-overrides.mjs still owns external font policy');
const foundation = read('scripts/apply-foundation-v13.mjs');
if (!foundation.includes("['styles.css', 'home-v5.css']")) fail('foundation does not normalize shared/home stylesheets');
if (!foundation.includes('fonts\\.googleapis\\.com')) fail('foundation is missing the legacy Google Fonts removal guard');

const forbidden = [/fonts\.googleapis\.com/i, /fonts\.gstatic\.com/i];
for (const file of walk(distRoot).filter(file => /\.(?:html|css|js)$/.test(file))) {
  const source = fs.readFileSync(file, 'utf8');
  for (const pattern of forbidden) if (pattern.test(source)) fail(`${path.relative(distRoot, file)}: forbidden runtime font dependency survived publication`);
}

const homeOutput = path.join(distRoot, 'index.html');
if (fs.existsSync(homeOutput)) {
  const home = fs.readFileSync(homeOutput, 'utf8');
  for (const legacy of ['/home-evidence.css', '/home-evidence.js', 'class="evidence-hero"', 'class="evidence-bridge"']) {
    if (home.includes(legacy)) fail(`Home final output still exposes superseded Evidence ownership: ${legacy}`);
  }
  if (!home.includes('data-reactor')) fail('Home final output is missing Reactor owner marker');
}

if (failures.length) {
  console.error('\nBUILD OWNERSHIP QA FAILED');
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log('BUILD OWNERSHIP QA PASSED: final globals/resources, Home chapter owners, Reactor hero, search surface and published output have explicit ownership; superseded Home Evidence cannot re-enter the build; no external font dependency survived.');
