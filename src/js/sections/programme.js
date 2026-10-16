/* 6 · PROGRAMME — a gold thread draws down the paper as you scroll;
   each ritual's line icon draws itself and lights up. */
import { h, wedding, state, kmNum } from '../utils.js';
import { gsap } from '../gsap-setup.js';
import { icon, divider } from '../ornaments.js';

export function buildProgramme() {
  const s = h('section.chapter.programme', { id: 'programme' });

  const card = h('article.paper.programme__card');
  const head = h('div.programme__head', {},
    h('h2.programme__title', { 'data-t': 'programmeTitle' }),
  );
  const dd = divider();
  const thread = h('div.thread', { 'aria-hidden': 'true' }, h('i.thread__line'));
  const list = h('div.programme__list');

  wedding.programme.forEach((it, i) => {
    const ic = h('span.prog__icon'); ic.append(icon(it.icon));
    const row = h('div.prog', {},
      h('span.prog__time.foil-text', {}, state.lang === 'km' ? `${kmNum(it.time.slice(0, 2))}:${kmNum(it.time.slice(3))}` : it.time),
      ic,
      h('span.prog__label', { 'data-prog-i': i }, it.km),
    );
    row.dataset.t2 = i;
    list.append(row);
  });

  card.append(head, dd, h('div.programme__body', {}, thread, list));
  s.append(card);

  /* time relabels on lang flip */
  const rows = [...list.querySelectorAll('.prog')];
  function relabel() {
    rows.forEach((r, i) => {
      const it = wedding.programme[i];
      r.querySelector('.prog__time').textContent = state.lang === 'km' ? `${kmNum(it.time.slice(0, 2))}:${kmNum(it.time.slice(3))}` : it.time;
      r.querySelector('.prog__label').textContent = state.lang === 'km' ? it.km : it.en;
    });
  }
  relabel();

  /* motion */
  gsap.from(card, { y: 70, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 80%' } });
  gsap.from(head, { opacity: 0, duration: .9, scrollTrigger: { trigger: card, start: 'top 76%' } });
  gsap.from('.thread__line', {
    scaleY: 0, transformOrigin: '50% 0',
    scrollTrigger: { trigger: list, start: 'top 78%', end: 'bottom 62%', scrub: .6 },
  });
  rows.forEach((r, i) => {
    const ic = r.querySelector('.prog__icon svg');
    gsap.from(ic.querySelectorAll('path'), {
      drawSVG: '0%', duration: 1.1, stagger: .18, ease: 'power1.inOut',
      scrollTrigger: { trigger: r, start: 'top 74%', once: true },
    });
    gsap.from(r, { x: 26, opacity: 0, duration: .8, delay: .25, ease: 'power3.out', scrollTrigger: { trigger: r, start: 'top 74%', once: true } });
    ScrollTriggerCreate(r, ic);
  });
  function ScrollTriggerCreate(r, ic) {
    gsap.timeline({ scrollTrigger: { trigger: r, start: 'top 70%', once: true } })
      .add(() => r.classList.add('lit'), 0)
      .to(ic, { scale: 1.12, duration: .25, yoyo: true, repeat: 1, ease: 'power2.out' }, 0);
  }

  return { el: s, relabel };
}
