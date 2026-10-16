/* COVER / HERO — merged with the hero: darkened couple photo + full invitation cover */
import { h, svgFrag, t, wedding, picSrc, isTouch, reduced, desktopBig } from '../utils.js';
import { gsap } from '../gsap-setup.js';
import { lockup, animateLockup } from '../logo.js';
import { crest, divider } from '../ornaments.js';

export function buildCover() {
  const s = h('section.cover', { id: 'cover' });

  const media = h('div.cover__media');
  media.append(picSrc('hero', '100vw'));
  media.append(h('div.cover__shade'));

  const corners = h('div.cover__corners', { 'aria-hidden': 'true' });
  for (const dir of ['tl', 'tr', 'bl', 'br']) {
    const slot = h(`span.cc.cc--${dir}`);
    slot.dataset.cnr = dir;
    corners.append(slot);
  }

  const lock = lockup({ variant: 'cover' });
  const enNames = h('div.cover__en', {}, 
    h('span', {}, wedding.couple.groom.en),
    h('i.script', {}, '&'),
    h('span', {}, wedding.couple.bride.en),
  );

  const chips = h('div.cover__chips', { role: 'list' });
  [['dayLabel', 'weekdayShort'], ['dateLabel', 'day'], ['monthLabel', 'month'], ['yearLabel', 'year']]
    .forEach(([lab, key]) => {
      chips.append(h('span.chip-d', { role: 'listitem' },
        h('small.chip-d__lab', { 'data-t': lab }),
        h('b.chip-d__val', { 'data-td': key }),
      ));
    });

  const venue = h('div.cover__venue', {},
    h('span', { 'data-venue': 'name' }),
    h('i.ar', {}, '·'),
    h('span', { 'data-venue': 'address' }),
  );

  const cue = h('a.cover__cue', { href: '#words' },
    h('span', { 'data-t': 'scrollOpen' }),
    svgFrag('<svg viewBox="0 0 24 26" aria-hidden="true"><path d="M12 3 L12 17 M5.5 11.5 L12 18.5 L18.5 11.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'),
  );

  const crestEl = h('div.cover__crest'); crestEl.append(crest());
  const inner = h('div.cover__inner', {},
    crestEl,
    h('h1.cover__kicker.foil-shine', { 'data-t': 'kicker' }),
    h('div.cover__sub', { 'data-t': 'weddingInvitation' }),
    lock,
    enNames,
    h('div.cover__invite', { 'data-t': 'inviteTo' }),
    chips,
    h('div.cover__lunar', { 'data-lunar': '' }),
    venue,
    cue,
  );
  s.append(media, corners, inner);

  /* corner ornaments are injected via ornaments.cornerOne by main (shared) */
  setTimeout(() => import('../ornaments.js').then(({ cornerOne }) => {
    corners.querySelectorAll('.cc').forEach((slot) => {
      const sv = cornerOne(slot.dataset.cnr);
      sv.setAttribute('width', '100%'); sv.setAttribute('height', '100%');
      slot.append(sv);
    });
  }), 0);

  function reveal() {
    autofit();
    document.fonts?.ready.then(() => autofit());
    addEventListener('resize', autofit, { passive: true });
    const tl = gsap.timeline({ defaults: { ease: 'silk' } });
    tl.fromTo(media, { opacity: 0 }, { opacity: 1, duration: 1.1 }, 0)
      .fromTo(media.querySelector('img'), { scale: 1.14 }, { scale: 1, duration: 6.5, ease: 'sine.out' }, 0)
      .from('.cover__corners .cc', { opacity: 0, duration: 1.1, stagger: .12 }, .2);

    s.querySelectorAll('.cover__inner > *').forEach((el, i) => {
      tl.fromTo(el, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .95 }, .35 + i * (.085));
    });
    tl.add(() => animateLockup(lock), .55);
    if (!reduced) {
      tl.from(cue.querySelector('svg'), { y: -6, duration: .6, yoyo: true, repeat: 1 }, '>-.4');
    }
    return tl;
  }

  /* keep the whole cover on ONE screen at any viewport */
  function autofit() {
    inner.style.scale = '1';
    inner.style.translate = '0 0';
    const kids = [...inner.children].filter((k) => !k.classList.contains('cover__cue'));
    for (let pass = 0; pass < 3; pass++) {
      const top = Math.min(...kids.map((k) => k.getBoundingClientRect().top));
      const bot = Math.max(...kids.map((k) => k.getBoundingClientRect().bottom));
      const need = (bot - top) + 26;                       // breathing room
      const avail = innerHeight - 14 - 76;                  // below HUD
      if (need <= avail && top >= 68) break;
      const f = Math.max(.42, Math.min(1, parseFloat(inner.style.scale || 1) * (avail / need)));
      inner.style.scale = f.toFixed(3);
      const t2 = Math.min(...kids.map((k) => k.getBoundingClientRect().top));
      const b2 = Math.max(...kids.map((k) => k.getBoundingClientRect().bottom));
      inner.style.translate = `0 ${(36 + innerHeight / 2 - (t2 + b2) / 2).toFixed(1)}px`;
    }
  }

  /* pre-hidden until the gate has opened */
  gsap.set([...s.querySelectorAll('.cover__inner > *')], { opacity: 0 });
  gsap.set(media, { opacity: 0 });

  return { el: s, reveal };
}
