# Pax's: photography portfolio

An Astro site (static output). Run `npm run dev` while working, `npm run build` then `npm run preview` to
check the real build. The old one-page prototype in `site/` is superseded and kept only for reference.

**The approved plan is [docs/site-brief.md](docs/site-brief.md)** (pages, layout, hierarchy, lightbox, photo
pipeline, open decisions). Build to it; product facts are in [PRODUCT.md](PRODUCT.md).

**Before any design, layout, copy or motion change, read [DESIGN.md](DESIGN.md) and follow it.** It fixes the
fonts, colour tokens, spacing, shape and motion principles. Do not introduce new faces, colours, radii or size
steps; if a change truly needs one, update DESIGN.md first and say why.

## Where things live

- `photos/film`, `photos/mirrorless`: the originals. Dropping a file in is all it takes to publish it.
  - Film file names give the roll and frame: `r001-013.jpg` = roll 001, frame 13.
  - Digital photos are grouped into trips by their EXIF dates (a gap of more than 4 days starts a new trip).
- `photos/captions.yml`: optional titles, places, alt text, roll places, trip names, the hero and stamp
  photos, and `hidden` files. Every entry is optional.
- `src/lib/photos.ts`: the build-time loader (reads files, EXIF, captions; builds rolls and trips).
- `src/lib/site.ts`: contact details (email, optional Instagram).
- `src/styles/global.css`: tokens (must match DESIGN.md), base styles, nav, footer.
- `src/components/`: `HeroDeck` (the home page 3-card hero), `Sheets` (both collection pages), `Photo` (a
  lightbox trigger), `Lightbox`, `Footer`. The deck's card photos are `filmCard` / `mirrorlessCard` in
  `photos/captions.yml`.
- `src/pages/`: `/`, `/film/`, `/mirrorless/`, and the deep links `/film/roll-001/13/`, `/mirrorless/<trip>/<n>/`.

## Checks after any visual change

Build, start `npm run preview`, then run the taste-skill gate on each page and fix every FAIL:

```
node ~/.claude/skills/design-taste-frontend/scripts/inspect.mjs http://127.0.0.1:4321/
```

Also run it on `/film/` and `/mirrorless/`. Deep-link pages open the lightbox over the page, so their
covered-title findings are expected.

## Motion

Everything that moves is specified in the Motion section of DESIGN.md (what animates, what doesn't, curves,
durations, reduced-motion fallbacks). Code: `src/scripts/motion.ts` (curves, reduced-motion flag, Lenis), `tray.ts` (the hero develop), `channel.ts` (the hero cards' channel flips), `glitch.ts` (tap and ambient glitches),
the landing script in `src/pages/index.astro` (the section entrances: IntersectionObserver + CSS), `src/components/Lightbox.astro` (open, close as a shared-element transition on the Web Animations API, with `src/scripts/develop.ts` for the darkroom develop and sensor readout,
swipes, zoom), the motion block at the end of `global.css` (presses, hovers, image fades, view transitions).
Test motion in a visible browser or headless Chrome; a hidden browser pane runs no animation frames.
