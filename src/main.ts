import "./style.css";

/*
  Full-flow staged-combustion explainer.
  Deterministic frame-driven timeline: render(frame) is a pure function of
  the integer frame index (0..1019). No wall-clock state enters the picture,
  so scrubbing, stepping and exporting always reproduce the same frame.
  Accuracy guardrails: no pressures, RPM, mixture-ratio numbers, gimbal
  angles or performance claims are shown. Proportions are schematic.
*/

const TOTAL = 1020;
const FPS = 30;

type Phase = {
  id: number; start: number; end: number; title: string; kicker: string;
  body: string; before: string; after: string;
  state: [string, string, string][];
};
const PHASES: Phase[] = [
  {
    id: 1, start: 0, end: 149, title: "Feed lines and pumps",
    kicker: "Phase 01 · Frames 0–149 · 0–5 s",
    body: "Both propellants leave their vehicle feed inlets at once. Separate pumps, on separate shafts, raise each stream. Nothing burns yet. This stage only moves liquid and makes the next stage possible.",
    before: "Start: vehicle feed inlets", after: "Next: pressurised streams split toward both preburners",
    state: [["CH4 feed", "FLOWING", "cyan"], ["LOX feed", "FLOWING", "cyan"], ["Fuel pump shaft", "TURNING (slowed)", "gold"], ["Oxidiser pump shaft", "TURNING (slowed)", "gold"], ["Preburners", "NOT YET LIT", "violet"]],
  },
  {
    id: 2, start: 150, end: 299, title: "Both propellants, both preburners, different ratios",
    kicker: "Phase 02 · Frames 150–299 · 5–10 s",
    body: "The defining move of the full-flow cycle. Each preburner receives both propellants, mixed differently. One burns fuel-rich, the other oxidiser-rich. Bars show illustrative proportion only, not a mixture-ratio specification.",
    before: "Before: pressurised liquid from Phase 01", after: "Next: hot preburner gas drives the turbines",
    state: [["Fuel-rich preburner", "BURNING FUEL-RICH", "gold"], ["Oxidiser-rich preburner", "BURNING OXIDISER-RICH", "gold"], ["Cross-feed branches", "OPEN", "cyan"], ["Chamber injectors", "WAITING FOR HOT GAS", "violet"], ["Unburned propellant bypass", "NONE. FULL-FLOW", "cyan"]],
  },
  {
    id: 3, start: 300, end: 509, title: "Turbine gases travel onward to the chamber",
    kicker: "Phase 03 · Frames 300–509 · 10–17 s",
    body: "Preburner gas expands through each turbine and extracts work to drive its pump. The gas does not leave the engine. Every stream continues to the main chamber, which is why the cycle is called full-flow.",
    before: "Before: hot gas made in Phase 02", after: "Next: the same gas becomes chamber propellant",
    state: [["Fuel-side turbine", "EXTRACTING WORK", "gold"], ["Oxidiser-side turbine", "EXTRACTING WORK", "gold"], ["Hot-gas ducts", "FLOWING TO CHAMBER", "cyan"], ["Pump shafts", "DRIVEN BY TURBINES", "gold"], ["Exhaust bypass", "NONE", "violet"]],
  },
  {
    id: 4, start: 510, end: 749, title: "Chamber burn and regenerative cooling",
    kicker: "Phase 04 · Frames 510–749 · 17–25 s",
    body: "Hot fuel-rich and oxidiser-rich gases meet and burn to completion in the main chamber. This is combustion, a sustained controlled burn, not detonation. The sectional wall shows coolant passages carrying propellant around the chamber to absorb wall heat before injection. Routing varies by engine; the heat-pickup principle is the point shown.",
    before: "Before: turbine exhaust from Phase 03", after: "Next: hot chamber gas enters the nozzle",
    state: [["Main chamber", "SUSTAINED COMBUSTION", "gold"], ["Cooling passages (section)", "ABSORBING WALL HEAT", "cyan"], ["Wall state sensors", "STATE CHANGE SHOWN", "violet"], ["Injector face", "ALL GAS INBOUND", "cyan"], ["Detonation", "NO. NOT THIS CYCLE", "violet"]],
  },
  {
    id: 5, start: 750, end: 1019, title: "Nozzle expansion, then the whole system",
    kicker: "Phase 05 · Frames 750–1019 · 25–34 s",
    body: "The bell nozzle lets chamber gas expand and accelerate rearward. Thrust is the reaction to that accelerated mass. The camera then pulls back and holds: one complete system, every earlier stage still connected to the next.",
    before: "Before: chamber gas from Phase 04", after: "End: stable complete-system view (held)",
    state: [["Nozzle flow", "EXPANDING, ACCELERATING", "cyan"], ["Gimbal actuators", "SHOWN, ANGLE NOT SPECIFIED", "gold"], ["Chamber + pumps", "STILL RUNNING", "gold"], ["Sensing overlay", "STATE, NOT NUMBERS", "violet"], ["Final frame", "HELD COMPLETE SYSTEM", "cyan"]],
  },
];

