/* 5 · COUNTDOWN — Khmer numerals, slow blessing marquee drifting behind */
import { h, kmNum, state, wedding, reduced } from '../utils.js';
import { gsap } from '../gsap-setup.js';

export function buildCountdown() {
  const s = h('section.chapter.countdown', { id: 'countdown' });

  /* blessing marquee (two directions, like incense smoke drifting) */
  const mq = h('div.marquee', { 'aria-hidden': 'true' },
    track(1), track(-1),
  );
  function track(rev) {
    const items = () => (wedding.blessings[state.lang] || wedding.blessings.km)
      .flatMap((b) => [h('span', {}, b), h('i', {}, '✦')]);
    const a = h('div.marquee__run', { style: rev < 0 ? 'animation-direction: reverse' : '' });
    a.append(...items(), ...items(), ...items());
    return h('div.marquee__lane', {}, a);
  }

  const head = h('div.countdown__head', {},
    h('span.kicker', { 'data-t': 'countdownKicker' }),
  );

  const grid = h('div.countdown__grid', { 'aria-live': 'off' });
  const cells = {};
  [['d', 'days'], ['h', 'hours'], ['m', 'minutes'], ['s', 'seconds']].forEach(([u, lab]) => {
    const val = h('span.count__num.foil-text', {}, '០០');
    cells[u] = val;
    grid.append(h('div.count__unit', {},
      val,
      h('span.count__label.caps', { 'data-t': lab }),
    ));
  });

  const when = h('div.countdown__when', {},
    h('div.countdown__date', { 'data-td': 'dateLine' }),
    h('div.countdown__time', { 'data-td': 'time' }),
  );

  s.append(mq, head, grid, when);

  /* the tick */
  const target = new Date(wedding.date).getTime();
  function tick() {
    let diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 864e5);
    const hrs = Math.floor(diff / 36e5) % 24;
    const min = Math.floor(diff / 6e4) % 60;
    const sec = Math.floor(diff / 1e3) % 60;
    const fmt = (n) => (state.lang === 'km' ? kmNum(n, String(n).length < 2 ? 2 : false) : String(n).padStart(2, '0'));
    set(cells.d, fmt(days)); set(cells.h, fmt(hrs)); set(cells.m, fmt(min)); set(cells.s, fmt(sec));
  }
  function set(el, v) {
    if (el.textContent !== v) {
      el.textContent = v;
      if (el.dataset.u === 's' && !reduced) {
        gsap.fromTo(el, { scale: 1.06 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
      }
    }
  }
  Object.entries(cells).forEach(([u, el]) => el.dataset.u = u);
  tick();
  setInterval(tick, 1000);

  /* entrance: units drop like a flip clock, one breath apart */
  gsap.from(grid.children, {
    yPercent: 90, opacity: 0, rotateX: -50, transformPerspective: 500,
    duration: 1, stagger: .14, ease: 'power3.out',
    scrollTrigger: { trigger: s, start: 'top 72%' },
  });
  gsap.from(head, { opacity: 0, y: 20, duration: .9, scrollTrigger: { trigger: s, start: 'top 76%' } });

  return { el: s };
}
