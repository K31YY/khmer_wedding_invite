import { h, wedding, reduced, weak, isTouch, L } from '../utils.js';
import { gsap } from '../gsap-setup.js';

export function buildPond() {
  const s = h('section.pond', { id: 'pond' });
  const sticky = h('div.pond__sticky');
  const img = h('img.pond__img', { src: '/img/pond-m-1280.webp', alt: '', loading: 'lazy', decoding: 'async' });
  img.srcset = '/img/pond-m-640.webp 640w, /img/pond-m-1280.webp 1280w, /img/pond-m-2000.webp 2000w';
  img.sizes = '100vw';
  const shade = h('div.pond__shade');
  const canvas = h('canvas.pond__canvas');
  const text = h('div.pond__text', {},
    h('div.kicker', { 'data-t': 'pondKicker' }),
    h('div.pond__names', {},
      h('span.foil-text', {}, wedding.couple.groom.shortKm),
      h('i.script', {}, '&'),
      h('span.foil-text', {}, wedding.couple.bride.shortKm)),
    h('div.caps.pond__hint', { 'data-t': 'pondLine' }),
  );
  sticky.append(img, shade, canvas, h('div.pond__glow.pond__glow--a'), h('div.pond__glow.pond__glow--b'), text);
  s.append(sticky);

  /* --- the water canvas: sized to its parent, visibility-checked, never loops resizes --- */
  const ctx = canvas.getContext('2d', { alpha: true });
  let W = 0, H = 0, visible = false, dpr = 1, rafOn = false;
  const ripples = [];
  const lotuses = [];

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !rafOn) start(); }, { threshold: .05 });

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
    canvas.width = W; canvas.height = H;
  }
  function start() {
    rafOn = true;
    const loop = () => {
      if (!visible) { rafOn = false; return; }
      frame();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    // ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.sp; rp.life -= .016;
      if (rp.life <= 0) { ripples.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.ellipse(rp.x, rp.y, rp.r * dpr, rp.r * dpr * .32, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(246, 227, 168, ${Math.max(0, rp.life * .5)})`;
      ctx.lineWidth = 1.4 * dpr;
      ctx.stroke();
    }
    // lotus lanterns
    for (const lo of lotuses) {
      lo.x += lo.vx; lo.y += Math.sin((lo.t += .012)) * .08 * dpr;
      if (lo.x > W + 60) lo.x = -60;
      drawLotus(lo);
    }
  }
  function drawLotus(lo) {
    const { x, y, s, glow } = lo;
    const flame = 1 + Math.sin(performance.now() / 90 + lo.seed) * .08;
    // glow on the water
    const g = ctx.createRadialGradient(x, y + 4 * s, 2, x, y + 4 * s, 34 * s * flame);
    g.addColorStop(0, `rgba(255, 208, 120, ${.34 * glow})`);
    g.addColorStop(1, 'rgba(255, 208, 120, 0)');
    ctx.fillStyle = g;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, .4); ctx.translate(-x, -y);
    ctx.fillRect(x - 40 * s, y - 40 * s, 80 * s, 80 * s);
    ctx.restore();
    // leaves
    ctx.fillStyle = `rgba(45, 78, 42, ${.9 * glow})`;
    ctx.beginPath(); ctx.ellipse(x, y + 2 * s, 13 * s, 4.4 * s, 0, 0, Math.PI * 2); ctx.fill();
    // petals
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * .5;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * 5.6 * s, y + Math.sin(a) * 3.4 * s - 1.6 * s, 4.6 * s, 2.2 * s, a + Math.PI / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 205, 210, ${.95 * glow})`;
      ctx.fill();
    }
    ctx.beginPath(); ctx.arc(x, y - 4 * s, 4.4 * s, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(250, 225, 170, ${glow})`; ctx.fill();
    // candle flame
    ctx.beginPath();
    ctx.ellipse(x, y - 9.6 * s * flame, 1.5 * s, 3 * s * flame, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 233, 160, ${glow})`; ctx.fill();
    // reflection shimmer
    ctx.fillStyle = `rgba(255, 220, 140, ${.12 * glow})`;
    ctx.fillRect(x - 1.5 * s, y + 5 * s, 3 * s, 16 * s);
  }
  function splash(cx, cy) {
    const r = canvas.getBoundingClientRect();
    const x = (cx - r.left) / r.width * W;
    const y = (cy - r.top) / r.height * H;
    ripples.push({ x, y, r: 6, sp: 1.3 * dpr, life: 1 });
    ripples.push({ x, y, r: 1, sp: .75 * dpr, life: 1.2 });
    if (lotuses.length < 14 && !weak) {
      lotuses.push({ x, y: H * .62 + Math.random() * H * .3, s: dpr * (0.9 + Math.random() * .5), vx: (Math.random() - .5) * .35 * dpr, glow: 0, t: Math.random() * 6, seed: Math.random() * 9 });
    }
    if (!rafOn) start();
  }
  if (!reduced) {
    canvas.addEventListener('pointerdown', (e) => splash(e.clientX, e.clientY));
  }
  queueMicrotask(() => { resize(); io.observe(s); });
  addEventListener('resize', () => { if (visible) resize(); }, { passive: true });

  /* text entrance */
  gsap.from('.pond__text > *', { y: 26, opacity: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 55%' } });

  return { el: s };
}
