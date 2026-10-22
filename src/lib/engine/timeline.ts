export const FPS = 30;
export const FRAME_COUNT = 1020;
export const LAST_FRAME = 1019;
/** Animation phase freezes here so the ending can be read. */
export const HOLD_FRAME = 960;

export type Segment = {
  id: string;
  from: number;
  to: number;
  title: string;
  clock: string;
  caption: string;
};

export const SEGMENTS: Segment[] = [
  {
    id: "feeds",
    from: 0,
    to: 149,
    title: "Feed lines and pumps",
    clock: "0:00-0:05",
    caption:
      "Liquid oxygen and liquid methane enter separate turbopumps. Each pump has its own shaft. A coaxial arrangement is not shown.",
  },
  {
    id: "preburners",
    from: 150,
    to: 299,
    title: "Preburners, two ratios",
    clock: "0:05-0:10",
    caption:
      "Each preburner takes both propellants. One is oxidizer-rich. One is fuel-rich. Pipe weight is qualitative. No mixture ratio is stated.",
  },
  {
    id: "turbines",
    from: 300,
    to: 509,
    title: "Turbine gas to the chamber",
    clock: "0:10-0:17",
    caption:
      "Each turbine drives the pump on its own shaft. Gas leaving the turbine is still propellant and continues to the main injector.",
  },
  {
    id: "chamber",
    from: 510,
    to: 749,
    title: "Chamber burn and cooling",
    clock: "0:17-0:25",
    caption:
      "The two streams burn continuously in the chamber. Fuel in the wall jacket takes heat on its way to the fuel-rich preburner.",
  },
  {
    id: "nozzle",
    from: 750,
    to: 1019,
    title: "Nozzle expansion",
    clock: "0:25-0:34",
    caption:
      "The bell is a de Laval schematic. The inset curve is pedagogical. The last two seconds hold the whole engine still.",
  },
];

export type Callout = {
  from: number;
  to: number;
  kicker: string;
  text: string;
};

export const CALLOUTS: Callout[] = [
  {
    from: 0,
    to: 149,
    kicker: "Time compressed",
    text: "Impeller motion is a reading aid. No rotational speed is stated.",
  },
  {
    from: 150,
    to: 299,
    kicker: "Ratios unscaled",
    text: "The thicker inlet is the bulk propellant. The thin inlet is the tap. No mixture ratio is stated.",
  },
  {
    from: 300,
    to: 509,
    kicker: "Time compressed",
    text: "Transit along the ducts is shortened so the path from turbine to injector can be followed.",
  },
  {
    from: 510,
    to: 749,
    kicker: "Slowed",
    text: "Mixing in the chamber is drawn slower than engine time. This is continuous combustion, not a detonation.",
  },
  {
    from: 680,
    to: 749,
    kicker: "Scale changed",
    text: "The wall is enlarged. Channel count and channel size are illustrative, not a cooling design.",
  },
  {
    from: 750,
    to: 959,
    kicker: "Principle, not a prediction",
    text: "The diagram shows velocity rising and pressure falling through a de Laval nozzle. It is not computed from this contour.",
  },
  {
    from: 960,
    to: 1019,
    kicker: "Steady view",
    text: "The full system is held. Flow markers are frozen so this frame can be read.",
  },
];

export function segmentAt(frame: number): Segment {
  const f = clampFrame(frame);
  return SEGMENTS.find((segment) => f >= segment.from && f <= segment.to) ?? SEGMENTS[0];
}

export function calloutsAt(frame: number): Callout[] {
  const f = clampFrame(frame);
  return CALLOUTS.filter((callout) => f >= callout.from && f <= callout.to);
}

export function motionFrame(frame: number): number {
  const f = clampFrame(frame);
  return f >= HOLD_FRAME ? HOLD_FRAME : f;
}

export function clampFrame(frame: number): number {
  if (frame < 0) return 0;
  if (frame > LAST_FRAME) return LAST_FRAME;
  return frame;
}

export function formatTime(frame: number): string {
  return `${(clampFrame(frame) / FPS).toFixed(2)}s`;
}
