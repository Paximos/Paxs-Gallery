# DIRECTION SHEET — The page is the object
seed 1795742774 · drawn 2026-10-23 · redraws: 1 · sector personal-portfolio
Brief: Pax's: personal photography portfolio with two collections, Life on Film (analog scans, grain, warm) and Life on Mirrorless (digital, sharp, clean)

| | |
| --- | --- |
| Direction | The page is the object |
| Hero | Card over a dim room |
| Type | Bebas Neue / EB Garamond |
| Colour | Green-black and bone |
| Sections | intro (Title, note, facts row) → gallery (Drag row of mixed modules) → gallery (Photo tiles with label strips) → about (Founder's letter) → contact (Clip-out coupon form) → footer (The back of the card) |
| Motion | Pinned story |
| Photographs | the "People" set, as atmosphere |

This is the direction for this build. Adopt it. Do not blend it with the layout you would have made anyway,
and do not redraw because it is unfamiliar: unfamiliar is the point. Redraw a slot only when it conflicts
with a stated brand constraint or needs an asset that does not exist, and say why in your report.

The parts of this sheet were written separately and will disagree in small ways. Settle every disagreement in this order:
**house rules** (including type no smaller than 13px and body text of 16px or more) → **the direction** (the idea, the composition habits, where the
one accent goes) → **the type system and the palette** (which face does which job, the five size steps, which colour is the ground and where the
accent goes) → **the hero blueprint** → **the section blueprints**. Under each blueprint below, "Adjusted for this page" lists where it disagrees.
In practice: take geometry from blueprints (columns, proportions, what sits where) and take everything else from above them. Map every size a
blueprint names onto one of your five type steps instead of adding a sixth. Use one button shape, one corner radius and one pair of page margins on
the whole page, whatever individual blueprints say. If a blueprint names a kind of typeface (a light serif, a heavy grotesk), use the dealt face.

## 1. The idea
Find the printed or physical artefact that already exists in the subject's world and build the page as that thing. A wedding site is the invitation card. A restaurant is its menu. A conference is the ticket; a record is its sleeve; a shop is the receipt or the swing tag; an archive is a stack of tabbed folders; a course is the syllabus sheet. The artefact supplies everything a template would otherwise invent: its proportions, its typographic manners, its way of grouping information. Visitors recognise the object instantly, which is why these pages feel specific.

Before anything else, write one sentence in your notes: "On this page, <the subject's own material> becomes <the device>."
Fill the first blank from your inventory of what only this client has (its name and what it means, its street, its numbers, its
constraint), then put the nearest competitor in the sentence: if it still works, the idea is the category's, not the client's.
Then name the one live thing the visitor can do on the page (SKILL.md step 4).

## 2. Composition
The first screen shows the artefact as a single filled panel (paper colour on a contrasting ground) centred or offset, with believable proportions: a card at 5:7, a ticket at about 2.2:1 with a notch cut by `clip-path`, a menu as a tall sheet. All primary content lives on it, set the way that object is set: centred and symmetrical for an invitation, in tidy aligned columns for a menu or ticket. The ground behind is a flat colour or one full-bleed photograph. As the page continues, each section is another piece of the same stationery: a second card, a tear-off stub, a folded panel, always filled shapes with real edges (straight, notched, scalloped, perforated by a dotted `border` of round dots at 4px or more), never outlined boxes. The footer is the back of the object.

## 3. Type — Bebas Neue / EB Garamond
Huge condensed capitals against a light old-style serif with italics: an industrial voice and a literary one, with a twenty-fold size gap between them. Suits crafted physical products, spirits, outdoor goods and hospitality.
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet">
```
- Display: **Bebas Neue** — weight 400 (single cut, capitals only) · tracking -0.02em, tightening to -0.06em above 15vw · leading 0.85 · uppercase
- Text: **EB Garamond** — leading 1.45 · tracking 0
```css
:root {
  --step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
  --step-body: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
  --step-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --step-head: clamp(2.5rem, 1.2rem + 5vw, 5.5rem);
}
```
Take the manners of the artefact: a bookish serif with small caps avoided, or a blunt condensed face for tickets and posters. Sizes stay within what print would use relative to the panel; the name is large on the panel, details are small and exact.
The direction decides sizes and how many of them; the type system decides how this face is set. Where the two give different tracking or leading, use the values of the type system: they are tuned to this face.
The display size itself comes from the hero blueprint below.

## 4. Colour — Green-black and bone
```css
:root {
  --bg: #161c1a;
  --surface: #1f2725;
  --ink: #e3e2da;
  --muted: #8e948d;
  --accent: #9fc7b8;
  --accent-ink: #161c1a;
}
```
Bone type on green-black from top to bottom, with panels and drawn details barely lighter than the ground so photographs supply the colour. Pale jade is for the booking or contact button alone.
Paper and ink plus the ground the paper sits on. Two or three flat colours in total, like a two-colour print job.

## 5. Imagery
**Use the images that belong to the project in every picture slot.** For slots they cannot fill, real pictures of the subject's world from the open collections come next (start with `node C:/Users/User/.agents/skills/design-taste-frontend/scripts/assets.mjs "film postcard"`, then "film old map" and "personal portfolio", then queries from your inventory (its street, its materials, its trade's tools and history); credit them on the page), then the dealt photographs.

Optional. One photograph behind the object, or small photographs placed on it like tipped-in plates. The object itself is the image.

**Floor (the inspector checks it):** at least four real pictures on the page, usually six to twelve; SVG drawings do not count. One moving picture where an honest clip exists: `node <skill>/scripts/assets.mjs --video "<query>"`, used as a muted loop with a poster frame. Whatever this direction says about pictures, it is carried out with real ones.

Photographs dealt for this build, from the "People" set (figures, silhouettes and portraits, mostly unposed)
Order of preference for imagery: (1) the project's own photographs and product shots; (2) images you generate, if an image tool is
available; (3) real pictures of the subject's world found in the open collections (assets.mjs, downloaded and credited on the page);
(4) drawings of the subject in code; (5) these. They are real photographs (Unsplash licence, served by picsum.photos) of places, light and
texture. They are atmosphere, never a stand-in for a specific product, dish, person or interface. List the ones you use in your report so
they can be replaced.
- `https://picsum.photos/id/338/1600/1000` — Person in a hooded coat seen from behind facing a misty sea · mid tone · slate blue, grey, charcoal · calm area: left · native landscape · photo: Patryk Sobczak
- `https://picsum.photos/id/177/1600/1000` — Hiker with a backpack looking over a hazy mountain valley · mid tone · warm tan, hazy gold, olive · calm area: left · native landscape · photo: Danka & Peter
- `https://picsum.photos/id/669/1600/1000` — Person in a mustard jacket and grey beanie seen from behind in fog · light tone · mustard, pale grey, white · calm area: left · native landscape · photo: Luke Pamer
- `https://picsum.photos/id/685/1600/1000` — Man sitting on a rock looking over a sea of clouds · mid tone · pale gold, grey, dark brown · calm area: right · native landscape · photo: Joshua Earle
- `https://picsum.photos/id/1006/1600/1000` — Person sitting on a rocky overlook above misty forested hills · mid tone · dusky purple, olive green, grey · calm area: top · native landscape · photo: Vladimir Kudinov
- `https://picsum.photos/id/660/1600/1000` — Woman in a knitted cardigan holding a lit sparkler in front of her · dark tone · dark teal, grey, warm white · calm area: left · native landscape · photo: Morgan Sessions
- `https://picsum.photos/id/1005/1600/1000` — Person in a scarf seen from behind, looking at the sea at dusk · mid tone · warm sand, dark brown, pale peach · calm area: left · native landscape · photo: Matthew Wiebe
- `https://picsum.photos/id/349/1600/1000` — Man sitting on a sea wall looking toward a hazy skyline · mid tone · warm grey, sepia, charcoal · calm area: left · native landscape · photo: Caleb George
The last two path numbers are width and height: request the exact crop you render (`/1200/1500` for a 4:5 portrait, `/2400/1350` for a hero) and
add `?grayscale` to desaturate. Use three to six of them, not all eight. Always set `width`, `height`, `alt` and `loading="lazy"` (not on the hero image).
Other sets that fit this brief: object-still, fog-and-quiet, field-and-farm, architecture — `node draw.mjs --photos <set>` prints one in full; `--photos list` shows all sets. Taking photographs from another set is your call and is not a redraw; keep them to one light and one treatment.

## 6. Hero — Card over a dim room
A full-bleed, low-key photograph of the room fills the viewport, darkened with `filter: brightness(0.7)` so it reads as atmosphere. Centred over it is one square-cornered panel in a flat warm tone taken from the photograph: columns 4–10, about 55% of the width and 62% of the height, a filled programme card with 32px padding. Along its top edge the three words of the title are spread to the left, centre and right in bold condensed capitals at clamp(28px, 2.5vw, 38px); that line is the headline. Under it sit two left-aligned blocks in the same face and size, line-height 1.0: the facts (date, time, place) as three short lines, then one supporting sentence held to 30ch. Along the card's bottom edge: a credit at left in 14px, the single action as a solid rectangular button in the centre, one text link at right. There is no navigation outside the card. The card is `position: sticky`: as the page scrolls it shrinks with `transform: scale` toward the bottom-left corner and stays there as a ticket-sized stub while photographs of differing sizes pass on a flat ground.

On a phone: The photograph fills 100svh and the card sits centred at full width minus 16px margins, 70svh tall. The title words stack as a two-line heading at 9vw at the card's top-left. The facts and the supporting sentence follow at 5.2vw in the condensed face. The action button spans the card's bottom edge. On scroll the card shrinks to a 120px stub pinned bottom-left.
Headline: The event or venue name, three words at most and up to about 8 characters each, spread across the card's top edge; two lines on a phone.

Adjusted for this page:
- It names a kind of typeface: use the dealt faces (display Bebas Neue, text EB Garamond) and their settings; capitals only where the type system sets them.
- It sets a sentence large over several lines: jurors read that as a long headline. Either cut it to a two-line headline at display size, or keep it a statement at 36px or less on three lines (24px, four lines on a phone).
- Its vw sizes assume a face of normal width: with this condensed display face, size the words to fill the measure the blueprint gives them instead of copying the vw value.

## 7. Sections, in order
Each is a composition to rebuild with this project's content. Keep the geometry; change the subject. Re-order or drop a
section when the argument of the page needs it (see references/copy.md), never to fall back to a card grid.

### 1. intro — Title, note, facts row (split)
First row: a heading of two to four words in a light weight at clamp(44px, 5vw, 76px) sits on the left margin in columns 1–6; a three-line paragraph at 16px, 260px wide, sits in columns 10–12 with its last line on the heading's baseline. Columns 7–9 stay empty. 120px lower, a second row sets three or four facts (a date, a time, a place, a price) as large light text at clamp(28px, 3vw, 44px), spread across the 12 columns with `justify-content: space-between`. Each fact has a one-line explanation at 14px directly under it in the soft ink, left-aligned to the fact. Facts are separated only by the space between them, so the row reads like the line of times on a printed programme. A photograph may start under the right half of the facts row, 5 columns wide at 4:3. Padding 140px top, 120px bottom.
On a phone: Heading at 11vw on the left margin; the note follows directly under it at 16px, full width. The facts become a two-column grid with a 32px row gap, each fact at 26px with its explanation beneath. Any photograph goes last, full width.

Adjusted for this page:
- Its vw sizes assume a face of normal width: with this condensed display face, size the words to fill the measure the blueprint gives them instead of copying the vw value.

### 2. gallery — Drag row of mixed modules (carousel)
One horizontal row, 68svh tall, running off both viewport edges with 12px gaps, draggable and scrollable sideways (`overflow-x: auto`, `scroll-snap-type: x proximity`, scrollbar hidden). The row is built from three module types: a tall single image at 3:4 filling the row height; a column of two stacked 4:3 images sharing the height with a 12px gap; and a wide 16:10 landscape at full height. Sequence for nine photographs: tall, stacked pair, wide, stacked pair, tall, wide. The row starts 6vw in from the left, so the first module is whole and the last visible one is cut by the right edge. A heading of two or three words at 28–36px sits 32px above the row's left start; the count of photographs sits at the right margin on the same baseline. No captions and no arrows. Inside a narrow reading column the same row runs 300px tall and is cut by the column's edge.
On a phone: The row is 62svh tall with 8px gaps and starts 20px in. Modules are sized so one and a third are visible: tall images 72vw wide, stacked pairs 64vw wide, landscapes 88vw wide at reduced height and centred vertically. Scroll snapping aligns each module to the left margin.

Adjusted for this page:
- Its vw sizes assume a face of normal width: with this condensed display face, size the words to fill the measure the blueprint gives them instead of copying the vw value.

### 3. gallery — Photo tiles with label strips (grid)
Four columns with 12px gaps; every tile is a photograph with a filled label strip attached directly beneath it, the two forming one object like a print with its swing tag. The photograph is 1:1 or 4:5 with square corners. The strip is the same width, 84–96px tall with 12px padding, and holds two or three rows of text at 12–13px in the text face with tabular figures: row one spreads four short values evenly across the width with `justify-content: space-between`; row two puts a date at the left end and a time or place at the right end; row three names the maker or model. Strip and text colours change per tile through four palette pairs (dark on bright, bright on dark), so a uniform grid looks varied. Rows of tiles are 28px apart. A two- or three-word heading at 32px sits top-left, 40px above the grid. Holds 8–16 tiles.
On a phone: Two columns with 8px gaps. Strips keep two rows only: the four values wrap to two per row, and the date and place line is dropped. Text stays at 12px. The heading sits above at 24px. Colour pairs keep rotating so adjacent tiles never match.

Adjusted for this page:
- It sets text at 12px: use your small step (13px or more) instead.

### 4. about — Founder's letter (stack)
A letter in a centred column 520px wide with at least 160px of empty ground above and below. At the column's top-left, a round portrait 44px across. 28px below it, four or five short paragraphs at 16–17px with leading 1.55, each two to four lines and separated by one blank line, written in the first person. No heading. The sign-off is the writer's name at 22px in the text face's italic, with the role at 14px in the soft ink beneath it. One phrase in the letter may carry a flat marker-colour background. Variant for a page built as an object: the letter sits on a filled paper-colour sheet 640px wide with 60px padding on a contrasting ground, square corners, its bottom edge cut into small scallops with `clip-path`, and below a row of 5px round dots a tear-off strip 72px tall that carries the email address.
On a phone: The column takes the full width with 24px margins; text at 16px, portrait 40px. In the sheet variant the sheet spans edge to edge with 24px padding and keeps its shaped bottom edge; the tear-off strip stacks the email above a full-width button.

Adjusted for this page:
- It names a kind of typeface: use the dealt faces (display Bebas Neue, text EB Garamond) and their settings; capitals only where the type system sets them.

### 5. contact — Clip-out coupon form (split)
The form is a coupon to cut out. One filled card in a strong flat colour, about 2.2:1, spans columns 2–11 with a 14px radius, with 120px of ground above and below. Semicircular notches 28px across are cut into its top and bottom edges at the 46% mark with `clip-path` or an SVG `mask`, and a vertical row of round dots (a dotted `border-left` 5px thick in the ground colour) joins the two notches as the perforation. Left of the perforation, with 48px padding: a two-line heading of three to five words at clamp(28px, 3vw, 44px) in heavy capitals at the top, and one sentence at 16px at the bottom. Right of it: four inputs stacked with 10px gaps, each a filled block 52px tall in a lighter tone of the card with its placeholder at 16px, then a full-width solid submit bar 56px tall in the darkest ink. Inputs keep visually hidden `label` elements.
On a phone: The card turns upright and spans the width with 12px margins. The perforation becomes horizontal: notches on the left and right edges, dots across. Heading and sentence sit above it; the four inputs and the submit bar sit below, each 54px tall.

Adjusted for this page:
- It names its own corners: use the one radius of this page (square unless the direction says otherwise) and one button shape.
- It names a kind of typeface: use the dealt faces (display Bebas Neue, text EB Garamond) and their settings; capitals only where the type system sets them.
- It draws lines or borders: keep them only inside a table, a form or a `data-ui` fragment; elsewhere separate with space or a change of ground.
- Its vw sizes assume a face of normal width: with this condensed display face, size the words to fill the measure the blueprint gives them instead of copying the vw value.

### 6. footer — The back of the card (stack)
The footer is the reverse side of the page's artefact, laid out as the back of a postcard. A paper-coloured panel spans columns 2–11 on the contrasting ground, about 420px tall, its top edge cut into a row of twelve semicircular scallops (an inline SVG path or `clip-path`, each scallop about 100px wide). The panel is divided by space into two halves. Left half: a short sign-off of two to four words at 32px, then two or three lines at 16px, written like a message. Right half: the address block, four left-aligned lines at 18px with 12px between them, each line a link (email, telephone, street, social); above it in the top-right corner, a stamp: one small photograph, 3:4 and 88px wide, with a 6px paper-coloured margin. Along the panel's bottom edge, a single centred line at 12px gives the copyright like a printer's imprint.
On a phone: The panel runs full width with six scallops across its top edge. The stamp sits top-right at 64px wide; the sign-off and message come first, then the address lines at 17px beneath them, then the imprint line centred at 12px.

Adjusted for this page:
- It sets text at 12px: use your small step (13px or more) instead.

## 8. Motion — Pinned story
One element holds its place with `position: sticky` (a title, a frame, a product fragment) while the items that belong to it scroll past or swap inside it. The page's ordinary scrolling does the work; nothing is hijacked. Hold it for about one screen per step and three screens at most, two held stages per page at most, with a line of text on every held screen. Recipe: 'Pinned story' in references/motion.md.
This is the signature move, the one loud moment. Around it the page still needs the rest of the motion layer (SKILL.md step 9): an entrance for the parts of every section, feedback on every control, and one moving picture. The inspector fails a page that barely moves. Recipes: references/motion.md.

## 10. Where the richness comes from
Recognition. The shaped edges, the print-like alignment and the limited inks make a familiar object out of plain HTML.

## 11. How this direction goes wrong
Choose an artefact that truly belongs to the subject, or it becomes costume. Shape the edges with fills and `clip-path`; an outlined rectangle with a thin border is not an object. Keep text sizes readable on a phone, where the object becomes full width with its shaped edge kept at top and bottom.

## 12. Real references
Studied sites that work this way. Take the principle, never the specifics: no names, copy, images or signature assets of theirs.
- **The Deep End** (One Page Love, studied score 7.5) `opl-the-deep-end`
  Idea: The whole site is one invitation card floating over ambient footage, which shrinks into a pinned corner ticket as scattered stills scroll past.
  Hero: Full-bleed, dim, amber-toned video of a listening room: a modular synth and speaker at top, a person lying on a silk cushion in soft focus. Centred over it is a square-cornered panel about 55% of the viewport wide and 62% tall, a blurred brown-to-taupe wash. Inside, the three words of the title are spread along the top edge at left, centre and right in bold condensed caps. A small line-diagram logo sits below. Two left-aligned text blocks at 2.5vw in the same heavy condensed face, tightly leaded: five lines of event details, four of description. Bottom edge: credits left, an RSVP box centre, a small link right. No navigation.
  Worth taking: Spread the words of a short title to the left, centre and right of a card's top edge so the name becomes its frame.
- **Mosby’s Files** (Awwwards Site of the Day, studied score 8) `aww-mosbys-files`
  Idea: An archive of architects presented as a physical stack of coloured index-tab file folders that you flip through.
  Hero: Charcoal background. A slim top bar over a hairline holds the condensed wordmark dead centre and one mono link far right. The headline is one centred line of heavy condensed uppercase at 10vw, about 71% of the width, in the upper quarter. Beneath it, a three-line centred serif paragraph in mid-grey, about 42% wide. From 51% down sits a stack of file folders 86% of the viewport wide: each is a flat colour band with one to three trapezoid tabs rising from its top-left edge, each tab a different colour holding a serif name. Mono category labels sit right-aligned. The front red folder is open, running off the bottom.
  Worth taking: Build navigation as stacked full-width colour bands with trapezoid tabs, each tab coloured to clash with the folder behind it.
- **Marina Rachello** (One Page Love, studied score 7.6) `opl-marina-rachello`
  Idea: The surname is broken with a hyphen so its tail becomes a greeting, set huge in a soft bookish serif on a red field, and the page signs off with an even larger goodbye.
  Hero: Solid red-orange viewport with no navigation: only two tiny pale labels in the top corners (role at left, employer at right). The name starts about 15% down, left-aligned from a 3% margin, in a soft, slightly blobby bold serif at roughly 14vw. Line one, in cream, breaks the surname with a hyphen about 84% across; line two, in near-black, completes it as a greeting with an exclamation mark, leaded so tightly the lines nearly touch. Together they fill the top 55% of the screen. A right-aligned two-paragraph bio in small white sans, about 24% wide, sits in the bottom-right corner. The bottom-left is empty.
  Worth taking: Find a word hiding inside the name and split it across two lines with a hyphen and a colour change, so the headline is both the name and a greeting.
Full notes on any of them: `node draw.mjs --site <id>`.

## Always
Headlines two lines or fewer at every width. No eyebrow labels, no monospace, no 01/02/03, no thin rules, no gradients, no shadows at rest,
no cream-and-terracotta, no violet. The frame: one h1 on the first screen that says what this is, equal outer margins, no
section huddled on one side with the other half empty, no blank stretch over half a screen, a heading on every section.
`inspect.mjs` measures all of it.

Saved to C:/Users/User/paxs/.taste-skill/direction.json · reprint with `node draw.mjs --show`
