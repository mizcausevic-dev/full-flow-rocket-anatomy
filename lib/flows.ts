import { CL, fu, innerRadius, manifoldX, nozzle, outerRadius, ox } from "./geometry";
import type { Pt } from "./path";

export type FlowId =
  | "oxIn"
  | "fuIn"
  | "oxMain"
  | "fuMain"
  | "oxCross"
  | "fuCross"
  | "oxGas"
  | "fuGas"
  | "coolSupply"
  | "coolUpper"
  | "coolLower"
  | "coolReturn"
  | "nozzle";

export type FlowPath = {
  id: FlowId;
  pts: Pt[];
  weight: "main" | "cross" | "gas" | "stream";
  propellant: "ox" | "fu" | "gas" | "mixed";
};

function upperWall(from: number, to: number): Pt[] {
  const pts: Pt[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i += 1) {
    const x = from + ((to - from) * i) / steps;
    const mid = innerRadius(x) + nozzle.wall * 0.55;
    pts.push({ x, y: CL - mid });
  }
  return pts;
}

function lowerWall(from: number, to: number): Pt[] {
  const pts: Pt[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i += 1) {
    const x = from + ((to - from) * i) / steps;
    const mid = innerRadius(x) + nozzle.wall * 0.55;
    pts.push({ x, y: CL + mid });
  }
  return pts;
}

function streamline(fraction: number): Pt[] {
  const pts: Pt[] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = nozzle.throatX + (nozzle.exitX - nozzle.throatX) * t;
    pts.push({ x, y: CL + innerRadius(x) * fraction * 0.72 });
  }
  return pts;
}

const jacketStart = nozzle.chamberX0 + 24;
const jacketEnd = manifoldX;

export const flows: FlowPath[] = [
  {
    id: "oxIn",
    weight: "main",
    propellant: "ox",
    pts: [
      { x: 36, y: ox.y },
      { x: ox.pumpX - ox.pumpR, y: ox.y },
    ],
  },
  {
    id: "fuIn",
    weight: "main",
    propellant: "fu",
    pts: [
      { x: 36, y: fu.y },
      { x: fu.pumpX - fu.pumpR, y: fu.y },
    ],
  },
  {
    id: "oxMain",
    weight: "main",
    propellant: "ox",
    pts: [
      { x: ox.pumpX + ox.pumpR - 6, y: ox.y - 18 },
      { x: ox.pumpX + 8, y: ox.pbY + 8 },
      { x: ox.pbX - ox.pbW / 2 + 8, y: ox.pbY },
    ],
  },
  {
    id: "oxCross",
    weight: "cross",
    propellant: "ox",
    pts: [
      { x: ox.pumpX + 20, y: ox.y + 28 },
      { x: 560, y: ox.y + 36 },
      { x: 560, y: fu.pbY },
      { x: fu.pbX + fu.pbW / 2 - 10, y: fu.pbY },
    ],
  },
  {
    id: "fuCross",
    weight: "cross",
    propellant: "fu",
    pts: [
      { x: fu.pumpX + 16, y: fu.y - 24 },
      { x: 620, y: fu.y - 30 },
      { x: 620, y: ox.pbY },
      { x: ox.pbX + ox.pbW / 2 - 10, y: ox.pbY },
    ],
  },
  {
    id: "fuMain",
    weight: "main",
    propellant: "fu",
    pts: [
      { x: fu.pumpX + fu.pumpR - 4, y: fu.y + 10 },
      { x: 330, y: fu.y + 18 },
      { x: 330, y: 868 },
      { x: manifoldX, y: 868 },
      { x: manifoldX, y: CL + outerRadius(manifoldX) + 8 },
    ],
  },
  {
    id: "coolSupply",
    weight: "main",
    propellant: "fu",
    pts: [
      { x: manifoldX, y: CL + outerRadius(manifoldX) + 8 },
      { x: manifoldX, y: CL },
    ],
  },
  {
    id: "coolUpper",
    weight: "main",
    propellant: "fu",
    pts: upperWall(jacketEnd, jacketStart),
  },
  {
    id: "coolLower",
    weight: "main",
    propellant: "fu",
    pts: lowerWall(jacketEnd, jacketStart),
  },
  {
    id: "coolReturn",
    weight: "main",
    propellant: "fu",
    pts: [
      { x: jacketStart, y: CL + outerRadius(jacketStart) + 6 },
      { x: jacketStart, y: 832 },
      { x: 390, y: 832 },
      { x: 390, y: fu.pbY + fu.pbH / 2 - 6 },
    ],
  },
  {
    id: "oxGas",
    weight: "gas",
    propellant: "gas",
    pts: [
      { x: ox.turbX + ox.turbR, y: ox.y },
      { x: 640, y: ox.y - 8 },
      { x: 760, y: CL - 120 },
      { x: nozzle.chamberX0, y: CL - 36 },
    ],
  },
  {
    id: "fuGas",
    weight: "gas",
    propellant: "gas",
    pts: [
      { x: fu.turbX + fu.turbR, y: fu.y },
      { x: 640, y: fu.y + 8 },
      { x: 760, y: CL + 120 },
      { x: nozzle.chamberX0, y: CL + 36 },
    ],
  },
  {
    id: "nozzle",
    weight: "stream",
    propellant: "mixed",
    pts: streamline(0),
  },
];

export const nozzleStreams: Pt[][] = [-0.72, -0.38, 0, 0.38, 0.72].map(streamline);

export function flowById(id: FlowId): FlowPath {
  const found = flows.find((flow) => flow.id === id);
  if (!found) throw new Error(`missing flow ${id}`);
  return found;
}
