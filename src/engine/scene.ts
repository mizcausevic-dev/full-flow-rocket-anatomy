export type Pt = { x: number; y: number };

export const CHAMBER_TOP = 740;
export const BARREL_END = 900;
export const THROAT_Y = 1000;
export const EXIT_Y = 1280;
export const BARREL_R = 86;
export const THROAT_R = 30;
export const EXIT_R = 178;
export const WALL = 28;

/** Teaching contour. Not a flight nozzle and not a Rao design. */
export function innerHalf(y: number): number {
  if (y <= BARREL_END) return BARREL_R;
  if (y <= THROAT_Y) {
    const t = (y - BARREL_END) / (THROAT_Y - BARREL_END);
    const s = t * t * (3 - 2 * t);
    return BARREL_R + (THROAT_R - BARREL_R) * s;
  }
  const t = Math.min(1, Math.max(0, (y - THROAT_Y) / (EXIT_Y - THROAT_Y)));
  const s = 1 - Math.pow(1 - t, 1.55);
  return THROAT_R + (EXIT_R - THROAT_R) * s;
}

export function outerHalf(y: number): number {
  return innerHalf(y) + WALL;
}

export const fuelPump = { x: -300, y: 248, r: 64 };
export const oxPump = { x: 318, y: 236, r: 78 };
export const fuelTurb = { x: -300, y: 508, r: 50 };
export const oxTurb = { x: 318, y: 516, r: 56 };

export const fuelPB = { x: -590, y: 468, w: 210, h: 76 };
export const oxPB = { x: 390, y: 476, w: 210, h: 80 };

export const LINES: Record<string, Pt[]> = {
  ch4Inlet: [
    { x: -860, y: 220 },
    { x: fuelPump.x - fuelPump.r, y: 220 },
  ],
  o2Inlet: [
    { x: 900, y: 206 },
    { x: oxPump.x + oxPump.r, y: 206 },
  ],
  ch4Downcomer: [
    { x: fuelPump.x - fuelPump.r, y: 312 },
    { x: -690, y: 312 },
    { x: -690, y: 1236 },
    { x: -outerHalf(EXIT_Y) - 8, y: 1236 },
  ],
  ch4Return: [
    { x: -outerHalf(820), y: 820 },
    { x: -445, y: 820 },
    { x: -445, y: fuelPB.y + fuelPB.h },
  ],
  o2Main: [
    { x: oxPump.x + oxPump.r, y: 292 },
    { x: 680, y: 292 },
    { x: 680, y: 530 },
    { x: oxPB.x + oxPB.w, y: 530 },
  ],
  smallO2: [
    { x: oxPump.x, y: oxPump.y - oxPump.r },
    { x: oxPump.x, y: 96 },
    { x: -760, y: 96 },
    { x: -760, y: 506 },
    { x: -730, y: 506 },
    { x: -690, y: 478 },
    { x: -650, y: 506 },
    { x: fuelPB.x, y: 506 },
  ],
  smallCH4: [
    { x: fuelPump.x, y: fuelPump.y - fuelPump.r },
    { x: fuelPump.x, y: 140 },
    { x: 760, y: 140 },
    { x: 760, y: 548 },
    { x: oxPB.x + oxPB.w, y: 548 },
  ],
  fuelGas: [
    { x: fuelPB.x + fuelPB.w, y: 506 },
    { x: fuelTurb.x - fuelTurb.r, y: 506 },
  ],
  oxGas: [
    { x: oxPB.x, y: 516 },
    { x: oxTurb.x + oxTurb.r, y: 516 },
  ],
  fuelDischarge: [
    { x: fuelTurb.x, y: fuelTurb.y + fuelTurb.r },
    { x: fuelTurb.x, y: 610 },
    { x: -150, y: 690 },
    { x: -48, y: 728 },
  ],
  oxDischarge: [
    { x: oxTurb.x, y: oxTurb.y + oxTurb.r },
    { x: oxTurb.x, y: 630 },
    { x: 160, y: 700 },
    { x: 48, y: 728 },
  ],
};
