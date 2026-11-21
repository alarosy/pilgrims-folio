/**
 * Geometry of the Pilgrim's Map. The road is measured in hours: going down
 * the map, every hour is the same distance, so each module's stretch of road
 * is exactly as long as its hours. Pure maths (no DOM), so the server and the
 * browser draw the same map.
 */
export const MAP_W = 400;
export const MARGIN = 44; // the week strip and breathing room at each side
export const ROAD_TOP = 205;
export const PX_PER_HOUR = 15;
export const ROAD_END = ROAD_TOP + 100 * PX_PER_HOUR; // 1705
export const MAP_H = ROAD_END + 150;

const WAVES = 2.25;
const PHASE = 0.5;
const AMP = 100;

export const roadX = (h: number) => MAP_W / 2 + AMP * Math.sin((h / 100) * Math.PI * 2 * WAVES + PHASE);
export const roadY = (h: number) => ROAD_TOP + h * PX_PER_HOUR;

/** Direction of travel at hour h, in degrees (0 = east, 90 = south). */
export function roadAngle(h: number) {
  const dx = AMP * Math.cos((h / 100) * Math.PI * 2 * WAVES + PHASE) * ((Math.PI * 2 * WAVES) / 100);
  return (Math.atan2(PX_PER_HOUR, dx) * 180) / Math.PI;
}

/** A smooth SVG path along the road between two hours (Catmull-Rom → Bézier). */
export function roadPath(from = 0, to = 100, step = 1) {
  if (to <= from) return "";
  const pts: [number, number][] = [];
  for (let h = from; h < to; h += step) pts.push([roadX(h), roadY(h)]);
  pts.push([roadX(to), roadY(to)]);
  const p = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))]!;
  let d = `M${pts[0]![0].toFixed(1)} ${pts[0]![1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0]!.toFixed(1)} ${c1[1]!.toFixed(1)} ${c2[0]!.toFixed(1)} ${c2[1]!.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Percent positions for HTML placed over the SVG. */
export const pctX = (x: number) => `${((x / MAP_W) * 100).toFixed(3)}%`;
export const pctY = (y: number) => `${((y / MAP_H) * 100).toFixed(3)}%`;