const phaseFor = (f: number) => PHASES.find((p) => f >= p.start && f <= p.end) ?? PHASES[4];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const smoother = (t: number) => { t = clamp01(t); return t * t * t * (t * (t * 6 - 15) + 10); };
const fadeIn = (f: number, a: number, b: number) => smoother(seg(f, a, b));
const fadeOut = (f: number, a: number, b: number) => 1 - smoother(seg(f, a, b));
const phaseWindow = (f: number, p: Phase, pad = 18) =>
  fadeIn(f, p.start, p.start + pad) * (p.id === 5 ? 1 : fadeOut(f, p.end - pad, p.end));

/* Camera: [frame, x, y, w, h] keyframes over the 1200x820 design space. */
const CAM: [number, number, number, number, number][] = [
  [0, 0, 0, 1200, 820], [120, 90, 70, 880, 600], [149, 130, 105, 800, 545],
  [180, 210, 210, 740, 505], [299, 250, 245, 700, 478], [340, 260, 260, 680, 464],
  [509, 330, 330, 580, 396], [560, 345, 355, 540, 369], [749, 345, 355, 540, 369],
  [800, 240, 330, 720, 491], [930, 150, 210, 880, 600], [985, 0, 0, 1200, 820], [1019, 0, 0, 1200, 820],
];
function cameraAt(f: number): [number, number, number, number] {
  let i = 0;
  while (i < CAM.length - 2 && f > CAM[i + 1][0]) i++;
  const a = CAM[i], b = CAM[i + 1];
  const t = smoother(seg(f, a[0], b[0]));
  return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t, a[4] + (b[4] - a[4]) * t];
}

const el = (tag: string, attrs: Record<string, string | number> = {}, parent?: SVGElement | HTMLElement) => {
  const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  if (parent) parent.appendChild(n);
  return n;
};
const txt = (parent: SVGElement, x: number, y: number, s: string, cls = "lbl", anchor = "start") => {
  const t = el("text", { x, y, class: cls, "text-anchor": anchor }, parent); t.textContent = s; return t;
};

