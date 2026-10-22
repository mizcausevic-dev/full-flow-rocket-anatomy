/**
 * Raptor-inspired full-flow schematic.
 *
 * Routing choice, stated on screen: pumped methane cools the chamber and the
 * upper bell, then enters the fuel-rich preburner. That series jacket is a
 * teaching arrangement, not a measured manifold map.
 *
 * Each propellant side has one shaft. The pumps are not coaxial.
 * No pressure, speed, angle, or mixture-ratio number lives in this file.
 */

export type Pt = { x: number; y: number };

export const CX = 800;
export const LEFT = 370;
export const RIGHT = 1230;

export const Y = {
  inlet: 150,
  pump: 450,
  pre: 910,
  turb: 1190,
  inj: 1490,
  chTop: 1560,
  chBot: 1920,
  throat: 2040,
  jacketEnd: 2240,
  exit: 2540,
} as const;

export const PUMP_R = 90;
export const CH_INNER = 128;
export const THROAT_R = 54;
export const EXIT_R = 300;

export const OR_PRE = { x: 610, y: Y.pre, w: 220, h: 132 };
export const FR_PRE = { x: 990, y: Y.pre, w: 220, h: 132 };
export const OX_TURB = { x: LEFT, y: Y.turb, w: 176, h: 124 };
export const FU_TURB = { x: RIGHT, y: Y.turb, w: 176, h: 124 };

export const DOWNCOMER_X = 1460;
export const RETURN_X = 1360;

const JACKET = 48;
const BARE = 16;

export function smoother(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** Inner gas boundary. Throat is the minimum. The bell is a schematic, not a Rao contour. */
export function innerRadius(y: number): number {
  if (y <= Y.chBot) return CH_INNER;
  if (y <= Y.throat) {
    const t = (y - Y.chBot) / (Y.throat - Y.chBot);
    return CH_INNER + (THROAT_R - CH_INNER) * smoother(t);
  }
  const t = Math.min(1, Math.max(0, (y - Y.throat) / (Y.exit - Y.throat)));
  const s = 1 - (1 - t) ** 2.35;
  return THROAT_R + (EXIT_R - THROAT_R) * s;
}

/** Metal outside the gas boundary. Jacket thickness steps down after the upper bell. */
export function shellExtra(y: number): number {
  if (y <= Y.jacketEnd) return JACKET;
  if (y >= Y.jacketEnd + 56) return BARE;
  const t = (y - Y.jacketEnd) / 56;
  return JACKET + (BARE - JACKET) * smoother(t);
}

export function outerRadius(y: number): number {
  return innerRadius(y) + shellExtra(y);
}

export function quad(p0: Pt, c: Pt, p1: Pt, n = 28): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i += 1) {
    const t = i / n;
    const u = 1 - t;
    pts.push({
      x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
      y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
    });
  }
  return pts;
}

export type Paths = {
  loxInlet: Pt[];
  fuelInlet: Pt[];
  oxFeed: Pt[];
  oxTap: Pt[];
  fuelTap: Pt[];
  downcomer: Pt[];
  jacketReturn: Pt[];
  jacketUpRight: Pt[];
  jacketUpLeft: Pt[];
  orToTurbine: Pt[];
  frToTurbine: Pt[];
  oxExhaust: Pt[];
  fuelExhaust: Pt[];
};

export function buildPaths(): Paths {
  const aftWall = CX + outerRadius(Y.jacketEnd) - 6;
  const fwdWall = CX + outerRadius(Y.chTop) - 6;
  const leftJacket = (y: number) => CX - innerRadius(y) - shellExtra(y) * 0.55;
  const rightJacket = (y: number) => CX + innerRadius(y) + shellExtra(y) * 0.55;

  const jacketUpRight: Pt[] = [];
  const jacketUpLeft: Pt[] = [];
  for (let y = Y.jacketEnd; y >= Y.chTop; y -= 14) {
    jacketUpRight.push({ x: rightJacket(y), y });
    jacketUpLeft.push({ x: leftJacket(y), y });
  }

  return {
    loxInlet: [
      { x: LEFT, y: 72 },
      { x: LEFT, y: Y.pump - PUMP_R + 8 },
    ],
    fuelInlet: [
      { x: RIGHT, y: 72 },
      { x: RIGHT, y: Y.pump - PUMP_R + 8 },
    ],
    oxFeed: [
      { x: LEFT + 62, y: Y.pump + 24 },
      { x: OR_PRE.x, y: Y.pump + 24 },
      { x: OR_PRE.x, y: OR_PRE.y - OR_PRE.h / 2 },
    ],
    oxTap: [
      { x: OR_PRE.x, y: Y.pre - 86 },
      { x: FR_PRE.x - FR_PRE.w / 2, y: Y.pre - 86 },
      { x: FR_PRE.x - FR_PRE.w / 2, y: FR_PRE.y - 8 },
    ],
    fuelTap: [
      { x: RETURN_X, y: Y.pre - 132 },
      { x: OR_PRE.x + 70, y: Y.pre - 132 },
      { x: OR_PRE.x + 70, y: OR_PRE.y - OR_PRE.h / 2 },
    ],
    downcomer: [
      { x: RIGHT + PUMP_R - 8, y: Y.pump + 8 },
      { x: DOWNCOMER_X, y: Y.pump + 8 },
      { x: DOWNCOMER_X, y: Y.jacketEnd },
      { x: aftWall, y: Y.jacketEnd },
    ],
    jacketReturn: [
      { x: fwdWall, y: Y.chTop + 8 },
      { x: RETURN_X, y: Y.chTop + 8 },
      { x: RETURN_X, y: FR_PRE.y },
      { x: FR_PRE.x + FR_PRE.w / 2, y: FR_PRE.y },
    ],
    jacketUpRight,
    jacketUpLeft,
    orToTurbine: [
      { x: OR_PRE.x - 36, y: OR_PRE.y + OR_PRE.h / 2 },
      { x: LEFT + OX_TURB.w / 2 - 8, y: Y.turb - 10 },
    ],
    frToTurbine: [
      { x: FR_PRE.x + 36, y: FR_PRE.y + FR_PRE.h / 2 },
      { x: RIGHT - FU_TURB.w / 2 + 8, y: Y.turb - 10 },
    ],
    oxExhaust: quad(
      { x: LEFT, y: Y.turb + OX_TURB.h / 2 },
      { x: LEFT - 10, y: 1360 },
      { x: CX - 78, y: Y.inj },
    ),
    fuelExhaust: quad(
      { x: RIGHT, y: Y.turb + FU_TURB.h / 2 },
      { x: RIGHT + 10, y: 1360 },
      { x: CX + 78, y: Y.inj },
    ),
  };
}

export function polyLength(pts: Pt[]): number {
  let length = 0;
  for (let i = 1; i < pts.length; i += 1) {
    length += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return length;
}

export function pointAlong(pts: Pt[], distance: number): Pt & { ang: number } {
  let remaining = distance;
  for (let i = 1; i < pts.length; i += 1) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (seg < 1e-6) continue;
    if (remaining <= seg) {
      const t = remaining / seg;
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        ang: Math.atan2(b.y - a.y, b.x - a.x),
      };
    }
    remaining -= seg;
  }
  const a = pts[pts.length - 2];
  const b = pts[pts.length - 1];
  return { x: b.x, y: b.y, ang: Math.atan2(b.y - a.y, b.x - a.x) };
}
