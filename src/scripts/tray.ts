// The developing tray (DESIGN.md, Motion; overdrive): on the first visit of a session, the three prints in
// the hero deck start as blank bone paper and come up in the developer, shadows first and highlights last,
// with a faint shimmer as if the tray were being rocked. Each card gets its own small WebGL canvas, drawn
// only for the 1.3s of the develop and then released. The develop curve is the lightbox darkroom's.
// No WebGL, a failed image or a slow decode: the photo is simply shown.

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D u_img;
uniform float u_t;      // 0 to 1 through the develop
uniform vec4 u_crop;    // object-fit: cover, as offset.xy and scale.zw of the image's uv
uniform vec2 u_res;
uniform float u_seed;
uniform float u_bright; // the card's black-and-white print: the same grayscale, contrast and brightness as its CSS filter
varying vec2 v_uv;

const vec3 PAPER = vec3(0.890, 0.886, 0.855); // bone, --paper

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + u_seed) * 43758.5453); }

void main() {
  // The tray is rocked: a slow liquid wobble over the print, calming to nothing as it finishes.
  float calm = pow(1.0 - u_t, 1.6);
  vec2 wob = vec2(sin(v_uv.y * 23.0 + u_t * 11.0 + u_seed), sin(v_uv.x * 17.0 - u_t * 8.0 + u_seed * 0.7)) * 0.0045 * calm;
  vec3 c = texture2D(u_img, u_crop.xy + clamp(v_uv + wob, 0.0, 1.0) * u_crop.zw).rgb;
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  // A black-and-white print, so the canvas hands over to the filtered photo without a change
  c = vec3(clamp((dot(c, vec3(0.2126, 0.7152, 0.0722)) - 0.5) * 1.28 + 0.5, 0.0, 1.0) * u_bright);
  // Paper holds for a beat, then the print develops out of it, shadows first, highlights last.
  float dev = smoothstep(0.08, 1.0, u_t);
  float local = clamp(dev * 1.7 - lum * 0.7, 0.0, 1.0);
  vec3 col = mix(PAPER, c, local);
  // A faint wet sheen travels with the wobble while the developer is moving.
  col += (sin((v_uv.x + v_uv.y) * 9.0 - u_t * 14.0) * 0.5 + 0.5) * 0.05 * calm;
  // Grain, strongest mid-develop, settling as the print finishes.
  float g = hash(floor(v_uv * u_res / 1.5) + floor(u_t * 24.0));
  col += (g - 0.5) * 0.09 * calm;
  gl_FragColor = vec4(col, 1.0);
}`;

const MS = 1300;

// Sets up one card's canvas (compile, upload, first draw) and returns the function that runs its develop.
function develop(img: HTMLImageElement, bitmap: ImageBitmap): (start: number) => Promise<void> {
  const link = img.parentElement!;
  const canvas = document.createElement('canvas');
  canvas.className = 'deck-tray';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, premultipliedAlpha: false });
  if (!gl) throw new Error('no webgl');
  const shader = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('shader');
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, bitmap);
  bitmap.close();

  // Laid-out size (the card's 3D transform is ignored), capped at 1.5x: three canvases on a phone stay small.
  const dpr = Math.min(1.5, devicePixelRatio || 1);
  const cw = link.offsetWidth, ch = link.offsetHeight;
  canvas.width = Math.max(1, Math.round(cw * dpr));
  canvas.height = Math.max(1, Math.round(ch * dpr));
  gl.viewport(0, 0, canvas.width, canvas.height);

  // object-fit: cover with the card's object-position, as a window onto the image's uv
  const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5));
  const ai = img.naturalWidth / img.naturalHeight, ac = cw / ch;
  const sx = ai > ac ? ac / ai : 1, sy = ai > ac ? 1 : ai / ac;
  const u = (n: string) => gl.getUniformLocation(prog, n);
  gl.uniform4f(u('u_crop'), px * (1 - sx), py * (1 - sy), sx, sy);
  gl.uniform2f(u('u_res'), canvas.width, canvas.height);
  gl.uniform1f(u('u_seed'), Math.random() * 10);
  gl.uniform1f(u('u_bright'), link.closest('.deck-pax') ? 0.6 : 0.9);
  gl.uniform1i(u('u_img'), 0);
  const uT = u('u_t');
  const draw = (t: number) => { gl.uniform1f(uT, t); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  draw(0);
  link.insertBefore(canvas, img.nextSibling);

  return (start) => new Promise((resolve) => {
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / MS));
      draw(t);
      if (t < 1) { requestAnimationFrame(tick); return; }
      // The last frame is the photo itself: show the real image under it and let the canvas go.
      img.style.opacity = '1';
      canvas.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease' }).finished.then(() => {
        canvas.remove();
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        resolve();
      });
    };
    requestAnimationFrame(tick);
  });
}

/** Runs the develop on every card photo; the photos stay hidden (html.tray) until it ends or fails. */
export async function runTray(deck: HTMLElement) {
  const root = document.documentElement;
  const reveal = () => { root.classList.remove('tray'); deck.querySelectorAll<HTMLElement>('.deck-photo').forEach((i) => { i.style.opacity = ''; }); };
  if (!root.classList.contains('tray')) return;
  try {
    const imgs = [...deck.querySelectorAll<HTMLImageElement>('.deck-card .deck-photo')];
    // Every photo must be decoded first; a slow one shows the photos as they are instead of waiting.
    const ready = Promise.all(imgs.map((i) => { i.loading = 'eager'; return i.decode(); }));
    await Promise.race([ready, new Promise((_, no) => setTimeout(() => no(new Error('slow')), 1500))]);
    // Side prints first, the centred one a beat later, so the eye lands on it as it comes up.
    const order = (i: HTMLImageElement) => (i.closest<HTMLElement>('.deck-card')?.dataset.pos === '0' ? 220 : 0);
    // Each photo is decoded and scaled down to its canvas off the main thread first, so the upload is
    // small: uploading the full AVIF made the main thread decode it again (a long frame per card).
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    const bitmaps = await Promise.all(imgs.map((i) => {
      const w = Math.min(i.naturalWidth, Math.round(i.parentElement!.offsetWidth * dpr * 1.6));
      return createImageBitmap(i, { resizeWidth: w, resizeHeight: Math.round((w * i.naturalHeight) / i.naturalWidth), resizeQuality: 'medium' });
    }));
    // All three canvases are set up first, one per frame, while the paper is still: nothing on screen moves
    // on the main thread then (the deck's arrival runs on the compositor). Only then does the clock start,
    // so the develop itself is just three small draws a frame.
    const starts: ((start: number) => Promise<void>)[] = [];
    for (const [k, i] of imgs.entries()) {
      starts.push(develop(i, bitmaps[k]));
      await new Promise(requestAnimationFrame);
    }
    const t0 = performance.now() + 60;
    await Promise.all(starts.map((run, k) => run(t0 + order(imgs[k]))));
    sessionStorage.setItem('pax-tray', '1');
  } catch {
    deck.querySelectorAll('.deck-tray').forEach((c) => c.remove());
  }
  reveal();
}
