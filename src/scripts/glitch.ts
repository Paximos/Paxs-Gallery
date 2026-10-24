// The VHS channel glitch beyond the mouse (DESIGN.md, Motion). A mouse sees it on hover (CSS); on a touch
// screen a link glitches the moment a finger lands on it, and on every device a visible headline or the
// wordmark now and then glitches on its own, like a tape's tracking slipping. Nothing under reduced motion.
import { reduced } from './motion';

const TAP = '.nav-mark, .nav-links a, .link, .col-index a';
const AMBIENT = '.head, .sheet-title, .nav-mark, .deck-card[data-pos="0"] .deck-title, .fact';

function play(el: Element) {
  el.classList.remove('is-glitch');
  // the next frame restarts the animation even if it was still running
  requestAnimationFrame(() => {
    el.classList.add('is-glitch');
    el.addEventListener('animationend', () => el.classList.remove('is-glitch'), { once: true });
  });
}

export function glitches() {
  if (reduced()) return;
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    const a = (e.target as Element | null)?.closest(TAP);
    if (a) play(a);
  }, { passive: true });

  const tick = () => {
    // only while the page is on screen and no photo is open full screen
    if (!document.hidden && !document.querySelector('dialog[open]')) {
      const seen = [...document.querySelectorAll(AMBIENT)].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.bottom > 0 && r.top < innerHeight;
      });
      if (seen.length) play(seen[Math.floor(Math.random() * seen.length)]);
    }
    setTimeout(tick, 6000 + Math.random() * 6000);
  };
  setTimeout(tick, 4000);
}