function buildStage(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", "engine"); svg.setAttribute("viewBox", "0 0 1200 820");
  svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Sectional schematic of a full-flow staged-combustion rocket engine");
  svg.innerHTML = `
  <defs>
    <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#EAFBFF"/><stop offset=".35" stop-color="#00E5FF"/>
      <stop offset=".7" stop-color="#FFD166"/><stop offset="1" stop-color="#FF7A45" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="plume" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#DFF9FF"/><stop offset=".3" stop-color="#00E5FF" stop-opacity=".75"/>
      <stop offset="1" stop-color="#9D4EDD" stop-opacity="0"/>
    </linearGradient>
    <marker id="arrC" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#00E5FF"/></marker>
    <marker id="arrG" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#FFD166"/></marker>
  </defs>`;

  /* backdrop grid */
  const bg = el("g", { id: "bg" }, svg);
  for (let x = 0; x <= 1200; x += 44) el("line", { x1: x, y1: 0, x2: x, y2: 820, stroke: "rgba(255,255,255,.045)" }, bg);
  for (let y = 0; y <= 820; y += 44) el("line", { x1: 0, y1: y, x2: 1200, y2: y, stroke: "rgba(255,255,255,.045)" }, bg);

  const hw = el("g", { id: "hardware" }, svg);
  /* feed inlets */
  const tank = (x: number, label: string, sub: string) => {
    el("rect", { x: x - 105, y: 46, width: 210, height: 74, rx: 16, class: "hardware" }, hw);
    txt(hw, x, 80, label, "lbl", "middle"); txt(hw, x, 101, sub, "lbl-small", "middle");
  };
  tank(320, "METHANE FEED", "liquid CH₄ · vehicle inlet");
  tank(880, "OXYGEN FEED", "liquid O₂ (LOX) · vehicle inlet");

  /* main flow paths (ids used for tracers) */
  const paths = el("g", { id: "paths", fill: "none" }, svg);
  const P = (id: string, d: string, color: string, w = 7) => {
    const p = el("path", { id, d, class: "flow", stroke: color, "stroke-width": w, opacity: .92 }, paths);
    el("path", { d, class: "flow", stroke: color, "stroke-width": w + 7, opacity: .10 }, paths);
    return p;
  };
  P("p-ch4-pump", "M320 120 L320 218", "#00E5FF");
  P("p-lox-pump", "M880 120 L880 218", "#00E5FF");
  P("p-ch4-main", "M320 292 C320 360 360 372 408 398", "#00E5FF");
  P("p-ch4-cross", "M336 330 C520 300 650 330 742 398", "#00E5FF", 4);
  P("p-lox-main", "M880 292 C880 360 840 372 792 398", "#7ED7E8");
  P("p-lox-cross", "M864 330 C680 300 550 330 458 398", "#7ED7E8", 4);
  P("p-fuel-hot", "M452 478 C470 530 520 548 566 566", "#FFD166", 6);
  P("p-ox-hot", "M748 478 C730 530 680 548 634 566", "#FFD166", 6);
  P("p-regen", "M548 566 C520 600 522 650 548 690 L548 712", "#00E5FF", 4);
  P("p-regen-r", "M652 566 C680 600 678 650 652 690 L652 712", "#00E5FF", 4);

  /* valves (gold diamonds) + sensors (violet) */
  const valves = el("g", { id: "valves" }, svg);
  const valve = (x: number, y: number) => el("path", { d: `M${x} ${y - 11} L${x + 11} ${y} L${x} ${y + 11} L${x - 11} ${y} Z`, fill: "#FFD166", stroke: "#8A6A1F", "stroke-width": 1.2 }, valves);
  valve(320, 168); valve(880, 168); valve(430, 382); valve(770, 382); valve(566, 540); valve(634, 540);
  const sensors = el("g", { id: "sensors" }, svg);
  const sensor = (x: number, y: number, id: string) => {
    el("circle", { id, cx: x, cy: y, r: 7, fill: "#9D4EDD", stroke: "#E4C6FF", "stroke-width": 1.4 }, sensors);
    el("circle", { id: `${id}-ring`, cx: x, cy: y, r: 12, class: "sensor-ring", opacity: .7 }, sensors);
  };
  sensor(356, 168, "s1"); sensor(916, 168, "s2"); sensor(408, 430, "s3"); sensor(792, 430, "s4"); sensor(520, 622, "s5"); sensor(680, 622, "s6"); sensor(600, 742, "s7");

  /* pumps */
  const pump = (x: number, label: string, impId: string) => {
    const g = el("g", {}, hw);
    el("circle", { cx: x, cy: 255, r: 42, class: "hardware" }, g);
    el("circle", { cx: x, cy: 255, r: 27, class: "hardware-dark" }, g);
    const imp = el("g", { id: impId }, g);
    for (let i = 0; i < 3; i++) {
      const a = (i * 120 * Math.PI) / 180;
      el("path", { d: `M${x} 255 L${x + 22 * Math.cos(a)} ${255 + 22 * Math.sin(a)}`, stroke: "#FFD166", "stroke-width": 6, "stroke-linecap": "round" }, imp);
    }
    el("circle", { cx: x, cy: 255, r: 6, fill: "#FFD166" }, g);
    txt(g, x, 322, label, "lbl", "middle");
    return g;
  };
  pump(320, "FUEL PUMP · separate shaft", "imp-fuel");
  pump(880, "OXIDISER PUMP · separate shaft", "imp-ox");
  txt(hw, 600, 248, "NOT coaxial. No shared shaft is drawn,", "lbl-small", "middle");
  txt(hw, 600, 266, "because none is claimed.", "lbl-small", "middle");

  /* preburners + turbines */
  const preburner = (x: number, title: string, sub: string, barId: string, fuelShare: number) => {
    const g = el("g", {}, hw);
    el("rect", { x: x - 78, y: 398, width: 156, height: 82, rx: 14, class: "hardware" }, g);
    el("circle", { id: `${barId}-turb`, cx: x + (x < 600 ? -108 : 108), cy: 439, r: 30, class: "hardware-dark", stroke: "#FFD166" }, g);
    txt(g, x + (x < 600 ? -108 : 108), 443, "T", "lbl lbl-gold", "middle");
    txt(g, x, 428, title, "lbl", "middle"); txt(g, x, 449, sub, "lbl-small", "middle");
    el("rect", { x: x - 58, y: 458, width: 116, height: 9, rx: 4, fill: "#1B2A44" }, g);
    el("rect", { id: barId, x: x - 58, y: 458, width: 116 * fuelShare, height: 9, rx: 4, fill: "#00E5FF" }, g);
    el("rect", { x: x - 58 + 116 * fuelShare, y: 458, width: 116 * (1 - fuelShare), height: 9, rx: 4, fill: "#FFD166" }, g);
    return g;
  };
  preburner(430, "PREBURNER A", "burns FUEL-RICH", "bar-fuel", .78);
  preburner(770, "PREBURNER B", "burns OXIDISER-RICH", "bar-ox", .22);
  txt(hw, 430, 505, "drives fuel pump via its turbine", "lbl-small", "middle");
  txt(hw, 770, 505, "drives oxidiser pump via its turbine", "lbl-small", "middle");
  txt(hw, 600, 392, "cyan = fuel share · gold = oxidiser share · illustrative only", "lbl-small", "middle");

  /* chamber (sectional) + nozzle */
  const ch = el("g", { id: "chamber" }, svg);
  el("path", { d: "M520 566 L680 566 L664 660 L640 700 L560 700 L536 660 Z", class: "hardware" }, ch);
  el("path", { d: "M548 566 L652 566 L640 660 L628 692 L572 692 L560 660 Z", class: "cutface", id: "chamber-cut" }, ch);
  const flame = el("ellipse", { id: "flame", cx: 600, cy: 618, rx: 34, ry: 42, fill: "url(#flame)", opacity: 0 }, ch);
  flame.id = "flame";
  /* regen channels */
  for (const dx of [-30, -18, 18, 30]) el("path", { d: `M${600 + dx} 574 L${600 + dx * 1.08} 686`, stroke: "#00E5FF", "stroke-width": 3, opacity: .0, class: "regen-line" }, ch);
  txt(ch, 600, 586, "MAIN CHAMBER · sectioned", "lbl", "middle");
  const plume = el("path", { id: "plume", d: "M560 742 L640 742 L690 812 L510 812 Z", fill: "url(#plume)", opacity: 0 }, svg);
  plume.id = "plume";
  el("path", { d: "M548 700 L560 742 L640 742 L652 700 L676 700 L700 806 L500 806 L524 700 Z", class: "hardware", id: "nozzle" }, svg);
  txt(svg, 600, 730, "NOZZLE (bell) · sectioned", "lbl", "middle");
  /* gimbal actuators, no angle stated */
  el("path", { d: "M520 690 L486 650", stroke: "#FFD166", "stroke-width": 7, "stroke-linecap": "round", id: "gimbal-l" }, svg);
  el("path", { d: "M680 690 L714 650", stroke: "#FFD166", "stroke-width": 7, "stroke-linecap": "round", id: "gimbal-r" }, svg);

  /* flow tracers */
  const tracers = el("g", { id: "tracers" }, svg);
  const tracerDefs: [string, number][] = [["p-ch4-pump", 3], ["p-lox-pump", 3], ["p-ch4-main", 3], ["p-lox-main", 3], ["p-ch4-cross", 2], ["p-lox-cross", 2], ["p-fuel-hot", 3], ["p-ox-hot", 3]];
  tracerDefs.forEach(([pid, n]) => {
    for (let i = 0; i < n; i++) el("circle", { class: "tracer", "data-path": pid, "data-i": i, "data-n": n, r: 5.5, fill: "#EAFBFF", stroke: "#00E5FF", "stroke-width": 1.6, opacity: 0 }, tracers);
  });

  /* annotation layers per phase */
  const anno = (id: string) => el("g", { id, opacity: 0 }, svg);
  const a1 = anno("anno-1");
  txt(a1, 96, 150, "① FEED", "lbl lbl-cyan"); txt(a1, 96, 170, "Liquid in. Nothing burns yet.", "lbl-small");
  txt(a1, 946, 330, "Separate shafts →", "lbl lbl-gold"); txt(a1, 946, 350, "each pump answers to its own turbine (Phase 03)", "lbl-small");
  const a2 = anno("anno-2");
  txt(a2, 92, 420, "② SAME TWO PROPELLANTS,", "lbl lbl-cyan"); txt(a2, 92, 442, "DIFFERENT PROPORTIONS", "lbl lbl-cyan");
  txt(a2, 92, 464, "Fuel-rich gas keeps turbine-side chemistry fuel-heavy.", "lbl-small");
  txt(a2, 92, 484, "Oxidiser-rich gas does the mirror job on the other side.", "lbl-small");
  txt(a2, 92, 504, "No numeric ratio is claimed here.", "lbl-small lbl-gold");
  const a3 = anno("anno-3");
  txt(a3, 96, 560, "③ GAS DOES WORK, THEN MOVES ON", "lbl lbl-gold");
  txt(a3, 96, 582, "Turbine → shaft → pump. The gas itself is not spent.", "lbl-small");
  txt(a3, 96, 602, "It becomes chamber propellant. That is 'full-flow'.", "lbl-small");
  const a4 = anno("anno-4");
  txt(a4, 884, 560, "④ SECTION VIEW", "lbl lbl-violet"); txt(a4, 884, 582, "Wall cut open. Coolant passages", "lbl-small");
  txt(a4, 884, 602, "carry heat away before injection.", "lbl-small");
  txt(a4, 884, 622, "Combustion = sustained burn.", "lbl-small lbl-gold");
  txt(a4, 884, 642, "Not detonation.", "lbl-small lbl-gold");
  const a5 = anno("anno-5");
  txt(a5, 96, 500, "⑤ EXPANSION", "lbl lbl-cyan"); txt(a5, 96, 522, "Gas expands, accelerates rearward.", "lbl-small");
  txt(a5, 96, 542, "Thrust is the reaction. No thrust", "lbl-small"); txt(a5, 96, 562, "figure is claimed in this schematic.", "lbl-small");

  /* scale / time disclaimer, always on */
  const disc = el("g", { id: "disc" }, svg);
  el("rect", { x: 18, y: 772, width: 560, height: 34, rx: 9, fill: "rgba(9,15,26,.82)", stroke: "#2A3E63" }, disc);
  txt(disc, 32, 794, "NOT TO SCALE · SECTIONAL SCHEMATIC · TIME COMPRESSED · ROTATION SLOWED · NO INVENTED SPECIFICATIONS", "lbl-small");
  const frameTag = el("g", { id: "frametag" }, svg);
  el("rect", { x: 986, y: 772, width: 196, height: 34, rx: 9, fill: "rgba(9,15,26,.82)", stroke: "#2A3E63" }, frameTag);
  const ft = txt(frameTag, 1084, 794, "FRAME 0000 / 1019", "lbl-small", "middle"); ft.id = "frametag-text";
  return svg;
}

