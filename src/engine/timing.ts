export const FRAME_MIN = 0;
export const FRAME_MAX = 1019;
export const FPS = 30;
export const VIEW_H = 900;

export type Camera = { cx: number; cy: number; zoom: number };

export type Chapter = {
  id: number;
  f0: number;
  f1: number;
  clock: string;
  title: string;
  body: string;
  badges: string[];
};

/**
 * One ease-in-out move per chapter, then a held wide view.
 * Identical keys at 980 and 1019 keep the last stretch still.
 */
export const CAMERA_KEYS: Array<{ f: number } & Camera> = [
  { f: 0, cx: 0, cy: 480, zoom: 0.7 },
  { f: 149, cx: -10, cy: 320, zoom: 1.02 },
  { f: 299, cx: 0, cy: 430, zoom: 0.8 },
  { f: 509, cx: 0, cy: 690, zoom: 0.96 },
  { f: 749, cx: 20, cy: 930, zoom: 1.04 },
  { f: 900, cx: 0, cy: 1140, zoom: 0.98 },
  { f: 980, cx: 0, cy: 700, zoom: 0.56 },
  { f: 1019, cx: 0, cy: 700, zoom: 0.56 },
];

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    f0: 0,
    f1: 149,
    clock: "0:00-0:05",
    title: "Feed lines and two turbopumps",
    body: "Liquid methane and liquid oxygen arrive on separate lines and enter separate turbopumps. Each spool is its own shaft. The preburners stay in frame below the pumps, which is why the pumps exist: the chamber sits at a pressure the tanks are not asked to supply. No rotational speed is shown.",
    badges: ["Section view", "Steady run, startup not modeled", "Separate shafts"],
  },
  {
    id: 2,
    f0: 150,
    f1: 299,
    clock: "0:05-0:10",
    title: "Two preburners, opposite ratios",
    body: "Both propellants enter each preburner. The fuel-rich preburner takes most of the methane and a little oxygen. The oxidizer-rich preburner takes most of the oxygen and a little methane. Bar width means most or a little. It is not a mixture ratio. Pumped methane is drawn through the wall jacket before the fuel-rich preburner. That order is the teaching route, not a claim about one Raptor serial number.",
    badges: ["Schematic ratios", "Pumps still in frame", "Jacket before the fuel-rich preburner"],
  },
  {
    id: 3,
    f0: 300,
    f1: 509,
    clock: "0:10-0:17",
    title: "Turbine gas, then the chamber",
    body: "Gas from each preburner drives its own turbine. Gold is shaft work up to that propellant's pump, not a measured torque and not a speed. The gas is not dumped overboard. Both discharge ducts turn inward to the injector. Violet marks a place a pressure or temperature tap would live. No value is shown.",
    badges: ["Exhaust is injected", "Two shafts, two gases", "State, not a reading"],
  },
  {
    id: 4,
    f0: 510,
    f1: 749,
    clock: "0:17-0:25",
    title: "Steady burn and a cooled wall",
    body: "The two gases meet and burn in the chamber. That is continuous combustion, deflagration, not detonation. Cold methane in the wall channels takes heat from the gas. Channel height is exaggerated, the inset is enlarged relative to the engine, and the heat arrows are a steady path rather than a startup transient. Chamber residence is milliseconds, so this shot is slow motion.",
    badges: ["Slow motion", "Scale change", "Time compression", "Not detonation"],
  },
  {
    id: 5,
    f0: 750,
    f1: 1019,
    clock: "0:25-0:34",
    title: "Nozzle expansion",
    body: "The contour converges to a throat, then opens into a bell. For a choked de Laval nozzle the regimes are subsonic in the chamber, sonic at the throat, and supersonic in the bell. The inset names those regimes and does not state a Mach number. The contour is a teaching shape, not a flight nozzle. The camera then pulls back and holds the whole engine still.",
    badges: ["Teaching contour", "Regimes, not a Mach number", "Held full-system view"],
  },
];

export function clampFrame(frame: number): number {
  if (!Number.isFinite(frame)) return 0;
  return Math.min(FRAME_MAX, Math.max(FRAME_MIN, Math.round(frame)));
}

export function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function cameraAt(frame: number): Camera {
  const f = clampFrame(frame);
  const keys = CAMERA_KEYS;
  if (f <= keys[0].f) return { cx: keys[0].cx, cy: keys[0].cy, zoom: keys[0].zoom };
  const last = keys[keys.length - 1];
  if (f >= last.f) return { cx: last.cx, cy: last.cy, zoom: last.zoom };
  let i = 0;
  while (i < keys.length - 2 && f > keys[i + 1].f) i += 1;
  const a = keys[i];
  const b = keys[i + 1];
  const span = b.f - a.f;
  const t = span === 0 ? 1 : smoothstep((f - a.f) / span);
  return {
    cx: a.cx + (b.cx - a.cx) * t,
    cy: a.cy + (b.cy - a.cy) * t,
    zoom: a.zoom + (b.zoom - a.zoom) * t,
  };
}

export function chapterAt(frame: number): Chapter {
  const f = clampFrame(frame);
  return CHAPTERS.find((c) => f >= c.f0 && f <= c.f1) ?? CHAPTERS[0];
}

export function windowFade(frame: number, start: number, end: number, edge = 14): number {
  const f = clampFrame(frame);
  if (f < start || f > end) return 0;
  const inn = Math.min(1, (f - start) / edge);
  const out = end >= FRAME_MAX ? 1 : Math.min(1, (end - f) / edge);
  return Math.max(0, Math.min(1, inn, out));
}

export function formatClock(frame: number): string {
  const f = clampFrame(frame);
  const sec = f / FPS;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const cs = Math.floor((sec - Math.floor(sec)) * 100);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}
