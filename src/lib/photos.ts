// Reads every photo in photos/film and photos/mirrorless at build time and groups them into rolls
// (from the scan file names) and trips (from the camera's dates). Notes come from photos/captions.yml.
import fs from 'node:fs';
import path from 'node:path';
import type { ImageMetadata } from 'astro';
import exifr from 'exifr';
import sharp from 'sharp';
import { parse } from 'yaml';

type Collection = 'film' | 'mirrorless';

export interface Exif {
  f?: number;
  shutter?: string;
  iso?: number;
  focal?: number;
  date?: Date;
  camera?: string;
}

export interface Photo {
  file: string;
  collection: Collection;
  image: ImageMetadata;
  group: string;
  index: number; // 1-based position in its roll or trip
  frame?: number; // film only
  title?: string;
  place?: string;
  alt: string;
  exif: Exif;
  placeholder: string; // tiny blurred image as a data URI
  focus: { x: number; y: number }; // where a contrast-detect autofocus would lock, as fractions of the frame
  href: string; // deep link
}

export interface Group {
  id: string;
  collection: Collection;
  label: string; // "Roll 001" or "Paris, Feb 2026"
  number?: string;
  places?: string;
  start?: Date;
  end?: Date;
  photos: Photo[];
}

interface Notes {
  hero?: string;
  stamp?: string;
  filmCard?: string;
  mirrorlessCard?: string;
  hidden?: string[];
  rolls?: Record<string, { places?: string; stock?: string }>;
  trips?: Record<string, { name?: string }>;
  photos?: Record<string, { title?: string; place?: string; alt?: string }>;
}

const root = process.cwd();
const notesPath = path.join(root, 'photos', 'captions.yml');
const notes: Notes = fs.existsSync(notesPath) ? parse(fs.readFileSync(notesPath, 'utf8')) ?? {} : {};
const hidden = new Set(notes.hidden ?? []);

const filmFiles = import.meta.glob<{ default: ImageMetadata }>('/photos/film/*.{jpg,jpeg,JPG,JPEG,png,webp}', { eager: true });
const mirrorlessFiles = import.meta.glob<{ default: ImageMetadata }>('/photos/mirrorless/*.{jpg,jpeg,JPG,JPEG,png,webp}', { eager: true });

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TRIP_GAP_DAYS = 4;

