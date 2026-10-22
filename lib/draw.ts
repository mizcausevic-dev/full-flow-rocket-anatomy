import { nozzleStreams } from "./flows";
import { flowById, type FlowId } from "./flows";
import { CL, contour, fu, innerRadius, nozzle, outerRadius, ox } from "./geometry";
import { lengthOf, pointAlong, type Pt } from "./path";
import { palette } from "./theme";
import type { SceneState } from "./timeline";

export type DrawOptions = {
  reducedMotion: boolean;
  fontFamily: string;
  monoFamily: string;
};

type R = {
  ctx: CanvasRenderingContext2D;
  scale: number;
  sx: (x: number) => number;
  sy: (y: number) => number;
  w: number;
  h: number;
  state: SceneState;
  reduced: boolean;
  font: string;
  mono: string;
};

type Callout = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  title: string;
  body?: string;
  color: string;
  alpha: number;
};

export function drawScene(canvas: HTMLCanvasElement, state: SceneState, options: DrawOptions): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (w < 2 || h < 2) return;
  const bufferW = Math.floor(w * dpr);
  const bufferH = Math.floor(h * dpr);
  if (canvas.width !== bufferW || canvas.height !== bufferH) {
    canvas.width = bufferW;
    canvas.height = bufferH;
  }

  const camera = state.camera;
  const scale = Math.min(w / camera.viewW, h / camera.viewH);
  const ox0 = (w - camera.viewW * scale) / 2;
  const oy0 = (h - camera.viewH * scale) / 2;
  const left = camera.cx - camera.viewW / 2;
  const top = camera.cy - camera.viewH / 2;
  const r: R = {
    ctx,
    scale,
    sx: (x) => ox0 + (x - left) * scale,
    sy: (y) => oy0 + (y - top) * scale,
    w,
    h,
    state,
    reduced: options.reducedMotion,
    font: options.fontFamily,
    mono: options.monoFamily,
  };

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = palette.stage;
  ctx.fillRect(0, 0, w, h);
  drawGrid(r);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * (ox0 - left * scale), dpr * (oy0 - top * scale));

  drawCenterline(r);
  drawNozzle(r);
  drawCoolingSlots(r);
  drawAllPipes(r);
  drawSpool(r, "ox");
  drawSpool(r, "fu");
  drawInjector(r);
  drawCombustion(r);
  drawHeatTicks(r);
  drawChevrons(r);
  drawNozzleStreams(r);
  drawSensorTap(r);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawStateMarks(r);
  for (const callout of callouts(state)) drawCallout(r, callout);
  drawRatioCard(r);
  drawMachCard(r);
  drawLocator(r);
  drawVignette(r);
}

function drawGrid(r: R): void {
  const { ctx, w, h } = r;
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawVignette(r: R): void {
  const { ctx, w, h } = r;
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.72);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.38)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawCenterline(r: R): void {
  const { ctx } = r;
  ctx.save();
  ctx.strokeStyle = "rgba(142,160,184,0.25)";
  ctx.lineWidth = px(r, 1);
  ctx.setLineDash([px(r, 8), px(r, 8)]);
  ctx.beginPath();
  ctx.moveTo(20, CL);
  ctx.lineTo(nozzle.exitX + 30, CL);
  ctx.stroke();
  ctx.restore();
}

