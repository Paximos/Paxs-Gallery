// The darkroom moment (DESIGN.md, Motion): when a photo opens full screen, a film frame appears as its
// orange-masked negative, clears to blank paper and develops into the print, darks first, the way a print
// comes up in the tray; a mirrorless frame is read off the sensor by a scanline sweeping down.
// One small WebGL canvas, created on first use and reused; nothing runs while it is idle.

type Medium = 'film' | 'digital';

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
uniform float u_t;       // 0 to 1 through the effect
uniform float u_mode;    // 0 film, 1 digital
uniform float u_seed;
uniform vec2 u_res;      // canvas size in pixels, for grain and the scanline width
varying vec2 v_uv;

const vec3 PAPER = vec3(0.890, 0.886, 0.855);  // bone, --paper
const vec3 GROUND = vec3(0.086, 0.110, 0.102); // green-black, --bg

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + u_seed) * 43758.5453); }

void main() {
  vec3 c = texture2D(u_img, v_uv).rgb;
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  vec3 col;

  if (u_mode < 0.5) {
    // Film. Until 0.38 the negative holds, inverted under the orange mask, while the photo grows to size;
    // by 0.48 it has cleared to blank paper.
    vec3 neg = (1.0 - c) * vec3(1.0, 0.66, 0.42) + vec3(0.10, 0.04, 0.0);
    col = mix(neg, PAPER, smoothstep(0.38, 0.48, u_t));
    // 0.48 to 1: the print develops out of the paper, shadows first, highlights last.
    float dev = clamp((u_t - 0.48) / 0.52, 0.0, 1.0);
    float local = clamp(dev * 1.7 - lum * 0.7, 0.0, 1.0);
    col = mix(col, c, local * step(0.48, u_t));
    // Grain, strongest mid-develop, settling as the print finishes.
    float g = hash(floor(v_uv * u_res / 1.5) + floor(u_t * 24.0));
    col += (g - 0.5) * (0.10 - 0.06 * dev);
  } else {
    // Digital. A readout line sweeps down: read pixels above it, dark sensor below.
    float y = v_uv.y;
    float edge = u_t * 1.04;
    float band = 3.0 / u_res.y;
    if (y < edge - band) {
      col = c;
    } else if (y < edge) {
      // The line itself: a thin bright band with a slight colour split as it reads.
      vec3 r = vec3(texture2D(u_img, v_uv + vec2(0.003, 0.0)).r, c.g, texture2D(u_img, v_uv - vec2(0.003, 0.0)).b);
      col = mix(r, PAPER, 0.55);
    } else {
      col = GROUND;
    }
  }
  gl_FragColor = vec4(col, 1.0);
}`;

export interface Developer {
  canvas: HTMLCanvasElement;
  /** Plays the effect from `source` (an already-decoded image) at the canvas's laid-out size. */
  play(source: HTMLImageElement, medium: Medium, ms: number): Promise<boolean>;
  cancel(): void;
}

let instance: Developer | null | undefined;

export function getDeveloper(): Developer | null {
  if (instance !== undefined) return instance;
  instance = null;
  const canvas = document.createElement('canvas');
  canvas.className = 'lb-dev';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = (canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false }) ??
    canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
  if (!gl) return null;

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = shader(gl.VERTEX_SHADER, VERT);
  const fs = shader(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uT = u('u_t'), uMode = u('u_mode'), uSeed = u('u_seed'), uRes = u('u_res');
  gl.uniform1i(u('u_img'), 0);
  // One throwaway draw so the driver finishes compiling now, not on the first tap.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0]));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  let frame = 0;
  let settle: ((done: boolean) => void) | null = null;

  const draw = (t: number) => { gl.uniform1f(uT, t); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  // Stops a run in progress (it resolves as not finished) but leaves the canvas where it is.
  const halt = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    settle?.(false);
    settle = null;
  };

  instance = {
    canvas,
    play(source, medium, ms) {
      halt();
      // Draw at the laid-out size (transforms ignored), capped at 2x so a phone never pays for a 3x buffer.
      const dpr = Math.min(2, devicePixelRatio || 1);
      const w = Math.max(1, Math.round(canvas.offsetWidth * dpr));
      const h = Math.max(1, Math.round(canvas.offsetHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
      } catch {
        return Promise.resolve(false);
      }
      gl.uniform1f(uMode, medium === 'film' ? 0 : 1);
      gl.uniform1f(uSeed, Math.random() * 100);
      gl.uniform2f(uRes, w, h);
      draw(0);
      return new Promise<boolean>((resolve) => {
        settle = resolve;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / ms);
          draw(t);
          if (t < 1) frame = requestAnimationFrame(tick);
          else { frame = 0; settle = null; resolve(true); }
        };
        frame = requestAnimationFrame(tick);
      });
    },
    cancel() {
      halt();
      canvas.remove();
    },
  };
  return instance;
}
