# Pax's: design system

The source of truth for how Pax's looks and moves. Every change to the site follows this file. If a change
needs something this file does not allow, update this file first and say why.

Direction: **The page is the object** (taste-skill, seed 1795742774; full sheet in `.taste-skill/sheet.md`).

## The idea

> On this page, **Pax's photo-lab envelope** (roll 001, frames 1–32, collected with the digital prints)
> becomes **the object the whole site is built as**.

- **The hero is a deck of three prints** in a 3D stack: **Pax's** (the sunset frame set as a poster: the
  name huge and heavy, the year in outline, dotted rules, a shutter-speed dial), **Life on Film** and **Life on Mirrorless**. The focused card faces you; the other two
  lean back in depth on either side. Click (or tap, or Enter) a side card to bring it to the centre; click the
  centred card to open it: the collections open their pages through the title morph, and Pax's glides to the
  letter and 'Say hello'. Deep dark ground under heavy grain; no glass.
- **Life on Film is the roll's contact sheet:** strips of 3:2 frames on the film base, each with its real frame
  number from the scan's file name printed along the edge, and sprocket holes along the top and bottom of every
  frame (a whole number of holes per frame, so a row reads as one continuous strip, ending in the same holes as
  the end of the roll).
- **Life on Mirrorless is the stack of prints:** each print is shown on the camera's screen, with its real
  camera data (aperture, shutter, ISO, focal length, date, camera) along the bottom.
- **The letter is the note tucked in the envelope.**
- **The footer is the back of the envelope,** where you say hello. Nothing is sold, so there is no order form.

**The live thing:** open any frame full screen (keyboard, swipe or arrows). It develops in the darkroom (film)
or is read off the sensor (mirrorless), and can be shared as a link to that exact frame.

## Type

Two faces from Google Fonts, plus one for a single word:

| Role | Face | Settings |
| --- | --- | --- |
| Display | **Bebas Neue** 400 | capitals only, tracking -0.02em (-0.04em above 120px), leading 0.85 |
| Text | **EB Garamond** 400/500, italic 400 | leading 1.5, tracking 0, tabular figures for camera data |
| Poster name | **Inter Tight** 800 | Pax's card only: the name "Pax's" and the outline year, lowercase, tracking -0.065em, leading 0.76; loaded subset to those glyphs (`text=Pax's0123456789`), a few KB. Added 2026-10-24: the user asked for the name set like a Swiss-grunge poster, a heavy grotesque Bebas Neue can't give. |

Five size steps, never a sixth:

```css
--step-small:   clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);   /* 13–14px: strips, captions, imprint */
--step-body:    clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);    /* 17–19px: running text */
--step-lead:    clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem);     /* 22–30px: facts, card text, statements */
--step-head:    clamp(2.75rem, 1.6rem + 4.6vw, 6rem);          /* 44–96px: section headings */
--step-display: clamp(4rem, 1rem + 12vw, 13rem);               /* 64–208px: the name, the counts */
```

- Headlines are two lines or fewer at every width. Statements are at most 3 lines and 36px.
- Running text uses the full ink colour, at 16px or more.

## Colour

Two-colour print job: green-black ground, bone paper, with the photographs supplying all the colour.

```css
--bg:         #161c1a;  /* the ground the envelope sits on */
--surface:    #1f2725;  /* one tone step up: the film strip, the stack */
--surface-2:  #2a3431;  /* two steps up: alternate print strips */
--ink:        #e3e2da;  /* bone: type on the ground */
--muted:      #8e948d;  /* secondary notes only */
--paper:      #e3e2da;  /* the envelope, the letter, the back */
--paper-ink:  #161c1a;  /* type on paper */
--paper-2:    #cfcdc2;  /* the stamp mat, film edge print */
--accent:     #9fc7b8;  /* pale jade: the one action per screen, focus ring */
--accent-ink: #161c1a;
--neon:       rgb(227 226 218 / 0.9);  /* the hero cards' VHS frame: a bone tube of light */
```

