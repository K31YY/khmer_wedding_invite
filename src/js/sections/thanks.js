import { h, svgFrag, t, toast, wedding, reduced } from '../utils.js';
import { gsap } from '../gsap-setup.js';
import { lockup, animateLockup } from '../logo.js';

const shareURL = encodeURIComponent(location.origin + location.pathname);

const ICONS = {
  telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 4.1 2.9 11.3c-.9.35-.88 1.63.03 1.94l4.6 1.5 1.77 5.35c.25.75 1.2.95 1.72.36l2.5-2.85 4.6 3.38c.62.45 1.48.1 1.63-.66L23.9 5.3c.16-.8-.62-1.47-1.37-1.16zM8.7 14.1l9-6.05c.2-.14.42.13.25.3l-7.3 7.5-.2 3.1-1.75-4.85z" fill="currentColor"/></svg>',
  messenger: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.3 2 2 6.2 2 11.7c0 3.1 1.4 5.8 3.7 7.6V23l3.4-1.9c.9.25 1.9.4 2.9.4 5.7 0 10-4.2 10-9.7S17.7 2 12 2zm1 13.1-2.6-2.7-5 2.7 5.5-5.9 2.6 2.7 4.9-2.7-5.4 5.9z" fill="currentColor"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 21v-8.02h2.7l.4-3.12h-3.1V7.9c0-.9.25-1.52 1.55-1.52h1.6V3.6c-.28-.04-1.24-.12-2.35-.12-2.33 0-3.93 1.42-3.93 4.04v2.27H7.6v3.12h2.32V21h3.48z" fill="currentColor"/></svg>',
  link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.6 13.4a1 1 0 0 1 0-1.4l1.8-1.8a1 1 0 1 1 1.4 1.4l-1.8 1.8a1 1 0 0 1-1.4 0zm-3.8 5.2a4 4 0 0 1 0-5.6l1.4-1.4 1.4 1.4-1.4 1.4a2 2 0 0 0 0 2.8 2 2 0 0 0 2.8 0l1.4-1.4 1.4 1.4-1.4 1.4a4 4 0 0 1-5.6 0zm8.4-15-1.4 1.4-1.4-1.4 1.4-1.4a4 4 0 0 1 5.6 5.6l-1.4 1.4-1.4-1.4 1.4-1.4a2 2 0 0 0-2.8-2.8z" fill="currentColor"/></svg>',
};

export function buildThanks() {
  const s = h('section.chapter.finale', { id: 'thanks' });

  const candles = h('div.finale__candles', { 'aria-hidden': 'true' });
  for (let i = 0; i < 9; i++) {
    candles.append(h('i.candle', { style: `--h:${26 + Math.abs(4 - i) * 5 + (i % 3) * 3}px;--dl:${(i * .13).toFixed(2)}s` },
      h('s.flame')));
  }

  const line = h('p.finale__line', { 'data-t': 'thanksLine' });

  const actions = h('div.finale__actions');
  const shareBtn = (cls, icon, labelKey, href, onclick) => {
    const el = href
      ? h('a.share', { href, target: '_blank', rel: 'noopener' })
      : h('button.share', { type: 'button' });
    el.classList.add(cls);
    el.innerHTML = `<i>${ICONS[icon]}</i><span><small class="share__via" data-t="shareVia"></small><b class="share__lab" data-t="${labelKey}"></b></span>`;
    if (onclick) el.addEventListener('click', onclick);
    actions.append(el);
    return el;
  };
  const text = encodeURIComponent('សិរីសួស្តីអាពាហ៍ពិពាហ៍ — Wedding invitation');
  shareBtn('share--tg', 'telegram', 'openTelegram', `https://t.me/share/url?url=${shareURL}&text=${text}`);
  shareBtn('share--ms', 'messenger', 'openMessenger', `https://www.facebook.com/sharer/sharer.php?u=${shareURL}&quote=${text}`);
  shareBtn('share--fb', 'facebook', 'openFacebook', `https://www.facebook.com/sharer/sharer.php?u=${shareURL}`);
  shareBtn('share--copy', 'link', 'copyLink', null, async () => {
    try { await navigator.clipboard.writeText(decodeURIComponent(shareURL)); }
    catch { /* clipboard may be blocked; user can long-press */ }
    toast(t('copied'));
  });

  const lock = lockup({ variant: 'finale' });
  const lockWrap = h('div.finale__lock'); lockWrap.append(lock);
  s.append(candles, h('h2.finale__thanks.foil-shine', { 'data-t': 'thanks' }), line, actions, lockWrap);

  /* candles light up one by one */
  gsap.to('.candle', {
    '--lit': 1, duration: .6, stagger: .12, ease: 'power2.out',
    scrollTrigger: { trigger: s, start: 'top 68%', once: true },
  });
  gsap.from('.finale__thanks', { letterSpacing: reduced ? 0 : '.06em', opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 66%' } });
  gsap.from([line, actions], { y: 22, opacity: 0, stagger: .14, duration: .9, scrollTrigger: { trigger: s, start: 'top 58%' } });
  gsap.from(lockWrap, { opacity: 0, duration: 1, scrollTrigger: { trigger: lockWrap, start: 'top 82%', once: true, onEnter: () => animateLockup(lock) } });

  return { el: s };
}
