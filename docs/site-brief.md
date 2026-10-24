# Pax's: site brief

**Status:** approved on 2026-10-23.

The plan for the multi-page site. Layout and hierarchy only, with no code. The visual world is fixed by
[DESIGN.md](../DESIGN.md) and the product facts by [PRODUCT.md](../PRODUCT.md). The gallery structure
**Contact sheets** was chosen on 2026-10-23 (Impeccable surface round, seed:103e790f826ec8e7); its
first-screen sketch is `.impeccable/mocks/decision/contact.html`.

## 1. Job and audience

- **Who:** Pax's friends and followers, arriving mostly on a phone from a shared link (often a link to one
  roll or one photo).
- **Mode:** Experience. The photos lead from the first viewport.
- **Need:** look through the work, open any frame large, and share it or say hello.
- **Success:** visitors open frames, move roll to roll, and share links that land on exactly that frame.

## 2. Site map

| Route | What it is |
| --- | --- |
| `/` | The envelope: who Pax is, and the split into the two collections |
| `/film` | Life on Film: one contact sheet per roll, newest roll first |
| `/mirrorless` | Life on Mirrorless: one proof sheet per trip, newest trip first |
| `/film/roll-001/13`, `/mirrorless/2026-paris/4` | The lightbox, open on one frame (shareable deep links) |
| any unknown address | **No signal** (404): an empty frame of static and the links back to the photos |

The navigation is the same on every page:
- the wordmark "Pax's" (links home)
- "Life on Film"
- "Life on Mirrorless"
- "Say hello"

There's no other chrome.

## 3. Landing page (`/`)

Hierarchy, top to bottom:

1. **The hero deck** (changed 2026-10-23): three prints in a 3D stack, Life on Film on the left, **Pax's**
   in the centre, Life on Mirrorless on the right.
   - **Pax's** is the sunset frame in black and white, set as a poster (after a Swiss-grunge print): the name
     "Pax's" huge and heavy as the page's `h1`, the year in outline, dotted rules, a shutter-speed dial and the roll and camera in small print.
   - **Two-stage:** click, tap or Enter a side card to bring it to the centre; click the centred card to open
     it. The collections open their pages through the title morph; Pax's glides to the letter.
   - Arrow keys turn the deck; on a phone, swipe. Without JavaScript every card is a plain link.
   - The centred collection card plays its photos like a VHS preview, cutting to another real frame every few seconds.
2. **The split** (removed 2026-10-23): the two doors were replaced by the deck's collection cards.
3. **A work in progress…:** the heading and the facts row. All the numbers are counted
   from the photos at build time.
4. **The letter:** the note from Pax in the envelope (first person, sample copy to be confirmed).
5. **Back of the envelope (footer) = Say hello.**
   - The print-order coupon is removed, since nothing is sold.
   - In its place goes a short postcard message plus the address lines: email, Instagram (if wanted),
     and links to the two collections.
   - The stamp photo stays.

## 4. Collection page: Life on Film (`/film`)

The composition follows the chosen sketch.

- **Desktop, two columns:**
  - **Left column, about 330px and sticky:**
    - the `h1` "Life on Film"
    - one line: "Every roll laid out as the lab's contact sheet. Tap a frame to lift it out."
    - the roll index, a list of "Roll 001", "Roll 002"…, newest first
    - The roll in view is marked in jade and updates as you scroll. Clicking a roll scrolls to its sheet.
    - At 20+ rolls the index scrolls inside its column.
  - **Right column: the sheets.** Each sheet is one dark `--surface` panel per roll, stacked with section
    spacing between them.
    - **Sheet header:**
      - "Roll 001 · 35mm · Madrid, Paris, the sea" on the left; the frame count on the right
      - the film stock and lab date, if captions provide them
    - **Strips:** rows of 6 frames at 3:2 on the near-black strip ground. Frames stay in frame-number order,
      and each frame's number is printed along the strip edge, like the real edge print.
    - **The strip caption,** under each row: the frame range, e.g. "Frames 1 to 20".
    - There are no titles on the sheet; titles live in the lightbox.
- **Tablet:** the index becomes a horizontal roll switcher pinned under the nav. Sheets go full width with
  4 frames per strip.
- **Phone:**
  - The roll switcher is a sticky horizontal row of roll numbers, with the current one in jade.
  - Each sheet is full width with 3 frames per strip.
  - Tapping a frame opens the lightbox.
- **Hierarchy check:** the page title, then the roll number, then the frames. Frame numbers and ranges are
  the quietest text.

## 5. Collection page: Life on Mirrorless (`/mirrorless`)

This is the same contact-sheet grammar as a **proof sheet per trip**, so the two collections read as one
site.

