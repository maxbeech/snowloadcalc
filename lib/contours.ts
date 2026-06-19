// Topographic contour geometry, the recurring motif. ASCE ground-snow maps are
// drawn as elevation contours, so the site is wrapped in the same lines. Pure
// and deterministic (index-driven phase, never Math.random) so server and client
// render identically with no hydration mismatch. Unit-tested.

export type Pt = [number, number];

// A closed Catmull-Rom spline through pts, emitted as cubic beziers, so a ring of
// sample points reads as one smooth contour line.
export function smoothClosedPath(pts: Pt[]): string {
  const n = pts.length;
  if (n < 3) return "";
  const f = (v: number) => Math.round(v * 10) / 10;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + "Z";
}

// One wobbly ring around (cx,cy): a base radius perturbed by two sinusoids whose
// phase is set by the ring index, so each contour is distinct yet stable.
function ring(cx: number, cy: number, baseR: number, wobble: number, idx: number, points = 28): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const r = baseR + Math.sin(a * 3 + idx * 0.7) * wobble + Math.cos(a * 2 + idx * 1.3) * wobble * 0.6;
    pts.push([cx + Math.cos(a) * r * 1.35, cy + Math.sin(a) * r]);
  }
  return pts;
}

// A nested field of contour lines (a stylised "snow basin"), returned as path
// strings from innermost to outermost.
export function contourField(opts: { cx?: number; cy?: number; count?: number; step?: number; baseR?: number; wobble?: number } = {}): string[] {
  const { cx = 50, cy = 50, count = 9, step = 13, baseR = 14, wobble = 4 } = opts;
  return Array.from({ length: count }, (_, i) => smoothClosedPath(ring(cx, cy, baseR + i * step, wobble + i * 0.6, i)));
}
