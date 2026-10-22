export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Symmetric ease. Derivative peaks at the midpoint, so a camera truck does not start or stop with a jerk. */
export function easeInOut(t: number): number {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 2 * x * x : 1 - ((-2 * x + 2) ** 2) / 2;
}

export function ramp(frame: number, start: number, end: number): number {
  if (end === start) return frame >= end ? 1 : 0;
  return easeInOut((frame - start) / (end - start));
}
