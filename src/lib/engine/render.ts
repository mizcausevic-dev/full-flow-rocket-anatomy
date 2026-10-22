import { cameraAt, project, type Camera } from "./camera";
import {
  buildPaths,
  CX,
  FR_PRE,
  FU_TURB,
  innerRadius,
  LEFT,
  OR_PRE,
  outerRadius,
  OX_TURB,
  pointAlong,
  polyLength,
  PUMP_R,
  RIGHT,
  shellExtra,
  Y,
  type Pt,
} from "./geometry";
import { LABELS, toneColor, type Tone } from "./labels";
import { LAST_FRAME, motionFrame, segmentAt, SEGMENTS } from "./timeline";

const COL = {
  stage: "#0B1019",
  metalHi: "#4a5d78",
  metal: "#344257",
  metalLo: "#232c3c",
  cut: "#121820",
  ink: "#E7EEF6",
  muted: "#9AA8BA",
  cyan: "#00E5FF",
  gold: "#FFD166",
  violet: "#9D4EDD",
  lox: "#8EA4B5",
  fuel: "#C4B59A",
  hotOx: "#8C5648",
  hotFu: "#A07A4E",
  core: "#6A3C36",
};

const PATHS = buildPaths();

type Ctx = CanvasRenderingContext2D;

export function renderFrame(
  ctx: Ctx,
  frame: number,
  cssW: number,
  cssH: number,
  dpr: number,
): void {
  const cam = cameraAt(frame);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  ctx.fillStyle = COL.stage;
  ctx.fillRect(0, 0, cssW, cssH);

  ctx.save();
  applyWorld(ctx, cam, cssW, cssH);
  const scale = cssW / cam.w;
  drawGrid(ctx, cam, cssW, cssH, scale);
  drawShafts(ctx, frame, scale);
  drawPlumbing(ctx, scale);
  drawChamber(ctx, scale);
  drawInjector(ctx);
  drawPump(ctx, LEFT, Y.pump, "ox");
  drawPump(ctx, RIGHT, Y.pump, "fuel");
  drawPumpInset(ctx, frame);
  drawPreburner(ctx, OR_PRE, "ox");
  drawPreburner(ctx, FR_PRE, "fuel");
  drawTurbine(ctx, OX_TURB, "ox");
  drawTurbine(ctx, FU_TURB, "fuel");
  drawCombustion(ctx, frame, scale);
  drawChannels(ctx);
  drawOverlays(ctx, frame, scale);
  drawHeat(ctx, frame, scale);
  drawStateDots(ctx, scale);
  ctx.restore();

  drawVignette(ctx, cssW, cssH);
  drawMinimap(ctx, cam, cssW, cssH, frame);
  drawLabels(ctx, frame, cam, cssW, cssH);
  drawMath(ctx, frame, cssW);
  drawBreadcrumb(ctx, frame, cssW);
  drawLowerThird(ctx, frame, cssW, cssH);
}

function applyWorld(ctx: Ctx, cam: Camera, cssW: number, cssH: number): void {
  const scale = cssW / cam.w;
  const viewH = cssH / scale;
  const left = cam.x - cam.w / 2;
  const top = cam.y - viewH / 2;
  ctx.transform(scale, 0, 0, scale, -left * scale, -top * scale);
}

function drawGrid(ctx: Ctx, cam: Camera, cssW: number, cssH: number, scale: number): void {
  const viewH = cssH / scale;
  const left = cam.x - cam.w / 2;
  const top = cam.y - viewH / 2;
  const right = left + cam.w;
  const bottom = top + viewH;
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = "rgba(52, 66, 87, 0.38)";
  ctx.lineWidth = 1 / scale;
  const step = 48;
  const x0 = Math.floor(left / step) * step;
  const y0 = Math.floor(top / step) * step;
  for (let x = x0; x <= right; x += step) {
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
  }
  for (let y = y0; y <= bottom; y += step) {
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
  }
  ctx.stroke();
  ctx.restore();
}

function strokePts(ctx: Ctx, pts: Pt[], width: number, color: string, alpha = 1): void {
  if (pts.length < 2 || width <= 0.4) return;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.restore();
}