/* ---------------- app shell ---------------- */
const app = document.getElementById("app")!;
app.innerHTML = `
<header class="topbar">
  <div class="brand"><div class="brand-mark"><svg width="20" height="20" viewBox="0 0 32 32"><path d="M16 2 L22 14 L22 24 L16 30 L10 24 L10 14 Z" fill="none" stroke="#00E5FF" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="#FFD166"/></svg></div>
  <div><b>Kinetic Gain · Motion Explainers</b><span>Aerospace Engineering · Full-flow cycle</span></div></div>
  <nav class="top-links"><a href="#explainer">Explainer</a><a href="#how-it-works">How it works</a><a href="#timeline">Timeline</a><a href="#method">Method &amp; limits</a><a href="./medium-article-Cursor.md">Medium article</a></nav>
</header>

<section class="hero">
  <div class="eyebrow">Anatomy-style motion explainer · 34 seconds · Deterministic timeline</div>
  <h1>Every drop of propellant <em>burns twice.</em><br/>That is the whole trick of the <span class="gold">full-flow</span> <span class="violet">rocket engine.</span></h1>
  <p class="lede">A Raptor-inspired conceptual model, drawn in code and cut open in section. Feed lines and pumps, two preburners burning opposite mixtures, turbines that hand their gas to the chamber instead of throwing it away, regenerative cooling, and nozzle expansion. One frame at a time, all 1,020 of them reproducible.</p>
  <div class="hero-meta">
    <span class="chip"><b>1,020</b> frames · indexed 0–1019</span><span class="chip"><b>30 fps</b> · 34.0 s</span>
    <span class="chip"><b>5</b> causal phases</span><span class="chip">Cyan <b>primary pathway</b></span>
    <span class="chip">Gold <b>actuation / energy</b></span><span class="chip">Violet <b>sensing / state</b></span>
  </div>
  <div class="guardrail"><b>Accuracy guardrail.</b> This is a consolidated working brief, not a certified engineering reference. No pressures, RPM, mixture ratios, gimbal angles, thrust figures, or coaxial pump arrangement are shown, because none are claimed. Combustion is shown as a sustained burn, not detonation. Verify subject-specific details before publication.</div>
</section>

<main class="stage-wrap" id="explainer">
  <div class="stage-shell">
    <div class="stage-head"><span class="dot"></span><span class="stage-title">Full-flow staged combustion · sectional schematic · Raptor-inspired conceptual model</span>
      <div class="stage-badges"><span class="badge warn">Not to scale</span><span class="badge warn">Time compressed</span><span class="badge">Rotation slowed</span><span class="badge violet">Sensors show state, not numbers</span></div>
    </div>
    <div id="svg-host"></div>
    <div class="stage-foot">
      <div class="caption"><div class="phase-kicker" id="cap-kicker"></div><h2 id="cap-title"></h2><p id="cap-body"></p>
        <div class="causal"><span id="cap-before"></span><span id="cap-after"></span></div></div>
      <aside class="state-panel"><h3>System state · this phase (schematic)</h3><div id="state-rows"></div></aside>
    </div>
  </div>
</main>

<section class="transport"><div class="transport-shell">
  <div class="transport-row">
    <button class="btn primary" id="btn-play">❚❚ Pause</button>
    <button class="btn" id="btn-restart">↺ Frame 0</button>
    <button class="btn small" id="btn-prev">◀ −1 frame</button>
    <button class="btn small" id="btn-next">+1 frame ▶</button>
    <div class="timecode" id="timecode">FRAME 0000 / 1019 <span>· 00.00 s / 34.00 s</span></div>
    <select class="speed" id="speed"><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1" selected>1× · 30 fps</option><option value="2">2×</option></select>
    <label class="check"><input type="checkbox" id="chk-labels" checked/> Labels</label>
    <label class="check"><input type="checkbox" id="chk-flow" checked/> Flow tracers</label>
    <button class="btn small" id="btn-png">Export frame PNG</button>
    <button class="btn small" id="btn-json">Copy frame JSON</button>
  </div>
  <input type="range" class="scrub" id="scrub" min="0" max="1019" step="1" value="0" aria-label="Scrub frame"/>
  <div class="phase-track" id="phase-track"></div>
  <div class="legend">
    <span><i class="sw" style="background:#00E5FF"></i>Cyan · primary pathway (propellant / hot gas)</span>
    <span><i class="sw" style="background:#FFD166"></i>Gold · actuation / energy (shafts, turbines, valves, gimbal)</span>
    <span><i class="sw" style="background:#9D4EDD"></i>Violet · sensing / state change</span>
    <span><i class="sw" style="background:#344257"></i>Muted blue-grey · structure / hardware</span>
  </div>
</div></section>

<section class="grid" id="how-it-works">
  <article class="card wide"><div class="k">The mechanism, in one paragraph</div><h3>Why burn everything twice?</h3>
    <p>In a full-flow staged-combustion cycle, all of the fuel and all of the oxidiser pass through a preburner before they reach the main chamber. One preburner gets most of the fuel and a little oxidiser, so it burns fuel-rich. The other gets most of the oxidiser and a little fuel, so it burns oxidiser-rich. Each hot gas stream spins a turbine, each turbine drives one pump, and then, critically, neither stream is dumped overboard. Both continue into the main chamber and burn to completion there.</p>
    <p>The payoff the schematic is built to make visible is causal, not numeric: pump work comes from propellant that was going to burn anyway, and the chamber receives gas already hot and already moving. No performance figure is attached to that statement on this page, deliberately. The diagram earns the mechanism. It does not invent the specification.</p></article>
  <article class="card"><div class="k gold">What is not claimed</div><h3>Read this before citing it</h3>
    <p>No chamber pressure. No pump speed. No mixture-ratio number. No gimbal angle. No thrust, specific impulse, or efficiency figure. No coaxial shaft. Proportions in the ratio bars are illustrative. If a number matters to your decision, this explainer is the map, not the territory, and you need the primary source.</p></article>

  <article class="card"><div class="k">Phase 01 · 0–5 s</div><h3>Feed and pressurise</h3><p>Separate inlets, separate pumps, separate shafts. The camera pushes in on the pump pair and holds the inlets in frame, so the source of everything downstream stays visible.</p></article>
  <article class="card"><div class="k">Phase 02 · 5–10 s</div><h3>Split, in different ratios</h3><p>Main lines and cross-feed branches deliver both propellants to both preburners. The ratio bars are the argument: same ingredients, opposite proportions.</p></article>
  <article class="card"><div class="k">Phase 03 · 10–17 s</div><h3>Work, then onward</h3><p>The camera tracks the hot-gas ducts from turbine exit to injector face. The causal chain never leaves the screen: preburner, turbine, shaft, pump, chamber.</p></article>
  <article class="card"><div class="k violet">Phase 04 · 17–25 s</div><h3>Burn, and cool the wall that contains it</h3><p>A sectional cut opens the chamber wall. Cooling passages are drawn inside the wall, carrying propellant that absorbs heat before it is injected. Sustained combustion, explicitly not detonation.</p></article>
  <article class="card"><div class="k">Phase 05 · 25–34 s</div><h3>Expand, accelerate, hold</h3><p>The bell expands the gas. The last 35 frames pull back to the full system and hold it still, so the viewer leaves with the whole machine, not the last zoom.</p></article>
  <article class="card"><div class="k gold">Colour discipline</div><h3>Explanatory, not literal</h3><p>Cyan, gold and violet are labels, not emission colours. Real exhaust, real metal and real flame do not look like this diagram, and the diagram says so on its face, on every frame.</p></article>

  <article class="card full" id="timeline"><div class="k">Deterministic timeline · 1,020 frames at 30 fps</div><h3>Every frame is a function, not a recording</h3>
    <table class="spec"><thead><tr><th>Frames</th><th>Time</th><th>Phase</th><th>Camera</th><th>Causal link kept visible</th></tr></thead><tbody>
    <tr><td>0–149</td><td>0–5 s</td><td>Feed lines and pumps</td><td>Wide system → push-in on pump pair</td><td>Vehicle inlets stay in frame above the pumps</td></tr>
    <tr><td>150–299</td><td>5–10 s</td><td>Both propellants into both preburners, different ratios</td><td>Track down to the preburner pair</td><td>Pump outlets and cross-feed branches stay traced</td></tr>
    <tr><td>300–509</td><td>10–17 s</td><td>Turbine gases onward to chamber</td><td>Follow the hot-gas ducts downward</td><td>Turbine, shaft and pump remain connected in frame</td></tr>
    <tr><td>510–749</td><td>17–25 s</td><td>Chamber burn and regenerative cooling</td><td>Close sectional hold on the chamber</td><td>Injector inlets at top of frame feed the burn below</td></tr>
    <tr><td>750–1019</td><td>25–34 s</td><td>Nozzle expansion, then complete system</td><td>Tilt to nozzle, then pull back to wide and hold</td><td>Chamber stays attached to the nozzle throughout</td></tr>
    </tbody></table></article>

  <article class="card wide" id="method"><div class="k violet">Method</div><h3>How this was built, and how to verify it</h3>
    <ol class="steps">
      <li>Scrub to any frame, then step one frame at a time. The picture is <code>render(frame)</code>, a pure function of the integer index. Returning to the same frame returns the same picture.</li>
      <li>Camera position is interpolated between keyframes with a smootherstep ease, so motion is deliberate and never cuts mid-phase.</li>
      <li>Flow tracers sit on named paths at positions computed from the frame index. They are explanatory markers on the primary pathway, not decorative particles.</li>
      <li>Export the current frame as PNG, or copy its JSON state, and compare it against the same frame after a reload. It will match.</li>
    </ol>
    <pre><code>render(0)    → wide system, inlets open, preburners dark
render(225)  → mid Phase 02, ratio bars at full width
render(1019) → identical camera to frame 0, system running, held</code></pre></article>
  <article class="card"><div class="k">Reuse</div><h3>Same engine, other machines</h3>
    <p>The frame-driven shell (timeline, camera keys, phase captions, state panel, scrub transport) is machine-agnostic. Swap the SVG anatomy and the phase table and it becomes a gas-turbine, fuel-cell, or dialysis-circuit explainer without touching the transport. That is the reusable asset. The rocket is the first subject, not the only one.</p></article>
</section>

<footer>
  <b style="color:#E8EEF7">Full-Flow Rocket Engine, Explained in 1,020 Frames.</b> Kinetic Gain LLC. Raptor-inspired conceptual model for education. Consolidated working brief, not a certified engineering reference. Aerospace subjects here are explanatory only. Verify subject-specific details before publication. Colour overlays are explanatory labels, not literal emission. No specification on this page should be cited as an engine figure.<br/>
  GitHub: <a href="https://github.com/mizcausevic-dev/full-flow-rocket-engine-explainer">mizcausevic-dev/full-flow-rocket-engine-explainer</a> · About: Code-driven anatomy explainer of a full-flow staged-combustion rocket engine (34 s, 30 fps, 1,020 deterministic frames). · Topics: rocket-engine, full-flow-staged-combustion, aerospace-engineering, motion-design, svg-animation, technical-communication, raptor-engine, turbopump, regenerative-cooling
</footer>`;

