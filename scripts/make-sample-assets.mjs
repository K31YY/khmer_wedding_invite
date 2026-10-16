/* =====================================================================
   scripts/make-sample-assets.mjs
   Generates tasteful PLACEHOLDER images so the site renders before the
   real photos arrive. Also builds sample QR cards + favicon.
   Delete this script once npm run photos has the real set.
   ===================================================================== */
import sharp from 'sharp';
import QRCode from 'qrcode';
import { mkdirSync } from 'node:fs';

mkdirSync('public/img', { recursive: true });
mkdirSync('public/gift', { recursive: true });
mkdirSync('public/media', { recursive: true });
const SIZES = [640, 1280, 2000];

function scene({ sky1, sky2, sun = null, hills = [], reeds = 0, warm = 15, seed = 1 }) {
  // layered "pre-wedding photo" abstractions: dusk skies, hills, sun disc, bokeh
  const rnd = mulberry(seed);
  let s = '';
  s += `<defs>
    <linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='${sky1}'/><stop offset='1' stop-color='${sky2}'/>
    </linearGradient>
    <radialGradient id='sun' cx='.5' cy='.5' r='.5'>
      <stop offset='0' stop-color='rgba(255,232,170,.95)'/><stop offset='.75' stop-color='rgba(255,190,90,.5)'/><stop offset='1' stop-color='rgba(255,190,90,0)'/>
    </radialGradient>
    <filter id='soft'><feGaussianBlur stdDeviation='6'/></filter>
    <filter id='grain'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 .06 0 0 0 0 .05 0 0 0 0 .04 1 0 0 0 -.94'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.28'/></feComponentTransfer></filter>
  </defs>`;
  s += `<rect width='1200' height='1600' fill='url(#sky)'/>`;
  if (sun) s += `<circle cx='${sun.x}' cy='${sun.y}' r='${sun.r * 3.2}' fill='url(#sun)'/><circle cx='${sun.x}' cy='${sun.y}' r='${sun.r * .42}' fill='#ffedbc' opacity='.92'/>`;
  hills.forEach(([y, fill, op]) => {
    let d = `M0 ${y}`;
    for (let x = 0; x <= 1200; x += 150) d += ` Q${x + 75} ${y - 40 - rnd() * 90}, ${x + 150} ${y - 10 + rnd() * 40}`;
    d += ` L1200 1600 L0 1600 Z`;
    s += `<path d='${d}' fill='${fill}' opacity='${op}'/>`;
  });
  for (let i = 0; i < warm; i++) {
    const x = rnd() * 1200, y = 900 + rnd() * 600, r = 4 + rnd() * 16;
    s += `<circle cx='${x.toFixed(0)}' cy='${y.toFixed(0)}' r='${r.toFixed(0)}' fill='rgba(255,214,140,${(.1 + rnd() * .22).toFixed(2)})' filter='url(#soft)'/>`;
  }
  // two close figures (silhouettes, suggestive of a couple — replace with real photos!)
  const figY = 1180;
  s += `<g filter='url(#soft)' opacity='.85'>
    <ellipse cx='520' cy='${figY + 190}' rx='68' ry='212' fill='rgba(23,18,12,.86)'/>
    <circle cx='520' cy='${figY - 52}' r='34' fill='rgba(23,18,12,.86)'/>
    <ellipse cx='646' cy='${figY + 204}' rx='62' ry='198' fill='rgba(23,18,12,.86)'/>
    <circle cx='646' cy='${figY - 62}' r='31' fill='rgba(23,18,12,.86)'/>
  </g>`;
  if (reeds) {
    for (let i = 0; i < reeds; i++) {
      const x = rnd() * 1200, h0 = 250 + rnd() * 380;
      s += `<path d='M${x} 1600 q ${(rnd() - .5) * 90} -${h0 * .6} ${(rnd() - .5) * 46} -${h0}' stroke='rgba(16,13,8,.75)' stroke-width='${2 + rnd() * 3}' fill='none'/>`;
    }
  }
  s += `<rect width='1200' height='1600' filter='url(#grain)' opacity='.5'/>`;
  return `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1600' viewBox='0 0 1200 1600'>${s}</svg>`;
}
function mulberry(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const set = {
  hero:  { seed: 4,  sky1: '#31404a', sky2: '#0d0f0c', sun: { x: 720, y: 420, r: 130 }, hills: [[820, '#2a352c', .9], [1050, '#1a211b', .96]], warm: 20, reeds: 26 },
  words: { seed: 11, sky1: '#5a6345', sky2: '#20241a', hills: [[900, '#39432f', .9], [1200, '#242b1e', .96]], warm: 12, reeds: 4 },
  cozy:  { seed: 23, sky1: '#46543f', sky2: '#181c13', sun: { x: 480, y: 500, r: 110 }, hills: [[1000, '#2c3626', .92], [1250, '#1d241a', .95]], warm: 16 },
  pond:  { seed: 31, sky1: '#1c2431', sky2: '#07090a', hills: [[760, '#141b26', .9], [1120, '#0a0e13', .98]], warm: 26, reeds: 9 },
  story1:{ seed: 41, sky1: '#708060', sky2: '#2c3323', hills: [[880, '#465239', .9], [1180, '#2a3123', .95]], warm: 8 },
  story2:{ seed: 47, sky1: '#84694a', sky2: '#241d18', sun: { x: 640, y: 560, r: 120 }, hills: [[940, '#4c3d2e', .9], [1230, '#20190f', .97]], warm: 14 },
  story3:{ seed: 53, sky1: '#4b4266', sky2: '#141021', sun: null, hills: [[900, '#2e2946', .9], [1200, '#171326', .96]], warm: 18 },
};
for (let i = 1; i <= 10; i++) set[`g${i}`] = { ...(set[['hero', 'words', 'cozy', 'story1', 'story2', 'story3', 'pond', 'hero', 'words', 'cozy'][i - 1]]), seed: 60 + i * 7 };
set['g10'].ar = 1;

for (const [name, cfg] of Object.entries(set)) {
  const svg = scene(cfg);
  for (const W of SIZES) {
    for (const [crop, H] of [['m', Math.round(W * 4 / 3)], ['w', Math.round(W * 3 / 4)]]) {
      await sharp(Buffer.from(svg))
        .resize(W, H, { fit: 'cover' })
        .webp({ quality: crop === 'm' ? 80 : 76, effort: 5 })
        .toFile(`public/img/${name}-${crop}-${W}.webp`);
    }
  }
}
const ids = Object.keys(set).filter((n) => n.startsWith('g'));
const ars = [1.25, 0.8, 1.1, 0.72, 0.9, 1.3, 0.85, 1.0, 0.75, 1.2];
await (await import('node:fs')).promises.writeFile('public/img/gallery.json',
  JSON.stringify(ids.map((id, i) => ({ id, ar: ars[i] })), null, 1));

/* sample KHQR-look cards (clearly fake data) */
for (const [file, payload] of [
  ['qr-a', 'KHQR-SAMPLE-AC#008888871#SOKHA CHEA#NGANH KHMER COMMERCIAL BANK'],
  ['qr-b', 'ABA-PAYNOW-SAMPLE#maly.su@aba#SOKHA MALY'],
]) {
  const png = await QRCode.toBuffer('PLACEHOLDER-' + payload + '-REPLACE-ME', { width: 300, margin: 1, color: { dark: '#20241a', light: '#f4eedd' }, errorCorrectionLevel: 'H' });
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='300' height='300' rx='14' fill='#fbf7ea'/><foreignObject width='1' height='1'></foreignObject></svg>`;
  await sharp(Buffer.from(svg)).composite([{ input: png, gravity: 'center' }]).png().toFile(`public/gift/${file}.png`);
}

/* gate hero bg + favicon */
await sharp(Buffer.from(scene(set.hero))).resize(1280, 800, { fit: 'cover' }).webp({ quality: 70 }).toFile('public/img/hero-w-1280.webp');
const favicon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><circle cx='32' cy='32' r='30' fill='%2343351a'/><circle cx='32' cy='32' r='24' fill='%23c9a349'/><path d='M32 44 C24 38 18 32 18 26 a7.5 7.5 0 0 1 14-4 a7.5 7.5 0 0 1 14 4 c0 6 -6 12 -14 18Z' fill='%23241a05'/></svg>`;
await (await import('node:fs')).promises.writeFile('public/favicon.svg', favicon.replace('%23', '#').replace(/%23/g, '#').replace(/%23/g, '#'));
console.log('placeholder assets ✓');
