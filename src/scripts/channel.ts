// Channel-flipping previews on the hero deck (DESIGN.md, Motion; overdrive). While Life on Film or Life on
// Mirrorless is the centred card, it plays its collection like a VHS preview: every 2.4s it cuts to another
// real photo through a tracking glitch (the new picture tears in, sliced and shifted, while a bright band
// rolls down the card) and the card names the frame it shows. Side cards hold still, and so does the
// centred one while it is hovered, touched, just turned, off screen or still developing.
// Nothing under reduced motion: the cards keep their covers.
import { reduced } from './motion';

type Entry = { src: string; srcset: string; label: string; pos: string };
const EVERY = 2400; // time on each picture
const CUT = 320; // the glitch itself

const step = (k: Keyframe) => ({ ...k, easing: 'steps(1, end)' });

export function channels(deck: HTMLElement) {
  if (reduced()) return;
  const hero = deck.closest<HTMLElement>('.deck-hero');
  const feeds = new Map<HTMLAnchorElement, { list: Entry[]; at: number; meta: HTMLElement | null; base: string }>();
  deck.querySelectorAll<HTMLAnchorElement>('.deck-link[data-feed]').forEach((a) => {
    try {
      const list = JSON.parse(a.dataset.feed ?? '[]') as Entry[];
      const meta = a.querySelector<HTMLElement>('.deck-meta');
      if (list.length > 1) feeds.set(a, { list, at: 0, meta, base: meta?.textContent ?? '' });
    } catch { /* a card without a feed keeps its cover */ }
  });
  if (!feeds.size || !hero) return;

  // A touch or a turn holds the picture still for a moment, so it can be looked at.
  let quietUntil = 0;
  const hold = (ms: number) => { quietUntil = Math.max(quietUntil, performance.now() + ms); };
  deck.addEventListener('pointerdown', () => hold(4000), { passive: true });
  deck.addEventListener('deckturn', () => hold(1600));

  const later = () => { setTimeout(cut, EVERY); };

  async function cut() {
    const a = deck.querySelector<HTMLAnchorElement>('.deck-card[data-pos="0"] .deck-link');
    const f = a ? feeds.get(a) : undefined;
    const still = !a || !f || document.hidden || hero!.classList.contains('is-off') || performance.now() < quietUntil
      || document.documentElement.classList.contains('tray') || a.matches(':hover');
    if (still) return later();

    const next = (f.at + 1) % f.list.length;
    const e = f.list[next];
    const img = new Image();
    img.className = 'deck-photo deck-feed';
    img.alt = '';
    img.sizes = '(min-width: 64em) 26rem, 70vw';
    img.srcset = e.srcset;
    img.src = e.src;
    img.style.objectPosition = e.pos;
    try { await img.decode(); } catch { return later(); }
    // the deck may have turned while the picture loaded
    if (a.closest('.deck-card')?.getAttribute('data-pos') !== '0') return later();

    const shown = [...a.querySelectorAll('.deck-feed')];
    (shown.at(-1) ?? a.querySelector('.deck-photo'))!.after(img);
    f.at = next;
    if (f.meta) f.meta.textContent = e.label || f.base;
    a.querySelector('.deck-title')?.classList.add('is-glitch');

    img.animate([
      step({ clipPath: 'inset(0 0 72% 0)', transform: 'translateX(-5%)' }),
      step({ clipPath: 'inset(38% 0 22% 0)', transform: 'translateX(4%)', offset: 0.22 }),
      step({ clipPath: 'inset(8% 0 48% 0)', transform: 'translateX(-2.5%)', opacity: 0.7, offset: 0.44 }),
      step({ clipPath: 'inset(0 0 12% 0)', transform: 'translateX(1.5%)', opacity: 1, offset: 0.66 }),
      { clipPath: 'inset(0 0 0 0)', transform: 'none' },
    ], { duration: CUT }).finished.then(() => {
      shown.forEach((s) => s.remove()); // the picture underneath is never seen again
      a.querySelector('.deck-title')?.classList.remove('is-glitch');
    }).catch(() => {});
    a.querySelector('.deck-track')?.animate(
      [{ transform: 'translateY(-100%)', opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: 'translateY(720%)', opacity: 0 }],
      { duration: CUT + 120, easing: 'linear' },
    );
    later();
  }

  setTimeout(cut, EVERY + 600);
}