const host = document.getElementById("svg-host")!;
const svg = buildStage();
host.appendChild(svg);

const $ = (id: string) => document.getElementById(id)!;
const scrub = $("scrub") as HTMLInputElement;
const phaseTrack = $("phase-track");
PHASES.forEach((p) => {
  const b = document.createElement("button");
  b.className = "phase-seg"; b.dataset.phase = String(p.id);
  b.innerHTML = `<b>0${p.id} · ${p.title}</b><span>FRAMES ${p.start}–${p.end} · ${(p.start / FPS).toFixed(0)}–${((p.end + 1) / FPS).toFixed(0)} S</span>`;
  b.onclick = () => { setFrame(p.start); pause(); };
  phaseTrack.appendChild(b);
});

let frame = 0, playing = !window.matchMedia("(prefers-reduced-motion: reduce)").matches, speed = 1, lastPhase = -1;
const $q = (s: string) => svg.querySelector(s) as SVGElement | null;
const $$q = (s: string) => Array.from(svg.querySelectorAll(s)) as SVGElement[];

function render(f: number) {
  frame = Math.max(0, Math.min(TOTAL - 1, Math.round(f)));
  const p = phaseFor(frame);
  const [vx, vy, vw, vh] = cameraAt(frame);
  svg.setAttribute("viewBox", `${vx} ${vy} ${vw} ${vh}`);

  /* phase annotations + hardware emphasis */
  for (let i = 1; i <= 5; i++) {
    const g = $q(`#anno-${i}`); if (g) g.setAttribute("opacity", String(phaseWindow(frame, PHASES[i - 1])));
  }
  const showLabels = ($("chk-labels") as HTMLInputElement).checked;
  $$q("[id^='anno-']").forEach((g) => { if (!showLabels) g.setAttribute("opacity", "0"); });

  /* pumps / turbines rotate (slowed, deterministic) */
  const a = frame * 2.4;
  $q("#imp-fuel")?.setAttribute("transform", `rotate(${a} 320 255)`);
  $q("#imp-ox")?.setAttribute("transform", `rotate(${-a} 880 255)`);
  $q("#bar-fuel-turb")?.setAttribute("transform", `rotate(${a * .6} 322 439)`);
  $q("#bar-ox-turb")?.setAttribute("transform", `rotate(${-a * .6} 878 439)`);

  /* ratio bars grow in phase 2 */
  const rp = fadeIn(frame, 165, 215);
  $q("#bar-fuel")?.setAttribute("width", String(116 * .78 * rp));
  $q("#bar-ox")?.setAttribute("width", String(116 * .22 * rp));

  /* flow tracers: active windows per path */
  const windows: Record<string, [number, number]> = {
    "p-ch4-pump": [8, 1019], "p-lox-pump": [8, 1019],
    "p-ch4-main": [150, 1019], "p-lox-main": [150, 1019], "p-ch4-cross": [170, 1019], "p-lox-cross": [170, 1019],
    "p-fuel-hot": [300, 1019], "p-ox-hot": [300, 1019],
  };
  const showFlow = ($("chk-flow") as HTMLInputElement).checked;
  $$q(".tracer").forEach((c) => {
    const pid = c.getAttribute("data-path")!, i = Number(c.getAttribute("data-i")), n = Number(c.getAttribute("data-n"));
    const path = $q(`#${CSS.escape(pid)}`) as unknown as SVGPathElement | null;
    const w = windows[pid]; if (!path || !w) return;
    const on = showFlow && frame >= w[0] && frame <= w[1];
    if (!on) { c.setAttribute("opacity", "0"); return; }
    const t = ((frame * 0.0035 + i / n) % 1 + 1) % 1;
    const pt = path.getPointAtLength(t * path.getTotalLength());
    c.setAttribute("cx", String(pt.x)); c.setAttribute("cy", String(pt.y));
    c.setAttribute("opacity", String(Math.sin(t * Math.PI) * .95));
  });

  /* chamber flame + regen + plume */
  const burn = seg(frame, 520, 580) * (frame > 749 ? .85 : 1);
  const flick = 1 + Math.sin(frame * .9) * .05 + Math.sin(frame * 2.7) * .03;
  const flame = $q("#flame");
  if (flame) { flame.setAttribute("opacity", String(burn * .95)); flame.setAttribute("transform", `translate(600 618) scale(${flick} ${1 + Math.sin(frame * 1.3) * .06}) translate(-600 -618)`); }
  $$q(".regen-line").forEach((l, i) => l.setAttribute("opacity", String(seg(frame, 545 + i * 14, 610 + i * 14) * .9)));
  const plumeT = seg(frame, 760, 860);
  const plume = $q("#plume");
  if (plume) { plume.setAttribute("opacity", String(plumeT * .9)); plume.setAttribute("transform", `translate(600 742) scale(1 ${.35 + plumeT * .65}) translate(-600 -742)`); }

  /* sensors pulse in violet */
  $$q("[id$='-ring']").forEach((r, i) => {
    const rr = 11 + 4 * (0.5 + 0.5 * Math.sin(frame * .22 + i * 1.1));
    r.setAttribute("r", String(rr)); r.setAttribute("opacity", String(.35 + .4 * (0.5 + 0.5 * Math.sin(frame * .22 + i))));
  });

  /* HUD + captions */
  const ft = $q("#frametag-text"); if (ft) ft.textContent = `FRAME ${String(frame).padStart(4, "0")} / 1019`;
  scrub.value = String(frame);
  $("timecode").innerHTML = `FRAME ${String(frame).padStart(4, "0")} / 1019 <span>· ${(frame / FPS).toFixed(2)} s / 34.00 s · ${p.kicker.split("·")[1]?.trim() ?? ""}</span>`;
  if (p.id !== lastPhase) {
    lastPhase = p.id;
    $("cap-kicker").textContent = p.kicker; $("cap-title").textContent = p.title; $("cap-body").textContent = p.body;
    $("cap-before").innerHTML = `<b>← Causal in:</b> ${p.before.replace("Before: ", "").replace("Start: ", "")}`;
    $("cap-after").innerHTML = `<b>Causal out →:</b> ${p.after.replace("Next: ", "").replace("End: ", "")}`;
    $("state-rows").innerHTML = p.state.map(([k, v, c]) => `<div class="state-row"><span>${k}</span><b class="${c}">${v}</b></div>`).join("");
    document.querySelectorAll<HTMLElement>(".phase-seg").forEach((s) => {
      const id = Number(s.dataset.phase);
      s.classList.toggle("active", id === p.id); s.classList.toggle("done", id < p.id);
    });
  }
}
function setFrame(f: number) { render(f); }
function pause() { playing = false; $("btn-play").textContent = "▶ Play"; }
function play() { playing = true; $("btn-play").textContent = "❚❚ Pause"; }

