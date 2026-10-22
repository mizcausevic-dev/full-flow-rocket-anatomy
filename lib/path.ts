export type Pt = { x: number; y: number };

export function lengthOf(pts: Pt[]): number {
  let total = 0;
  for (let i = 1; i < pts.length; i += 1) {
    total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return total;
}

export function pointAlong(pts: Pt[], distance: number): Pt & { angle: number } {
  let remain = distance;
  for (let i = 1; i < pts.length; i += 1) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    const seg = Math.hypot(dx, dy);
    if (remain <= seg || i === pts.length - 1) {
      const t = seg === 0 ? 0 : Math.min(1, remain / seg);
      return {
        x: pts[i - 1].x + dx * t,
        y: pts[i - 1].y + dy * t,
        angle: Math.atan2(dy, dx),
      };
    }
    remain -= seg;
  }
  const last = pts[pts.length - 1] ?? { x: 0, y: 0 };
  return { ...last, angle: 0 };
}
