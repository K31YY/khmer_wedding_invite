import { h, wedding, t, parentLines } from '../utils.js';
import { gsap } from '../gsap-setup.js';
import { scallopFrameClip, butterfly, divider } from '../ornaments.js';

export function buildCouple() {
  const s = h('section.chapter.couple', { id: 'couple' });
  const head = h('div.chapter__head', {},
    h('span.kicker', { 'data-t': 'coupleKicker' }),
  );
  const dv = divider();

  const { groom, bride } = wedding.couple;
  const photo = h('div.couple__photo');
  const frame = h('div.couple__frame');
  const img = h('img', { src: '/img/cozy-m-1280.webp', alt: `${groom.en} & ${bride.en}`, loading: 'lazy', decoding: 'async' });
  img.srcset = '/img/cozy-m-1280.webp 1280w, /img/cozy-m-2000.webp 2000w';
  img.sizes = '(max-width: 880px) 82vw, 34vw';
  const clipId = scallopFrameClip(24, .052, true);
  frame.style.clipPath = clipId;
  frame.append(img);
  const halo = h('div.couple__halo', { 'aria-hidden': 'true' });
  photo.append(halo, frame);

  const bfly = h('div.couple__bfly'); bfly.append(butterfly()); photo.append(bfly);

  const person = (role) => {
    const c = role === 'groom' ? groom : bride;
    return h(`div.person.person--${role}`, { 'data-person': role },
      h('div.caps', { 'data-t': role === 'groom' ? 'groomLabel' : 'brideLabel' }),
      h('h3.person__name.foil-shine', {}, c.fullKm),
      h('div.person__en', {}, c.en),
      h('div.person__parents', {},
        h('span', { 'data-t': role === 'groom' ? 'sonOf' : 'daughterOf' }),
        h('span', { 'data-parents': role }),
      ),
    );
  };

  s.append(head, dv, h('div.couple__stage', {}, person('groom'), photo, person('bride')));

  /* motion: portrait blooms, names wipe in from their sides, bfly crosses */
  gsap.from(frame, {
    scale: .82, opacity: 0, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: photo, start: 'top 76%' },
  });
  gsap.from(halo, { scale: 1.25, opacity: 0, duration: 1.4, scrollTrigger: { trigger: photo, start: 'top 76%' } });
  ['groom', 'bride'].forEach((role) => {
    const p = s.querySelector(`.person--${role}`);
    const nm = p.querySelector('.person__name');
    gsap.from(p, { x: role === 'groom' ? -40 : 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 68%' } });
    gsap.fromTo(nm, { clipPath: role === 'groom' ? 'inset(-40% 110% -40% -10%)' : 'inset(-40% -10% -40% 110%)' }, {
      clipPath: 'inset(-40% -10% -40% -10%)', duration: 1.2, ease: 'power3.inOut', delay: .3,
      onComplete: () => (nm.style.clipPath = 'none'),
      scrollTrigger: { trigger: s, start: 'top 66%' },
    });
  });
  gsap.fromTo(bfly,
    { x: -140, y: -40, opacity: 0, rotate: 10 },
    {
      duration: 2.6, ease: 'power1.inOut', opacity: 1,
      motionPath: { path: [{ x: -110, y: 60 }, { x: -20, y: -185 }, { x: 40, y: -240 }, { x: 110, y: -160 }], curviness: 1.6 },
      scrollTrigger: { trigger: s, start: 'top 62%', once: true },
    });
  bfly.classList.add('anim-flap-once');

  return { el: s };
}
