# ធៀបការឌីជីថល · Khmer Digital Wedding Invitation

A production-ready Khmer wedding e‑invitation guests open from a shared link (Telegram / Messenger on phones). It is designed to feel like the digital twin of a printed card: real paper materials, gold‑foil typography, and a hand‑opened envelope.

## First, fill in your details — ២ minutes

Everything about the wedding lives in **one file**: `src/data/wedding.js`. Everything is currently **SAMPLE data** (names, parents, date, programme, venue, gifts) — search for `⚠️` and replace. **Do not ship with sample names, dates or times still inside.**

Also update in `index.html`:

1. `<title>` + the five `og:*` meta tags. Set `og:url` / `og:image` to your **deployed absolute URL** (Telegram needs absolute URLs for link previews).
2. Regenerate the preview image from your real cover: build the site, then run `npm run og` (script drives a headless browser at 1200×630) and commit `public/og.jpg`.

## Photos & music

1. Drop your original photos into `public/photos/raw/` and run:
   ```bash
   npm run photos
   ```
   This builds responsive WebP crops (640/1280, portrait `-m-` + landscape `-w-`), **strips GPS/EXIF**, and writes `public/img/gallery.json`.
   Use the file names already referenced in the code: `hero`, `words`, `cozy` (the couple section), `pond`, `story1…story3`. Any *extra* files you drop in become the masonry gallery automatically.
2. Khmer text rules respected everywhere (HTML text over SVG, generous foil padding, line-height ≥ 1.8).

> ⚠️ `public/img/*` is currently a set of self-contained **placeholder** artworks so the site renders end-to-end before real photos arrive. Replace all of it with `npm run photos`.

3. Music: put any mp3 you have rights to at `public/media/music.mp3` (it plays after the guest taps the envelope; the toggle lives in the top bar).

## Fonts

Bundled locally (nothing loads from Google at runtime): **Moul** (ceremonial headings), **Moulpali** (name logo), **Kantumruy Pro** (body), **Cormorant Garamond + Pinyon Script** (English).

## Colours (from your printed card)

The palette is a token block at the top of `src/styles/base.css`: one paper colour, a metallic foil *gradient* (`--foil-line`, `--foil-flat` — never flat yellow), cream, and a near-black backdrop for photo sections. Recolour those tokens and the whole site (envelope, seal, foil names) follows. The decorative elements (leaf-scroll corners, fan crest, curls) are original SVG geometry generated in code — `npm run` and they draw themselves.

## Run

```bash
npm install
npm run dev      # local
npm run build    # → dist/ (deploy dist/ to Vercel/Netlify/static host)
npm run og       # regenerate og.jpg after real photos are in (serves dist/ itself)
python3 scripts/qa.py 390 844 --touch   # screenshot QA harness
```

## Structure

```
src/data/wedding.js      ← ALL wedding facts
src/i18n/translations.js ← ALL text (kh + en) + Khmer calendar names
src/js/sections/*.js     ← one module per section (cover → thanks)
src/js/envelope.js       ← the 5.5 s envelope opening (3D, GSAP)
src/js/ornaments.js      ← decorative SVG library (corners, crest, divider, seal, butterfly, icons)
src/js/logo.js           ← the name lockup, reused flap/card/cover/hud/finale
src/styles/*.css         ← tokens · envelope · logo · sections
scripts/prepare-photos.mjs  · make-sample-assets.mjs · make-og.py · qa.py
```

## Experience order

Envelope → Cover → Formal invitation → The couple → Countdown → Programme → Love story (pinned sideways, day→dusk) → Candlelight pond (tap the water for ripples + lotus lanterns) → Gallery → Venue (+map, .ics) → Gift (KHQR always visible) → Thank‑you (candles light up, share).

No RSVP form, no guest data collection. Design credit footer: “Design inspired by Someth Phay · somethphay.me”.

## Privacy note

Share the link only with your guest list. The site sets no cookies and collects nothing; the photos should not contain location data (`prepare-photos` strips EXIF/GPS automatically).