function conduit(ctx: Ctx, pts: Pt[], outer: number, fluid: string): void {
  strokePts(ctx, pts, outer, "#1a2230");
  strokePts(ctx, pts, Math.max(1, outer - 6), COL.metal);
  strokePts(ctx, pts, Math.max(1, outer - 12), fluid);
}

function chevrons(
  ctx: Ctx,
  pts: Pt[],
  frame: number,
  speed: number,
  phase: number,
  scale: number,
  alpha: number,
  color = COL.cyan,
): void {
  const length = polyLength(pts);
  if (length < 8) return;
  const spacing = Math.max(36, Math.min(140, 48 / Math.max(scale, 0.12)));
  const size = Math.max(5, 10 / Math.max(scale, 0.2));
  const travel = motionFrame(frame) * speed + phase;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let d = ((travel % spacing) + spacing) % spacing; d < length; d += spacing) {
    const p = pointAlong(pts, d);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.ang);
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.65, size * 0.48);
    ctx.lineTo(-size * 0.28, 0);
    ctx.lineTo(-size * 0.65, -size * 0.48);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function pathway(ctx: Ctx, pts: Pt[], frame: number, scale: number, speed: number, phase: number, alpha = 0.95): void {
  strokePts(ctx, pts, Math.max(1.2, 2.4 / scale), COL.cyan, alpha * 0.9);
  chevrons(ctx, pts, frame, speed, phase, scale, alpha);
}

function drawShafts(ctx: Ctx, frame: number, scale: number): void {
  for (const x of [LEFT, RIGHT]) {
    ctx.save();
    ctx.strokeStyle = "#8b95a4";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, Y.pump);
    ctx.lineTo(x, Y.turb);
    ctx.stroke();
    ctx.strokeStyle = COL.gold;
    ctx.lineWidth = Math.max(1.4, 2.2 / scale);
    ctx.setLineDash([12, 9]);
    ctx.lineDashOffset = -motionFrame(frame) * 0.55;
    ctx.stroke();
    ctx.setLineDash([]);
    arrow(ctx, x, Y.pump + PUMP_R + 18, "up", COL.gold, scale);
    ctx.restore();
  }
}