- Each print sits on the camera's screen: a bezel in the film-base tone (the playback index's), the frame's
  place in the trip along the top ("▶ 2 / 9", display face, paper-2), its camera data along the bottom (ink;
  date and camera in paper-2). Film frames get sprocket holes; digital prints never do.
- Surfaces are separated by a step in tone, never by a line or a shadow.
- `--neon` is bone at 90%: it appears only in the hero cards' VHS frame. Added 2026-10-24 (the user asked for a
  black-and-white neon VHS border on the slideshow); it replaced the amber date-stamp tokens, retired with the stamp.

## Space and shape

```css
--margin:  clamp(1rem, 2.2vw, 2rem);    /* the one pair of outer margins, 16–32px */
--gutter:  clamp(0.75rem, 1.6vw, 1.5rem);
--section: clamp(7.5rem, 14vw, 15rem);  /* 120–240px between sections */
--radius:  0;                           /* square everywhere: prints, buttons, fields */
```

- Use a 12-column grid inside the margins.
- Shaped edges (notches, scallops, perforations, sprocket holes) are cut with `clip-path`, masks or filled
  shapes. They are never drawn with outlines.
- Buttons are flat rectangles in jade, at least 48px tall.
- On touch screens every link is at least 44px tall to the finger (padding that does not move the layout).

## House rules (from taste-skill, checked by its inspector)

The site uses none of these:
- eyebrow labels above headings
- monospace
- 01/02/03 numbering (frame numbers are written "Frame 13")
- thin rules
- gradients (a neutral scrim under text on a photo is allowed)
- shadows at rest (only what floats casts one: the open lightbox, and a hovered hero card; the hero cards' neon
  frame is the one glow, see below)

**Chosen exceptions, hero only:** the cards' photos carry a neutral darkening scrim under their text. On
2026-10-24 the user asked for every slideshow photo in black and white with a neon VHS border: each card has a 1px
bone frame inset 3.5cqi with a static glow (box-shadow) and red and blue copies 1.5px apart, and these are the only
outlined box and glow at rest on the site. The inspector reports them (`shadow`, `outlined-box`) on `/`; they are
kept on purpose and allowed nowhere else. The fixer sheen (a band of reflected light crossing a print as it comes
to the front) is a gradient, also hero only.

