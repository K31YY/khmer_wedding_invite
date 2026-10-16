#!/usr/bin/env python3
"""Make-og: captures the live cover at 1200x630 → public/og.jpg (link preview).
Assumes dist/ is built and served on :4174 by scripts/serve.py, or runs its own server."""
import subprocess, time, sys, os, http.server, socketserver, threading, contextlib

os.chdir(os.path.join(os.path.dirname(__file__), '..'))
PORT = 4180
Handler = http.server.SimpleHTTPRequestHandler
handler = type('Quiet', (Handler,), {'log_message': lambda *a, **k: None})
server = socketserver.TCPServer(('127.0.0.1', PORT), handler)
threading.Thread(target=server.serve_forever, daemon=True).start()
time.sleep(.5)

from playwright.sync_api import sync_playwright
EXE = '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome'
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=EXE, headless=True, args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 1200, 'height': 630})
    pg.goto(f'http://127.0.0.1:{PORT}/dist/', wait_until='networkidle')
    # og render reads the non-public assets from dist/; the photos come from dist too
    pg.wait_for_timeout(1600)
    pg.evaluate("document.querySelector('.env-seal').click()")
    pg.wait_for_timeout(7000)
    pg.screenshot(path='public/og.jpg', type='jpeg', quality=88)
    # also copy into dist for the served preview
    import shutil
    shutil.copy('public/og.jpg', 'dist/og.jpg')
    print('og.jpg ✓ 1200x630')
    b.close()
server.shutdown()
