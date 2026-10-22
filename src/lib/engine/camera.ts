import { LAST_FRAME } from "./timeline";

export type Camera = {
  x: number;
  y: number;
  w: number;
};

type CameraKey = Camera & { f: number };

/**
 * Authored for a 16:9 frame. `w` is the visible world width.
 * Each span eases to a stop so the cut feels deliberate.
 * Frames 960-1019 are identical: the required steady ending.
 */
const KEYS: CameraKey[] = [
  { f: 0, x: 800, y: 520, w: 1560 },
  { f: 88, x: 800, y: 620, w: 1180 },
  { f: 149, x: 800, y: 760, w: 1400 },
  { f: 210, x: 640, y: 930, w: 1020 },
  { f: 270, x: 1080, y: 940, w: 1080 },
  { f: 299, x: 800, y: 1080, w: 1360 },
  { f: 410, x: 800, y: 1340, w: 1160 },
  { f: 509, x: 800, y: 1580, w: 980 },
  { f: 640, x: 900, y: 1780, w: 680 },
  { f: 710, x: 1040, y: 1820, w: 420 },
  { f: 749, x: 860, y: 1980, w: 700 },
  { f: 840, x: 800, y: 2300, w: 1120 },
  { f: 910, x: 800, y: 1620, w: 2700 },
  { f: 960, x: 800, y: 1340, w: 4800 },
  { f: 1019, x: 800, y: 1340, w: 4800 },
];

export function smootherstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export function cameraAt(frame: number): Camera {
  const f = Math.min(LAST_FRAME, Math.max(0, frame));
  const first = KEYS[0];
  if (f <= first.f) return { x: first.x, y: first.y, w: first.w };

  for (let i = 0; i < KEYS.length - 1; i += 1) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (f < a.f || f > b.f) continue;
    const span = b.f - a.f;
    const t = span === 0 ? 1 : smootherstep((f - a.f) / span);
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      w: a.w + (b.w - a.w) * t,
    };
  }

  const last = KEYS[KEYS.length - 1];
  return { x: last.x, y: last.y, w: last.w };
}

export function project(
  cam: Camera,
  cssW: number,
  cssH: number,
  x: number,
  y: number,
): { sx: number; sy: number; scale: number } {
  const scale = cssW / cam.w;
  const viewH = cssH / scale;
  const left = cam.x - cam.w / 2;
  const top = cam.y - viewH / 2;
  return {
    sx: (x - left) * scale,
    sy: (y - top) * scale,
    scale,
  };
}
