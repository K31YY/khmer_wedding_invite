import { wedding } from '../data/wedding.js';
import { T, KM, EN } from '../i18n/translations.js';

/* ---------- tiny DOM helpers ---------- */
export const $  = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export function h(tag, attrs = {}, ...kids) {
  const i = tag.search(/[.#]/);
  const name = i < 0 ? tag : tag.slice(0, i);
  const cls = i < 0 ? [] : (tag.slice(i).match(/[.#][^.#]+/g) || []).map((s) => s.slice(1));
  const el = document.createElement(name);
  if (cls.length) el.className = cls.join(' ');
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'html') el.innerHTML = v;
    else if (k === 'data' && v && typeof v === 'object') Object.assign(el.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined && v !== false) el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(9)) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
export const svgFrag = (str) => { const t = document.createElement('template'); t.innerHTML = str.trim(); return t.content.firstChild; };

/* ---------- i18n / locale ---------- */
export const state = { lang: localStorage.getItem('w-lang') || 'km', opened: false };
export const t = (key) => (T[state.lang] && T[state.lang][key]) ?? T.km[key] ?? key;
export const kmNum = (v, pad = 2) => {
  let s = pad === false ? String(v) : String(v).padStart(pad, '0');
  return s.replace(/\d/g, (d) => KM.digits[+d]);
};
export const L = (o) => (typeof o === 'string' ? o : o[state.lang] ?? o.km);

/* ---------- dates ---------- */
export const d = new Date(wedding.date);
export const dEnd = new Date(wedding.endDate || wedding.date);
const pad = (n) => String(n).padStart(2, '0');

export function dateParts() {
  const wd = d.getDay();
  return {
    weekdayShort: state.lang === 'km' ? KM.weekdayShort[wd] : EN.weekdayFull[wd],
    weekday:      state.lang === 'km' ? `ថ្ងៃ${KM.weekdayFull[wd]}` : EN.weekdayFull[wd],
    day:   state.lang === 'km' ? kmNum(d.getDate()) : String(d.getDate()),
    month: state.lang === 'km' ? KM.months[d.getMonth()] : EN.months[d.getMonth()],
    year:  state.lang === 'km' ? kmNum(d.getFullYear(), false).replace('២០២៦','២០២៦') : String(d.getFullYear()),
    dateLine: state.lang === 'km'
      ? `ថ្ងៃ${KM.weekdayFull[wd]} ទី${kmNum(d.getDate())} ខែ${KM.months[d.getMonth()]} ឆ្នាំ${kmNum(d.getFullYear(), false)}`
      : `${EN.weekdayFull[wd]} ${d.getDate()} ${EN.months[d.getMonth()]} ${d.getFullYear()}`,
    coverDate: state.lang === 'km'
      ? `${KM.weekdayShort[wd]} ${kmNum(d.getDate())} ${KM.months[d.getMonth()]} ${kmNum(d.getFullYear(), false)}`
      : `${EN.weekdayFull[wd]}, ${d.getDate()} ${EN.months[d.getMonth()]} ${d.getFullYear()}`,
    time: state.lang === 'km' ? `ម៉ោង ${kmNum(d.getHours())}:${kmNum(d.getMinutes())}` : `${pad(((d.getHours()+11)%12)+1)}:${pad(d.getMinutes())} ${d.getHours() < 12 ? 'AM' : 'PM'}`,
    lunar: wedding.lunar[state.lang] || wedding.lunar.km,
    icsStamp: `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`,
    icsEnd:   `${dEnd.getUTCFullYear()}${pad(dEnd.getUTCMonth() + 1)}${pad(dEnd.getUTCDate())}T${pad(dEnd.getUTCHours())}${pad(dEnd.getUTCMinutes())}00Z`,
  };
}

/* ---------- parents blocks: "លោក X" / "និង លោកស្រី Y" ---------- */
export function parentLines(side) {
  const p = wedding.parents[side];
  if (state.lang === 'km') {
    return [`លោក ${p.father.km}`, `និង លោកស្រី ${p.mother.km}`];
  }
  return [`Mr. ${p.father.en}`, `and Mrs. ${p.mother.en}`];
}

/* ---------- device probes ---------- */
export const isTouch = matchMedia('(hover: none)').matches;
export const coarseSmall = matchMedia('(max-width: 500px)').matches;
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const weak =
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
  (navigator.deviceMemory && navigator.deviceMemory <= 3);
export const desktopBig = matchMedia('(min-width: 861px)').matches;

/* ---------- foil class is CSS; helpers for picture srcset ---------- */
export function picSrc(name, sizes = '100vw', portrait = true) {
  // resolves to /img/{name}-m-{640,1280,2000}.webp (portrait crop) or -w-
  const s = (w) => `/img/${name}-${portrait ? 'm' : 'w'}-${w}.webp`;
  const pic = h('picture');
  const src1 = h('source', { media: '(max-aspect-ratio: 1/1)', srcset: `${s(640)} 640w, ${s(1280)} 1280w, ${s(2000)} 2000w`, sizes });
  const img = h('img', { src: s(1280), srcset: s(1280) + ' 1280w, ' + s(2000) + ' 2000w', sizes, alt: '', loading: 'lazy', decoding: 'async' });
  pic.append(src1, img);
  return pic;
}

export function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------- .ics calendar file ---------- */
export function downloadICS() {
  const p = dateParts();
  const g = wedding.couple;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//khmer-wedding//invite//KM', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${p.icsStamp}-${g.groom.en}@khmer-wedding`,
    `DTSTAMP:${p.icsStamp}`,
    `DTSTART:${p.icsStamp}`,
    `DTEND:${p.icsEnd}`,
    `SUMMARY:${g.groom.fullKm || g.groom.en.toLowerCase()} & ${g.bride.fullKm || g.bride.en.toLowerCase()}'s Wedding` /* keep ascii safe below */,
    `DESCRIPTION:The wedding of ${g.groom.en} & ${g.bride.en}`,
    `LOCATION:${L(wedding.venue.name)}, ${L(wedding.venue.address)}`,
    `URL:${wedding.url}`,
    'END:VEVENT', 'END:VCALENDAR',
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
  const a = h('a', { href: URL.createObjectURL(blob), download: 'wedding.ics' });
  document.body.append(a); a.click(); a.remove();
}

export { wedding };
