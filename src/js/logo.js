/* =====================================================================
   ឡូហ្គោឈ្មោះ — the couple's name logo used everywhere:
   groom top-left, bride bottom-right (Moulpali, gold foil), joined by
   a flourish line, a small heart and a butterfly, under a crest.
   Khmer names are HTML text layered over the SVG flourish.
   ===================================================================== */
import { h, svgFrag, wedding, state } from './utils.js';
import { crest, flourish, butterfly } from './ornaments.js';
import { gsap, MotionPathPlugin } from './gsap-setup.js';

let uid = 0;

export function lockup({ variant = 'cover', crest: withCrest = null } = {}) {
  const { groom, bride } = wedding.couple;
  const showCrest = withCrest ?? !['mini', 'flap-mini'].includes(variant);
  const el = h(`div.lock.lock--${variant}`, { 'data-lock': ++uid });
  if (showCrest) {
    const c = h('div.lock__crest'); c.append(crest()); el.append(c);
  }
  const field = h('div.lock__field');
  const fl = flourish();
  const bfly = h('div.lock__bfly'); bfly.append(butterfly());
  field.append(
    h('span.lock__g.foil-shine', { 'data-km-name': 'groom' }, groom.shortKm),
    fl,
    h('span.lock__b.foil-shine', { 'data-km-name': 'bride' }, bride.shortKm),
    bfly,
  );
  el.append(field);
  return el;
}

/* reveal: names left→right, flourish draws, heart pops, bfly flies in */
export function animateLockup(el, tl = gsap.timeline(), at = 0) {
  const g = el.querySelector('.lock__g');
  const b = el.querySelector('.lock__b');
  const stem = el.querySelector('.fl-stem');
  const leafs = [...el.querySelectorAll('.fl-draw path:not(.fl-stem)')];
  const heart = el.querySelector('.fl-heart');
  const bfly = el.querySelector('.lock__bfly');
  const wings = el.querySelectorAll('.wing');
  const crestEl = el.querySelector('.lock__crest');

  if (!stem) return tl;
  const len = stem.getTotalLength();
  stem.style.strokeDasharray = len;
  stem.style.strokeDashoffset = len;

  tl.addLabel('lock', at);
  if (crestEl) {
    tl.from(crestEl.firstElementChild, { scale: .4, opacity: 0, transformOrigin: '50% 80%', duration: .9, ease: 'back.out(1.6)' }, 'lock');
  }
  tl.fromTo(g, { clipPath: 'inset(-40% 111% -40% -12%)' },
    { clipPath: 'inset(-40% -12% -40% -12%)', duration: 1.0, ease: 'power3.inOut', onStart: () => { }, onComplete: () => g.style.clipPath = 'none' }, 'lock+=.1');
  tl.to(stem, { strokeDashoffset: 0, duration: 1.15, ease: 'power2.inOut' }, 'lock+=.35');
  tl.from(leafs, { opacity: 0, scale: .2, transformOrigin: 'left center', duration: .5, stagger: .07, ease: 'back.out(2)' }, 'lock+=.7');
  tl.fromTo(b, { clipPath: 'inset(-40% -12% -40% 111%)' },
    { clipPath: 'inset(-40% -12% -40% -12%)', duration: 1.0, ease: 'power3.inOut', delay: .25, onComplete: () => b.style.clipPath = 'none' }, 'lock+=.5');
  if (heart) {
    tl.from(heart, { scale: 0, transformOrigin: 'center', duration: .55, ease: 'back.out(3)' }, 'lock+=1.2');
  }
  if (bfly) {
    tl.fromTo(bfly, { x: -46, y: -30, opacity: 0, scale: .5 },
      { opacity: 1, duration: .3 }, 'lock+=1.25');
    tl.to(bfly, {
      duration: 1.5, ease: 'power1.inOut', opacity: 1,
      motionPath: {
        path: [{ x: -46, y: -30 }, { x: -8, y: -52 }, { x: 34, y: -40 }, { x: 70, y: -18 }, { x: 96, y: -30 }],
        curviness: 1.4, autoRotate: false,
      },
    }, 'lock+=1.3');
    if (wings.length) {
      tl.add(() => bfly.classList.add('is-flapping'), 'lock+=1.3');
    }
  }
  return tl;
}

/* ---- HUD mini lockup (initials joined by a small heart line) ---- */
export function miniLockup() {
  const { groom, bride } = wedding.couple;
  const g = groom.shortKm.slice(0, 2), b = bride.shortKm.slice(0, 2);
  const el = h('span.lockmini',
    h('span.foil', {}, g),
    svgFrag('<svg viewBox="0 -8 26 16" class="lockmini__line" aria-hidden="true"><path d="M0 0 C7 -6 12 6 13 0 C14 -6 19 6 26 0" fill="none" stroke="url(#g-foil)" stroke-width="1.6" stroke-linecap="round"/><path class="fl-heart" d="M13 -0.8 C12 -3 8.7 -2.8 8.7 -0.6 C8.7 1.4 11 2.9 13 4.4 C15 2.9 17.3 1.4 17.3 -0.6 C17.3 -2.8 14 -3 13 -0.8 Z" fill="url(#g-foil)" transform="translate(0 6)"/></svg>'),
    h('span.foil', {}, b),
  );
  return el;
}
