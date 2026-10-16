#!/usr/bin/env python3
"""QA harness — opens the envelope, screenshots every section at the
requested viewport, reports console errors + overflow + hud overlaps."""
import sys, json, os
from playwright.sync_api import sync_playwright

EXE = '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome'
W, H = int(sys.argv[1]), int(sys.argv[2])
SECT = ['cover', 'words', 'couple', 'countdown', 'programme', 'story', 'pond', 'gallery', 'venue', 'gift', 'thanks']
OUT = '/tmp/shots/%dx%d' % (W, H)
os.makedirs(OUT, exist_ok=True)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=EXE, headless=True, args=['--no-sandbox'])
    touch = '--touch' in sys.argv
    ctx = b.new_context(viewport={'width': W, 'height': H}, has_touch=touch, is_mobile=touch,
                        device_scale_factor=2 if (W < 800 and touch) else 1)
    pg = ctx.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append('console:' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:4174/', wait_until='networkidle')
    pg.wait_for_timeout(2200)
    pg.screenshot(path=f'{OUT}/00-gate.png')
    pg.evaluate("document.querySelector('.env-seal').click()")
    pg.wait_for_timeout(7600)
    pg.screenshot(path=f'{OUT}/01-cover.png')
    for sid in SECT[1:]:
        pg.evaluate(f"document.getElementById('{sid}').scrollIntoView({{block:'start'}})")
        pg.wait_for_timeout(1100)
        if sid == 'story':
            # capture mid-pin frames of the horizontal run
            pg.evaluate("window.scrollBy(0, window.innerHeight * 0.9)")
            pg.wait_for_timeout(900)
            pg.screenshot(path=f'{OUT}/sec-story-a.png')
            pg.evaluate("window.scrollBy(0, window.innerHeight * 1.6)")
            pg.wait_for_timeout(900)
            pg.screenshot(path=f'{OUT}/sec-story-b.png')
            continue
        pg.evaluate(f"document.getElementById('{sid}').scrollIntoView({{block:'center'}})")
        pg.wait_for_timeout(800)
        try:
            if sid in ('countdown','programme','gallery','gift','thanks','words','couple'):
                pg.evaluate(f"window.__scrollToSection ? window.__scrollToSection('{sid}') : null")
                el = pg.query_selector(f'#{sid}')
                el.screenshot(path=f'{OUT}/sec-{sid}.png')
            else:
                pg.screenshot(path=f'{OUT}/sec-{sid}.png')
        except Exception as ex:
            print('SHOOT FAIL', sid, ex)
    # measurements
    m = pg.evaluate("""() => {
      const de = document.documentElement;
      const over = [...document.querySelectorAll('body *')].filter(e => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && (r.right > innerWidth + 1.5 || r.left < -1.5) && getComputedStyle(e).position !== 'fixed';
      }).slice(0,12).map(e => e.className && String(e.className).slice(0,60) || e.tagName);
      return { overflowX: de.scrollWidth - de.clientWidth, offenders: over, docH: de.scrollHeight };
    }""")
    print(json.dumps({'view': f'{W}x{H}', 'errors': errs[:6], **m}, ensure_ascii=False))
    b.close()
