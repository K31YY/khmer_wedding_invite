import { h, wedding, L, t } from '../utils.js';
import { gsap } from '../gsap-setup.js';
import { divider } from '../ornaments.js';

export function buildGift() {;
  const s = h('section.chapter.gift', { id: 'gift' });

  const note = h('p.gift__note', { 'data-t': 'giftNote' });
  const cards = h('div.gift__cards');

  wedding.gifts.forEach((g, i) => {
    const qr = h('img.gift__qr', { src: g.file, alt: 'KHQR', loading: 'lazy', width: '300', height: '300' });
    const save = h('button.btn.btn--dark.gift__save', { type: 'button' });
    save.append(h('span', { 'data-t': 'saveQr' }));
    save.addEventListener('click', async () => {
      try {
        const r = await fetch(g.file);
        const b = await r.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = g.file.split('/').pop() || `khqr-${i + 1}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      } catch (e) { /* file will exist for real deployments */ }
    });
    const card = h('figure.paper.gift__card', {},
      qr,
      h('figcaption.gift__cap', {},
        h('b.gift__holder', {}, g.holder),
        h('span.gift__label', { 'data-gift-label': i }, L(g.label)),
      ),
      save,
    );
    cards.append(card);
  });

  s.append(
    h('div.chapter__head', {}, h('span.kicker.gift__title', { 'data-t': 'giftKicker' })),
    divider(),
    note, cards,
  );

  gsap.from('.gift__card', { y: 62, opacity: 0, rotate: -1.4, duration: 1, stagger: .16, ease: 'power3.out', scrollTrigger: { trigger: cards, start: 'top 82%' } });
  return { el: s, relabel: () => s.querySelectorAll('[data-gift-label]').forEach((el) => (el.textContent = L(wedding.gifts[+el.dataset.giftLabel].label))) };
}
