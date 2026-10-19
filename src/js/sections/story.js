import { h, wedding, reduced } from '../utils.js';
import { gsap, ScrollTrigger } from '../gsap-setup.js';

export function buildStory() {
  const s = h('section.story', { id: 'story', style: '--sky-a:#4d5a3a;--sky-b:#11130b' });
  const sky = h('div.story__sky', { 'aria-hidden': 'true' });
  const pin = h('div.story__pin');
  const track = h('div.story__track');

  const intro = h('div.story__intro', {},
    h('span.kicker', { 'data-t': 'storyKicker' }),
    h('h2.story__title', { 'data-t': 'storyTitle' }),
    h('div.caps.story__hint', { 'data-t': 'storyHint' }),
  );
  track.append(intro);

  const cards = wedding.story.map((st, i) => {
    const img = h('img', { src: `/img/${st.photo}-m-1280.webp`, alt: '', loading: 'lazy', decoding: 'async' });
    img.srcset = `/img/${st.photo}-m-640.webp 640w, /img/${st.photo}-m-1280.webp 1280w`;
    img.sizes = '78vw';
    const photo = h('div.storycard__photo', {}, img);
    const cap = h('figcaption.storycard__cap', { 'data-story-i': i }, st.km);
    return h('figure.storycard', {}, photo, cap);
  });
  track.append(...cards);
  track.append(h('div.story__end', { 'aria-hidden': 'true' }));
  pin.append(track);
  s.append(sky, pin);

  /* pinned horizontal run */
  let api = null;
  const makeST = () => {
    if (api) api.kill(true); // reset the text to top before measuring again
    ScrollTrigger.getAll().forEach((x) => { if (x.vars?.id === 'story') x.kill(true); });
    api = null;
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 40);
    api = gsap.timeline({
      scrollTrigger: {
        id: 'story', trigger: s, pin: pin, scrub: .8, invalidateOnResize: true,
        start: 'top top', end: () => '+=' + (dist() + window.innerHeight * 0.55),
        onUpdate: ({ progress }) => {
          const a = mix('#4d5a3a', '#160f14', progress);
          const b = mix('#11130b', '#0a0708', progress);
          s.style.setProperty('--sky-a', a);
          s.style.setProperty('--sky-b', b);
        },
      },
    });
    api.to(track, {
      x: () => -dist(), ease: 'none', duration: 1,
    }, 0);
    cards.forEach((c) => {
      api.fromTo(c.querySelector('img'), { xPercent: 12 }, { xPercent: -6, ease: 'none', duration: 1 }, 0);
      api.fromTo(c.querySelector('figcaption'), { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .3 }, .12);
    });
    return api;
  };
  makeST();

  function mix(c1, c2, t) {
    const p = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const [r1, g1, b1] = p(c1); const [r2, g2, b2] = p(c2);
    const l = (a, b) => Math.round(a + (b - a) * t);
    return `rgb(${l(r1, r2)} ${l(g1, g2)} ${l(b1, b2)})`;
  }

  function relabel() {
    cards.forEach((c, i) => {
      c.querySelector('figcaption').textContent =
        document.body.dataset.lang === 'en' ? wedding.story[i].en : wedding.story[i].km;
    });
  }

  if (reduced) {
    gsap.set(track, { x: 0 });
    ScrollTrigger.getAll().forEach((x) => { if (x.vars?.id === 'story') x.kill(true); });
    gsap.from(cards, { y: 60, opacity: 0, stagger: .2, scrollTrigger: { trigger: s, start: 'top 70%' } });
    s.classList.add('story--flat');
  }

  return { el: s, relabel };
}