- **The left index lists trips:** "Paris, Feb 2026", "Morocco, Sep 2025", "Greece, 2021".
  - A trip is either named in the captions file, or grouped automatically. Photos taken within 4 days of each
    other form one trip, named by month and year until a name is given.
- **Proof sheet:** justified rows of prints at a fixed row height, so portrait and landscape frames sit in
  their true shapes. This differs from film, which is uniformly 3:2.
  - Each print carries its EXIF tag strip underneath:
    - aperture, shutter, ISO and focal length
    - the date
    - the camera
  - The four strip colour pairs rotate.
  - On a phone the strip keeps one row: aperture, shutter, ISO, focal length.
- **Sheet header:** the trip name, the date range and the number of frames.

## 6. Lightbox (on both collections)

- **Entry:** it opens from the tapped thumbnail. The frame grows from its own rectangle to fill the screen,
  and the URL changes to the frame's deep link. A deep link loads the collection page with the lightbox
  already open.
- **Layout:**
  - **Background:** the full `--bg` ground; nothing of the page shows through.
  - **The photo:** as large as the viewport allows, uncropped, centred, with a margin of `--margin`.
  - **Bottom bar:**
    - **Left:**
      - the caption (or "Frame 13" when there is none)
      - film: "Roll 001 · Frame 13 · 35mm"
      - digital: aperture, shutter, ISO, focal length and the date
    - **Right:** Previous, Next, Share (copies the frame link) and Close.
  - **Desktop only:** a thin filmstrip of the current roll or trip runs under the bar, with the current
    frame marked in jade.
- **Navigation:**
  - arrow keys, Escape, and Previous/Next
  - swipe left and right; swipe down to close on a phone
  - Next runs to the end of the roll or trip, then continues into the next one; the set name in the bar
    wipes in to mark it ("Roll 002"), without delaying the photo.
- **Zoom:** double-tap or pinch for 2× on a phone; click to zoom on desktop. Panning follows the pointer.
- **Exit:** it closes back into the thumbnail's rectangle, faster than it opened, and focus returns to the
  thumbnail.

## 7. States and ranges

- **Rolls:** from 1 to hundreds. A roll has 1 to 37 frames, at 3:2, or 2:3 when a scan is portrait.
- **Trips:** from 1 to hundreds of frames, in mixed orientation.
- **Captions:** optional everywhere. A photo with no caption shows its frame number (film) or date
  (digital), and still looks finished.
- **Missing EXIF** (phone shots, edited exports): show the date only, or nothing. The tag strip shrinks and
  never shows empty fields.
- **Loading:** every thumbnail reserves its exact box from build-time dimensions and shows a small blurred
  placeholder, then fades in. There's never a layout shift.
- **One-frame roll or trip:** a single strip with one frame, and the sheet keeps its header.
- **Without JS:** frames are plain links to the full image, the index is anchor links, and every page reads
  top to bottom.

## 8. Stack and pipeline

- **Astro** (static output, the `astro:assets` image service with sharp). It works on any static host.
- **Photos load automatically.** A build-time loader reads `photos/film/**` and `photos/mirrorless/**`:
  - Film: the file name `r001-013.jpg` gives roll 1, frame 13. Suffixes like " (1)" are ignored.
  - Digital: EXIF is read with `exifr` and gives the date, camera and exposure, and the trip grouping.
  - Optional `photos/captions.yml` holds the titles, places, film stock and trip names, keyed by file name.
  - Astro outputs responsive AVIF/WebP sizes and a tiny blurred placeholder per frame.
- **Motion:**
  - **No animation library** (GSAP removed 2026-10-24): landing entrances are an IntersectionObserver plus CSS
    transitions; the lightbox runs on the Web Animations API.
  - **Lenis** for smooth scrolling. It is turned off while the lightbox is open,
    and fully off under `prefers-reduced-motion`.
  - **Astro View Transitions** between `/`, `/film` and `/mirrorless`: the door you click morphs into that
    page's title.
- **Interactivity:** small client islands only, for the lightbox, the roll index and the motion layer.
  Everything else is static HTML.

## 9. Open decisions (the builder must not invent these)

1. Pax's real email and whether to show an Instagram handle.
2. Captions file format and who fills it: YAML in `photos/` is proposed.
3. Whether phone shots (no mirrorless EXIF) are allowed in Life on Mirrorless. Proposed: exclude them by
   camera model, and drop exact duplicates.
4. Film stock and lab date per roll, if Pax wants them on the sheet headers.
5. The letter's wording (currently sample copy written for Pax).

## 10. Anti-goals

- **No masonry wall, and no infinite scroll.** Rolls and trips are the units.
- **No hover-only information.** Everything a visitor needs is visible or one tap away.
- **No scroll hijacking, and no preloader.** Nothing delays seeing a photo.
- **No selling or forms.** "Say hello" is a link, not a form.