$("btn-play").onclick = () => (playing ? pause() : play());
$("btn-restart").onclick = () => { setFrame(0); play(); };
$("btn-prev").onclick = () => { pause(); setFrame(frame - 1); };
$("btn-next").onclick = () => { pause(); setFrame(frame + 1); };
scrub.addEventListener("input", () => { pause(); setFrame(Number(scrub.value)); });
($("speed") as HTMLSelectElement).onchange = (e) => (speed = Number((e.target as HTMLSelectElement).value));
$("chk-labels").onchange = () => render(frame);
$("chk-flow").onchange = () => render(frame);
$("btn-json").onclick = async () => {
  const p = phaseFor(frame);
  await navigator.clipboard.writeText(JSON.stringify({ frame, time_s: +(frame / FPS).toFixed(3), fps: FPS, total_frames: TOTAL, phase: p.id, phase_title: p.title, camera_viewBox: cameraAt(frame).map((v) => +v.toFixed(1)), deterministic: true }, null, 2));
  $("btn-json").textContent = "Copied ✓"; setTimeout(() => ($("btn-json").textContent = "Copy frame JSON"), 1200);
};
$("btn-png").onclick = () => {
  const xml = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" }));
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas"); c.width = 1200; c.height = 820;
    const ctx = c.getContext("2d")!; ctx.fillStyle = "#0B1019"; ctx.fillRect(0, 0, 1200, 820); ctx.drawImage(img, 0, 0, 1200, 820);
    const a = document.createElement("a"); a.download = `full-flow-frame-${String(frame).padStart(4, "0")}.png`; a.href = c.toDataURL("image/png"); a.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
};
window.addEventListener("keydown", (e) => {
  if (e.key === " ") { e.preventDefault(); playing ? pause() : play(); }
  if (e.key === "ArrowRight") { pause(); setFrame(frame + (e.shiftKey ? 10 : 1)); }
  if (e.key === "ArrowLeft") { pause(); setFrame(frame - (e.shiftKey ? 10 : 1)); }
  if (e.key === "Home") { pause(); setFrame(0); }
  if (e.key === "End") { pause(); setFrame(1019); }
});

/* transport loop: clock only advances the index; render stays pure */
let last = performance.now(), acc = 0;
function loop(now: number) {
  const dt = now - last; last = now;
  if (playing) {
    acc += (dt / 1000) * FPS * speed;
    const step = Math.floor(acc); acc -= step;
    if (step > 0) { const nf = frame + step; if (nf >= TOTAL - 1) { setFrame(TOTAL - 1); pause(); } else setFrame(nf); }
  }
  requestAnimationFrame(loop);
}
render(0);
if (!playing) $("btn-play").textContent = "▶ Play";
requestAnimationFrame(loop);
