/* 9 · GALLERY — masonry grid + swipeable full-screen viewer */
import { h, wedding, reduced } from '../utils.js';
import { gsap } from '../gsap-setup.js';
import { divider } from '../ornaments.js';

let PHOTOS = [
  // replaced by manifest if /img/gallery.json exists
  ...['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'].map((n, i) => ({
    id: n, ar: [0.66, 1.25, 0.8, 1.5, 0.72, 1.2, 0.9, 1.35, 0.7, 1.1][i],
  })),
];

export function buildGallery() {
  const s = h('section.chapter.gallery', { id: 'gallery' });
  const head = h('div.chapter__head', {},
    h('span.kicker', { 'data-t': 'galleryKicker' }),
  );
  const grid = h('div.gallery__grid');
  let list = [];

  function render() {
    grid.innerHTML = '';
    list = PHOTOS.map((p, i) => {
      const img = h('img', {
        src: `/img/${p.id}-m-640.webp`, alt: '', loading: 'lazy', decoding: 'async',
        style: `aspect-ratio: ${p.ar || 0.8}`,
      });
      img.srcset = `/img/${p.id}-m-640.webp 640w, /img/${p.id}-m-1280.webp 1280w`;
      img.sizes = '(min-width: 900px) 30vw, 46vw';
      const fig = h('button.gallery__cell', { type: 'button', 'aria-label': `Photo ${i + 1}` }, img);
      fig.addEventListener('click', () => openLb(i));
      grid.append(fig);
      return fig;
    });
    if (!reduced) {
      gsap.from(grid.children, {
        y: 46, opacity: 0, scale: .97, duration: .9, stagger: .055, ease: 'power3.out',
        scrollTrigger: { trigger: grid, start: 'top 80%' },
      });
    }
  }
  fetch('/img/gallery.json').then((r) => r.ok ? r.json() : null)
    .then((j) => { if (j?.length) { PHOTOS = j; } render(); })
    .catch(() => render());

  s.append(head, divider(), grid);
  return { el: s };
}

/* ---------------- lightbox ---------------- */
let lbIndex = 0, lbOpen = false;
function openLb(i) {
  const dlg = document.getElementById('lightbox');
  lbIndex = i; lbOpen = true;
  document.body.classList.add('lb-open');
  showLb();
  if (!dlg.open) dlg.showModal();
  document.getElementById('lb-close').focus?.();
}
function showLb() {
  const p = PHOTOS[lbIndex];
  const img = document.getElementById('lb-img');
  img.src = `/img/${p.id}-m-1280.webp`;
  img.srcset = `/img/${p.id}-m-1280.webp 1280w, /img/${p.id}-m-2000.webp 2000w`;
  img.sizes = '100vw';
  const cap = document.getElementById('lb-cap');
  const title = (wedding.galleryCaptions || {})[p.id];
  cap.textContent = title ? (document.body.dataset.lang === 'en' ? title.en || title : title.km || title) : '';
  document.getElementById('lb-count').textContent =
    `${lbIndex + 1} / ${PHOTOS.length}`;
}
function stepLb(d) {
  lbIndex = (lbIndex + d + PHOTOS.length) % PHOTOS.length;
  const img = document.getElementById('lb-img');
  gsap.fromTo(img, { opacity: .2, x: d * 46 }, { opacity: 1, x: 0, duration: .5, ease: 'power3.out' });
  showLb();
}
export function wireLightbox() {
  const dlg = document.getElementById('lightbox');
  document.getElementById('lb-close').addEventListener('click', () => { dlg.close(); lbOpen = false; document.body.classList.remove('lb-open'); });
  document.getElementById('lb-prev').addEventListener('click', () => stepLb(-1));
  document.getElementById('lb-next').addEventListener('click', () => stepLb(1));
  document.addEventListener('keydown', (e) => {
    if (!dlg.open) return;
    if (e.key === 'ArrowRight') stepLb(1);
    if (e.key === 'ArrowLeft') stepLb(-1);
  });
  // swipe
  let x0 = null;
  dlg.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
  dlg.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 46) stepLb(dx < 0 ? 1 : -1);
    x0 = null;
  }, { passive: true });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) { dlg.close(); document.body.classList.remove('lb-open'); } });
}
