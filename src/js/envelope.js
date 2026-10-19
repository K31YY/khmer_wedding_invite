import { h, wedding, t, state, reduced, weak, isTouch, dateParts } from './utils.js';
import { gsap } from './gsap-setup.js';
import { seal, scallopBottomPoly, scallopLine } from './ornaments.js';
import { lockup, animateLockup } from './logo.js';

export function buildEnvelope(mount, { onOpen, onDone } = {}) {
  const d = dateParts();

  /* ---------- the flap scallop clip (shared by front/back/shadow) ---------- */
  const FLAP_SCALLOP = 11;
  const flapClip = scallopBottomPoly(FLAP_SCALLOP, 13);

  /* ---------- DOM ---------- */
  const lockFlap = h('div.env-flap__logo');
  const lockCard = h('div.env-card__logo');
  const gold = scallopLine(FLAP_SCALLOP);
  gold.setAttribute('preserveAspectRatio', 'none');
  gold.classList.add('env-flap__gold');

  const cardInner = h('div.env-card__inner', {},
    lockCard,
    h('div.env-card__rule'),
    h('div.env-card__invite', {}, t('inviteTo')),
    h('div.env-card__date', {}, d.dateLine),
    h('div.env-card__lunar', {}, wedding.lunar.km),
  );
  const card = h('div.env-card', {}, cardInner);
  const cardWrap = h('div.env-card-wrap', {}, card);

  const pocket = h('div.env-pocket', {},
    h('div.env-pocket__panel--bottom'),
    h('div.env-pocket__panel--left'),
    h('div.env-pocket__panel--right'),
  );

  const flapFront = h('div.env-flap.env-flap--front', {}, lockFlap, gold);
  const flapBack = h('div.env-flap.env-flap--back');
  flapFront.style.clipPath = flapClip;
  flapBack.style.clipPath = flapClip;
  const pivot = h('div.env-flap-pivot', {}, flapFront, flapBack);
  const cast = h('div.env-flap-cast');
  cast.style.clipPath = flapClip;

  const sealBox = h('button.env-seal', { type: 'button', 'aria-label': t('tapSeal') },
    h('span.env-seal__shadow', { 'aria-hidden': 'true' }),
    seal(),
  );

  const body = h('div.env-body', {},
    h('div.env-ground', { 'aria-hidden': 'true' }),
    h('div.env-back'),
    cardWrap,
    pocket,
    cast,
    pivot,
    sealBox,
  );
  const stage = h('div.env-stage', {}, body);
  const env = h('div.env', {}, stage);
  mount.append(env);

  /* ---------- lockups ---------- */
  const flapL = lockup({ variant: 'flap', crest: false });
  lockFlap.append(flapL);
  const cardL = lockup({ variant: 'card', crest: true });
  lockCard.append(cardL);

  /* ---------- idle float + tilt ---------- */
  gsap.set(cardWrap, { z: 2, transformStyle: 'preserve-3d' });
  gsap.set(pocket, { z: 6 });
  gsap.set(cast, { z: 11 });
  gsap.set(pivot, { z: 12, rotationX: 0 });
  gsap.set(sealBox, { z: 16 });
  const floatTL = reduced ? null : gsap.timeline({ repeat: -1, yoyo: true })
    .to(stage, { y: -7, rotateZ: .5, duration: 3.1, ease: 'sine.inOut' }, 0);
  if (!reduced && !isTouch) {
    const qx = gsap.quickTo(stage, 'rotateY', { duration: 1.2, ease: 'power3' });
    const qy = gsap.quickTo(stage, 'rotateX', { duration: 1.2, ease: 'power3' });
    window.addEventListener('pointermove', (e) => {
      if (state.opened) return;
      qx((e.clientX / innerWidth - .5) * 8);
      qy(-(e.clientY / innerHeight - .5) * 6);
    }, { passive: true });
  } else if (!reduced && !weak) {
    window.addEventListener('deviceorientation', (e) => {
      if (state.opened) return;
      const b = Math.max(-30, Math.min(30, (e.beta || 45) - 45));
      const g = Math.max(-30, Math.min(30, e.gamma || 0));
      gsap.to(stage, { rotateX: -b * .1, rotateY: g * .12, duration: .8, ease: 'power2.out' });
    }, { passive: true });
  }
  if (!reduced) {
    gsap.to('.env-seal svg', { scale: 1.035, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }
  setTimeout(() => animateLockup(flapL), 1100);

  /* ---------- the 5.5 s opening, slow “by hand” ---------- */
  let busy = false;
  function open() {
    if (busy) return; busy = true; state.opened = true;
    onOpen?.();
    floatTL?.kill();

    gsap.to(['.gate__invite', '.gate__hint'], { opacity: 0, y: -14, duration: .55, ease: 'power2.in' });

    const tl = gsap.timeline({ defaults: { ease: 'hand' } });
    tl
      // press
      .to(sealBox, { scale: .88, duration: .15, yoyo: true, repeat: 1, ease: 'power2.inOut', transformOrigin: '50% 46%' })
      // lift with a growing shadow
      .to('.env-seal__shadow', { scale: 2.4, opacity: .8, duration: .5 }, .3)
      .to(sealBox, { rotate: -15, yPercent: -9, scale: 1.18, duration: .5, ease: 'sine.inOut' }, .55)
      // set aside, past the edge of the screen
      .to(sealBox, { xPercent: 190, yPercent: 640, rotate: 30, scale: 1.5, opacity: 0, duration: .95, ease: 'power2.in' }, .88)
      // flap folds back in 3D; its cast shadow lifts off the pocket
      .to(pivot, { rotateX: -180, duration: 1.5 }, 1.15)
      .to(cast, { opacity: 0, duration: .85, ease: 'power1.out' }, 1.3)
      // card drawn out of the pocket at a slight angle; envelope dips
      .to(cardWrap, { yPercent: -192, rotate: -2.4, z: 5, duration: 1.5 }, 2.05)
      .to(body, { yPercent: 4.5, duration: 1.25, ease: 'sine.out' }, 2.2)
      .add(() => { animateLockup(cardL); gsap.set(pivot, { zIndex: 1 }); }, 2.7)
      // the envelope drops out of frame…
      .to(body, { yPercent: 195, rotate: -2.6, duration: .95, ease: 'power2.in' }, 3.55)
      // …the card comes to the camera
      .to(cardWrap, { yPercent: -345, z: 95, scale: 1.16, duration: 1.3, ease: 'power1.inOut' }, 3.7)
      .to(cardWrap, { scale: 1.05, duration: .5, ease: 'sine.out' }, 5.0)
      // fade through dark into the cover
      .to('#gate-veil', { opacity: 1, duration: .8, ease: 'power1.inOut' }, 5.0)
      .add(() => onDone?.(), '>-.2');

    if (reduced) {
      tl.time(tl.duration());
      tl.pause();
      setTimeout(() => onDone?.(), 700);
    }
  }

  sealBox.addEventListener('click', open);
  return { env, open };
}
