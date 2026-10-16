/* =====================================================================
   scripts/prepare-photos.mjs
   Convert your real photos (public/photos/raw/*.{jpg,png}) to responsive
   WebP at 640 / 1280 / 2000 px in BOTH crops:
     -m-  portrait  (3:4)      -w-  landscape (4:3 / used where asked)
   STRIPS GPS + all EXIF, then writes public/img/gallery.json.
   Usage: npm run photos
   ===================================================================== */
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const RAW = 'public/photos/raw';
const OUT = 'public/img';
const SIZES = [640, 1280, 2000];

if (!existsSync(RAW)) { console.error(`no ${RAW} folder — add your photos there`); process.exit(1); }
mkdirSync(OUT, { recursive: true });

const files = readdirSync(RAW).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const manifest = [];

for (const f of files) {
  const name = basename(f, extname(f));
  const srcFile = join(RAW, f);
  const meta = await sharp(srcFile).metadata();
  for (const crop of ['m', 'w']) {
    const [cw, ch] = crop === 'm' ? [3, 4] : [4, 3];
    for (const W of SIZES) {
      const H = Math.round((W * ch) / cw);
      await sharp(srcFile)
        .rotate()                       // honour EXIF orientation, then strip
        .resize(W, H, { fit: 'cover', position: 'attention' })
        .withMetadata({ exif: undefined, gps: undefined, icc: undefined })
        .webp({ quality: W === 2000 ? 74 : 80, effort: 5 })
        .toFile(join(OUT, `${name}-${crop}-${W}.webp`));
    }
  }
  const ar = +(((meta.height || 4) / (meta.width || 3))).toFixed(2);
  manifest.push({ id: name, ar: Math.min(1.6, Math.max(0.62, cropAr(meta))) });
  console.log('✓', name);
}

function cropAr(m) {
  if (!m.width || !m.height) return 0.8;
  // use the natural image aspect for the masonry grid
  return m.width / m.height > 1 ? 0.72 : 1.28;
}

manifest.sort((a, b) => a.id.localeCompare(b.id));
const { writeFileSync } = await import('node:fs');
writeFileSync(join(OUT, 'gallery.json'), JSON.stringify(manifest, null, 1));
console.log(`\n${manifest.length} photos → ${OUT}/ (GPS/EXIF stripped) + gallery.json`);
