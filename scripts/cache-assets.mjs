import fs from 'node:fs';
import path from 'node:path';

const output = path.join(process.cwd(), 'site', 'assets', 'media');
fs.mkdirSync(output, { recursive: true });

const assets = [
  ['axante-logo.png', 'https://www.axante.it/wp-content/uploads/2021/08/axante-logo.png'],
  ['casarossa.jpg', 'https://www.axante.it/wp-content/uploads/2025/02/casarossa-screenshot.jpg'],
  ['unicart.jpg', 'https://www.axante.it/wp-content/uploads/2021/08/unicart.jpg'],
  ['carabetta.jpg', 'https://www.axante.it/wp-content/uploads/2021/08/copertina-sito-carabetta.jpg'],
  ['carabetta-logo.png', 'https://www.axante.it/wp-content/uploads/2021/08/carabetta-logo.png'],
  ['weblab.jpg', 'https://www.axante.it/wp-content/uploads/2021/08/weblab.jpg'],
  ['tda.jpg', 'https://www.axante.it/wp-content/uploads/2021/08/tda.jpg']
];

for (const [filename, url] of assets) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(30000),
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; AxantePreviewBuild/6.0)',
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      referer: 'https://www.axante.it/'
    }
  });

  if (!response.ok) {
    throw new Error(`Unable to download ${url}: HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Invalid content type for ${url}: ${contentType || 'unknown'}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 500) {
    throw new Error(`Downloaded asset is unexpectedly small: ${filename} (${bytes.length} bytes)`);
  }

  fs.writeFileSync(path.join(output, filename), bytes);
  console.log(`Cached ${filename}: ${bytes.length} bytes`);
}
