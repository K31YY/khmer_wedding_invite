/* =====================================================================
   ENTRY — assembles the invitation.
   ===================================================================== */
import '@fontsource/moul/400.css';
import '@fontsource/moulpali/400.css';
import '@fontsource/pinyon-script/400.css';
import '@fontsource-variable/kantumruy-pro/index.css';
import '@fontsource-variable/cormorant-garamond/index.css';
import './styles/base.css';
import './styles/logo.css';
import './styles/envelope.css';
import './styles/sections.css';

import { gsap, ScrollTrigger } from './js/gsap-setup.js';
import Lenis from 'lenis';
import {
  $, $$, h, state, t, wedding, dateParts, L, reduced, isTouch, desktopBig, toast, parentLines,
} from './js/utils.js';
import { buildEnvelope } from './js/envelope.js';
import { miniLockup } from './js/logo.js';
import { buildCover } from './js/sections/cover.js';
import { buildWords } from './js/sections/words.js';
import { buildCouple } from './js/sections/couple.js';
import { buildCountdown } from './js/sections/countdown.js';
import { buildProgramme } from './js/sections/programme.js';
import { buildStory } from './js/sections/story.js';
import { buildPond } from './js/sections/pond.js';
import { buildGallery, wireLightbox } from './js/sections/gallery.js';
import { buildVenue } from './js/sections/venue.js';
import { buildGift } from './js/sections/gift.js';
import { buildThanks } from './js/sections/thanks.js';
import { initMusic, musicPlaying } from './js/music.js';
import { corner4, crest, divider } from './js/ornaments.js';

/* weak-device flag for lighter motion */
if (reduced || (isTouch && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)) {
  document.body.classList.add('device-lite');
}
document.fonts?.ready.then(() => ScrollTrigger.refresh());

/* ================= language application ================= */
let langHooks = [];
export function applyLang(lang) {
  if (lang) { state.lang = lang; localStorage.setItem('w-lang', lang); }
  document.body.dataset.lang = state.lang;
  document.documentElement.lang = state.lang === 'km' ? 'km' : 'en';

  $$('[data-t]').forEach((el) => (el.textContent = t(el.dataset.t)));
  $$('[data-td]').forEach((el) => {
    const p = dateParts();
    el.textContent = p[el.dataset.td] ?? '';
  });
  $$('[data-bi]').forEach((el) => {
    const [a, b] = el.dataset.bi.split('|');
    el.innerHTML = state.lang === 'km'
      ? `<b class="km-first">${a}</b><i>${b}</i>`
      : `<b>${b}</b><i>${a}</i>`;
  });
  $$('[data-parents]').forEach((el) => {
    el.innerHTML = parentLines(el.dataset.parents).join('<br/>');
  });
  $$('[data-venue]').forEach((el) => {
    el.textContent = L(wedding.venue[el.dataset.venue]);
  });
  $$('[data-lunar]').forEach((el) => {
    el.textContent = wedding.lunar[state.lang] || wedding.lunar.km;
  });
  $('#lang-toggle').innerHTML =
    state.lang === 'km'
      ? '<span class="lg-on">ខ្មែរ</span><span class="lg-sep">/</span><span>EN</span>'
      : '<span>ខ្មែរ</span><span class="lg-sep">/</span><span class="lg-on">EN</span>';
  $('#gate-kicker').textContent = t('kicker');
  $('#gate-sub').textContent = t('weddingInvitation');
  $('#gate-hint').textContent = t('tapSeal');
  document.title = `${t('kicker')} · ${wedding.couple.groom.shortKm} & ${wedding.couple.bride.shortKm}`;
  langHooks.forEach((f) => f?.());
  ScrollTrigger.refresh();
}

/* ================= boot ================= */
const app = $('#app');
const sections = {
  cover: buildCover(), words: buildWords(), couple: buildCouple(),
  countdown: buildCountdown(), programme: buildProgramme(), story: buildStory(),
  pond: buildPond(), gallery: buildGallery(), venue: buildVenue(),
  gift: buildGift(), thanks: buildThanks(),
};
Object.values(sections).forEach((s) => app.append(s.el));
langHooks = [
  () => sections.words.refreshText?.(),
  () => sections.programme.relabel?.(),
  () => sections.story.relabel?.(),
  () => sections.gift.relabel?.(),
  () => dispatchEvent(new Event('resize')),
];
wireLightbox();

/* HUD */
$('#hud-logo').append(miniLockup());
$('#lang-toggle').addEventListener('click', () => applyLang(state.lang === 'km' ? 'en' : 'km'));
applyLang(state.lang);

/* footer */
$('#footer-names').textContent = `${wedding.couple.groom.fullKm} & ${wedding.couple.bride.fullKm}`;

/* envelope gate */
const gate = $('#gate');
$('#gate-bg').style.backgroundImage = `url(/img/hero-m-1280.webp)`;
buildEnvelope($('#env-mount'), {
  onOpen: () => initMusic(true),
  onDone: revealSite,
});

/* scroll: Lenis on desktop-pointer only; native touch scroll elsewhere */
let lenis = null;
if (!isTouch && !reduced) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: .85 });
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);
}

/* top-bar veil after scroll */
addEventListener('scroll', () => {
  $('#hud').classList.toggle('solid', scrollY > 40);
}, { passive: true });

function revealSite() {
  document.body.classList.remove('is-locked');
  $('#gate').classList.add('gate--out');
  $('#hud').classList.add('show');
  sections.cover.reveal?.(lenis);
  setTimeout(() => { gate.style.display = 'none'; }, 1200);
}

/* music chip */
$('#music-toggle').addEventListener('click', () => {
  const on = initMusic(false, true);
  $('#music-toggle').setAttribute('aria-pressed', String(!!on));
});

export { sections, applyLang as refresh };
