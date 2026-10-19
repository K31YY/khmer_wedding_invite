import { h, wedding, L, state, downloadICS, toast, t } from '../utils.js';
import { gsap } from '../gsap-setup.js';
import { crest } from '../ornaments.js';

export function buildVenue() {
  const s = h('section.chapter.venue', { id: 'venue' });
  const [lat, lng] = wedding.venue.pin;

  const crestEl = h('div.venue__crest'); crestEl.append(crest());
  const name = h('h2.venue__name.foil-shine', { 'data-venue': 'name' });
  const addr = h('p.venue__addr', { 'data-venue': 'address' });
  const when = h('p.venue__when', {},
    h('span', { 'data-td': 'dateLine' }), ' · ', h('span', { 'data-td': 'time' }),
  );
  const mapBox = h('div.venue__map');
  const frame = h('iframe', {
    title: 'Google Maps', src: `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`,
    loading: 'lazy', referrerpolicy: 'no-referrer-when-downgrade', allowfullscreen: '',
  });
  mapBox.append(h('div.venue__mapframe', {}, frame));
  const actions = h('div.venue__actions', {},
    h('a.btn', { href: `https://maps.google.com/maps?q=${lat},${lng}`, target: '_blank', rel: 'noopener' },
      h('span', { 'data-t': 'openMap' })),
    h('button.btn', { type: 'button', id: 'ics-btn' }, h('span', { 'data-t': 'addCalendar' })),
  );
  const note = h('p.venue__note', { 'data-t': 'venueNote' });

  s.append(h('span.kicker.venue__kicker', { 'data-t': 'venueKicker' }), crestEl, name, addr, when, mapBox, actions, note);

  s.querySelector('#ics-btn').addEventListener('click', () => { downloadICS(); toast('✓ .ics'); });

  gsap.from('.venue__crest svg', { scale: .5, opacity: 0, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: s, start: 'top 74%' } });
  gsap.from([name, addr, when], { y: 22, opacity: 0, stagger: .1, duration: .9, scrollTrigger: { trigger: s, start: 'top 70%' } });
  gsap.from('.venue__mapframe', { clipPath: 'inset(46% 46% 46% 46%)', opacity: 0, duration: 1.3, ease: 'power3.inOut', scrollTrigger: { trigger: mapBox, start: 'top 82%' } });

  return { el: s };
}
