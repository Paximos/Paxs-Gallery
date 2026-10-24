// Shared motion helpers: the DESIGN.md curves as functions, the reduced-motion flag, and smooth scrolling.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

// A cubic-bezier as a function of time, for places that take an easing function (Lenis).
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const x = (t: number) => ((ax * t + bx) * t + cx) * t;
  const y = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (p: number) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let t = p;
    for (let i = 0; i < 8; i++) {
      const err = x(t) - p;
      const d = dx(t);
      if (Math.abs(err) < 1e-5 || Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    return y(Math.min(1, Math.max(0, t)));
  };
}

// The same curves as the CSS tokens in global.css, as functions GSAP and Lenis take directly.
export const easeOut = bezier(0.23, 1, 0.32, 1);
export const easeInOut = bezier(0.77, 0, 0.175, 1);
export const easeDrawer = bezier(0.32, 0.72, 0, 1);
// The same curves as strings, for the Web Animations API.
export const EASE = {
  out: 'cubic-bezier(0.23, 1, 0.32, 1)',
  inOut: 'cubic-bezier(0.77, 0, 0.175, 1)',
  drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
};

declare global {
  interface Window { __paxLenis?: Lenis | null }
}

/** Smooth scrolling on desktop pointers only; off on touch and under reduced motion. One instance per page. */
export function getLenis(): Lenis | null {
  if (window.__paxLenis !== undefined) return window.__paxLenis;
  window.__paxLenis = null;
  if (reduced() || !finePointer()) return null;
  window.__paxLenis = new Lenis({
    lerp: 0.1,
    autoRaf: true,
    anchors: { duration: 0.8, easing: easeInOut, offset: -16 },
  });
  return window.__paxLenis;
}
