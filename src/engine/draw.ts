import {
  BARREL_R,
  CHAMBER_TOP,
  EXIT_R,
  EXIT_Y,
  LINES,
  THROAT_R,
  THROAT_Y,
  WALL,
  fuelPB,
  fuelPump,
  fuelTurb,
  innerHalf,
  outerHalf,
  oxPB,
  oxPump,
  oxTurb,
  type Pt,
} from "./scene";
import { VIEW_H, cameraAt, windowFade, type Camera } from "./timing";

const BG = "#0B1019";
const METAL = "#344257";
const METAL_HI = "#546680";
const METAL_LO = "#243044";
const BORE = "#0e141e";
const CYAN = "#00E5FF";
const GOLD = "#FFD166";
const VIOLET = "#9D4EDD";
const BONE = "#E6E8EE";

export type RenderMode = "player" | "poster";

type Label = {
  text: string;
  ax: number;
  ay: number;
  dx: number;
  dy: number;
  side: "left" | "right" | "mid";
  t0: number;
  t1: number;
  tone: "path" | "energy" | "sense" | "note";
};

const LABELS: Label[] = [
  { text: "Liquid methane", ax: -860, ay: 220, dx: 0, dy: -36, side: "left", t0: 0, t1: 168, tone: "path" },
  { text: "Liquid oxygen", ax: 900, ay: 206, dx: 0, dy: -36, side: "right", t0: 0, t1: 168, tone: "path" },
  { text: "Fuel turbopump", ax: fuelPump.x, ay: fuelPump.y, dx: -120, dy: 8, side: "left", t0: 20, t1: 175, tone: "note" },
  { text: "Oxidizer turbopump", ax: oxPump.x, ay: oxPump.y, dx: 28, dy: -8, side: "right", t0: 20, t1: 175, tone: "note" },
  { text: "Own shaft", ax: fuelPump.x, ay: 380, dx: -110, dy: 0, side: "left", t0: 40, t1: 160, tone: "energy" },
  { text: "Fuel-rich preburner", ax: fuelPB.x + 40, ay: fuelPB.y, dx: -20, dy: -48, side: "left", t0: 155, t1: 330, tone: "path" },
  { text: "Ox-rich preburner", ax: oxPB.x + oxPB.w - 8, ay: oxPB.y + oxPB.h, dx: 6, dy: 4, side: "right", t0: 155, t1: 330, tone: "path" },
  { text: "Small oxidizer fraction", ax: -700, ay: 58, dx: 10, dy: -28, side: "left", t0: 170, t1: 320, tone: "path" },
  { text: "Small fuel fraction", ax: 760, ay: 108, dx: 8, dy: -28, side: "right", t0: 170, t1: 320, tone: "path" },
  { text: "Fuel turbine", ax: fuelTurb.x, ay: fuelTurb.y, dx: -130, dy: 36, side: "left", t0: 300, t1: 530, tone: "note" },
  { text: "Oxidizer turbine", ax: oxTurb.x, ay: oxTurb.y, dx: 24, dy: 40, side: "right", t0: 300, t1: 530, tone: "note" },
  { text: "Shaft work to the pump", ax: fuelPump.x + 36, ay: 390, dx: -20, dy: -28, side: "left", t0: 320, t1: 520, tone: "energy" },
  { text: "Not dumped. To the injector", ax: -20, ay: 690, dx: -70, dy: -36, side: "mid", t0: 360, t1: 540, tone: "path" },
  { text: "Injector face", ax: 0, ay: 724, dx: 70, dy: -8, side: "right", t0: 420, t1: 560, tone: "note" },
  { text: "Steady combustion", ax: 0, ay: 830, dx: 90, dy: -10, side: "right", t0: 520, t1: 760, tone: "note" },
  { text: "Cooling channels", ax: outerHalf(860), ay: 860, dx: 18, dy: -8, side: "right", t0: 540, t1: 760, tone: "path" },
  { text: "Heat into the methane", ax: -outerHalf(820), ay: 820, dx: -150, dy: 8, side: "left", t0: 560, t1: 750, tone: "energy" },
  { text: "State tap. No reading", ax: outerHalf(800) + 16, ay: 800, dx: 16, dy: -32, side: "right", t0: 500, t1: 740, tone: "sense" },
  { text: "Throat", ax: THROAT_R + 8, ay: THROAT_Y, dx: 36, dy: -6, side: "right", t0: 760, t1: 960, tone: "note" },
  { text: "Teaching bell", ax: innerHalf(1160), ay: 1160, dx: 28, dy: 0, side: "right", t0: 800, t1: 970, tone: "note" },
  { text: "Plume boundary, illustrative", ax: 0, ay: EXIT_Y + 36, dx: -40, dy: 28, side: "mid", t0: 860, t1: 980, tone: "path" },
  { text: "Methane feed", ax: -860, ay: 220, dx: -8, dy: -32, side: "left", t0: 950, t1: 1019, tone: "path" },
  { text: "Oxygen feed", ax: 900, ay: 206, dx: 8, dy: -32, side: "right", t0: 950, t1: 1019, tone: "path" },
  { text: "Fuel turbopump", ax: fuelPump.x, ay: fuelPump.y, dx: -138, dy: -20, side: "left", t0: 950, t1: 1019, tone: "note" },
  { text: "Oxidizer turbopump", ax: oxPump.x, ay: oxPump.y, dx: 20, dy: -24, side: "right", t0: 950, t1: 1019, tone: "note" },
  { text: "Fuel-rich preburner", ax: fuelPB.x + 20, ay: fuelPB.y + 20, dx: -16, dy: 46, side: "left", t0: 950, t1: 1019, tone: "path" },
  { text: "Ox-rich preburner", ax: oxPB.x + oxPB.w - 8, ay: oxPB.y + oxPB.h, dx: 6, dy: 4, side: "right", t0: 950, t1: 1019, tone: "path" },
  { text: "Main chamber", ax: 0, ay: 840, dx: -150, dy: 10, side: "left", t0: 950, t1: 1019, tone: "note" },
  { text: "Throat and bell", ax: 40, ay: 1120, dx: 80, dy: 10, side: "right", t0: 950, t1: 1019, tone: "note" },
];

