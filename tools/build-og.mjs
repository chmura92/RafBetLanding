import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SRC = join(root, 'src/assets/images/gallery-01.jpg');
const DST = join(root, 'public/og-image.jpg');

// Get source dims to figure out crop after resize
const meta = await sharp(SRC).metadata();
const srcW = meta.width;
const srcH = meta.height;

// Resize so width becomes 1200, scale height proportionally
const ratio = 1200 / srcW;
const newH = Math.round(srcH * ratio);

// Then center-crop to 630 high
const topOffset = Math.max(0, Math.floor((newH - 630) / 2));

await sharp(SRC)
  .resize(1200, newH)
  .extract({ left: 0, top: topOffset, width: 1200, height: 630 })
  // Apply dark overlay (composite with semi-transparent black rectangle)
  .composite([{
    input: Buffer.from(`<svg width="1200" height="630"><rect width="1200" height="630" fill="rgba(10,10,12,0.4)"/></svg>`),
    blend: 'over',
  }])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(DST);

const result = await sharp(DST).metadata();
const { statSync } = await import('fs');
console.log(`Created og-image.jpg: ${result.width}x${result.height}, ${statSync(DST).size} bytes`);