**The VHS screen, every page** (2026-10-23, the user's pick, after arcmarumo.com): the whole site plays back like a
tape on a CRT. Scanlines with RGB phosphor stripes, a roll band and a vignette are gradients; light type on the dark
ground carries a colour fringe (`--chroma`: a faint glow and red and blue copies 0.6px apart), which is a text-shadow.
These are the screen, not decoration on the content: they never appear as fills, cards or panels, and type on paper
(the letter, the back of the envelope) has no fringe. The inspector's `gradient` and `text-shadow` allowances in
`.taste-skill/direction.json` record this.

- glass or blur panels
- emoji
- icon cards
- styled accent words
- tiny tracked capitals

## Motion

Designed with the emil-design-eng framework (2026-10-23). Every move below answered four questions in order:
should it animate at all (how often is it seen?), what is it for, which curve, and how long. **The photos are
the star; motion exists to carry the eye to a photo and out again, never to make anyone wait for one.**

### Character

A lab envelope, not a slot machine: motion is **quick, weighted and quiet**. Things arrive like a print slid
out of a sleeve (fast start, soft landing) and leave faster than they came. There is no bounce anywhere and
no loop except the hero drift. The one generous moment is a photo opening full screen; everything around it
stays crisp.

### Tokens

```css
/* curves */
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);    /* everything that enters or exits */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* things that move or morph while on screen */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* gestures settling after a drag or swipe */
/* hovers and colour changes use the CSS keyword `ease`; scroll-linked moves use no easing (scrub) */
/* the cursor-follow drift is a spring: duration 0.5s, bounce 0 (stiffness 158, damping 25, mass 1) */

/* durations */
--t-press:  140ms;  /* press feedback */
--t-hover:  200ms;  /* hover, underline, colour */
--t-fade:   240ms;  /* an image appearing once it has loaded */
--t-close:  260ms;  /* lightbox closing, a swipe settling, zoom out */
--t-open:   420ms;  /* lightbox opening */
--t-reveal: 600ms;  /* landing-page entrances (seen once per visit) */
--stagger:   60ms;  /* between items entering together */
--ease-spring: linear(0, 0.026, 0.0905, 0.1773, 0.2746, 0.3741, 0.4702, 0.5594, 0.6397, 0.7102, 0.7708, 0.822, 0.8644, 0.899, 0.9268, 0.9486, 0.9656, 0.9784, 0.988, 0.9948, 0.9996, 1.0028, 1.0048, 1.0058, 1.0063, 1.0062, 1.0059, 1.0054, 1.0048, 1.0042, 1.0036, 1.003, 1.0025, 1.002, 1.0016, 1.0012, 1);
               /* a spring (duration 0.6s, bounce 0.15) baked into CSS: 0.6% overshoot */
--t-deck:    840ms;  /* the hero deck rearranging, including the spring settling */
--t-film:  640ms;  /* film's page transition, and both collections' title morph: slow and soft */
--t-shutter: 280ms; /* mirrorless page transition: crisp, like a shutter */
--t-reveal-crisp: 360ms; /* mirrorless prints wiping in */
```

`--ease-in` is never used. Nothing animates from `scale(0)`; the smallest entering scale is 0.96.

### What animates

| Moment | How often it's seen | Purpose | Motion | Curve | Duration |
| --- | --- | --- | --- | --- | --- |
| Press on any button, hero card or frame (`:active`) | Constantly | Feedback | `scale(0.97)` (hero cards `scale: 0.985`, on its own property so it never fights the 3D transform) | `--ease-out` | `--t-press` |
| Hover on a frame or print (fine pointer only) | Tens per visit | Says "this opens"; the photo leans toward the pointer | The image inside its crop goes to `scale(1.05)` and drifts toward the pointer by at most 2.5% of its size, so the crop never shows an edge. The frame itself does not move. Without JS: `scale(1.03)` only. | spring, duration 0.5s, bounce 0 | — |
| Hover on a text link | Tens per visit | Feedback | underline colour fades in, and the channel changes: for a third of a second the link glitches (red and blue split, a skew, two sliced clips), like a VHS changing channel. On a touch screen the same glitch plays the moment a finger lands on a link, and on every device a visible headline or the wordmark glitches on its own every 6 to 12 seconds (glitch.ts; paused in a hidden tab or with a photo open full screen). Nothing under reduced motion. | `ease`; glitch `step-end` | `--t-hover`; glitch 360ms |
| A photo finishing loading (every thumbnail, everywhere) | Every photo, once | Hides the jarring pop from blurred placeholder to photo | `opacity 0 → 1` after `img.decode()`; already-cached images show at once | `--ease-out` | `--t-fade` |
| **Landing, first screen** | Once per visit | Arrival | The poster's name is painted at once; its rules, outline year, dial and small print fade in over it. Everything is settled by 1.1s. The hero photo is painted at once and never waits. | `--ease-out` | 650ms at +450ms |
| **Hero cards: neon frame** | Ambient, while the hero is on screen | A tube of light on an old set | Each card's VHS frame stutters twice near the end of a 7s cycle (opacity 1 → 0.3 → 1 → 0.55 → 1, stepped), the three cards out of phase. Paused off screen; none under reduced motion. | steps(1) | 7s cycle |
| **Hero deck: a card comes to the centre** (click, tap, Enter, arrow keys, swipe) | Occasional | Spatial: the chosen print slides to the front | Every card moves to its new place in the stack (`translateX` + `rotateY` on a baked spring, depth sorted by the browser). Depth (`translate` z) runs on its own faster curve, so the chosen print lifts clear before the cards swing past each other and their planes never cut through one another | `--ease-spring`; depth `--ease-out` | `--t-deck` (840ms incl. settle); depth `--t-open` |
| **Hero deck: hover** (fine pointer) | Tens per visit | Says which card you are on | The hovered card comes forward and grows to `scale(1.03)`: the centred card faces you; a side card turns most of the way round (to 12°) but stays behind the centred one, and its outline only grows, so the hover can't flicker at an edge; its layered shadow fades in (a pseudo-element's opacity, never an animated box-shadow); the other cards dim a little | `--ease-spring`, `ease` for the dim | 520ms, 200ms |
| **Hero deck: opening the centred card** | Per navigation | Continuity | Collections: the card title morphs into the page title (the per-collection page transitions). Pax's: smooth scroll to the letter | as page transitions | as page transitions |
| **Hero grain** | While the hero is on screen | It is a print, alive | Heavy grain over the whole deck (a noise tile, overlay at 45%) jumps 24 times a second on the compositor; paused off screen, still under reduced motion | steps(1) | 417ms loop |
| **The VHS screen** | On every page, always | Every page plays back like a tape: the grain of the prints and the screen they are watched on | Four fixed layers over the whole site, each blending with the page directly: film grain (the shared noise tile, overlay at 20%, jumping 24 times a second), scanlines with RGB phosphor stripes (flickering to 90% in two steps every 120ms), a faint bright band rolling down the screen, and a vignette. Under the lightbox (a top-layer dialog), so a full-screen photo shows clean. Reduced motion: grain and lines still, no roll, no flicker. | steps(1), steps(2), linear | 417ms, 120ms, 7s roll |
| **The developing tray** (overdrive), hero | Once per session | The darkroom: the three prints come up in the developer | On the first visit of a session, the cards start as blank bone paper (hidden before first paint, so no photo flashes) and develop on three small WebGL canvases: shadows first, highlights last, with a slow liquid wobble and wet sheen calming as they finish. Side prints first, the centred one 220ms later; then the poster's small print appears. The prints develop in black and white (the shader draws the same grayscale, contrast and brightness as the photos' CSS filter, so the hand-over is invisible). The canvases are all set up during the still paper beat, the clock starts after. No WebGL, reduced motion or a slow photo: the photos are simply there. A print brought to the centre later catches a fixer sheen (a band of reflected light, 800ms). | develop curve in the shader; sheen `--ease-in-out` | 1.3s; sheen 800ms |
| **Channel-flipping previews** (overdrive), hero | While Life on Film or Life on Mirrorless is centred | Shows the collections, not just their covers: the card plays its photos like a VHS preview | Every 2.4s the centred collection card cuts to another real photo (the newest roll; a round of the trips), framed on its build-time focus point. The cut is a 320ms tracking glitch: the new picture tears in, sliced and shifted in steps, while a bright band rolls down the card and the title glitches; the card's line names the frame ("Roll 001 · Frame 13", "Paris, Feb 2026"). Side cards hold still; so does the centred one while hovered, for 4s after a touch, 1.6s after a turn, off screen, in a hidden tab, or while the prints develop. Pictures load only when cut to. Reduced motion: the covers stay. | steps(1); band linear | 2.4s hold, 320ms cut |
| Landing sections (the facts, the letter) | Once per visit | Reading order | Heading, then text, then pictures rise 16px with opacity, once each, when 15% visible (an IntersectionObserver marks the items; CSS transitions move them). Content is visible without JS. | `--ease-out` | `--t-reveal`, `--stagger` |
| Hover on a door (fine pointer) | Rare | Delight: the envelope's contents shift | Film strip slides `translateX(-12px)`; fanned prints spread 2° further apart | `--ease-out` | 300ms |
| **Lightbox opens** from a click or tap | Occasional | Spatial: the photo you touched *becomes* the big photo | FLIP: the image grows from the thumbnail's exact rectangle to its full-screen rectangle. The ground fades in under it (200ms); the bar and strip rise 8px with opacity after 120ms. | `--ease-out` | `--t-open` |
| **The darkroom** (overdrive), film, as the lightbox opens | Occasional | The medium itself: the frame appears as its negative and is printed in front of you | On a WebGL canvas that travels with the growing photo: the orange-masked **negative** holds until the photo is full size, clears to blank **paper** (bone), and the **print develops**, shadows first, highlights last, with grain settling. Then a 160ms crossfade hands over to the full-resolution photo. | linear time, shaped in the shader | 900ms |
| **The sensor readout** (overdrive), mirrorless, as the lightbox opens | Occasional | The medium itself: a digital frame is read off the sensor | Same canvas: a thin readout line sweeps down at a constant speed, leaving the read frame above it and dark sensor below, with a slight colour split on the line. | linear (constant motion) | 260ms |
| **Live film grain** on a film photo at rest in the lightbox | While viewing | Film keeps its texture | A 128px noise tile, blended as overlay at 40%, is jumped to a new position 24 times a second (film's frame rate) by a CSS transform animation on the compositor. Hidden during zoom, drags, closing and the develop. | steps(1) | 417ms loop |
| **Lightbox closes** (Close, Escape, Back, swipe down) | Occasional | Spatial: back where it came from | Reverse FLIP into the current frame's thumbnail. If that thumbnail is off screen, fade out with `scale(0.98)` instead. | `--ease-out` | `--t-close` |
| Lightbox frame change by **swipe** | Often on phones | Direct manipulation | The photo follows the finger 1:1. On release it commits if it moved past 30% of the width **or** its velocity is above 0.11px/ms, sliding the next photo in; otherwise it settles back. | `--ease-drawer` | 280ms |
| Lightbox frame change by **Previous/Next button** | Often | Continuity | Crossfade only, no travel; the caption (title and details) fades in over the same 160ms, so words and photo change together | `ease` | 160ms |
| A status line in the lightbox ("Link copied") | Occasional | Feedback | Rises 4px and fades in; fades out after 1.8s instead of vanishing. Reduced motion: fade only. | `--ease-out` in, `ease` out | 200ms in, 150ms out |
| Next past the last photo, or Previous before the first (the lightbox wraps round) | Rare | Feedback, shown: the tape went round instead of silently jumping | The VCR on-screen display blinks in at the top left, "Rewind" (or "Fast forward") beside two drawn arrows, in display type with the colour fringe, and holds 1.3s; the first photo tears in with the channel glitch (sliced, shifted, stepped). The status line says it in words for screen readers. Reduced motion: the display only, no tear. | steps(1) | 1.3s display, 360ms tear |
| **No signal** (404), its empty frame | On a broken link | Delight on a dead end: the tape has nothing recorded here | A 3:2 frame on the film base filled with TV snow (the shared noise tile, contrast raised by a static filter) jumping 4 times faster than the grain; the title glitches with the ambient channel glitch; the way back is three links. Reduced motion: the snow stands still. | steps(1) | 250ms loop |
| Crossing into the next roll or trip in the lightbox | Rare | Marks the new set without stopping you | The set name in the bar wipes in (`clip-path: inset(0 100% 0 0) → inset(0)`) and holds in jade. The photo is never delayed. | `--ease-out` | 300ms |
| Zoom in / out in the lightbox | Occasional | Morph on screen | `scale(1 ↔ 2)` from the tap point; panning follows the pointer smoothed by a 0.15 lerp per frame | `--ease-in-out` | in `--t-close`+40ms (300ms), out `--t-close` |
| Swipe down to close (phone) | Occasional | Direct manipulation | The photo follows the finger down and the ground fades with distance. Release past 90px or above 0.11px/ms closes (reverse FLIP); otherwise it settles back. | `--ease-drawer` | `--t-close` |
| Page to page, **into or out of Life on Film** | Per navigation | Continuity, with film's pace: slow and soft, like a print coming up in the tray | The door's heading morphs into the page's `h1` (both titles' boxes hug their letters and break their lines at the same place, so the morph scales one shape evenly; it runs at `--t-film`, `--ease-in-out` for both collections); the whole page crossfades while the new one settles from `scale(1.015)` | `--ease-in-out` (morph), `ease` (fade), `--ease-out` (settle) | `--t-film` |
| Page to page, **into or out of Life on Mirrorless** | Per navigation | Continuity, with digital's pace: crisp and quick, like a shutter | The heading morphs at the same slow, even pace as Film's ("Life on / Mirrorless" breaks after "on" on the card and the page); the new page wipes down over the old one (`clip-path: inset(0 0 100% 0) → inset(0)`) with no fade | `--ease-in-out` | morph `--t-film`; wipe `--t-shutter` |
| **Life on Film frames** scrolling into view | Once per frame per page view | Reading order; the roll develops as you reach it | Frames below the first screen rise 16px with opacity as they enter, 40ms apart within a batch. Frames already on screen never move. | `--ease-out` (rise), `ease` (fade) | `--t-reveal` |
| **Life on Mirrorless prints** scrolling into view | Once per print per page view | Reading order, crisp | Prints below the first screen wipe in from the top (`clip-path`), 40ms apart within a batch. Prints already on screen never move. | `--ease-in-out` | `--t-reveal-crisp` |
| **The end of a roll** (Life on Film) | Once per roll per page view | The roll runs out: the strip ends the way real film does | After the last frame the strip runs on into two fogged, light-struck frames (the last photo, overexposed and blurred by static filters, so the colour is the photo's own), on the strips' own column grid (so the fogged frames are the size of the frames above), and is cut into the leader's tongue; under it, "End of Roll 001 · 9 frames". As it scrolls in, the strip slides in 32px and the light leaks into the fog (an overexposed layer fading up). Already settled if on screen at arrival; reduced motion: settled. | `--ease-out` | `--t-reveal`; fog 1.4s |
| **AF lock** (overdrive), Life on Mirrorless | Once per print per page view | The medium: the camera finds its subject before the data is written | When a print reaches the upper half of the screen, four AF corner brackets hunt over the sharpest patch of the frame (a contrast-detect focus point found at build time): scale 1.4 → 0.84 → 1.07 → 1, then turn jade, hold and fade. The camera data under the print is then rewritten field by field: each value blinks off and back on, 50ms apart, readable at full strength before and after. Prints arriving together lock 140ms apart. Reduced motion: no brackets and no blink. | `--ease-in-out` (hunt), steps (data), `ease` (fade) | 460ms hunt, 820ms hold and fade |
| Smooth scrolling (Lenis) | Constantly | Weight on desktop wheels | `lerp: 0.1`. Index and anchor jumps use `scrollTo` over 0.8s on `--ease-in-out`. | — | — |

### What does not animate

| Moment | Why not |
| --- | --- |
| Keyboard actions in the lightbox (arrow keys, Escape) | Repeated many times; animation makes them feel delayed. Frames swap instantly. Escape closes with the normal close only because it returns you to a place. |
| Opening the lightbox from the keyboard (Enter on a focused frame) | No FLIP: a 150ms opacity fade only. Keyboard users get speed. |
| The roll/trip index marker | It changes on every scroll; colour swaps instantly, and the index box scrolls without easing. |
| Navigation bar, footer, focus rings | Always there; motion adds nothing. |
| The pinned envelope stub (from the first draft) | Dropped: a stub pinned bottom-left would sit on top of photos as they scroll past. The envelope now scrolls away with the hero. |
| A full-screen "Roll 002" title card between rolls | Dropped: it would make the visitor wait for the next photo. The wipe on the set name does the same job. |
| Anything on hover on touch devices | Touch fires hover on tap; all hover motion sits behind `(hover: hover) and (pointer: fine)`. |

### Interruption

- **Use transitions, not keyframes, for anything a visitor can trigger again mid-flight:** presses, hovers,
  zoom and the frame crossfade.
- **The lightbox is a shared-element transition.**
  - **Opening:** the photo animates from a transform that lays it exactly over the tapped thumbnail, down to
    none. It's one uniform scale about the centre, because thumbnail and photo share a shape.
  - **Closing:** the photo animates from wherever it is (mid-open, dragged down, zoomed) to the transform over
    its thumbnail.
  - **One copy only:** while the photo is in flight, the thumbnail is hidden.
  - **Interruption:** any move can be cut off by another and continues from the current value without
    jumping.
- **A swipe that starts during a settle takes over from the current transform.**
- **Escape and Back always work, even mid-animation.**

### Reduced motion (`prefers-reduced-motion: reduce`)

| Kept | Gone |
| --- | --- |
| Image load fades | Lenis smooth scrolling (native scrolling instead) |
| The lightbox ground fade (150ms) | The shared-element grow and shrink (the photo fades in place instead) |
| The 160ms crossfade between frames | Hero drift and envelope scrub |
| Colour changes on hover and on the index marker | Every rise, slide, spread and stagger |
| Gallery reveals, as a plain 240ms fade | The film settle and the mirrorless shutter wipe (both collections get the 150ms crossfade) |
| | The cursor-follow drift and the hover scale |
| | The view-transition morph (a 150ms crossfade instead) |
| | Zoom scale (zoom jumps to 2× without a transition) |

Swipe gestures still work, because they follow the finger; only their settle becomes instant.

### Performance and implementation rules

1. **Only `transform`, `opacity` and `clip-path` animate.** Never `width`, `height`, `top`, `left` or
   `filter`. The `brightness(0.7)` on the hero is static.
2. **Hovers, presses and fades are CSS transitions.** Scroll entrances are an IntersectionObserver that marks items for a CSS transition. No animation library ships (GSAP was removed on 2026-10-24: its only remaining job was that entrance).
3. **Every lightbox move uses the Web Animations API,** which Chrome runs on the compositor. A busy main
   thread can delay the start of a move, but never make it stutter or jump ahead. GSAP Flip was tried first;
   its main-thread clock made the open jump a frame on a slow phone.
4. **Libraries load only where used:**
   - Lenis runs everywhere on desktop pointers. The deck's links stop their clicks from reaching Lenis's anchor
     scrolling, so a side Pax's card comes forward instead of jumping to the letter.
5. **Set transforms directly on the element.** Never drive per-frame motion through inherited CSS variables.
6. **`will-change: transform`** goes only on the element in flight. It is added when a move or drag starts
   and removed when it lands.
7. **Lenis is off on touch devices** (native momentum is better), **while the lightbox is open, and under
   reduced motion.**
8. **No content is hidden waiting for JS.** Entrance start states are applied by the script that animates
   them, behind a `js` class on `<html>`.
9. **The page passes the taste-skill inspector without `--allow still-page`.**
10. **The lightbox photo is sized from its aspect ratio** (container query units), not its loaded pixels. It
    has its final box the moment it opens, so the grow has a real target.
11. **Phone budget:** measured on an emulated phone (390px at 3×, touch, CPU slowed 4×), every scroll, swipe,
    settle, zoom, crossfade and close runs with no frame over 20ms.
12. **The darkroom canvas** (and the hero's developing tray: three small canvases, set up during the paper beat, drawn only for its 1.3s and then released) are the only places pixels are drawn by script. One WebGL context, created and its
    shader compiled while the browser is idle after load, reused for every open, drawing only during the
    900ms develop (capped at 2× pixel density) and doing nothing at rest. No WebGL, reduced motion, a keyboard
    open or a deep link: the photo simply grows as before. Under reduced motion the grain stays, still.

## Photographs

- `photos/` holds the originals. Never edit them.
- **Web versions are made at build time by Astro, all in AVIF.**
  - **Quality:** film is encoded at 62 so its grain survives; digital at 52.
  - **Thumbnails:** 400, 800 and 1200px wide.
  - **Lightbox:** 1200 to 2400px wide.
  - **Hero:** 900 to 2400px wide.
  - **No full-resolution copy is ever written:** each image is given an explicit fallback width.
- **The lightbox asks for the size it actually shows:** the screen width, or less when the photo is limited by
  the screen's height.
- **Budgets:**
  - a page's first load stays under about 600 KB, fonts included
  - one full-screen photo stays under about 700 KB at the largest size
- **Shapes:**
  - film frames keep 3:2
  - mirrorless prints keep their true shape on the proof sheets
  - the lightbox always shows the full frame