function arrow(ctx: Ctx, x: number, y: number, dir: "up" | "down" | "right" | "left", color: string, scale: number): void {
  const s = 9 / Math.max(scale, 0.25);
  ctx.beginPath();
  if (dir === "up") {
    ctx.moveTo(x, y - s);
    ctx.lineTo(x - s * 0.72, y + s * 0.45);
    ctx.lineTo(x + s * 0.72, y + s * 0.45);
  } else if (dir === "down") {
    ctx.moveTo(x, y + s);
    ctx.lineTo(x - s * 0.72, y - s * 0.45);
    ctx.lineTo(x + s * 0.72, y - s * 0.45);
  } else if (dir === "right") {
    ctx.moveTo(x + s, y);
    ctx.lineTo(x - s * 0.45, y - s * 0.72);
    ctx.lineTo(x - s * 0.45, y + s * 0.72);
  } else {
    ctx.moveTo(x - s, y);
    ctx.lineTo(x + s * 0.45, y - s * 0.72);
    ctx.lineTo(x + s * 0.45, y + s * 0.72);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawPlumbing(ctx: Ctx, scale: number): void {
  conduit(ctx, PATHS.loxInlet, 22, COL.lox);
  conduit(ctx, PATHS.fuelInlet, 22, COL.fuel);
  conduit(ctx, PATHS.oxFeed, 20, COL.lox);
  conduit(ctx, PATHS.downcomer, 18, COL.fuel);
  conduit(ctx, PATHS.jacketReturn, 18, COL.fuel);
  conduit(ctx, PATHS.oxTap, 9, COL.lox);
  conduit(ctx, PATHS.fuelTap, 9, COL.fuel);
  conduit(ctx, PATHS.orToTurbine, 18, COL.hotOx);
  conduit(ctx, PATHS.frToTurbine, 18, COL.hotFu);
  conduit(ctx, PATHS.oxExhaust, 26, COL.hotOx);
  conduit(ctx, PATHS.fuelExhaust, 26, COL.hotFu);

  for (const [x, y] of [
    [LEFT, 78],
    [RIGHT, 78],
  ] as const) {
    roundRect(ctx, x - 46, y - 22, 92, 36, 8);
    ctx.fillStyle = COL.metal;
    ctx.fill();
    ctx.lineWidth = 1 / Math.max(scale, 0.2);
    ctx.strokeStyle = COL.metalHi;
    ctx.stroke();
  }
}

function drawChamber(ctx: Ctx, scale: number): void {
  const top = Y.chTop;
  const bot = Y.exit;
  ctx.beginPath();
  traceSide(ctx, top, bot, -1, outerRadius);
  traceSide(ctx, bot, top, 1, outerRadius, true);
  ctx.closePath();
  const grad = ctx.createLinearGradient(CX - 200, top, CX + 240, bot);
  grad.addColorStop(0, COL.metalHi);
  grad.addColorStop(0.45, COL.metal);
  grad.addColorStop(1, COL.metalLo);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 1.2 / Math.max(scale, 0.2);
  ctx.strokeStyle = "#1b2330";
  ctx.stroke();

  ctx.beginPath();
  traceSide(ctx, top, bot, -1, innerRadius);
  traceSide(ctx, bot, top, 1, innerRadius, true);
  ctx.closePath();
  ctx.fillStyle = "#140e12";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(CX - outerRadius(bot) - 8, bot);
  ctx.lineTo(CX - innerRadius(bot) + 4, bot);
  ctx.lineTo(CX - innerRadius(bot) + 4, bot + 10);
  ctx.lineTo(CX + innerRadius(bot) - 4, bot + 10);
  ctx.lineTo(CX + innerRadius(bot) - 4, bot);
  ctx.lineTo(CX + outerRadius(bot) + 8, bot);
  ctx.lineTo(CX + outerRadius(bot) + 8, bot + 16);
  ctx.lineTo(CX - outerRadius(bot) - 8, bot + 16);
  ctx.closePath();
  ctx.fillStyle = COL.metalLo;
  ctx.fill();
}

function traceSide(
  ctx: Ctx,
  y0: number,
  y1: number,
  side: 1 | -1,
  radius: (y: number) => number,
  continuing = false,
): void {
  const step = y1 >= y0 ? 5 : -5;
  const start = continuing ? y0 + step : y0;
  if (!continuing) ctx.moveTo(CX + side * radius(y0), y0);
  if ((step > 0 && start > y1) || (step < 0 && start < y1)) return;
  for (let y = start; step > 0 ? y <= y1 : y >= y1; y += step) {
    ctx.lineTo(CX + side * radius(y), y);
  }
  ctx.lineTo(CX + side * radius(y1), y1);
}

function drawInjector(ctx: Ctx): void {
  roundRect(ctx, CX - 150, Y.inj - 28, 300, Y.chTop - Y.inj + 28, 16);
  ctx.fillStyle = COL.metal;
  ctx.fill();
  ctx.strokeStyle = "#1c2430";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#1a120f";
  roundRect(ctx, CX - 108, Y.inj - 8, 70, 28, 6);
  ctx.fill();
  roundRect(ctx, CX + 38, Y.inj - 8, 70, 28, 6);
  ctx.fill();
}

function drawPump(ctx: Ctx, x: number, y: number, side: "ox" | "fuel"): void {
  const grad = ctx.createRadialGradient(x - 24, y - 28, 12, x, y, PUMP_R);
  grad.addColorStop(0, "#51627c");
  grad.addColorStop(0.5, COL.metal);
  grad.addColorStop(1, "#202838");
  ctx.beginPath();
  ctx.arc(x, y, PUMP_R, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, PUMP_R - 13, 0, Math.PI * 2);
  ctx.fillStyle = COL.cut;
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, PUMP_R - 16, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = "rgba(154,168,186,0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 58, y - 22);
  ctx.quadraticCurveTo(x - 30, y - 8, x - 18, y);
  ctx.moveTo(x - 58, y + 16);
  ctx.quadraticCurveTo(x - 28, y + 6, x - 18, y);
  ctx.moveTo(x + 18, y);
  ctx.quadraticCurveTo(x + 30, y - 10, x + 58, y - 20);
  ctx.moveTo(x + 18, y);
  ctx.quadraticCurveTo(x + 32, y + 8, x + 58, y + 18);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#8d97a6";
  ctx.fillRect(x - 5, y - 28, 10, 56);
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.fillStyle = side === "ox" ? COL.lox : COL.fuel;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = "#5c6572";
  ctx.fill();
}

function drawPumpInset(ctx: Ctx, frame: number): void {
  const alpha = windowAlpha(frame, 24, 160, 12);
  if (alpha <= 0) return;
  const cx = 500;
  const cy = 620;
  const r = 48;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#101820";
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = COL.metal;
  ctx.stroke();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(motionFrame(frame) * 0.05);
  ctx.fillStyle = "#b7c0ce";
  for (let i = 0; i < 7; i += 1) {
    ctx.rotate((Math.PI * 2) / 7);
    ctx.beginPath();
    ctx.moveTo(12, -3);
    ctx.quadraticCurveTo(28, -14, 36, -2);
    ctx.quadraticCurveTo(26, 2, 12, 3);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fillStyle = COL.lox;
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

function drawPreburner(
  ctx: Ctx,
  box: { x: number; y: number; w: number; h: number },
  side: "ox" | "fuel",
): void {
  const x = box.x - box.w / 2;
  const y = box.y - box.h / 2;
  roundRect(ctx, x, y, box.w, box.h, 20);
  const grad = ctx.createLinearGradient(x, y, x, y + box.h);
  grad.addColorStop(0, COL.metalHi);
  grad.addColorStop(1, COL.metalLo);
  ctx.fillStyle = grad;
  ctx.fill();
  roundRect(ctx, x + 12, y + 12, box.w - 24, box.h - 24, 12);
  ctx.fillStyle = COL.cut;
  ctx.fill();

  const bulk = side === "ox" ? COL.lox : COL.fuel;
  const tap = side === "ox" ? COL.fuel : COL.lox;
  roundRect(ctx, box.x - 16, y + 22, 46, box.h - 44, 8);
  ctx.fillStyle = bulk;
  ctx.globalAlpha = 0.85;
  ctx.fill();
  ctx.globalAlpha = 1;
  roundRect(ctx, box.x + 28, y + 40, 16, box.h - 80, 6);
  ctx.fillStyle = tap;
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawTurbine(
  ctx: Ctx,
  box: { x: number; y: number; w: number; h: number },
  side: "ox" | "fuel",
): void {
  const x = box.x - box.w / 2;
  const y = box.y - box.h / 2;
  roundRect(ctx, x, y, box.w, box.h, 16);
  ctx.fillStyle = COL.metal;
  ctx.fill();
  roundRect(ctx, x + 12, y + 12, box.w - 24, box.h - 24, 10);
  ctx.fillStyle = side === "ox" ? "#2a201c" : "#2a2418";
  ctx.fill();

  ctx.strokeStyle = "#d5dbe4";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  for (const row of [-16, 10]) {
    for (const sign of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(box.x + sign * 16, box.y + row);
      ctx.quadraticCurveTo(box.x + sign * 40, box.y + row - 8, box.x + sign * 62, box.y + row + 4);
      ctx.stroke();
    }
  }
  ctx.fillStyle = "#8d97a6";
  ctx.fillRect(box.x - 5, y + 8, 10, box.h - 16);
}

function drawCombustion(ctx: Ctx, frame: number, scale: number): void {
  ctx.save();
  ctx.beginPath();
  traceSide(ctx, Y.chTop, Y.throat + 30, -1, (y) => innerRadius(y) - 2);
  traceSide(ctx, Y.throat + 30, Y.chTop, 1, (y) => innerRadius(y) - 2, true);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = COL.hotOx;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(CX - 70, Y.chTop);
  ctx.lineTo(CX - 8, Y.chTop + 180);
  ctx.lineTo(CX - innerRadius(Y.chBot) + 8, Y.chBot);
  ctx.lineTo(CX - innerRadius(Y.chTop) + 6, Y.chTop);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COL.hotFu;
  ctx.beginPath();
  ctx.moveTo(CX + 70, Y.chTop);
  ctx.lineTo(CX + 8, Y.chTop + 180);
  ctx.lineTo(CX + innerRadius(Y.chBot) - 8, Y.chBot);
  ctx.lineTo(CX + innerRadius(Y.chTop) - 6, Y.chTop);
  ctx.closePath();
  ctx.fill();

  const mix = ctx.createLinearGradient(CX, Y.chTop + 40, CX, Y.chBot);
  mix.addColorStop(0, "rgba(106,60,54,0)");
  mix.addColorStop(0.35, "rgba(106,60,54,0.35)");
  mix.addColorStop(1, COL.core);
  ctx.globalAlpha = 1;
  ctx.fillStyle = mix;
  ctx.fillRect(CX - CHWidth(), Y.chTop, CHWidth() * 2, Y.chBot - Y.chTop);

  const showState = windowAlpha(frame, 520, 749, 12);
  if (showState > 0) {
    ctx.save();
    ctx.globalAlpha = showState;
    ctx.strokeStyle = COL.violet;
    ctx.lineWidth = Math.max(1.2, 1.6 / scale);
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(CX, Y.chTop + 24);
    ctx.lineTo(CX, Y.chBot - 20);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
  ctx.restore();

  const nozzleLesson = frame < 750 ? 0 : frame >= 950 ? 0.22 : 0.2 + 0.65 * windowAlpha(frame, 750, 940, 14);
  const streamAlpha = frame < 750 ? 0.16 : nozzleLesson;
  for (const frac of [-0.45, -0.18, 0.18, 0.45]) {
    const pts: Pt[] = [];
    for (let y = Y.throat - 10; y <= Y.exit - 16; y += 12) {
      pts.push({ x: CX + innerRadius(y) * frac, y });
    }
    pathway(ctx, pts, frame, scale, frame >= 510 && frame < 750 ? 0.85 : 2.1, frac * 40, streamAlpha);
  }
}

function CHWidth(): number {
  return innerRadius(Y.chTop);
}

function drawChannels(ctx: Ctx): void {
  ctx.save();
  for (let y = Y.chTop + 18; y < Y.jacketEnd - 8; y += 20) {
    const inner = innerRadius(y);
    const outer = outerRadius(y);
    const gapIn = inner + 7;
    const gapOut = outer - 8;
    const h = 9;
    if (gapOut - gapIn < 6) continue;
    ctx.fillStyle = "rgba(18, 24, 32, 0.92)";
    ctx.fillRect(CX + gapIn, y, gapOut - gapIn, h);
    ctx.fillRect(CX - gapOut, y, gapOut - gapIn, h);
  }
  ctx.restore();
}

function drawOverlays(ctx: Ctx, frame: number, scale: number): void {
  const cruise = 2.15;
  const slow = frame >= 510 && frame < 750 ? 0.72 : cruise;
  pathway(ctx, PATHS.loxInlet, frame, scale, cruise, 0);
  pathway(ctx, PATHS.fuelInlet, frame, scale, cruise, 20);
  pathway(ctx, PATHS.oxFeed, frame, scale, cruise, 10);
  pathway(ctx, PATHS.oxTap, frame, scale, cruise * 0.8, 30, 0.85);
  pathway(ctx, PATHS.fuelTap, frame, scale, cruise * 0.8, 12, 0.85);
  pathway(ctx, PATHS.downcomer, frame, scale, cruise, 8);
  pathway(ctx, PATHS.jacketUpRight, frame, scale, slow, 4, 0.9);
  pathway(ctx, PATHS.jacketUpLeft, frame, scale, slow, 18, 0.9);
  pathway(ctx, PATHS.jacketReturn, frame, scale, cruise, 6);
  pathway(ctx, PATHS.orToTurbine, frame, scale, cruise, 14);
  pathway(ctx, PATHS.frToTurbine, frame, scale, cruise, 22);
  pathway(ctx, PATHS.oxExhaust, frame, scale, frame >= 300 && frame < 510 ? 2.8 : cruise, 5);
  pathway(ctx, PATHS.fuelExhaust, frame, scale, frame >= 300 && frame < 510 ? 2.8 : cruise, 16);
}

function drawHeat(ctx: Ctx, frame: number, scale: number): void {
  const alpha = windowAlpha(frame, 560, 749, 14);
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  for (const y of [1660, 1760, 1860]) {
    const x0 = CX + innerRadius(y) - 16;
    const x1 = CX + innerRadius(y) + shellExtra(y) * 0.7;
    ctx.strokeStyle = COL.gold;
    ctx.lineWidth = Math.max(1.3, 1.8 / scale);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    arrow(ctx, x1, y, "right", COL.gold, scale);
  }
  ctx.restore();
}

function drawStateDots(ctx: Ctx, scale: number): void {
  const r = Math.max(3.5, 5 / Math.max(scale, 0.2));
  const spots: Pt[] = [
    { x: OR_PRE.x, y: OR_PRE.y },
    { x: FR_PRE.x, y: FR_PRE.y },
    { x: LEFT, y: Y.turb + 20 },
    { x: RIGHT, y: Y.turb + 20 },
    { x: CX, y: 1760 },
    { x: CX, y: Y.throat },
  ];
  ctx.save();
  for (const spot of spots) {
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, r, 0, Math.PI * 2);
    ctx.fillStyle = COL.violet;
    ctx.globalAlpha = 0.9;
    ctx.fill();
  }
  ctx.restore();
}

function drawVignette(ctx: Ctx, cssW: number, cssH: number): void {
  const g = ctx.createRadialGradient(cssW / 2, cssH / 2, cssW * 0.28, cssW / 2, cssH / 2, cssW * 0.72);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.32)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cssW, cssH);
}

function drawMinimap(ctx: Ctx, cam: Camera, cssW: number, cssH: number, frame: number): void {
  const diagramUp = frame >= 790 && frame <= 940;
  if (diagramUp || cam.w > 2600) return;
  const mw = cssW < 720 ? 52 : 68;
  const mh = cssW < 720 ? 150 : 200;
  const mx = 14;
  const my = 46;
  ctx.save();
  roundRect(ctx, mx, my, mw, mh, 8);
  ctx.fillStyle = "rgba(11,16,25,0.78)";
  ctx.fill();
  ctx.strokeStyle = "rgba(52,66,87,0.9)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const x0 = 220;
  const x1 = 1560;
  const y0 = 40;
  const y1 = 2620;
  const mapX = (x: number) => mx + 8 + ((x - x0) / (x1 - x0)) * (mw - 16);
  const mapY = (y: number) => my + 8 + ((y - y0) / (y1 - y0)) * (mh - 16);

  ctx.strokeStyle = COL.metalHi;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(mapX(LEFT), mapY(120));
  ctx.lineTo(mapX(LEFT), mapY(Y.turb));
  ctx.moveTo(mapX(RIGHT), mapY(120));
  ctx.lineTo(mapX(RIGHT), mapY(Y.turb));
  ctx.moveTo(mapX(CX - 40), mapY(Y.chTop));
  ctx.lineTo(mapX(CX - 90), mapY(Y.exit));
  ctx.moveTo(mapX(CX + 40), mapY(Y.chTop));
  ctx.lineTo(mapX(CX + 90), mapY(Y.exit));
  ctx.stroke();

  const scale = cssW / cam.w;
  const viewH = cssH / scale;
  const left = cam.x - cam.w / 2;
  const top = cam.y - viewH / 2;
  ctx.strokeStyle = COL.cyan;
  ctx.lineWidth = 1;
  ctx.strokeRect(mapX(left), mapY(top), mapX(left + cam.w) - mapX(left), mapY(top + viewH) - mapY(top));
  ctx.restore();
}

function drawLabels(ctx: Ctx, frame: number, cam: Camera, cssW: number, cssH: number): void {
  const display = fontFamily(ctx, "display");
  for (const label of LABELS) {
    if (label.minW !== undefined && cam.w < label.minW) continue;
    if (label.maxW !== undefined && cam.w > label.maxW) continue;
    const alpha = windowAlpha(frame, label.from, label.to, 8);
    if (alpha <= 0) continue;
    const { sx, sy } = project(cam, cssW, cssH, label.x, label.y);
    if (sx < -180 || sy < -120 || sx > cssW + 180 || sy > cssH + 120) continue;
    paintLabel(ctx, sx + label.dx, sy + label.dy, label.title, label.detail, label.tone, alpha, display, cssW, cssH);
  }
}

function paintLabel(
  ctx: Ctx,
  x: number,
  y: number,
  title: string,
  detail: string | undefined,
  tone: Tone,
  alpha: number,
  display: string,
  cssW: number,
  cssH: number,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `600 13px ${display}`;
  const titleW = ctx.measureText(title).width;
  ctx.font = `500 11px ${display}`;
  const detailW = detail ? ctx.measureText(detail).width : 0;
  const padX = 8;
  const width = Math.max(titleW, detailW) + padX * 2;
  const height = detail ? 36 : 22;
  let left = x - width / 2;
  let top = y - height / 2;
  const minLeft = cssW < 680 ? 8 : 90;
  left = Math.min(cssW - width - 10, Math.max(minLeft, left));
  top = Math.min(cssH - height - 64, Math.max(42, top));

  roundRect(ctx, left, top, width, height, 6);
  ctx.fillStyle = "rgba(11,16,25,0.88)";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = toneColor(tone);
  ctx.stroke();
  ctx.fillStyle = COL.ink;
  ctx.font = `600 13px ${display}`;
  ctx.fillText(title, left + padX, top + 15);
  if (detail) {
    ctx.fillStyle = COL.muted;
    ctx.font = `500 11px ${display}`;
    ctx.fillText(detail, left + padX, top + 29);
  }
  ctx.restore();
}

function drawMath(ctx: Ctx, frame: number, cssW: number): void {
  const fadeIn = windowAlpha(frame, 770, LAST_FRAME, 12);
  const fadeOut = frame <= 900 ? 1 : frame >= 948 ? 0 : 1 - (frame - 900) / 48;
  const alpha = fadeIn * fadeOut;
  if (alpha <= 0 || cssW < 520) return;
  const display = fontFamily(ctx, "display");
  const mono = fontFamily(ctx, "mono");
  const pw = Math.min(320, cssW * 0.34);
  const ph = 196;
  const x = 16;
  const y = 46;
  ctx.save();
  ctx.globalAlpha = alpha;
  roundRect(ctx, x, y, pw, ph, 10);
  ctx.fillStyle = "rgba(11,16,25,0.9)";
  ctx.fill();
  ctx.strokeStyle = "rgba(157,78,221,0.85)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = COL.violet;
  ctx.font = `600 10px ${mono}`;
  ctx.fillText("MATHEMATICAL DIAGRAM", x + 12, y + 18);
  ctx.fillStyle = COL.muted;
  ctx.font = `500 11px ${display}`;
  ctx.fillText("de Laval, pedagogical shape", x + 12, y + 34);

  const plotX = x + 36;
  const plotY = y + 48;
  const plotW = pw - 56;
  const plotH = 110;
  ctx.strokeStyle = "rgba(231,238,246,0.45)";
  ctx.beginPath();
  ctx.moveTo(plotX, plotY);
  ctx.lineTo(plotX, plotY + plotH);
  ctx.lineTo(plotX + plotW, plotY + plotH);
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= 48; i += 1) {
    const t = i / 48;
    const px = plotX + plotW * t;
    const py = plotY + plotH * (1 - velocityShape(t));
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = COL.cyan;
  ctx.lineWidth = 1.6;
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= 48; i += 1) {
    const t = i / 48;
    const px = plotX + plotW * t;
    const py = plotY + plotH * (1 - pressureShape(t));
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = COL.gold;
  ctx.stroke();

  const throatT = 0.35;
  ctx.strokeStyle = "rgba(157,78,221,0.7)";
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(plotX + plotW * throatT, plotY);
  ctx.lineTo(plotX + plotW * throatT, plotY + plotH);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = `500 10px ${mono}`;
  ctx.fillStyle = COL.muted;
  ctx.fillText("chamber", plotX, plotY + plotH + 14);
  ctx.fillText("throat", plotX + plotW * throatT - 16, plotY + plotH + 14);
  ctx.fillText("exit", plotX + plotW - 22, plotY + plotH + 14);
  ctx.fillStyle = COL.cyan;
  ctx.fillText("velocity", x + 12, y + ph - 12);
  ctx.fillStyle = COL.gold;
  ctx.fillText("pressure", x + 78, y + ph - 12);
  ctx.fillStyle = COL.muted;
  ctx.fillText("unscaled", x + 150, y + ph - 12);
  ctx.restore();
}

/** Hand-shaped curves. Not an isentropic integration. */
function velocityShape(t: number): number {
  if (t < 0.35) return 0.16 + 0.34 * (t / 0.35) ** 1.35;
  const u = (t - 0.35) / 0.65;
  return 0.5 + 0.4 * (1 - (1 - u) ** 1.55);
}

function pressureShape(t: number): number {
  if (t < 0.35) return 0.88 - 0.3 * (t / 0.35) ** 1.25;
  const u = (t - 0.35) / 0.65;
  return 0.58 - 0.4 * (1 - (1 - u) ** 1.15);
}

function drawBreadcrumb(ctx: Ctx, frame: number, cssW: number): void {
  if (cssW < 760) return;
  const display = fontFamily(ctx, "display");
  const current = segmentAt(frame);
  const gap = 8;
  ctx.save();
  ctx.font = `600 11px ${display}`;
  const shorts = ["Feeds", "Preburners", "Turbines", "Chamber", "Nozzle"];
  const widths = shorts.map((label) => ctx.measureText(label).width + 16);
  const total = widths.reduce((sum, width) => sum + width, 0) + gap * (SEGMENTS.length - 1);
  let x = Math.max(92, (cssW - total) / 2);
  const y = 14;
  SEGMENTS.forEach((segment, index) => {
    const label = shorts[index];
    const w = widths[index];
    const active = segment.id === current.id;
    const done = segment.to < frame;
    roundRect(ctx, x, y, w, 22, 11);
    ctx.fillStyle = active ? "rgba(0,229,255,0.16)" : "rgba(11,16,25,0.72)";
    ctx.fill();
    ctx.strokeStyle = active || done ? COL.cyan : "rgba(154,168,186,0.45)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = active || done ? COL.ink : COL.muted;
    ctx.fillText(label, x + 8, y + 15);
    x += w + gap;
  });
  ctx.restore();
}

function drawLowerThird(ctx: Ctx, frame: number, cssW: number, cssH: number): void {
  const display = fontFamily(ctx, "display");
  const mono = fontFamily(ctx, "mono");
  const segment = segmentAt(frame);
  ctx.save();
  const grad = ctx.createLinearGradient(0, cssH - 72, 0, cssH);
  grad.addColorStop(0, "rgba(11,16,25,0)");
  grad.addColorStop(0.35, "rgba(11,16,25,0.82)");
  grad.addColorStop(1, "rgba(11,16,25,0.94)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, cssH - 72, cssW, 72);
  ctx.fillStyle = COL.ink;
  ctx.font = `600 16px ${display}`;
  ctx.fillText(segment.title, 16, cssH - 36);
  ctx.fillStyle = COL.muted;
  ctx.font = `500 12px ${mono}`;
  const clock =
    cssW < 720
      ? `${formatClock(frame)}   ${frame} / ${LAST_FRAME}`
      : `${formatClock(frame)}   frame ${String(frame).padStart(4, "0")} / ${LAST_FRAME}   ${segment.clock}`;
  ctx.fillText(clock, 16, cssH - 16);
  ctx.restore();
}

function formatClock(frame: number): string {
  const seconds = frame / 30;
  const whole = Math.floor(seconds);
  const frac = Math.floor((seconds - whole) * 100);
  return `0:${String(whole).padStart(2, "0")}.${String(frac).padStart(2, "0")}`;
}

function windowAlpha(frame: number, from: number, to: number, fade: number): number {
  if (frame < from || frame > to) return 0;
  const inn = Math.min(1, (frame - from) / Math.max(1, fade));
  const out = to >= LAST_FRAME ? 1 : Math.min(1, (to - frame) / Math.max(1, fade));
  return Math.max(0, Math.min(inn, out));
}

function fontFamily(ctx: Ctx, kind: "display" | "mono"): string {
  const fromData = kind === "mono" ? ctx.canvas.dataset.mono : ctx.canvas.dataset.display;
  if (fromData && fromData.trim()) return fromData;
  return kind === "mono" ? "ui-monospace, monospace" : "sans-serif";
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
