/* =====================================================================
   Original decorative elements — flowing leaf scrolls, a fan-shaped
   crest, soft curls, a butterfly, line icons. All drawn in code as
   geometry; no cultural motifs claimed, no stock clipart.
   Khmer text is NEVER rendered inside SVG — HTML sits on top.
   ===================================================================== */
import { svgFrag } from './utils.js';

const NS = 'http://www.w3.org/2000/svg';
const foil = 'url(#g-foil)';

/* small helpers ------------------------------------------------------ */
function path(dstr, attrs = {}) {
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', dstr);
  Object.entries(attrs).forEach(([k, v]) => p.setAttribute(k, v));
  return p;
}
function g(attrs = {}, ...kids) {
  const el = document.createElementNS(NS, 'g');
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  kids.flat().forEach((k) => k && el.append(k));
  return el;
}
export function svgEl(viewBox, cls) {
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', viewBox);
  s.classList.add('orn');
  if (cls) s.classList.add(...cls.split(' '));
  s.setAttribute('aria-hidden', 'true');
  return s;
}
/* sample points+tangents along a path to graft leaves on */
function samplePath(el, n) {
  const len = el.getTotalLength();
  const out = [];
  for (let i = 0; i < n; i++) {
    const l = (len * (i + 0.5)) / n;
    const p = el.getPointAtLength(l);
    const q = el.getPointAtLength(Math.min(len, l + 1));
    out.push({ x: p.x, y: p.y, a: (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI });
  }
  return out;
}

/* leaf blade primitive ------------------------------------------------ */
const LEAF = 'M0 0 C5 -6.5 13.5 -7.5 19 -2.5 C13.5 4.5 4.5 5.5 0 0 Z';
const PETAL = 'M0 0 C-5.5 -14 -4.5 -30 0 -41 C4.5 -30 5.5 -14 0 0 Z';
const CURL = 'M0 0 C7 -1 10 -7 6.5 -11.5 C3.5 -15 -2 -13.5 -1.5 -8.5 C-1 -5 2.5 -4 4 -6.5';

function graftLeaves(host, stem, { from = 0.12, to = 0.94, count = 6, size = 1, flip = false } = {}) {
  const pts = samplePath(stem, Math.round(count / (to - from)))
    .filter((_, i, a) => i / a.length >= from && i / a.length <= to);
  pts.forEach((p, i) => {
    const dir = (i % 2 === 0 ? -1 : 1) * (flip ? -1 : 1);
    const sc = (size * (0.72 + 0.42 * Math.sin((i * 3.1) % 7))).toFixed(2);
    const leaf = path(LEAF, {
      fill: foil, opacity: .9,
      transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(p.a + (dir > 0 ? 38 : -38)).toFixed(1)}) scale(${sc} ${sc * dir})`,
      class: 'orn-leaf',
    });
    host.append(leaf);
  });
}

/* ---------------------------------------------------------------------
   1. CORNER — vine sweeping along two edges, mirrored to the other 3
   via <g transform> attributes (never CSS transforms, so GSAP can
   animate the outer groups of each corner independently).
   --------------------------------------------------------------------- */
export function corner4(size = 420) {
  const s = svgEl(`0 0 ${size} ${size}`, 'orn-corner4');
  const half = size / 2;
  const proto = buildCornerProto(size);

  // inner corner group; the four placements use SVG transforms so the
  // geometry itself holds the mirror — outer wrappers are free for GSAP.
  const placements = [
    { t: `translate(0 0)` },
    { t: `translate(${size} 0) scale(-1 1)` },
    { t: `translate(0 ${size}) scale(1 -1)` },
    { t: `translate(${size} ${size}) scale(-1 -1)` },
  ];
  placements.forEach((pl, i) => {
    const outer = g({ class: `orn-c orn-c${i}`, transform: pl.t });
    const inner = g();
    inner.append(proto.cloneNode(true));
    outer.append(inner);
    s.append(outer);
  });
  return s;
}

/* single corner, mirrored by inner SVG <g transform> (never CSS), dir: tl|tr|bl|br */
export function cornerOne(dir = 'tl', size = 420) {
  const s = svgEl(`0 0 ${size} ${size}`, 'orn-corner1');
  const map = {
    tl: 'translate(0 0)',
    tr: `translate(${size} 0) scale(-1 1)`,
    bl: `translate(0 ${size}) scale(1 -1)`,
    br: `translate(${size} ${size}) scale(-1 -1)`,
  };
  const outer = g({ class: 'orn-c', transform: map[dir] || map.tl });
  outer.append(buildCornerProto(size));
  s.append(outer);
  return s;
}

function buildCornerProto(size) {
  const grp = g();
  const stem = path(`M6 ${size * 0.42} C14 ${size * 0.24} 40 ${size * 0.10} ${size * 0.30} ${size * 0.055} C${size * 0.5} ${size * 0.03} ${size * 0.42} 14 ${size * 0.6} 6`, {
    fill: 'none', stroke: 'url(#g-foil)', 'stroke-width': 2.1, 'stroke-linecap': 'round', class: 'orn-stem',
  });
  grp.append(stem);
  const host = g();
  grp.append(host);
  const s0 = svgEl(`0 0 ${size} ${size}`, 'tmp-measure');
  s0.append(stem);
  document.body.append(s0);
  graftLeaves(host, stem, { count: 7, size: size / 130 });
  s0.remove();
  const curl = (x, y, rot) => {
    const gg = g({ transform: `translate(${x} ${y}) rotate(${rot}) scale(${size / 520})`, opacity: .85 });
    gg.append(path(CURL, { fill: 'none', stroke: 'url(#g-foil)', 'stroke-width': 2.6, 'stroke-linecap': 'round' }));
    return gg;
  };
  grp.append(curl(8, size * 0.44, 75), curl(size * 0.61, 6, 115));
  // berries sprinkle
  [[0.16, 0.30], [0.24, 0.17], [0.44, 0.09], [0.53, 0.05]].forEach(([fx, fy], i) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', fx * size); c.setAttribute('cy', fy * size);
    c.setAttribute('r', (1.6 + (i % 3) * .8) * (size / 420));
    c.setAttribute('fill', 'url(#g-foil)'); c.setAttribute('opacity', .78);
    grp.append(c);
  });
  return grp;
}

/* ---------------------------------------------------------------------
   2. CREST — fan-shaped: petals fanned around a base, curled leaves
   crossed below, a dot arc above.
   --------------------------------------------------------------------- */
export function crest(cls) {
  const s = svgEl('0 0 120 92', cls ? `orn-crest ${cls}` : 'orn-crest');
  const cx = 60, cy = 62;
  const fan = g({ transform: `translate(${cx} ${cy})` });
  [-64, -44, -24, -8, 8, 24, 44, 64].forEach((a, i) => {
    const sc = 1 - Math.abs(a) / 165;
    fan.append(path(PETAL, {
      fill: i === 3 || i === 4 ? foil : 'none',
      stroke: foil, 'stroke-width': 1.4,
      opacity: a === 0 ? 1 : 0.9,
      transform: `rotate(${a}) scale(${sc.toFixed(2)})`,
      class: 'orn-leaf',
    }));
  });
  s.append(fan);
  // crossed scrolls under the fan
  s.append(path('M28 64 C20 70 14 82 24 86 C34 90 40 80 34 74 C30 70 24 74 26 79', { fill: 'none', stroke: foil, 'stroke-width': 2, 'stroke-linecap': 'round', transform: 'translate(6 -2)' }));
  s.append(path('M28 64 C20 70 14 82 24 86 C34 90 40 80 34 74 C30 70 24 74 26 79', { fill: 'none', stroke: foil, 'stroke-width': 2, 'stroke-linecap': 'round', transform: 'translate(86 -2) scale(-1 1)' }));
  // dot stars above
  [[38, 16, 1.7], [60, 10, 2.2], [82, 16, 1.7], [50, 22, 1.2], [70, 22, 1.2]].forEach(([x, y, r]) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', r);
    c.setAttribute('fill', foil);
    s.append(c);
  });
  return s;
}

/* ---------------------------------------------------------------------
   3. DIVIDER — hairline + leaf curls + centre seed
   --------------------------------------------------------------------- */
export function divider() {
  const s = svgEl('0 0 320 24', 'orn-divider');
  const line = (x1, x2, y) => {
    const l = document.createElementNS(NS, 'line');
    ['x1', 'x2', 'y1', 'y2'].forEach((a, i) => l.setAttribute(a, [x1, x2, y, y][i]));
    l.setAttribute('stroke', foil); l.setAttribute('stroke-width', .8);
    return l;
  };
  s.append(line(4, 128, 12), line(192, 316, 12));
  s.append(path('M128 12 C138 6 146 8 149 12 C146 16 138 18 128 12 Z', { fill: foil, opacity: .9 }));
  s.append(path('M192 12 C182 6 174 8 171 12 C174 16 182 18 192 12 Z', { fill: foil, opacity: .9 }));
  s.append(path('M156 12 C157.6 8.4 162.4 8.4 164 12 C162.4 15.6 157.6 15.6 156 12 Z', { fill: foil }));
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('cx', 160); c.setAttribute('cy', 5); c.setAttribute('r', 1.4); c.setAttribute('fill', foil);
  const c2 = c.cloneNode(); c2.setAttribute('cy', 19);
  s.append(c, c2);
  return s;
}

/* ---------------------------------------------------------------------
   4. FLOURISH — joins the two names of the lockup (path is drawn
   on by GSAP; heart + butterfly are separate elements)
   --------------------------------------------------------------------- */
export function flourish() {
  const s = svgEl('0 0 200 56', 'orn-flourish');
  const stem = path('M4 20 C46 4 88 10 108 26 C124 39 120 50 106 50 C95 50 92 42 99 38 C118 27 152 30 172 16 C180 11 188 10 196 12', {
    fill: 'none', stroke: foil, 'stroke-width': 2.4, 'stroke-linecap': 'round', class: 'fl-stem',
  });
  const g1 = g({ class: 'fl-draw' }, stem);
  s.append(g1);
  // small leaves on the stem
  const leafPts = [[52, 10.5, -24], [128, 40, 18], [158, 24, -14], [86, 15, 24]];
  leafPts.forEach(([x, y, r], i) => {
    g1.append(path(LEAF, { fill: foil, opacity: .85, transform: `translate(${x} ${y}) rotate(${r}) scale(${i % 2 ? .42 : .34})` }));
  });
  const hrt = path('M0 -4.6 C-1.3 -7.6 -6 -7.4 -6 -3.6 C-6 -0.4 -2.2 2.2 0 5 C2.2 2.2 6 -0.4 6 -3.6 C6 -7.4 1.3 -7.6 0 -4.6 Z',
    { fill: foil, class: 'fl-heart', transform: 'translate(106 44)' });
  s.append(hrt);
  return s;
}

/* butterfly — wings flap via CSS on children, flight via GSAP MotionPath */
export function butterfly(cls = '') {
  const s = svgEl('-30 -24 60 48', `orn-bfly ${cls}`.trim());
  const upL = path('M-1 -2 C-6 -16 -20 -21 -26 -14 C-31 -8 -24 1 -14 3 C-8 4.2 -2.6 2.2 -1 -2 Z', { class: 'wing wing--l' });
  const upR = path('M1 -2 C6 -16 20 -21 26 -14 C31 -8 24 1 14 3 C8 4.2 2.6 2.2 1 -2 Z', { class: 'wing wing--r' });
  const loL = path('M-1.4 1 C-8 3 -13 9 -9.5 12.4 C-6 15.6 -1.6 10.6 -1 5 Z', { class: 'wing wing--l' });
  const loR = path('M1.4 1 C8 3 13 9 9.5 12.4 C6 15.6 1.6 10.6 1 5 Z', { class: 'wing wing--r' });
  const body = path('M0 -7 C1.7 -7 2.1 4 0 8 C-2.1 4 -1.7 -7 0 -7 Z', { class: 'bfly-body' });
  const antL = path('M0 -6.4 C-2.4 -11.4 -5.4 -12.4 -7.8 -12.4', { fill: 'none', 'stroke-width': .9, 'stroke-linecap': 'round', class: 'bfly-ant' });
  const antR = path('M0 -6.4 C2.4 -11.4 5.4 -12.4 7.8 -12.4', { fill: 'none', 'stroke-width': .9, 'stroke-linecap': 'round', class: 'bfly-ant' });
  const gl = g({ class: 'bfly-wings_l' }, upL, loL);
  const gr = g({ class: 'bfly-wings_r' }, upR, loR);
  s.append(gl, gr, body, antL, antR);
  return s;
}

/* ---------------------------------------------------------------------
   5. SEAL — wax disc with uneven poured edge, embossed crest,
   lit with SVG specular lighting (defs live in index.html: #f-wax)
   --------------------------------------------------------------------- */
export function seal() {
  const s = svgEl('-52 -52 104 104', 'orn-seal');
  // poured blob outline
  let blob = '';
  const N = 26;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r = 44 + 5.5 * Math.sin(a * 5 + 1.2) + 3.4 * Math.sin(a * 3 + 4.1) + 1.8 * Math.sin(a * 11);
    const x = (Math.cos(a) * r).toFixed(2), y = (Math.sin(a) * r).toFixed(2);
    blob += (i ? 'L' : 'M') + x + ' ' + y;
  }
  blob += 'Z';
  // drip accents (poured wax lobes hanging off the edge)
  const drips = path('M30 34 C34 42 30 47 25 44 C21 41 25 36 30 34 Z M-34 28 C-40 34 -45 30 -42 25 C-39 21 -35 23 -34 28 Z M2 -47 C4 -52 9 -52 8 -47 C7.4 -44 3 -44 2 -47 Z', {});
  drips.setAttribute('fill', '#b5842c');
  const wax = g({ class: 'seal-wax' });
  const base = path(blob, { fill: '#b5842c' });
  const shade = path(blob, { fill: 'url(#g-seal-shade)' });
  const lite = path(blob, { filter: 'url(#f-wax)', opacity: .55, fill: '#caa03f' });
  // gradient for seal body
  const defs = document.createElementNS(NS, 'defs');
  defs.innerHTML =
    `<radialGradient id="g-seal-shade" cx=".36" cy=".3" r="1"><stop offset="0" stop-color="#f6dd8f" stop-opacity=".9"/><stop offset=".45" stop-color="#d5a93f" stop-opacity=".35"/><stop offset="1" stop-color="#5f4209" stop-opacity=".65"/></radialGradient>`;
  s.append(defs);
  // inner ring + pressed crest
  const ring = document.createElementNS(NS, 'circle');
  ring.setAttribute('r', 31); ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', '#6b4a0d'); ring.setAttribute('stroke-width', 1.4); ring.setAttribute('opacity', .55);
  const inner = document.createElementNS(NS, 'circle');
  inner.setAttribute('r', 27.6); inner.setAttribute('fill', 'none');
  inner.setAttribute('stroke', '#f7e4a4'); inner.setAttribute('stroke-width', .8); inner.setAttribute('opacity', .5);
  const miniCrest = crest();
  miniCrest.setAttribute('class', 'orn orn-crest seal-crest');
  miniCrest.setAttribute('width', '46'); miniCrest.setAttribute('height', '35');
  miniCrest.removeAttribute('viewBox');
  miniCrest.setAttribute('viewBox', '0 0 120 92');
  const fo = document.createElementNS(NS, 'g');
  fo.setAttribute('transform', 'translate(-23 -16) scale(0.383)');
  fo.append(miniCrest);
  s.append(wax); wax.append(base, shade, lite, drips);
  s.append(ring, inner);
  const pressed = g({ class: 'seal-crest', filter: 'url(#f-emboss-deep)' }, fo);
  s.append(pressed);
  return s;
}

/* ---------------------------------------------------------------------
   6. PROGRAMME LINE ICONS — 40x40, stroke paths ready for draw-on
   --------------------------------------------------------------------- */
const ICONS = {
  procession: ['M6 32 C14 26 26 26 34 32', 'M20 12 L20 28', 'M20 12 C26 10 30 14 34 12 L34 20 C30 22 26 18 20 20', 'M16 32 L24 32'],
  monks: ['M20 7 C24 7 25 12 20 14 C15 12 16 7 20 7 Z', 'M12 33 C12 24 28 24 28 33', 'M9 33 L31 33', 'M20 18 L20 26'],
  alms: ['M9 17 L31 17 C31 27 24 31 20 31 C16 31 9 27 9 17 Z', 'M14 11 C15 8 17 8 18 11', 'M22 10 C23 7 25 7 26 10', 'M6 34 L34 34'],
  rings: ['M17 23 A8 8 0 1 1 17 22.9 Z', 'M26 20 A8 8 0 1 1 26 19.9 Z', 'M20 10 L22 6'],
  ancestors: ['M20 6 C20 10 17 11 18 14 M20 6 C20 10 23 11 22 14', 'M11 16 L29 16 L26 23 C26 27 14 27 14 23 Z', 'M15 31 L25 31', 'M20 27 L20 31'],
  lunch: ['M10 14 C10 21 14 25 20 25 L20 14 Z', 'M30 14 C30 21 26 25 20 25 L20 14 Z', 'M20 25 L20 34', 'M13 34 L27 34', 'M8 10 L14 14', 'M32 10 L26 14'],
  party: ['M9 10 C12 17 16 19 20 20 C24 19 28 17 31 10', 'M20 20 L20 31', 'M14 33 L26 33', 'M11 8 L16 12', 'M29 8 L24 12'],
};
export function icon(key) {
  const s = svgEl('0 0 40 40', `orn-icon orn-icon--${key}`);
  (ICONS[key] || ICONS.rings).forEach((dstr) => {
    s.append(path(dstr, { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'ico-line' }));
  });
  return s;
}

/* ---------------------------------------------------------------------
   7. Scallop clips. CSS `clip-path: polygon()` with densely sampled
   arcs for the flap (percentages = responsive), and real SVG
   <clipPath clipPathUnits="objectBoundingBox>" nodes for photo frames
   (referenced with clip-path: url(#id)).
   --------------------------------------------------------------------- */
export function scallopBottomPoly(n = 15, depth = 9) {
  // closed-envelope flap: full-width rect, scalloped bottom edge
  const pts = ['0 0', `100% 0`, `100% ${100 - depth}%`];
  const steps = 6;                       // samples per scallop
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= steps; j++) {
      const u = (i + j / steps) / n;     // 0..1 along the edge (right → left)
      if (j === 0 && i > 0) continue;
      const t = j / steps;
      const x = 100 - u * 100;
      pts.push(`${x.toFixed(2)}% ${(100 - depth + (depth / 2) * (1 - Math.cos(t * Math.PI * 2))).toFixed(2)}%`);
    }
  }
  pts.push(`0 ${100 - depth}%`);
  return `polygon(${pts.join(', ')})`;
}

let clipN = 0;
export function scallopFrameClip(n = 20, depth = 0.048, topScallop = false) {
  // returns a css url(#id). Frames the image with a scalloped top (and bottom optional)
  const id = `scallop-frame-${++clipN}`;
  let d = `M0 ${topScallop ? depth : 0} `;
  const seg = 1 / n;
  if (topScallop) {
    const steps = 8;
    const pts = [];
    for (let i = 0; i < n * steps; i++) {
      const u = i / (n * steps);
      const bump = (1 - Math.cos(u * n * Math.PI * 2)) / 2;
      pts.push([u, depth * (1 - bump)]);
    }
    pts.forEach(([x, y]) => (d += `L${x.toFixed(4)} ${y.toFixed(4)} `));
    d += `L1 ${1 - depth} `;
    for (let i = n * steps; i >= 0; i--) {
      const u = i / (n * steps);
      const bump = (1 - Math.cos(u * n * Math.PI * 2)) / 2;
      d += `L${u.toFixed(4)} ${(1 - depth * (1 - bump)).toFixed(4)} `;
    }
  } else {
    d = `M0 0 L1 0 L1 ${1 - depth} `;
    const steps = 8;
    for (let i = 0; i <= n * steps; i++) {
      const u = 1 - i / (n * steps);
      const bump = (1 - Math.cos((i / steps) * Math.PI * 2)) / 2;
      d += `L${u.toFixed(4)} ${(1 - depth * (1 - bump)).toFixed(4)} `;
    }
    d += 'L0 0 Z';
  }
  d += 'Z';
  const NSX = 'http://www.w3.org/2000/svg';
  const cp = document.createElementNS(NSX, 'clipPath');
  cp.setAttribute('id', id); cp.setAttribute('clipPathUnits', 'objectBoundingBox');
  let clip = document.getElementById('global-clips');
  if (!clip) {
    clip = document.createElementNS(NSX, 'svg');
    clip.id = 'global-clips';
    clip.setAttribute('width', 0); clip.setAttribute('height', 0);
    clip.style.position = 'absolute';
    const defs = document.createElementNS(NSX, 'defs');
    clip.append(defs); document.body.append(clip);
  }
  const p = document.createElementNS(NSX, 'path');
  p.setAttribute('d', d);
  cp.append(p);
  clip.firstChild.append(cp);
  return `url(#${id})`;
}

/* generic gold scallop LINE (svg) used along the flap edge */
export function scallopLine(n = 18) {
  const w = 720, h = 26, seg = w / n;
  let d = `M0 4`;
  for (let i = 0; i < n; i++) {
    const x0 = i * seg, x1 = x0 + seg / 2, x2 = x0 + seg;
    d += ` C${(x0 + seg * .14).toFixed(1)} ${h} ${(x1 - seg * .14).toFixed(1)} ${h} ${x1.toFixed(1)} ${(h - 6).toFixed(1)}`;
    d += ` C${(x1 + seg * .14).toFixed(1)} ${h} ${(x2 - seg * .14).toFixed(1)} ${h} ${x2.toFixed(1)} 4`;
  }
  const s = svgEl(`0 0 ${w} ${h}`, 'orn-scallopline');
  s.append(path(d, { fill: 'none', stroke: foil, 'stroke-width': 3, 'stroke-linecap': 'round' }));
  return s;
}

export const cornerTL = corner4;
