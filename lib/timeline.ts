import { easeInOut, lerp, ramp } from "./easing";

/** World points that must stay visible. Kept aligned with lib/geometry.ts. */
const causalAnchors: { from: number; to: number; x: number; y: number; name: string }[] = [
  { from: 0, to: 149, x: 48, y: 226, name: "oxidizer inlet" },
  { from: 0, to: 149, x: 48, y: 656, name: "fuel inlet" },
  { from: 150, to: 299, x: 268, y: 226, name: "oxidizer pump" },
  { from: 150, to: 299, x: 268, y: 656, name: "fuel pump" },
  { from: 300, to: 509, x: 456, y: 226, name: "oxidizer turbine" },
  { from: 300, to: 509, x: 456, y: 656, name: "fuel turbine" },
  { from: 510, to: 749, x: 830, y: 440, name: "injector face" },
  { from: 750, to: 900, x: 1060, y: 440, name: "chamber exit" },
];

export const FPS = 30;
export const FRAME_COUNT = 1020;
export const LAST_FRAME = 1019;
export const FILM_ASPECT = 16 / 9;

export type Camera = {
  cx: number;
  cy: number;
  viewW: number;
  viewH: number;
};

export type ChapterId = "feeds" | "preburners" | "turbines" | "chamber" | "nozzle";

export type Chapter = {
  id: ChapterId;
  index: string;
  title: string;
  start: number;
  end: number;
  caption: string;
};

export const CHAPTERS: readonly Chapter[] = [
  {
    id: "feeds",
    index: "01",
    title: "Feeds and pumps",
    start: 0,
    end: 149,
    caption:
      "Liquid oxygen and liquid methane arrive on separate lines, each to its own turbopump. The inlets stay in frame. Pump work starts from that upstream pressure.",
  },
  {
    id: "preburners",
    index: "02",
    title: "Preburner splits",
    start: 150,
    end: 299,
    caption:
      "Most of the oxidizer, with a little fuel, enters the oxidizer-rich preburner. Most of the fuel, with a little oxidizer, is headed for the fuel-rich preburner. Line weight is ordinal. No mixture ratio is stated.",
  },
  {
    id: "turbines",
    index: "03",
    title: "Turbine gas to the chamber",
    start: 300,
    end: 509,
    caption:
      "Each preburner drives only its own turbine. The exhaust is not dumped. Both streams turn inward and feed the main injector. That closed path is what full-flow means.",
  },
  {
    id: "chamber",
    index: "04",
    title: "Chamber and cooling",
    start: 510,
    end: 749,
    caption:
      "The two hot-gas streams meet and burn in steady deflagration. Methane in the wall channels carries heat out of the metal. Scale change. Slow motion is conceptual. This is not a detonation.",
  },
  {
    id: "nozzle",
    index: "05",
    title: "Nozzle expansion",
    start: 750,
    end: 1019,
    caption:
      "The contour converges, passes a sonic throat in the textbook choked-nozzle picture, then expands. Those regime labels are not a solved flowfield. The last second holds the whole engine.",
  },
] as const;

const END_CAPTION =
  "Complete system, held still. Aligned section of a methalox full-flow cycle. Steel is hardware. Cyan is the pathway. Gold is work or heat. Violet is state. No pressure, speed, or angle is stated.";

type Key = { f: number; cx: number; cy: number; viewW: number };

const KEYS: readonly Key[] = [
  { f: 0, cx: 390, cy: 450, viewW: 1380 },
  { f: 149, cx: 500, cy: 450, viewW: 1460 },
  { f: 299, cx: 620, cy: 448, viewW: 1520 },
  { f: 509, cx: 900, cy: 448, viewW: 1500 },
  { f: 680, cx: 990, cy: 450, viewW: 900 },
  { f: 749, cx: 1060, cy: 468, viewW: 620 },
  { f: 880, cx: 1220, cy: 450, viewW: 980 },
  { f: 960, cx: 1080, cy: 450, viewW: 1360 },
  { f: 1000, cx: 790, cy: 450, viewW: 1720 },
  { f: 1019, cx: 790, cy: 450, viewW: 1720 },
];

export type Reveals = {
  inlets: number;
  pumps: number;
  pumpSection: number;
  crossfeed: number;
  preburners: number;
  pbSection: number;
  turbines: number;
  ducts: number;
  injector: number;
  combustion: number;
  cooling: number;
  nozzle: number;
  mach: number;
  settled: number;
};

export type Chips = {
  scale: boolean;
  slow: boolean;
  compress: boolean;
};

export type SceneState = {
  frame: number;
  camera: Camera;
  chapter: Chapter;
  caption: string;
  chips: Chips;
  reveal: Reveals;
  emphasis: Record<string, number>;
  detail: number;
};