function strokeLine(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x, pts[i].y);
}

function metalTube(ctx: CanvasRenderingContext2D, pts: Pt[], radius: number) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#151c28";
  ctx.lineWidth = radius * 2.35;
  strokeLine(ctx, pts);
  ctx.stroke();
  ctx.strokeStyle = METAL;
  ctx.lineWidth = radius * 2;
  strokeLine(ctx, pts);
  ctx.stroke();
  ctx.strokeStyle = METAL_HI;
  ctx.lineWidth = Math.max(1, radius * 0.28);
  ctx.translate(-radius * 0.22, -radius * 0.22);
  strokeLine(ctx, pts);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = BORE;
  ctx.lineWidth = radius * 0.95;
  strokeLine(ctx, pts);
  ctx.stroke();
  ctx.restore();
}

function pathway(ctx: CanvasRenderingContext2D, pts: Pt[], frame: number, alpha: number, width: number) {
  if (alpha <= 0.02) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
  ctx.lineWidth = width;
  ctx.setLineDash([14, 10]);
  ctx.lineDashOffset = -frame * 0.85;
  strokeLine(ctx, pts);
  ctx.stroke();
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wallPath(ctx: CanvasRenderingContext2D, side: number) {
  const step = 4;
  ctx.beginPath();
  ctx.moveTo(side * outerHalf(CHAMBER_TOP), CHAMBER_TOP);
  for (let y = CHAMBER_TOP + step; y <= EXIT_Y; y += step) ctx.lineTo(side * outerHalf(y), y);
  for (let y = EXIT_Y; y >= CHAMBER_TOP; y -= step) ctx.lineTo(side * innerHalf(y), y);
  ctx.closePath();
}

function gasPath(ctx: CanvasRenderingContext2D, y0: number, y1: number) {
  const step = 4;
  ctx.beginPath();
  ctx.moveTo(-innerHalf(y0), y0);
  for (let y = y0; y <= y1; y += step) ctx.lineTo(-innerHalf(Math.min(y, EXIT_Y)), Math.min(y, EXIT_Y));
  for (let y = y1; y >= y0; y -= step) ctx.lineTo(innerHalf(Math.min(y, EXIT_Y)), Math.min(y, EXIT_Y));
  ctx.closePath();
}

function drawSpool(
  ctx: CanvasRenderingContext2D,
  pump: { x: number; y: number; r: number },
  turb: { x: number; y: number; r: number },
  emphasis: number,
) {
  const y0 = pump.y + pump.r - 6;
  const y1 = turb.y - turb.r + 6;
  ctx.fillStyle = METAL_LO;
  ctx.fillRect(pump.x - 8, y0, 16, y1 - y0);
  ctx.fillStyle = METAL_HI;
  ctx.fillRect(pump.x - 2, y0, 3, y1 - y0);

  for (const part of [pump, turb]) {
    const g = ctx.createRadialGradient(part.x - part.r * 0.35, part.y - part.r * 0.4, part.r * 0.2, part.x, part.y, part.r);
    g.addColorStop(0, "#5c6e88");
    g.addColorStop(0.55, METAL);
    g.addColorStop(1, "#283448");
    ctx.beginPath();
    ctx.arc(part.x, part.y, part.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = emphasis > 0.2 ? `rgba(0, 229, 255, ${0.35 + emphasis * 0.45})` : METAL_HI;
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(pump.x, pump.y);
  ctx.rotate(0.35);
  ctx.fillStyle = "#243246";
  for (let i = 0; i < 6; i += 1) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(pump.r * 0.2, 0);
    ctx.quadraticCurveTo(pump.r * 0.48, pump.r * 0.16, pump.r * 0.72, pump.r * 0.03);
    ctx.quadraticCurveTo(pump.r * 0.5, -0.04 * pump.r, pump.r * 0.2, 0);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, pump.r * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = BORE;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(turb.x, turb.y);
  ctx.rotate(0.2);
  ctx.strokeStyle = "#243246";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, turb.r * 0.58, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * turb.r * 0.42, Math.sin(a) * turb.r * 0.42);
    ctx.lineTo(Math.cos(a + 0.18) * turb.r * 0.82, Math.sin(a + 0.18) * turb.r * 0.82);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCan(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, hot: number) {
  roundRect(ctx, x, y, w, h, 12);
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, "#46556d");
  g.addColorStop(1, "#2a3648");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = METAL_HI;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.save();
  roundRect(ctx, x + 8, y + 8, w - 16, h - 16, 8);
  ctx.clip();
  ctx.fillStyle = `rgba(232, 140, 70, ${0.08 + hot * 0.22})`;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
  ctx.fillStyle = "#1a2332";
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(x + 18, y + 18 + i * 12, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawChannels(ctx: CanvasRenderingContext2D, frame: number, alpha: number) {
  if (alpha <= 0.02) return;
  ctx.save();
  wallPath(ctx, 1);
  wallPath(ctx, -1);
  ctx.clip();
  const step = 18;
  const shift = (frame * 0.35) % step;
  for (let y = CHAMBER_TOP + 8; y < EXIT_Y - 8; y += step) {
    for (const side of [-1, 1]) {
      const mid = side * (innerHalf(y) + outerHalf(y)) * 0.5;
      ctx.fillStyle = `rgba(14, 20, 30, ${0.55 + alpha * 0.35})`;
      ctx.fillRect(mid - side * 4 - 5, y, 10, 8);
      const cy = y + shift;
      if (cy > CHAMBER_TOP && cy < EXIT_Y) {
        const mx = side * (innerHalf(cy) + outerHalf(cy)) * 0.5;
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.25 + alpha * 0.55})`;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(mx - 3, cy + 4);
        ctx.lineTo(mx, cy);
        ctx.lineTo(mx + 3, cy + 4);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

function coreLine(): Pt[] {
  const pts: Pt[] = [];
  for (let y = 734; y <= EXIT_Y; y += 16) pts.push({ x: 0, y });
  return pts;
}

function project(x: number, y: number, cam: Camera, w: number, h: number) {
  const scale = (h / VIEW_H) * cam.zoom;
  return { x: w / 2 + (x - cam.cx) * scale, y: h / 2 + (y - cam.cy) * scale, s: scale };
}

function drawLabels(ctx: CanvasRenderingContext2D, frame: number, cam: Camera, w: number, h: number) {
  const groups: Record<
    Label["side"],
    Array<{ x: number; y: number; homeY: number; w: number; h: number; label: Label; a: number }>
  > = {
    left: [],
    right: [],
    mid: [],
  };
  ctx.save();
  ctx.font = "12px JetBrains Mono, ui-monospace, monospace";
  for (const label of LABELS) {
    const a = windowFade(frame, label.t0, label.t1, 10);
    if (a <= 0.04) continue;
    const p = project(label.ax, label.ay, cam, w, h);
    if (w < 760 && label.text.length > 22) continue;
    if (p.x < -80 || p.x > w + 80 || p.y < -80 || p.y > h + 80) continue;
    const width = ctx.measureText(label.text).width + 16;
    const height = 22;
    let x = p.x + label.dx;
    const y = p.y + label.dy;
    if (label.side === "left") x = Math.min(x, p.x - 8) - width;
    if (label.side === "right") x = Math.max(x, p.x + 8);
    groups[label.side].push({ x, y, homeY: y, w: width, h: height, label, a });
  }
  for (const side of ["left", "right", "mid"] as const) {
    const items = groups[side].sort((a, b) => a.y - b.y);
    for (let i = 1; i < items.length; i += 1) {
      const prev = items[i - 1];
      const cur = items[i];
      const overlapX = cur.x < prev.x + prev.w + 8 && prev.x < cur.x + cur.w + 8;
      const next = prev.y + prev.h + 4;
      if (overlapX && cur.y < next && next - cur.homeY < 64) cur.y = next;
    }
    for (const item of items) {
      item.x = Math.max(8, Math.min(w - item.w - 8, item.x));
      item.y = Math.max(8, Math.min(h - item.h - 8, item.y));
      const anchor = project(item.label.ax, item.label.ay, cam, w, h);
      const tone = item.label.tone === "path" ? CYAN : item.label.tone === "energy" ? GOLD : item.label.tone === "sense" ? VIOLET : BONE;
      ctx.globalAlpha = item.a;
      ctx.strokeStyle = tone;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(anchor.x, anchor.y);
      const endX = item.label.side === "left" ? item.x + item.w : item.x;
      ctx.lineTo(endX, item.y + item.h / 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(11, 16, 25, 0.88)";
      roundRect(ctx, item.x, item.y, item.w, item.h, 6);
      ctx.fill();
      ctx.strokeStyle = tone;
      ctx.stroke();
      ctx.fillStyle = tone;
      ctx.fillText(item.label.text, item.x + 8, item.y + 15);
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
}

function drawChannelInset(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number) {
  if (alpha <= 0.04) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  const x = 16;
  const y = h - 168;
  const bw = Math.min(280, w * 0.42);
  const bh = 148;
  ctx.fillStyle = "rgba(11, 16, 25, 0.92)";
  roundRect(ctx, x, y, bw, bh, 10);
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.stroke();
  ctx.font = "10px JetBrains Mono, ui-monospace, monospace";
  ctx.fillStyle = GOLD;
  ctx.fillText("SCALE CHANGE", x + 10, y + 16);
  ctx.fillStyle = BONE;
  ctx.font = "12px Space Grotesk, sans-serif";
  ctx.fillText("Wall channels, enlarged", x + 10, y + 34);
  const gx = x + 16;
  const gy = y + 48;
  ctx.fillStyle = "rgba(232, 140, 70, 0.35)";
  ctx.fillRect(gx, gy, 36, 64);
  ctx.fillStyle = "#8d6a45";
  ctx.fillRect(gx + 36, gy, 10, 64);
  ctx.fillStyle = "#16343a";
  ctx.fillRect(gx + 46, gy, 28, 64);
  ctx.fillStyle = METAL;
  ctx.fillRect(gx + 74, gy, 22, 64);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(gx + 18, gy + 32);
  ctx.lineTo(gx + 58, gy + 32);
  ctx.stroke();
  ctx.font = "10px JetBrains Mono, ui-monospace, monospace";
  ctx.fillStyle = "#9AA4B5";
  ctx.fillText("Hot gas", gx + 108, gy + 16);
  ctx.fillText("Liner, alloy unnamed", gx + 108, gy + 32);
  ctx.fillText("Methane channel", gx + 108, gy + 48);
  ctx.fillText("Outer jacket", gx + 108, gy + 64);
  ctx.fillText("Height exaggerated. Steady heat path.", x + 10, y + bh - 12);
  ctx.restore();
}

function drawMachInset(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number) {
  if (alpha <= 0.04) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  const bw = Math.min(320, w - 32);
  const bh = 92;
  const x = 16;
  const y = h - bh - 16;
  ctx.fillStyle = "rgba(11, 16, 25, 0.92)";
  roundRect(ctx, x, y, bw, bh, 10);
  ctx.fill();
  ctx.strokeStyle = CYAN;
  ctx.stroke();
  ctx.font = "10px JetBrains Mono, ui-monospace, monospace";
  ctx.fillStyle = CYAN;
  ctx.fillText("SCHEMATIC  ·  DE LAVAL REGIMES", x + 10, y + 16);
  ctx.fillStyle = BONE;
  ctx.font = "12px Space Grotesk, sans-serif";
  ctx.fillText("Subsonic", x + 12, y + 42);
  ctx.fillText("Sonic throat", x + 110, y + 42);
  ctx.fillText("Supersonic", x + 220, y + 42);
  ctx.strokeStyle = "rgba(0, 229, 255, 0.8)";
  ctx.beginPath();
  ctx.moveTo(x + 16, y + 68);
  ctx.lineTo(x + 100, y + 68);
  ctx.lineTo(x + 150, y + 58);
  ctx.lineTo(x + bw - 16, y + 74);
  ctx.stroke();
  ctx.fillStyle = "#9AA4B5";
  ctx.font = "10px JetBrains Mono, ui-monospace, monospace";
  ctx.fillText("No Mach number. Contour is a teaching shape.", x + 12, y + 86);
  ctx.restore();
}

function drawHardware(ctx: CanvasRenderingContext2D, frame: number) {
  const feedA = Math.max(windowFade(frame, 0, 180), windowFade(frame, 940, 1019) * 0.85);
  const preA = Math.max(windowFade(frame, 140, 340), windowFade(frame, 940, 1019) * 0.7);
  const turbA = Math.max(windowFade(frame, 280, 540), windowFade(frame, 940, 1019) * 0.7);
  const burn = windowFade(frame, 500, 1019, 24);
  const cool = windowFade(frame, 530, 1019, 20);
  const nozzle = windowFade(frame, 740, 1019, 18);

  ctx.save();
  ctx.strokeStyle = "rgba(230, 232, 238, 0.16)";
  ctx.setLineDash([2, 8]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.lineTo(0, EXIT_Y + 80);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  metalTube(ctx, LINES.ch4Inlet, 12);
  metalTube(ctx, LINES.o2Inlet, 14);
  metalTube(ctx, LINES.ch4Downcomer, 8);
  metalTube(ctx, LINES.ch4Return, 8);
  metalTube(ctx, LINES.o2Main, 12);
  metalTube(ctx, LINES.smallO2, 4.5);
  metalTube(ctx, LINES.smallCH4, 4.5);
  metalTube(ctx, LINES.fuelGas, 9);
  metalTube(ctx, LINES.oxGas, 9);
  metalTube(ctx, LINES.fuelDischarge, 9);
  metalTube(ctx, LINES.oxDischarge, 9);

  ctx.fillStyle = METAL;
  wallPath(ctx, -1);
  ctx.fill();
  wallPath(ctx, 1);
  ctx.fill();
  ctx.save();
  wallPath(ctx, 1);
  ctx.clip();
  ctx.strokeStyle = "rgba(197, 206, 220, 0.18)";
  ctx.lineWidth = 1;
  for (let i = -40; i < 80; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, CHAMBER_TOP + i * 8);
    ctx.lineTo(260, CHAMBER_TOP + 180 + i * 8);
    ctx.stroke();
  }
  ctx.restore();

  gasPath(ctx, CHAMBER_TOP, EXIT_Y);
  ctx.fillStyle = "#0c121c";
  ctx.fill();

  ctx.save();
  gasPath(ctx, CHAMBER_TOP, THROAT_Y);
  ctx.clip();
  const g = ctx.createLinearGradient(0, CHAMBER_TOP, 0, THROAT_Y);
  g.addColorStop(0, `rgba(255, 186, 110, ${0.05 * burn})`);
  g.addColorStop(0.45, `rgba(226, 112, 58, ${0.32 * burn})`);
  g.addColorStop(1, `rgba(160, 64, 36, ${0.12 * burn})`);
  ctx.fillStyle = g;
  ctx.fillRect(-BARREL_R, CHAMBER_TOP, BARREL_R * 2, THROAT_Y - CHAMBER_TOP);
  ctx.restore();

  ctx.save();
  gasPath(ctx, THROAT_Y, EXIT_Y);
  ctx.clip();
  const n = ctx.createLinearGradient(0, THROAT_Y, 0, EXIT_Y);
  n.addColorStop(0, `rgba(226, 130, 70, ${0.2 * Math.max(burn, nozzle)})`);
  n.addColorStop(1, `rgba(226, 130, 70, ${0.02 * nozzle})`);
  ctx.fillStyle = n;
  ctx.fillRect(-EXIT_R - 10, THROAT_Y, (EXIT_R + 10) * 2, EXIT_Y - THROAT_Y);
  ctx.restore();

  drawChannels(ctx, frame, Math.max(cool, windowFade(frame, 940, 1019) * 0.55));

  ctx.beginPath();
  ctx.ellipse(0, CHAMBER_TOP - 8, BARREL_R + 10, 28, 0, Math.PI, 0);
  ctx.lineTo(BARREL_R + WALL, CHAMBER_TOP);
  ctx.lineTo(-(BARREL_R + WALL), CHAMBER_TOP);
  ctx.closePath();
  ctx.fillStyle = "#3c4c62";
  ctx.fill();
  ctx.strokeStyle = METAL_HI;
  ctx.stroke();

  ctx.fillStyle = "#121820";
  for (let i = -3; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.arc(i * 16, 726, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  if (nozzle > 0.02) {
    const re = innerHalf(EXIT_Y);
    ctx.beginPath();
    ctx.moveTo(-re, EXIT_Y);
    ctx.lineTo(-re * 1.28, EXIT_Y + 78);
    ctx.lineTo(re * 1.28, EXIT_Y + 78);
    ctx.lineTo(re, EXIT_Y);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 170, 90, ${0.06 * nozzle})`;
    ctx.fill();
    ctx.save();
    ctx.strokeStyle = `rgba(0, 229, 255, ${0.45 * nozzle})`;
    ctx.setLineDash([5, 7]);
    ctx.stroke();
    ctx.restore();
  }

  drawSpool(ctx, fuelPump, fuelTurb, Math.max(feedA, turbA));
  drawSpool(ctx, oxPump, oxTurb, Math.max(feedA, turbA));
  drawCan(ctx, fuelPB.x, fuelPB.y, fuelPB.w, fuelPB.h, preA);
  drawCan(ctx, oxPB.x, oxPB.y, oxPB.w, oxPB.h, preA);

  const pathBase = 0.18;
  pathway(ctx, LINES.ch4Inlet, frame, pathBase + feedA * 0.75, 2.2);
  pathway(ctx, LINES.o2Inlet, frame, pathBase + feedA * 0.75, 2.4);
  pathway(ctx, LINES.ch4Downcomer, frame, pathBase + cool * 0.7, 2);
  pathway(ctx, LINES.ch4Return, frame, pathBase + Math.max(preA, cool) * 0.75, 2);
  pathway(ctx, LINES.o2Main, frame, pathBase + preA * 0.8, 2.4);
  pathway(ctx, LINES.smallO2, frame, pathBase * 0.6 + preA * 0.85, 1.6);
  pathway(ctx, LINES.smallCH4, frame, pathBase * 0.6 + preA * 0.85, 1.6);
  pathway(ctx, LINES.fuelGas, frame, pathBase + turbA * 0.8, 2);
  pathway(ctx, LINES.oxGas, frame, pathBase + turbA * 0.8, 2);
  pathway(ctx, LINES.fuelDischarge, frame, pathBase + windowFade(frame, 320, 1019, 16) * 0.8, 2.2);
  pathway(ctx, LINES.oxDischarge, frame, pathBase + windowFade(frame, 320, 1019, 16) * 0.8, 2.2);
  pathway(ctx, coreLine(), frame, 0.12 + Math.max(burn, nozzle) * 0.55, 2);

  const work = Math.max(windowFade(frame, 310, 540, 16), windowFade(frame, 950, 1019) * 0.75);
  if (work > 0.02) {
    for (const spool of [fuelPump, oxPump]) {
      const turb = spool === fuelPump ? fuelTurb : oxTurb;
      ctx.save();
      ctx.strokeStyle = `rgba(255, 209, 102, ${0.35 + work * 0.6})`;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(spool.x + 28, turb.y - turb.r);
      ctx.quadraticCurveTo(spool.x + 62, (spool.y + turb.y) / 2, spool.x + 28, spool.y + spool.r);
      ctx.stroke();
      ctx.restore();
    }
  }

  const sense = Math.max(windowFade(frame, 470, 760, 12), windowFade(frame, 960, 1019) * 0.8);
  if (sense > 0.02) {
    const taps = [
      { x: outerHalf(800) + 8, y: 800 },
      { x: 120, y: 680 },
    ];
    for (const tap of taps) {
      ctx.beginPath();
      ctx.arc(tap.x, tap.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(157, 78, 221, ${0.85 * sense})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(157, 78, 221, ${sense})`;
      ctx.strokeRect(tap.x + 6, tap.y - 6, 14, 12);
    }
  }

  const valve = windowFade(frame, 160, 340, 10);
  if (valve > 0.02) {
    for (const p of [
      { x: -80, y: 96 },
      { x: 120, y: 140 },
    ]) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.strokeStyle = `rgba(157, 78, 221, ${valve})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-7, -5);
      ctx.lineTo(7, 5);
      ctx.lineTo(-7, 5);
      ctx.lineTo(7, -5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }
}

export function renderPlate(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  mode: RenderMode,
) {
  const cam = mode === "poster" ? cameraAt(1000) : cameraAt(frame);
  if (w < 760) cam.zoom *= 0.62;
  const drawFrame = mode === "poster" ? 1000 : frame;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += 44) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  const scale = (h / VIEW_H) * cam.zoom;
  ctx.translate(w / 2, h / 2);
  ctx.scale(scale, scale);
  ctx.translate(-cam.cx, -cam.cy);
  drawHardware(ctx, drawFrame);
  ctx.restore();

  const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.72);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);

  if (mode === "player") {
    drawLabels(ctx, drawFrame, cam, w, h);
    drawChannelInset(ctx, w, h, windowFade(drawFrame, 580, 735, 12));
    drawMachInset(ctx, w, h, windowFade(drawFrame, 800, 955, 12));
  } else {
    ctx.fillStyle = BONE;
    ctx.font = "600 42px Space Grotesk, sans-serif";
    ctx.fillText("Full-flow staged combustion", 48, 78);
    ctx.font = "18px Space Grotesk, sans-serif";
    ctx.fillStyle = "#C5C6C7";
    ctx.fillText("A sectional model of the path from the pumps to the nozzle.", 48, 112);
    ctx.font = "14px JetBrains Mono, ui-monospace, monospace";
    ctx.fillStyle = CYAN;
    ctx.fillText("34 seconds  ·  1,020 frames  ·  no pressure, speed, or mixture ratio asserted", 48, 142);
  }
}

export const PLATE_COLORS = { BG, METAL, CYAN, GOLD, VIOLET, BONE };