function drawNozzle(r: R): void {
  const { ctx, state } = r;
  const alpha = Math.max(0.14, state.reveal.injector);
  ctx.save();
  ctx.globalAlpha = alpha;
  traceWall(ctx);
  const gradient = ctx.createLinearGradient(nozzle.chamberX0, CL - 160, nozzle.chamberX0, CL + 160);
  gradient.addColorStop(0, "#42536A");
  gradient.addColorStop(0.5, palette.metal);
  gradient.addColorStop(1, "#2A384C");
  ctx.fillStyle = gradient;
  ctx.fill("evenodd");
  ctx.save();
  traceWall(ctx);
  ctx.clip("evenodd");
  ctx.strokeStyle = "rgba(180,196,214,0.28)";
  ctx.lineWidth = px(r, 1);
  const boundsTop = CL - 280;
  const boundsLeft = nozzle.chamberX0 - 20;
  for (let i = -40; i < 80; i += 1) {
    ctx.beginPath();
    const x = boundsLeft + i * 9;
    ctx.moveTo(x, boundsTop);
    ctx.lineTo(x + 220, boundsTop + 360);
    ctx.stroke();
  }
  ctx.restore();
  ctx.lineWidth = px(r, 1.25);
  ctx.strokeStyle = palette.metalEdge;
  ctx.stroke();
  ctx.restore();
}

function traceWall(ctx: CanvasRenderingContext2D): void {
  const x0 = nozzle.chamberX0;
  const x1 = nozzle.exitX;
  const steps = 42;
  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const x = x0 + ((x1 - x0) * i) / steps;
    const y = CL - outerRadius(x);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.lineTo(x1 + 10, CL - innerRadius(x1));
  ctx.lineTo(x1 + 10, CL + innerRadius(x1));
  for (let i = steps; i >= 0; i -= 1) {
    const x = x0 + ((x1 - x0) * i) / steps;
    ctx.lineTo(x, CL + outerRadius(x));
  }
  ctx.closePath();
  ctx.moveTo(x0, CL - innerRadius(x0));
  for (let i = 1; i <= steps; i += 1) {
    const x = x0 + ((x1 - x0) * i) / steps;
    ctx.lineTo(x, CL - innerRadius(x));
  }
  ctx.lineTo(x1 + 10, CL + innerRadius(x1));
  for (let i = steps; i >= 0; i -= 1) {
    const x = x0 + ((x1 - x0) * i) / steps;
    ctx.lineTo(x, CL + innerRadius(x));
  }
  ctx.closePath();
}

function drawCoolingSlots(r: R): void {
  const alpha = r.state.reveal.cooling;
  if (alpha < 0.02) return;
  const { ctx } = r;
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let x = nozzle.chamberX0 + 28; x < 1360; x += 32) {
    drawSlot(r, x, -1);
    drawSlot(r, x, 1);
  }
  ctx.restore();
}

function drawSlot(r: R, x: number, side: 1 | -1): void {
  const { ctx } = r;
  const mid = innerRadius(x) + nozzle.wall * 0.55;
  const y = CL + side * mid;
  const ahead = innerRadius(x + 8) - innerRadius(x - 8);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.atan2(side * ahead, 16));
  ctx.fillStyle = palette.bore;
  ctx.fillRect(-9, -3.2, 18, 6.4);
  ctx.strokeStyle = "rgba(142,160,184,0.45)";
  ctx.lineWidth = px(r, 0.8);
  ctx.strokeRect(-9, -3.2, 18, 6.4);
  ctx.restore();
}

