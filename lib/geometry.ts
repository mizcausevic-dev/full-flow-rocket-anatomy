import type { Pt } from "./path";

/** Diagram units. Not millimeters, and not a measured engine.
 * Camera anchors in lib/timeline.ts use these coordinates. Update both together. */
export const CL = 440;

export const ox = {
  y: 226,
  pumpX: 268,
  pumpR: 52,
  turbX: 456,
  turbR: 36,
  pbX: 456,
  pbY: 108,
  pbW: 132,
  pbH: 74,
} as const;

export const fu = {
  y: 656,
  pumpX: 268,
  pumpR: 42,
  turbX: 456,
  turbR: 30,
  pbX: 456,
  pbY: 754,
  pbW: 132,
  pbH: 74,
} as const;

export const nozzle = {
  chamberX0: 830,
  chamberX1: 1060,
  throatX: 1148,
  exitX: 1488,
  chamberR: 70,
  throatR: 24,
  exitR: 112,
  wall: 20,
} as const;

export const manifoldX = 1388;

export function innerRadius(x: number): number {
  const n = nozzle;
  if (x <= n.chamberX1) return n.chamberR;
  if (x <= n.throatX) {
    const t = (x - n.chamberX1) / (n.throatX - n.chamberX1);
    const s = t * t * (3 - 2 * t);
    return n.chamberR + (n.throatR - n.chamberR) * s;
  }
  const t = Math.min(1, (x - n.throatX) / (n.exitX - n.throatX));
  const s = Math.sin((t * Math.PI) / 2);
  return n.throatR + (n.exitR - n.throatR) * s;
}

export function outerRadius(x: number): number {
  return innerRadius(x) + nozzle.wall;
}

export function contour(
  side: 1 | -1,
  from: number,
  to: number,
  steps: number,
  radius: (x: number) => number,
): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const x = from + ((to - from) * i) / steps;
    pts.push({ x, y: CL + side * radius(x) });
  }
  return pts;
}