export const formatDate = (d: Date) => `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

export function formatRange(a?: Date, b?: Date) {
  if (!a) return '';
  if (!b || formatDate(a) === formatDate(b)) return formatDate(a);
  if (a.getUTCFullYear() !== b.getUTCFullYear()) return `${formatDate(a)} to ${formatDate(b)}`;
  if (a.getUTCMonth() !== b.getUTCMonth()) return `${a.getUTCDate()} ${months[a.getUTCMonth()]} to ${formatDate(b)}`;
  return `${a.getUTCDate()}–${formatDate(b)}`;
}

const slug = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

async function placeholder(file: string) {
  const buf = await sharp(path.join(root, file)).rotate().resize(16).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

// Contrast-detect autofocus, done once at build time: the sharpest patch of the frame (the most local
// contrast in a coarse grid), with a gentle pull toward the centre, as the camera's own AF would weigh it.
async function focusPoint(file: string) {
  const W = 96;
  const { data, info } = await sharp(path.join(root, file)).rotate().resize(W).greyscale().raw().toBuffer({ resolveWithObject: true });
  const H = info.height, G = 8;
  const cw = W / G, ch = H / G;
  let best = { x: 0.5, y: 0.5, e: -1 };
  for (let gy = 0; gy < G; gy++) for (let gx = 0; gx < G; gx++) {
    let e = 0;
    for (let y = Math.max(1, Math.floor(gy * ch)); y < Math.min(H - 1, Math.floor((gy + 1) * ch)); y++)
      for (let x = Math.max(1, Math.floor(gx * cw)); x < Math.min(W - 1, Math.floor((gx + 1) * cw)); x++) {
        const i = y * W + x;
        e += Math.abs(4 * data[i] - data[i - 1] - data[i + 1] - data[i - W] - data[i + W]); // Laplacian
      }
    const cx = (gx + 0.5) / G, cy = (gy + 0.5) / G;
    e *= 1 - 0.6 * Math.hypot(cx - 0.5, cy - 0.5);
    if (e > best.e) best = { x: cx, y: cy, e };
  }
  return { x: best.x, y: best.y };
}

async function readExif(file: string): Promise<Exif> {
  try {
    // EXIF sits at the start of a JPEG; read only that much (exifr's own file reader trips on Node 26).
    const fd = fs.openSync(path.join(root, file), 'r');
    const head = Buffer.alloc(256 * 1024);
    const bytes = fs.readSync(fd, head, 0, head.length, 0);
    fs.closeSync(fd);
    const t = await exifr.parse(head.subarray(0, bytes), ['Make', 'Model', 'FNumber', 'ExposureTime', 'ISO', 'FocalLength', 'DateTimeOriginal']);
    if (!t) return {};
    const exposure: number | undefined = t.ExposureTime;
    const model = [t.Make, t.Model].filter(Boolean).join(' ');
    return {
      f: t.FNumber,
      shutter: exposure ? (exposure < 1 ? `1/${Math.round(1 / exposure)}` : `${exposure}s`) : undefined,
      iso: t.ISO,
      focal: t.FocalLength ? Math.round(t.FocalLength) : undefined,
      // Camera clocks have no time zone: read the wall-clock time as UTC so dates never shift.
      date: t.DateTimeOriginal ? new Date(Date.UTC(t.DateTimeOriginal.getFullYear(), t.DateTimeOriginal.getMonth(), t.DateTimeOriginal.getDate(), t.DateTimeOriginal.getHours(), t.DateTimeOriginal.getMinutes())) : undefined,
      camera: cameraName(model),
    };
  } catch {
    return {};
  }
}

function cameraName(model: string) {
  if (!model) return undefined;
  if (/EOS M50m2/i.test(model)) return 'Canon EOS M50 Mark II';
  return model.replace(/^(\w+) \1 /i, '$1 ').replace(/^Canon Canon/i, 'Canon');
}

function entries(files: Record<string, { default: ImageMetadata }>) {
  return Object.entries(files)
    .map(([key, mod]) => ({ file: key.replace(/^\//, ''), name: path.basename(key), image: mod.default }))
    .filter((e) => !hidden.has(e.name));
}

async function loadFilm(): Promise<Group[]> {
  const rolls = new Map<string, Photo[]>();
  for (const e of entries(filmFiles)) {
    // r001-013.jpg = roll 001, frame 13; anything after the frame number (" (1)") is ignored.
    const m = e.name.match(/^r?(\d+)[-_ ](\d+)/i);
    const roll = m ? m[1].padStart(3, '0') : '000';
    const frame = m ? parseInt(m[2], 10) : undefined;
    const n = notes.photos?.[e.name] ?? {};
    const photo: Photo = {
      file: e.file, collection: 'film', image: e.image, group: `roll-${roll}`, index: 0, frame,
      title: n.title, place: n.place,
      alt: n.alt ?? `Frame ${frame ?? ''} of roll ${roll}${n.title ? `: ${n.title}` : ''}`,
      exif: {}, placeholder: await placeholder(e.file), focus: { x: 0.5, y: 0.5 }, href: '',
    };
    if (!rolls.has(roll)) rolls.set(roll, []);
    rolls.get(roll)!.push(photo);
  }
  return [...rolls.entries()]
    .sort(([a], [b]) => b.localeCompare(a)) // newest roll first
    .map(([roll, photos]) => {
      photos.sort((a, b) => (a.frame ?? 0) - (b.frame ?? 0));
      photos.forEach((p, i) => { p.index = i + 1; p.href = `/film/roll-${roll}/${p.frame ?? i + 1}/`; });
      return { id: `roll-${roll}`, collection: 'film' as const, label: `Roll ${roll}`, number: roll, places: notes.rolls?.[roll]?.places, photos };
    });
}

async function loadMirrorless(): Promise<Group[]> {
  const photos: Photo[] = [];
  for (const e of entries(mirrorlessFiles)) {
    const n = notes.photos?.[e.name] ?? {};
    const exif = await readExif(e.file);
    photos.push({
      file: e.file, collection: 'mirrorless', image: e.image, group: '', index: 0,
      title: n.title, place: n.place,
      alt: n.alt ?? (n.title ?? `Photograph${exif.date ? ` taken ${formatDate(exif.date)}` : ''}`),
      exif, placeholder: await placeholder(e.file), focus: await focusPoint(e.file), href: '',
    });
  }
  photos.sort((a, b) => (a.exif.date?.getTime() ?? 0) - (b.exif.date?.getTime() ?? 0));

  // A new trip starts whenever more than TRIP_GAP_DAYS pass between two photos.
  const trips: Photo[][] = [];
  for (const p of photos) {
    const last = trips.at(-1)?.at(-1);
    const gap = last?.exif.date && p.exif.date ? (p.exif.date.getTime() - last.exif.date.getTime()) / 864e5 : Infinity;
    if (!last || gap > TRIP_GAP_DAYS) trips.push([p]);
    else trips.at(-1)!.push(p);
  }

  return trips.reverse().map((list) => {
    const start = list[0].exif.date;
    const end = list.at(-1)!.exif.date;
    const key = start ? `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}` : 'undated';
    const name = notes.trips?.[key]?.name;
    const month = start ? `${months[start.getUTCMonth()]} ${start.getUTCFullYear()}` : 'Undated';
    const id = name ? `${key}-${slug(name)}` : key;
    list.forEach((p, i) => { p.group = id; p.index = i + 1; p.href = `/mirrorless/${id}/${i + 1}/`; p.place ??= name; });
    return { id, collection: 'mirrorless' as const, label: name ? `${name}, ${month}` : month, places: name, start, end, photos: list };
  });
}

let cache: Promise<{ film: Group[]; mirrorless: Group[]; hero?: Photo; stamp?: Photo; filmCard?: Photo; mirrorlessCard?: Photo }> | undefined;

export function loadPhotos() {
  cache ??= (async () => {
    const [film, mirrorless] = await Promise.all([loadFilm(), loadMirrorless()]);
    const all = [...film, ...mirrorless].flatMap((g) => g.photos);
    const hero = all.find((p) => path.basename(p.file) === notes.hero) ?? film[0]?.photos.at(-1) ?? all[0];
    const stamp = all.find((p) => path.basename(p.file) === notes.stamp) ?? mirrorless[0]?.photos[0] ?? all[0];
    const pick = (name?: string) => all.find((p) => path.basename(p.file) === name);
    const filmCard = pick(notes.filmCard) ?? film[0]?.photos.find((p) => p !== hero);
    const mirrorlessCard = pick(notes.mirrorlessCard) ?? mirrorless[0]?.photos[0];
    return { film, mirrorless, hero, stamp, filmCard, mirrorlessCard };
  })();
  return cache;
}

/** One line of camera data for a photo, as printed on its tag strip and in the lightbox. */
export function exposure(p: Photo) {
  const e = p.exif;
  return [e.f && `f/${e.f}`, e.shutter, e.iso && `ISO ${e.iso}`, e.focal && `${e.focal}mm`].filter(Boolean) as string[];
}

export function caption(p: Photo) {
  if (p.collection === 'film') return p.title ?? `Frame ${p.frame}`;
  return p.title ?? (p.exif.date ? formatDate(p.exif.date) : `Frame ${p.index}`);
}

export function meta(p: Photo, g: Group) {
  // The roll or trip name is shown on its own line above, so it is not repeated here.
  if (p.collection === 'film') return [`Frame ${p.frame}`, '35mm', p.place].filter(Boolean).join(' · ');
  return [...exposure(p), p.exif.date && formatDate(p.exif.date)].filter(Boolean).join(' · ');
}
