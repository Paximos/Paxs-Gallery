// Pax's — interactions. Everything works without this file: frames link to full images, the coupon is a mailto form.
(() => {
  const EMAIL = 'pax@example.com';

  // Drag the film strip sideways with a mouse (touch already scrolls natively).
  document.querySelectorAll('[data-drag] .strip-row').forEach((row) => {
    let startX = 0, startScroll = 0, moved = false, down = false;
    row.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startScroll = row.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) { moved = true; row.classList.add('is-dragging'); }
      if (moved) row.scrollLeft = startScroll - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      row.classList.remove('is-dragging');
    });
    // A drag must not also open the frame under the pointer.
    row.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    row.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // Full-screen viewer.
  const viewer = document.querySelector('.viewer');
  const links = [...document.querySelectorAll('[data-photo]')];
  if (viewer && typeof viewer.showModal === 'function' && links.length) {
    const img = viewer.querySelector('.viewer-img');
    const title = viewer.querySelector('.viewer-title');
    const meta = viewer.querySelector('.viewer-meta');
    let index = 0;

    const show = (i) => {
      index = (i + links.length) % links.length;
      const a = links[index];
      const thumb = a.querySelector('img');
      img.src = a.href;
      img.width = Number(a.dataset.w); img.height = Number(a.dataset.h);
      img.alt = thumb.alt;
      title.textContent = a.dataset.title;
      meta.textContent = a.dataset.meta;
    };

    links.forEach((a, i) => a.addEventListener('click', (e) => {
      e.preventDefault();
      show(i);
      viewer.showModal();
    }));

    viewer.querySelector('[data-prev]').addEventListener('click', () => show(index - 1));
    viewer.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
    viewer.querySelector('[data-close]').addEventListener('click', () => viewer.close());
    viewer.querySelector('[data-order]').addEventListener('click', () => {
      const select = document.querySelector('#c-frame');
      const wanted = links[index].dataset.frame;
      const option = [...select.options].find((o) => o.textContent === wanted);
      if (option) select.value = option.value || option.textContent;
      viewer.close();
      document.querySelector('#prints').scrollIntoView();
      document.querySelector('#c-name').focus({ preventScroll: true });
    });

    viewer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });

    let touchX = null;
    viewer.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    viewer.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  // The coupon opens a written email with the visitor's choices filled in.
  const coupon = document.querySelector('[data-coupon]');
  if (coupon) {
    coupon.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!coupon.reportValidity()) return;
      const f = new FormData(coupon);
      const frame = f.get('frame') || 'not chosen yet';
      const subject = `Print request: ${frame}`;
      const body = `Hi Pax,\n\nI'd like a print of: ${frame}\nSize and notes: ${f.get('note') || '-'}\n\n${f.get('name')}\n${f.get('email')}`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
})();
