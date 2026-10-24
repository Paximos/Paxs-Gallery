# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static output) with GSAP + ScrollTrigger for motion and Lenis for smooth scrolling, chosen by the user
on 2026-10-23. Replaces the current plain HTML/CSS/JS prototype in `site/`. Deploy target not yet decided
(any static host works).

## Users

Pax's friends and followers: people who know Pax or follow the work, arriving from a shared link or a
profile, mostly on a phone, browsing for pleasure rather than to buy or hire.

## Product Purpose

A personal photography archive in two collections, **Life on Film** (35mm scans, roll by roll) and
**Life on Mirrorless** (digital frames from a Canon EOS M50 Mark II). Success: visitors look through the
photos, open them full screen, and share or say hello. Nothing is sold.

## Positioning

The site is Pax's own record of two ways of looking: the slow, roll-by-roll film camera and the immediate
mirrorless one. The real artefacts of each (roll and frame numbers from the lab scans, the camera's own
exposure data) are part of the content, not decoration.

## Operating Context

- Film arrives as numbered lab scans: `r001-013.jpg` = roll 001, frame 13. New rolls (002, 003…) will be
  added regularly.
- Digital frames come straight from the camera with EXIF (aperture, shutter, ISO, focal length, date).
- Pax adds photos by dropping originals into `photos/film` and `photos/mirrorless`; the site must pick them
  up automatically at build time, with no hand-written markup per photo.
- Collections are expected to grow to hundreds of photos.

## Capabilities and Constraints

- Captions and places are optional per photo; a photo with none must still look complete.
- Undecided: the contact email or social handle, and whether captions/places live in a sidecar file.
- No print sales, no checkout, no client enquiries.

## Brand Commitments

Name: **Pax's**. Collection names: **Life on Film** and **Life on Mirrorless**.

## Evidence on Hand

- `photos/film`: 9 scans from roll 001 (Madrid, Paris, a beach at dusk).
- `photos/mirrorless`: 22 files. Most are from the Canon EOS M50 Mark II (Greece 2021, Morocco Sep 2025,
  Paris Feb 2026). One is a Samsung phone shot, and `IMG_2549.jpg` duplicates `IMG_2549 (1).jpg`.
- No testimonials, press, clients or statistics exist; never invent them.

## Product Principles

1. The photographs are the experience; every interface element must step back for them.
2. Each collection shows the truth of its medium: rolls and frame numbers for film, exposure data for digital.
3. Adding photos is drop-in: no code edits to publish a new roll or trip.
4. Motion is smooth and generous, but never delays seeing a photo or hijacks the scroll.
5. Phone first: most visitors arrive from a shared link on a phone.