export function chapterAt(frame: number): Chapter {
  return CHAPTERS.find((chapter) => frame >= chapter.start && frame <= chapter.end) ?? CHAPTERS[0];
}

export function cameraAt(frame: number): Camera {
  const key = sampleKey(frame);
  return { cx: key.cx, cy: key.cy, viewW: key.viewW, viewH: key.viewW / FILM_ASPECT };
}

function sampleKey(frame: number): Key {
  if (frame <= KEYS[0].f) return KEYS[0];
  for (let i = 1; i < KEYS.length; i += 1) {
    const b = KEYS[i];
    if (frame <= b.f) {
      const a = KEYS[i - 1];
      const t = easeInOut((frame - a.f) / (b.f - a.f));
      return {
        f: frame,
        cx: lerp(a.cx, b.cx, t),
        cy: lerp(a.cy, b.cy, t),
        viewW: lerp(a.viewW, b.viewW, t),
      };
    }
  }
  return KEYS[KEYS.length - 1];
}

export function cameraContains(camera: Camera, x: number, y: number, margin = 8): boolean {
  const left = camera.cx - camera.viewW / 2 + margin;
  const right = camera.cx + camera.viewW / 2 - margin;
  const top = camera.cy - camera.viewH / 2 + margin;
  const bottom = camera.cy + camera.viewH / 2 - margin;
  return x >= left && x <= right && y >= top && y <= bottom;
}

export function stateAt(frame: number): SceneState {
  const clamped = Math.min(LAST_FRAME, Math.max(0, Math.round(frame)));
  const camera = cameraAt(clamped);
  const chapter = chapterAt(clamped);
  const reveal: Reveals = {
    inlets: ramp(clamped, 6, 56),
    pumps: ramp(clamped, 36, 120),
    pumpSection: ramp(clamped, 70, 145),
    crossfeed: ramp(clamped, 155, 240),
    preburners: ramp(clamped, 165, 250),
    pbSection: ramp(clamped, 200, 290),
    turbines: ramp(clamped, 300, 390),
    ducts: ramp(clamped, 340, 480),
    injector: ramp(clamped, 430, 520),
    combustion: ramp(clamped, 530, 640),
    cooling: ramp(clamped, 560, 710),
    nozzle: ramp(clamped, 745, 860),
    mach: ramp(clamped, 800, 910),
    settled: ramp(clamped, 968, 1000),
  };
  const detail = 1 - reveal.settled;
  return {
    frame: clamped,
    camera,
    chapter,
    caption: clamped >= 980 ? END_CAPTION : chapter.caption,
    chips: {
      scale: camera.viewW < 1100,
      slow: clamped >= 510 && clamped <= 749,
      compress: (clamped >= 150 && clamped <= 509) || (clamped >= 750 && clamped <= 970),
    },
    reveal,
    emphasis: emphasisAt(clamped),
    detail,
  };
}

function emphasisAt(frame: number): Record<string, number> {
  const dim = 0.32;
  const hot = 1;
  const map: Record<string, number> = {
    oxIn: dim,
    fuIn: dim,
    oxMain: dim,
    fuMain: dim,
    oxCross: dim,
    fuCross: dim,
    oxGas: dim,
    fuGas: dim,
    coolSupply: dim,
    coolUpper: dim,
    coolLower: dim,
    coolReturn: dim,
    nozzle: dim,
  };
  const lift = (ids: string[]) => {
    for (const id of ids) map[id] = hot;
  };
  const chapter = chapterAt(frame).id;
  if (chapter === "feeds") lift(["oxIn", "fuIn"]);
  if (chapter === "preburners") lift(["oxMain", "fuMain", "oxCross", "fuCross", "coolSupply"]);
  if (chapter === "turbines") lift(["oxGas", "fuGas", "oxMain", "fuMain"]);
  if (chapter === "chamber") lift(["oxGas", "fuGas", "coolUpper", "coolLower", "coolReturn", "coolSupply", "fuMain"]);
  if (chapter === "nozzle") lift(["nozzle", "oxGas", "fuGas"]);
  if (frame >= 980) {
    for (const key of Object.keys(map)) map[key] = 0.9;
  }
  return map;
}

export function timecode(frame: number): string {
  const seconds = frame / FPS;
  const whole = Math.floor(seconds);
  const frac = Math.floor((seconds - whole) * 10);
  return `00:${String(whole).padStart(2, "0")}.${frac}`;
}

export function durationLabel(): string {
  return timecode(FRAME_COUNT);
}

export function anchorsOutside(frame: number): string[] {
  const camera = cameraAt(frame);
  return causalAnchors
    .filter((anchor) => frame >= anchor.from && frame <= anchor.to)
    .filter((anchor) => !cameraContains(camera, anchor.x, anchor.y))
    .map((anchor) => anchor.name);
}
