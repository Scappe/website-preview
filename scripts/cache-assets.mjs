import fs from 'node:fs';
import path from 'node:path';

const output = path.join(process.cwd(), 'site', 'assets', 'media');
fs.mkdirSync(output, { recursive: true });

const assets = [
  ['axante-logo.png', 'https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png'],
  ['casarossa.jpg', 'https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg'],
  ['casarossa-detail.jpg', 'https://www.axante.it/wp-content/uploads/2025/02/casarossa-vaso.jpg'],
  ['unicart.jpg', 'https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg'],
  ['unicart-detail.jpg', 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Funicartauctions.com%2Fen%2F?w=1200'],
  ['carabetta.jpg', 'https://www.axante.it/wp-content/uploads/2021/08/copertina-sito-carabetta.jpg'],
  ['carabetta-detail.jpg', 'https://carabetta.eu/img/cms/biancheria-letto.jpg'],
  ['carabetta-logo.png', 'https://www.axante.it/wp-content/uploads/2021/08/carabetta-logo.png'],
  ['weblab.jpg', 'https://www.axante.it/wp-content/uploads/2021/08/weblab.jpg'],
  ['tda.jpg', 'https://www.axante.it/wp-content/uploads/2021/08/tda.jpg']
];

const fallbackBase = 'https://website-preview-murex.vercel.app/assets/media';

async function fetchImage(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(30000),
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; AxantePreviewBuild/15.0)',
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      referer: 'https://www.axante.it/'
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) throw new Error(`invalid content type ${contentType || 'unknown'}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 500) throw new Error(`unexpectedly small payload (${bytes.length} bytes)`);
  return bytes;
}

for (const [filename, originUrl] of assets) {
  const candidates = [originUrl, `${fallbackBase}/${filename}`];
  let bytes = null;
  let lastError = null;
  for (const candidate of candidates) {
    try {
      bytes = await fetchImage(candidate);
      if (candidate !== originUrl) console.warn(`Using published fallback for ${filename}`);
      break;
    } catch (error) {
      lastError = error;
      console.warn(`Asset source failed for ${filename}: ${candidate} (${error.message})`);
    }
  }
  if (!bytes) throw new Error(`Unable to cache ${filename}: ${lastError?.message || 'all sources failed'}`);
  fs.writeFileSync(path.join(output, filename), bytes);
  console.log(`Cached ${filename}: ${bytes.length} bytes`);
}
