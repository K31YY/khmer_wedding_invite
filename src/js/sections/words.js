/* 3 · FORMAL INVITATION WORDS — arched photo + both sets of parents on cream paper */
import { h, t, wedding, picSrc } from '../utils.js';
import { gsap, ScrollTrigger } from '../gsap-setup.js';
import { crest, divider } from '../ornaments.js';

export function buildWords() {
  const s = h('section.chapter.words', { id: 'words' });
  const lines = side =>
    h('div.parents', {},
      h('h3.parents__title.foil-text', {}, wedding.parents[side].titleSr[stateLang()]),
      ...parentLines(side).map(txt => h('p.parents__line', {}, txt)),
    );

  const photo = h('div.words__photo');
  photo.append(picSrc('words', '(max-width: 880px) 86vw, 40vw'));

  const card = h('article.paper.words__card');
  card.append(
    (() => { const c = h('div.words__crest'); c.append(crest()); return c; })(),
    h('h2.words__honor.caps', { 'data-t': 'cardHonor' }),
    h('p.words__body', { 'data-t': 'cardBody' }),
    h('div.words__div', {}, (() => { const dd = divider(); return dd; })()),
    h('div.words__parents', {}, lines('groom'), lines('bride')),
    h('div.words__div', {}, divider()),
    h('div.words__couple', {},
      personBlock('cardSon', 'groom'),
      h('span.words__amp.script', {}, '&'),
      personBlock('cardDaughter', 'bride'),
    ),
    h('p.words__date', {},
      h('span', { 'data-t': 'cardWhen' }), ' ',
      h('b', { 'data-td': 'coverDate' })),
    h('p.words__venue', { 'data-venue': 'name' }),
  );
  s.append(h('div.words__grid', {}, photo, card));

  function stateLang() { return document.body.dataset.lang === 'en' ? 'en' : 'km'; }
  function parentLines(side) {
    const p = wedding.parents[side];
    return document.body.dataset.lang === 'en'
      ? [`Mr. ${p.father.en}`, `and Mrs. ${p.mother.en}`]
      : [`លោក ${p.father.km}`, `និង លោកស្រី ${p.mother.km}`];
  }
  function personBlock(tKey, role) {
    const c = wedding.couple[role === 'groom' ? 'groom' : 'bride'];
    return h('div.words__person', {},
      h('small', { 'data-t': tKey }),
      h('b.foil-text.words__name', {}, c.fullKm),
      h('i', {}, c.en),
    );
  }

  /* motion: paper rises, text masks line by line, photo arch reveals */
  gsap.from(photo, {
    clipPath: 'inset(45% 0 45% 0)', opacity: .3, duration: 1.4, ease: 'power3.inOut',
    scrollTrigger: { trigger: s, start: 'top 72%' },
  });
  const maskLines = ['.words__honor', '.words__body', '.parents__title', '.parents__line', '.words__person', '.words__date', '.words__venue'];
  maskLines.forEach((sel, i) => {
    gsap.from(card.querySelectorAll(sel), {
      yPercent: 60, opacity: 0, filter: 'blur(3px)', duration: .9, stagger: .06, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 68%' },
    });
  });
  gsap.from(card, { y: 60, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 74%' } });

  return { el: s, refreshText: () => {
    card.querySelectorAll('.parents').forEach((p, i) => {
      const side = i === 0 ? 'groom' : 'bride';
      const title = p.querySelector('.parents__title');
      title.textContent = wedding.parents[side].titleSr[stateLang()];
      const txts = parentLines(side);
      p.querySelectorAll('.parents__line').forEach((el, j) => (el.textContent = txts[j]));
    });
  } };
}