function drawHeatTicks(r: R): void {
  const alpha = r.state.reveal.cooling * r.state.emphasis.coolUpper;
  if (alpha < 0.05) return;
  const { ctx } = r;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = palette.gold;
  ctx.lineWidth = px(r, 1.3);
  for (let x = nozzle.chamberX0 + 40; x < nozzle.chamberX1; x += 48) {
    for (const side of [-1, 1] as const) {
      const y0 = CL + side * (innerRadius(x) + 2);
      const y1 = CL + side * (innerRadius(x) + nozzle.wall * 0.45);
      ctx.beginPath();
      ctx.moveTo(x, y0);
      ctx.lineTo(x, y1);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawAllPipes(r: R): void {
  const ids: FlowId[] = [
    "oxIn",
    "fuIn",
    "oxMain",
    "fuMain",
    "oxCross",
    "fuCross",
    "coolReturn",
    "oxGas",
    "fuGas",
  ];
  for (const id of ids) {
    const flow = flowById(id);
    const gate = pipeGate(id, r.state);
    if (gate < 0.02) continue;
    const outer = flow.weight === "cross" ? 7 : flow.weight === "gas" ? 18 : 15;
    drawPipe(r, flow.pts, outer, gate, flow.propellant);
  }
}

function pipeGate(id: FlowId, state: SceneState): number {
  const reveal = state.reveal;
  switch (id) {
    case "oxIn":
    case "fuIn":
      return reveal.inlets;
    case "oxMain":
      return reveal.preburners;
    case "oxCross":
    case "fuCross":
      return reveal.crossfeed;
    case "fuMain":
    case "coolSupply":
      return reveal.preburners;
    case "coolUpper":
    case "coolLower":
    case "coolReturn":
      return reveal.cooling;
    case "oxGas":
    case "fuGas":
      return reveal.ducts;
    default:
      return reveal.nozzle;
  }
}

function drawPipe(r: R, pts: Pt[], outer: number, alpha: number, propellant: string): void {
  const { ctx } = r;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  strokePts(ctx, pts, outer, palette.metal);
  strokePts(ctx, pts, outer * 0.52, palette.bore);
  const body = propellant === "ox" ? palette.loxBody : propellant === "fu" ? palette.fuelBody : "#6A625C";
  strokePts(ctx, pts, outer * 0.22, body);
  ctx.restore();
}

function strokePts(ctx: CanvasRenderingContext2D, pts: Pt[], width: number, color: string): void {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawSpool(r: R, side: "ox" | "fu"): void {
  const spec = side === "ox" ? ox : fu;
  const { state } = r;
  drawShaft(r, spec.pumpX, spec.turbX, spec.y, state.reveal.turbines, side);
  drawPump(r, spec.pumpX, spec.y, spec.pumpR, state.reveal.pumps, state.reveal.pumpSection, side);
  drawTurbine(r, spec.turbX, spec.y, spec.turbR, state.reveal.turbines, side);
  drawPreburner(r, side);
}

function drawShaft(r: R, x0: number, x1: number, y: number, alpha: number, side: "ox" | "fu"): void {
  if (alpha < 0.02 && r.state.reveal.pumps < 0.02) return;
  const { ctx, state } = r;
  const shown = Math.max(alpha, r.state.reveal.pumps * 0.85);
  ctx.save();
  ctx.globalAlpha = shown;
  ctx.strokeStyle = "#51627A";
  ctx.lineWidth = side === "ox" ? 10 : 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x0 + 10, y);
  ctx.lineTo(x1 - 8, y);
  ctx.stroke();
  const span = x1 - x0 - 18;
  const phase = (state.frame % 45) / 45;
  const gx = x0 + 10 + span * phase;
  ctx.strokeStyle = palette.gold;
  ctx.globalAlpha = shown * alpha;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(gx, y);
  ctx.lineTo(Math.min(x1 - 8, gx + 28), y);
  ctx.stroke();
  ctx.fillStyle = palette.metalDeep;
  ctx.globalAlpha = shown;
  ctx.fillRect(x0 + 36, y - 7, 10, 14);
  ctx.fillRect(x1 - 48, y - 7, 10, 14);
  ctx.restore();
}

function drawPump(
  r: R,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  cut: number,
  side: "ox" | "fu",
): void {
  if (alpha < 0.02) return;
  const { ctx, state } = r;
  ctx.save();
  ctx.globalAlpha = alpha;
  const gradient = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.35, radius * 0.1, x, y, radius);
  gradient.addColorStop(0, "#556884");
  gradient.addColorStop(1, "#243246");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = px(r, 1.4);
  ctx.strokeStyle = palette.metalEdge;
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.rect(x - radius, y - radius, radius * 2 * Math.max(0.02, cut), radius * 2);
  ctx.clip();
  ctx.fillStyle = palette.bore;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, 0, Math.PI * 2);
  ctx.fill();
  drawRotor(r, x, y, radius * 0.62, state.frame * 0.07 + (side === "fu" ? 0.6 : 0), 6);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = "#101820";
  ctx.fill();
  ctx.restore();
}

function drawTurbine(r: R, x: number, y: number, radius: number, alpha: number, side: "ox" | "fu"): void {
  if (alpha < 0.02) return;
  const { ctx, state } = r;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#3C4D64";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = px(r, 1.3);
  ctx.strokeStyle = palette.metalEdge;
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.82, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = palette.bore;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  drawRotor(r, x, y, radius * 0.7, -state.frame * 0.11 + (side === "ox" ? 0.2 : 1), 10);
  ctx.restore();
  ctx.restore();
}

function drawRotor(r: R, x: number, y: number, radius: number, angle: number, blades: number): void {
  const { ctx } = r;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = "#C5D0DE";
  ctx.lineWidth = px(r, 1.4);
  ctx.lineCap = "round";
  for (let i = 0; i < blades; i += 1) {
    const a = (i / blades) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * radius * 0.22, Math.sin(a) * radius * 0.22);
    const mx = Math.cos(a + 0.5) * radius * 0.62;
    const my = Math.sin(a + 0.5) * radius * 0.62;
    ctx.quadraticCurveTo(mx, my, Math.cos(a) * radius, Math.sin(a) * radius);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPreburner(r: R, side: "ox" | "fu"): void {
  const spec = side === "ox" ? ox : fu;
  const alpha = r.state.reveal.preburners;
  if (alpha < 0.02) return;
  const { ctx, state } = r;
  const left = spec.pbX - spec.pbW / 2;
  const top = spec.pbY - spec.pbH / 2;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#3A4C63";
  ctx.beginPath();
  ctx.roundRect(left, top, spec.pbW, spec.pbH, 12);
  ctx.fill();
  ctx.lineWidth = px(r, 1.3);
  ctx.strokeStyle = palette.metalEdge;
  ctx.stroke();
  const neckY = side === "ox" ? top + spec.pbH : top;
  const neckH = side === "ox" ? spec.y - (spec.pbY + spec.pbH / 2) : spec.pbY - spec.pbH / 2 - spec.y;
  ctx.fillStyle = "#314256";
  ctx.fillRect(spec.pbX - 10, side === "ox" ? spec.pbY + spec.pbH / 2 : spec.y + spec.turbR, 20, Math.max(8, neckH));
  if (state.reveal.pbSection > 0.02) {
    ctx.globalAlpha = alpha * state.reveal.pbSection;
    ctx.fillStyle = palette.bore;
    ctx.beginPath();
    ctx.roundRect(left + 10, top + 10, spec.pbW - 20, spec.pbH - 20, 8);
    ctx.fill();
    ctx.fillStyle = palette.gold;
    ctx.globalAlpha = alpha * state.reveal.pbSection * 0.85;
    ctx.beginPath();
    ctx.ellipse(spec.pbX, spec.pbY, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  void neckY;
}

function drawInjector(r: R): void {
  const alpha = r.state.reveal.injector;
  if (alpha < 0.02) return;
  const { ctx } = r;
  const x = nozzle.chamberX0;
  const half = outerRadius(x);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#46586F";
  ctx.fillRect(x - 18, CL - half, 22, half * 2);
  ctx.strokeStyle = palette.metalEdge;
  ctx.lineWidth = px(r, 1.2);
  ctx.strokeRect(x - 18, CL - half, 22, half * 2);
  ctx.fillStyle = palette.bore;
  for (let i = -3; i <= 3; i += 1) {
    const y = CL + i * 16;
    ctx.beginPath();
    ctx.arc(x - 6, y, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCombustion(r: R): void {
  const alpha = r.state.reveal.combustion;
  if (alpha < 0.02) return;
  const { ctx, state, reduced } = r;
  const pulse = reduced ? 1 : 0.94 + 0.06 * Math.sin(state.frame / 20);
  ctx.save();
  ctx.beginPath();
  const steps = 20;
  const x0 = nozzle.chamberX0 + 8;
  const x1 = nozzle.chamberX1 - 4;
  ctx.moveTo(x0, CL - innerRadius(x0) + 6);
  for (let i = 1; i <= steps; i += 1) {
    const x = x0 + ((x1 - x0) * i) / steps;
    ctx.lineTo(x, CL - innerRadius(x) + 6);
  }
  for (let i = steps; i >= 0; i -= 1) {
    const x = x0 + ((x1 - x0) * i) / steps;
    ctx.lineTo(x, CL + innerRadius(x) - 6);
  }
  ctx.closePath();
  ctx.clip();
  const gradient = ctx.createLinearGradient(x0, CL, x1, CL);
  gradient.addColorStop(0, "rgba(255,209,102,0.05)");
  gradient.addColorStop(0.35, "rgba(255,209,102,0.38)");
  gradient.addColorStop(1, "rgba(255,209,102,0.12)");
  ctx.globalAlpha = alpha * pulse;
  ctx.fillStyle = gradient;
  ctx.fillRect(x0, CL - 120, x1 - x0, 240);
  ctx.restore();
}

function drawChevrons(r: R): void {
  const ids: FlowId[] = [
    "oxIn",
    "fuIn",
    "oxMain",
    "fuMain",
    "oxCross",
    "fuCross",
    "coolUpper",
    "coolLower",
    "coolReturn",
    "oxGas",
    "fuGas",
  ];
  for (const id of ids) {
    const gate = pipeGate(id, r.state) * (r.state.emphasis[id] ?? 0.4);
    if (gate < 0.08) continue;
    const flow = flowById(id);
    const spacing = flow.weight === "cross" ? 36 : 28;
    const phase = ((r.state.frame * 0.6 + id.length * 5) % 48) / 48;
    chevrons(r, flow.pts, palette.cyan, gate, phase, spacing);
  }
}

function drawNozzleStreams(r: R): void {
  const alpha = r.state.reveal.nozzle * (r.state.emphasis.nozzle ?? 1);
  if (alpha < 0.04) return;
  nozzleStreams.forEach((pts, index) => {
    const phase = ((r.state.frame * 0.8 + index * 7) % 40) / 40;
    chevrons(r, pts, palette.cyan, alpha * 0.9, phase, 34);
  });
}

function chevrons(
  r: R,
  pts: Pt[],
  color: string,
  alpha: number,
  phase: number,
  spacingPx: number,
): void {
  const { ctx, scale } = r;
  const total = lengthOf(pts);
  if (total < 4) return;
  const spacing = spacingPx / scale;
  const size = 7 / scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let distance = phase * spacing; distance < total; distance += spacing) {
    const point = pointAlong(pts, distance);
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(point.angle);
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.7, size * 0.55);
    ctx.lineTo(-size * 0.7, -size * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawSensorTap(r: R): void {
  const alpha = r.state.reveal.combustion * r.state.detail;
  if (alpha < 0.05) return;
  const { ctx } = r;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = palette.violet;
  ctx.beginPath();
  ctx.arc(980, CL - outerRadius(980) - 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawStateMarks(r: R): void {
  const { ctx, state } = r;
  const marks: { x: number; y: number; label: string; alpha: number }[] = [
    { x: 90, y: ox.y, label: "Liquid", alpha: state.reveal.inlets * state.detail },
    { x: 90, y: fu.y, label: "Liquid", alpha: state.reveal.inlets * state.detail },
    { x: 700, y: ox.y - 28, label: "Hot gas", alpha: state.reveal.ducts * state.detail },
    { x: 700, y: fu.y + 28, label: "Hot gas", alpha: state.reveal.ducts * state.detail },
    { x: 960, y: CL - innerRadius(960) - 18, label: "Subsonic", alpha: state.reveal.combustion * state.detail },
    { x: nozzle.throatX, y: CL - innerRadius(nozzle.throatX) - 22, label: "Sonic", alpha: state.reveal.mach * state.detail },
    { x: 1320, y: CL - innerRadius(1320) - 18, label: "Supersonic", alpha: state.reveal.mach * state.detail },
  ];
  ctx.save();
  ctx.font = `500 11px ${r.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const mark of marks) {
    if (mark.alpha < 0.05) continue;
    const x = r.sx(mark.x);
    const y = r.sy(mark.y);
    if (x < 8 || y < 8 || x > r.w - 8 || y > r.h - 8) continue;
    const width = ctx.measureText(mark.label).width + 14;
    ctx.globalAlpha = mark.alpha;
    ctx.fillStyle = "rgba(11,16,25,0.88)";
    ctx.beginPath();
    ctx.roundRect(x - width / 2, y - 9, width, 18, 4);
    ctx.fill();
    ctx.strokeStyle = palette.violet;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = palette.violet;
    ctx.fillText(mark.label, x, y);
  }
  ctx.restore();
}

function callouts(state: SceneState): Callout[] {
  const detail = state.detail;
  const end = state.reveal.settled;
  const major = (chapterAlpha: number) => Math.max(chapterAlpha * detail, end);
  return [
    {
      x: ox.pumpX,
      y: ox.y,
      dx: -150,
      dy: -46,
      title: "Oxidizer turbopump",
      body: "Own shaft. Not coaxial.",
      color: palette.bone,
      alpha: major(state.reveal.pumps),
    },
    {
      x: fu.pumpX,
      y: fu.y,
      dx: -150,
      dy: 46,
      title: "Fuel turbopump",
      body: "Own shaft. Methane side.",
      color: palette.bone,
      alpha: major(state.reveal.pumps),
    },
    {
      x: ox.pbX,
      y: ox.pbY,
      dx: 20,
      dy: -42,
      title: "Oxidizer-rich preburner",
      body: "Most oxidizer, little fuel",
      color: palette.cyan,
      alpha: major(state.reveal.preburners),
    },
    {
      x: fu.pbX,
      y: fu.pbY,
      dx: 20,
      dy: 42,
      title: "Fuel-rich preburner",
      body: "Most fuel, little oxidizer",
      color: palette.cyan,
      alpha: major(state.reveal.preburners),
    },
    {
      x: 640,
      y: CL,
      dx: 0,
      dy: -70,
      title: "Turbine gas stays onboard",
      body: "Both ducts enter the injector",
      color: palette.cyan,
      alpha: state.reveal.ducts * detail,
    },
    {
      x: (ox.pumpX + ox.turbX) / 2,
      y: ox.y,
      dx: 0,
      dy: -36,
      title: "Shaft work",
      body: "Direction only. No speed stated.",
      color: palette.gold,
      alpha: state.reveal.turbines * detail * (state.chapter.id === "turbines" || state.chapter.id === "feeds" ? 1 : 0.2),
    },
    {
      x: 960,
      y: CL,
      dx: 30,
      dy: -78,
      title: "Steady deflagration",
      body: "Not a detonation",
      color: palette.gold,
      alpha: state.reveal.combustion * Math.max(detail, 0.35),
    },
    {
      x: 1180,
      y: CL + outerRadius(1180) + 28,
      dx: -170,
      dy: -42,
      title: "Regenerative jacket",
      body: "Schematic methane route",
      color: palette.cyan,
      alpha: Math.max(state.reveal.cooling * detail, end * 0.95),
    },
    {
      x: 980,
      y: CL - outerRadius(980),
      dx: 24,
      dy: -28,
      title: "Sensor tap",
      body: "Location only. No reading.",
      color: palette.violet,
      alpha: state.reveal.combustion * detail,
    },
    {
      x: nozzle.exitX - 8,
      y: CL - innerRadius(nozzle.exitX) * 0.45,
      dx: 12,
      dy: -36,
      title: "Schematic bell",
      body: "Not a Rao optimum",
      color: palette.bone,
      alpha: Math.max(state.reveal.nozzle * detail, end),
    },
  ];
}

function drawCallout(r: R, callout: Callout): void {
  if (callout.alpha < 0.04) return;
  const { ctx } = r;
  const ax = r.sx(callout.x);
  const ay = r.sy(callout.y);
  if (ax < -20 || ay < -20 || ax > r.w + 20 || ay > r.h + 20) return;
  ctx.save();
  ctx.globalAlpha = callout.alpha;
  ctx.font = `500 12.5px ${r.font}`;
  const titleW = ctx.measureText(callout.title).width;
  ctx.font = `400 11px ${r.font}`;
  const bodyW = callout.body ? ctx.measureText(callout.body).width : 0;
  const boxW = Math.min(250, Math.max(titleW, bodyW) + 18);
  const boxH = callout.body ? 38 : 24;
  let left = ax + callout.dx;
  let top = ay + callout.dy - boxH / 2;
  if (callout.dx < 0) left -= boxW;
  left = Math.max(8, Math.min(r.w - boxW - 8, left));
  top = Math.max(8, Math.min(r.h - boxH - 8, top));
  ctx.strokeStyle = callout.color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(left + (ax < left ? 0 : boxW), top + boxH / 2);
  ctx.stroke();
  ctx.fillStyle = callout.color;
  ctx.beginPath();
  ctx.arc(ax, ay, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(11,16,25,0.9)";
  ctx.beginPath();
  ctx.roundRect(left, top, boxW, boxH, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.stroke();
  ctx.fillStyle = callout.color;
  ctx.fillRect(left, top, 2, boxH);
  ctx.fillStyle = palette.bone;
  ctx.font = `500 12.5px ${r.font}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(callout.title, left + 10, top + 16);
  if (callout.body) {
    ctx.font = `400 11px ${r.font}`;
    ctx.fillStyle = palette.muted;
    ctx.fillText(callout.body, left + 10, top + 30);
  }
  ctx.restore();
}

function drawRatioCard(r: R): void {
  const frame = r.state.frame;
  const fadeIn = clamp01((frame - 170) / 24);
  const fadeOut = 1 - clamp01((frame - 286) / 16);
  const alpha = frame < 170 ? 0 : fadeIn * fadeOut * r.state.detail;
  if (alpha < 0.04) return;
  const { ctx } = r;
  const w = 280;
  const h = 132;
  const x = r.w - w - 16;
  const y = 16;
  ctx.save();
  ctx.globalAlpha = alpha;
  cardChrome(ctx, x, y, w, h, r.mono);
  ctx.fillStyle = palette.muted;
  ctx.font = `500 10px ${r.mono}`;
  ctx.fillText("MATHEMATICAL DIAGRAM", x + 12, y + 18);
  ctx.fillStyle = palette.bone;
  ctx.font = `500 12px ${r.font}`;
  ctx.fillText("Opposite proportions", x + 12, y + 36);
  barPair(ctx, x + 16, y + 52, "Oxidizer-rich", 0.86, 0.18);
  barPair(ctx, x + 150, y + 52, "Fuel-rich", 0.18, 0.86);
  ctx.font = `400 10px ${r.font}`;
  ctx.fillStyle = palette.muted;
  ctx.fillText("Bar length is ordinal. No mixture ratio.", x + 12, y + 118);
  ctx.restore();
}

function barPair(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  title: string,
  oxShare: number,
  fuShare: number,
): void {
  ctx.fillStyle = palette.bone;
  ctx.font = "500 11px sans-serif";
  ctx.fillText(title, x, y);
  ctx.fillStyle = palette.loxBody;
  ctx.fillRect(x, y + 10, 18, 36 * oxShare);
  ctx.fillStyle = palette.fuelBody;
  ctx.fillRect(x + 26, y + 10, 18, 36 * fuShare);
  ctx.fillStyle = palette.muted;
  ctx.font = "10px sans-serif";
  ctx.fillText("ox", x, y + 58);
  ctx.fillText("fuel", x + 24, y + 58);
}

function drawMachCard(r: R): void {
  const frame = r.state.frame;
  const fadeIn = clamp01((frame - 800) / 24);
  const fadeOut = 1 - clamp01((frame - 955) / 18);
  const alpha = frame < 800 ? 0 : fadeIn * fadeOut * r.state.detail;
  if (alpha < 0.04) return;
  const { ctx } = r;
  const w = 300;
  const h = 148;
  const x = 16;
  const y = r.h - h - 16;
  ctx.save();
  ctx.globalAlpha = alpha;
  cardChrome(ctx, x, y, w, h, r.mono);
  ctx.fillStyle = palette.muted;
  ctx.font = `500 10px ${r.mono}`;
  ctx.fillText("MATHEMATICAL DIAGRAM", x + 12, y + 18);
  ctx.fillStyle = palette.bone;
  ctx.font = `500 12px ${r.font}`;
  ctx.fillText("Area and regime, textbook only", x + 12, y + 36);
  ctx.beginPath();
  ctx.moveTo(x + 20, y + 92);
  ctx.lineTo(x + 70, y + 58);
  ctx.lineTo(x + 120, y + 96);
  ctx.lineTo(x + 210, y + 52);
  ctx.strokeStyle = palette.violet;
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.fillStyle = palette.muted;
  ctx.font = `400 10px ${r.font}`;
  ctx.fillText("subsonic", x + 24, y + 112);
  ctx.fillStyle = palette.violet;
  ctx.fillText("sonic", x + 108, y + 112);
  ctx.fillStyle = palette.gold;
  ctx.fillText("supersonic expansion", x + 150, y + 112);
  ctx.fillStyle = palette.muted;
  ctx.fillText("Not a solution for this contour.", x + 12, y + 134);
  ctx.restore();
}

function cardChrome(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  mono: string,
): void {
  ctx.fillStyle = "rgba(11,16,25,0.92)";
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();
  void mono;
}

function drawLocator(r: R): void {
  const { ctx, state } = r;
  const bw = 168;
  const bh = 96;
  const bx = r.w - bw - 12;
  const by = r.h - bh - 12;
  const worldW = 1600;
  const worldH = 900;
  const mapX = (x: number) => bx + (x / worldW) * (bw - 16) + 8;
  const mapY = (y: number) => by + (y / worldH) * (bh - 22) + 16;
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "rgba(11,16,25,0.82)";
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 8);
  ctx.fill();
  ctx.stroke();
  ctx.font = `500 9px ${r.mono}`;
  ctx.fillStyle = palette.muted;
  ctx.fillText("LOCATOR", bx + 8, by + 12);
  ctx.beginPath();
  const upper = contour(-1, nozzle.chamberX0, nozzle.exitX, 24, outerRadius);
  const lower = contour(1, nozzle.exitX, nozzle.chamberX0, 24, outerRadius);
  ctx.moveTo(mapX(upper[0].x), mapY(upper[0].y));
  for (const point of upper) ctx.lineTo(mapX(point.x), mapY(point.y));
  for (const point of lower) ctx.lineTo(mapX(point.x), mapY(point.y));
  ctx.closePath();
  ctx.strokeStyle = palette.metalEdge;
  ctx.stroke();
  ctx.fillStyle = palette.metal;
  ctx.fillRect(mapX(ox.pumpX) - 3, mapY(ox.y) - 3, 6, 6);
  ctx.fillRect(mapX(fu.pumpX) - 3, mapY(fu.y) - 3, 6, 6);
  const camera = state.camera;
  const left = camera.cx - camera.viewW / 2;
  const top = camera.cy - camera.viewH / 2;
  ctx.strokeStyle = palette.cyan;
  ctx.strokeRect(mapX(left), mapY(top), (camera.viewW / worldW) * (bw - 16), (camera.viewH / worldH) * (bh - 22));
  ctx.restore();
}

function px(r: R, cssPx: number): number {
  return cssPx / r.scale;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
