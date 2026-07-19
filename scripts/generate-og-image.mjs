import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const site = path.join(process.cwd(), 'site');
const mediaDir = path.join(site, 'assets', 'media');
const logoPath = path.join(mediaDir, 'axante-logo.png');
const outputPath = path.join(mediaDir, 'axante-share-v1.png');

if (!fs.existsSync(logoPath)) {
  throw new Error(`Official Axante logo not found: ${logoPath}`);
}

const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050507"/>
      <stop offset="0.52" stop-color="#0b0810"/>
      <stop offset="1" stop-color="#130817"/>
    </linearGradient>
    <radialGradient id="pinkGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1020 60) rotate(135) scale(520 420)">
      <stop stop-color="#f40673" stop-opacity="0.62"/>
      <stop offset="1" stop-color="#f40673" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="violetGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150 610) rotate(-35) scale(620 430)">
      <stop stop-color="#8a5cff" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#8a5cff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accent" x1="210" y1="0" x2="870" y2="0">
      <stop stop-color="#f40673"/>
      <stop offset="0.5" stop-color="#ff6ab6"/>
      <stop offset="1" stop-color="#8a5cff"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="44"/></filter>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#000" flood-opacity="0.46"/></filter>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="#fff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#pinkGlow)"/>
  <rect width="1200" height="630" fill="url(#violetGlow)"/>
  <circle cx="1030" cy="40" r="210" fill="none" stroke="#fff" stroke-opacity="0.075"/>
  <circle cx="1030" cy="40" r="285" fill="none" stroke="#fff" stroke-opacity="0.04"/>
  <path d="M64 72H1136" stroke="url(#accent)" stroke-width="3" stroke-linecap="round"/>
  <g filter="url(#shadow)">
    <rect x="64" y="105" width="1072" height="438" rx="42" fill="#0b0910" fill-opacity="0.72" stroke="#fff" stroke-opacity="0.12"/>
  </g>
  <image href="data:image/png;base64,${logoBase64}" x="110" y="154" width="370" height="118" preserveAspectRatio="xMinYMid meet"/>
  <text x="110" y="365" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="800" letter-spacing="-3">IL DIGITALE CHE</text>
  <text x="110" y="443" fill="url(#accent)" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="800" letter-spacing="-3">PORTA RISULTATI.</text>
  <text x="110" y="500" fill="#b9b1bd" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="500">Strategia · Design · Tecnologia · Roma</text>
  <g transform="translate(1000 436)">
    <circle cx="0" cy="0" r="64" fill="#ffffff" fill-opacity="0.055" stroke="#ffffff" stroke-opacity="0.14"/>
    <path d="M-22 0H22M8-14 22 0 8 14" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
  .toFile(outputPath);

const metadata = await sharp(outputPath).metadata();
if (metadata.width !== 1200 || metadata.height !== 630) {
  throw new Error(`Invalid social preview dimensions: ${metadata.width}x${metadata.height}`);
}

console.log(`Generated Axante social preview: ${path.relative(process.cwd(), outputPath)} (${metadata.width}x${metadata.height}).`);
