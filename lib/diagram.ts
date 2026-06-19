// Pure geometry for the roof-section diagram, the product's signature visual.
// It turns a snow computation into an SVG cross-section: the roof at its real
// slope and shape, carrying a snow blanket whose thickness tracks the load, with
// the §7.6.1 leeward drift drawn when it governs. No DOM, fully unit-tested.
import type { RoofShape, SnowInputs, SnowResult } from "./snow";
import { computeUnbalanced } from "./unbalanced";

export interface Pt { x: number; y: number }
export const VIEW = { w: 360, h: 220 };

const PAD = 42;            // left/right inset of the eaves
const EAVE_Y = 150;        // y of the eave line (wall top)
const GROUND_Y = 190;      // y of the ground datum
const RIDGE_X = VIEW.w / 2;
const HALF = RIDGE_X - PAD; // horizontal eave-to-ridge run, px
const MAX_RISE = 78;       // cap so a steep roof still fits the frame
const SNOW_K = 1.6;        // px of blanket per inch of settled snow
const SNOW_MIN = 7;
const SNOW_MAX = 60;

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

// Apex rise for a half-span at a given slope, capped to stay in frame.
export function apexRise(slopeDeg: number, half = HALF, max = MAX_RISE): number {
  const rise = half * Math.tan((clamp(slopeDeg, 0, 89) * Math.PI) / 180);
  return Math.round(clamp(rise, 0, max));
}

// Blanket thickness in px from a settled snow depth (inches). Monotonic + clamped.
export function snowPx(depthIn: number): number {
  if (depthIn <= 0) return 0;
  return Math.round(clamp(depthIn * SNOW_K, SNOW_MIN, SNOW_MAX));
}

// The top edge of the roof as a left-to-right polyline (shape + slope aware).
export function roofLine(shape: RoofShape, slopeDeg: number): Pt[] {
  const L = PAD, R = VIEW.w - PAD;
  if (shape === "monoslope") {
    const rise = apexRise(slopeDeg, HALF * 2);
    return [{ x: L, y: EAVE_Y }, { x: R, y: EAVE_Y - rise }];
  }
  if (shape === "flat") return [{ x: L, y: EAVE_Y }, { x: R, y: EAVE_Y }];
  const rise = apexRise(slopeDeg); // gable / hip
  return [{ x: L, y: EAVE_Y }, { x: RIDGE_X, y: EAVE_Y - rise }, { x: R, y: EAVE_Y }];
}

const path = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");

// Closed building silhouette (roof + walls down to the ground datum).
export function roofSilhouette(line: Pt[]): string {
  const last = line[line.length - 1], first = line[0];
  return `${path(line)} L${last.x} ${GROUND_Y} L${first.x} ${GROUND_Y} Z`;
}

// A blanket of uniform thickness sitting on the roof line, closed back along it.
function blanket(line: Pt[], top: number[]): string {
  const upper = line.map((p, i) => ({ x: p.x, y: p.y - top[i] }));
  const lower = [...line].reverse();
  return `${path(upper)} ${lower.map((p) => `L${p.x} ${p.y}`).join(" ")} Z`;
}

export interface DiagramGeometry {
  line: Pt[];
  silhouette: string;
  balanced: string;          // balanced snow blanket path
  drifted: string | null;    // §7.6.1 unbalanced profile, when it governs
  ground: { y: number; x1: number; x2: number };
  depthIn: number;
  thickness: number;         // balanced blanket px (for the depth label)
  ridge: Pt;
}

// Assemble everything the <RoofDiagram> needs from one computation.
export function diagramGeometry(inp: SnowInputs, r: SnowResult): DiagramGeometry {
  const line = roofLine(inp.shape, inp.slopeDeg);
  const t = snowPx(r.depth);
  const balanced = blanket(line, line.map(() => t));

  let drifted: string | null = null;
  const unbal = computeUnbalanced(inp, r);
  if (unbal.applies && line.length === 3 && r.design > 0) {
    // Ratio each unbalanced load to the balanced design load, then to px.
    const tWind = clamp((unbal.windward / r.design) * t, 2, SNOW_MAX);
    const tBase = clamp((unbal.leewardBase / r.design) * t, SNOW_MIN, SNOW_MAX);
    const tPeak = clamp((unbal.leewardPeak / r.design) * t, tBase, SNOW_MAX + 18);
    const [eaveL, ridge, eaveR] = line;
    // Windward (left) thin + uniform; leeward (right) drifts to a ridge peak.
    const upper: Pt[] = [
      { x: eaveL.x, y: eaveL.y - tWind },
      { x: ridge.x - 2, y: ridge.y - tWind },
      { x: ridge.x + 2, y: ridge.y - tPeak },
      { x: eaveR.x, y: eaveR.y - tBase },
    ];
    drifted = `${path(upper)} L${eaveR.x} ${eaveR.y} L${ridge.x} ${ridge.y} L${eaveL.x} ${eaveL.y} Z`;
  }

  return {
    line,
    silhouette: roofSilhouette(line),
    balanced,
    drifted,
    ground: { y: GROUND_Y, x1: 10, x2: VIEW.w - 10 },
    depthIn: r.depth,
    thickness: t,
    ridge: line.length === 3 ? line[1] : { x: RIDGE_X, y: EAVE_Y },
  };
}
