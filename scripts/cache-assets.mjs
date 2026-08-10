import fs from 'node:fs';
import path from 'node:path';

const output = path.join(process.cwd(), 'site', 'assets', 'media');
fs.mkdirSync(output, { recursive: true });

const snapshot = (url) => `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200`;

const assets = [
  ['axante-logo.png', 'https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png'],
  ['casarossa.jpg', 'https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg'],
  ['casarossa-detail.jpg', snapshot('https://casarossa.it/')],
  ['casarossa-store.jpg', snapshot('https://casarossa.it/store/'), 'casarossa-detail.jpg'],
  ['casarossa-product.jpg', snapshot('https://casarossa.it/store/bottiglia-100ml/'), 'casarossa-detail.jpg'],
  ['unicart.jpg', 'https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg'],
  ['unicart-detail.jpg', snapshot('https://unicartauctions.com/en/')],
  ['unicart-catalog.jpg', snapshot('https://unicartauctions.com/en/shop/'), 'unicart-detail.jpg'],
  ['unicart-auctions.jpg', snapshot('https://unicartauctions.com/en/auctions-calendar/'), 'unicart-detail.jpg'],
  ['carabetta.jpg', 'https://www.axante.it/wp-content/uploads/2021/08/copertina-sito-carabetta.jpg'],
  ['carabetta-detail.jpg', snapshot('https://carabetta.eu/')],
  ['carabetta-category.jpg', snapshot('https://carabetta.eu/351-cartoni'), 'carabetta-detail.jpg'],
  ['carabetta-new.jpg', snapshot('https://carabetta.eu/new-products'), 'carabetta-detail.jpg'],
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
      'user-agent': 'Mozilla/5.0 (compatible; AxantePreviewBuild/16.0)',
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

for (const [filename, originUrl, fallbackFilename = filename] of assets) {
  const candidates = [originUrl, `${fallbackBase}/${fallbackFilename}`];
  let bytes = null;
  let lastError = null;
  for (const candidate of candidates) {
    try {
      bytes = await fetchImage(candidate);
      if (candidate !== originUrl) console.warn(`Using published fallback for ${filename}: ${fallbackFilename}`);
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
