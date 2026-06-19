// Geometry checks for the roof-section diagram. The visual is driven by these
// pure helpers, so they carry the test weight (path strings are exercised for
// shape, not pixel-compared). Run via npm test.
import { computeSnow, type SnowInputs } from "../lib/snow.ts";
import { apexRise, snowPx, roofLine, diagramGeometry, clamp, VIEW } from "../lib/diagram.ts";

let pass = 0, fail = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.error(`  FAIL ${name} ${detail}`); }
}

const base = (o: Partial<SnowInputs> = {}): SnowInputs => ({
  pg: 30, risk: "II", terrain: "C", roofExposure: "partial", thermal: "heated",
  surface: "nonslippery", shape: "gable", slopeDeg: 18.4, width: 30, area: 0, ...o,
});

// clamp
check("clamp below", clamp(-5, 0, 10) === 0);
check("clamp above", clamp(99, 0, 10) === 10);
check("clamp inside", clamp(5, 0, 10) === 5);

// apexRise: 0 at flat, increases with slope, capped in frame
check("apexRise flat = 0", apexRise(0) === 0);
check("apexRise monotonic", apexRise(30) > apexRise(10));
check("apexRise capped", apexRise(80) <= 78);

// snowPx: 0 with no snow, monotonic, clamped to [7,60]
check("snowPx zero", snowPx(0) === 0);
check("snowPx min floor", snowPx(0.1) >= 7);
check("snowPx monotonic", snowPx(40) >= snowPx(10));
check("snowPx capped", snowPx(999) === 60);

// roofLine shapes
check("flat line is 2 pts level", (() => { const l = roofLine("flat", 0); return l.length === 2 && l[0].y === l[1].y; })());
check("gable line is 3 pts, ridge highest", (() => { const l = roofLine("gable", 25); return l.length === 3 && l[1].y < l[0].y && l[1].y < l[2].y; })());
check("gable symmetric eaves", (() => { const l = roofLine("gable", 25); return l[0].y === l[2].y && l[0].x === VIEW.w - l[2].x; })());
check("monoslope rises left-to-right", (() => { const l = roofLine("monoslope", 15); return l.length === 2 && l[1].y < l[0].y; })());

// Full geometry: drift profile only when unbalanced governs (gable in band, W>20)
const bigGable = base({ width: 40, slopeDeg: 18.4 });
const gDrift = diagramGeometry(bigGable, computeSnow(bigGable));
check("drift path present for large in-band gable", gDrift.drifted !== null);
check("balanced path always present", gDrift.balanced.startsWith("M"));
check("silhouette closes (Z)", gDrift.silhouette.trim().endsWith("Z"));

const flat = base({ shape: "flat", slopeDeg: 0 });
const gFlat = diagramGeometry(flat, computeSnow(flat));
check("no drift on flat roof", gFlat.drifted === null);

const steep = base({ width: 40, slopeDeg: 50 });
const gSteep = diagramGeometry(steep, computeSnow(steep));
check("no drift above the §7.6.1 band (50°)", gSteep.drifted === null);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
