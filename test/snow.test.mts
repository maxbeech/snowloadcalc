// Verification of the ASCE 7-22 roof snow load engine against hand-computed
// values and physical sanity checks. Run: npm test (tsx test/snow.test.mts)
import { computeSnow, slopeFactor, CE, CT, IS, type SnowInputs } from "../lib/snow.ts";

let pass = 0, fail = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.error(`  FAIL ${name} ${detail}`); }
}
function near(name: string, got: number, want: number, tol = 0.05) {
  check(`${name} (=${got}, want ${want}±${tol})`, Math.abs(got - want) <= tol, `got ${got}`);
}

const flat = (o: Partial<SnowInputs> = {}): SnowInputs => ({
  pg: 30, risk: "II", terrain: "C", roofExposure: "partial", thermal: "heated",
  surface: "nonslippery", slopeDeg: 0, width: 40, area: 0, ...o,
});

// --- Textbook flat-roof case: Pf = 0.7·1·1·1·30 = 21 psf ---
const a = computeSnow(flat());
near("flat Pf (Pg=30, all factors 1.0)", a.pf, 21);
near("flat Ps == Pf (Cs=1 on flat)", a.ps, 21);
near("minimum Pm = Is·min(Pg,20) = 20", a.pm, 20);
near("design governs balanced 21", a.design, 21);
check("governs balanced", a.governs === "balanced");

// --- Minimum governs when Pf < Pm and no rain-on-snow ---
// Pg=25 (>20 so no ROS), flat, all 1.0: Pf=17.5, Pm=Is·20=20 -> min governs.
const b = computeSnow(flat({ pg: 25 }));
near("Pf (Pg=25)", b.pf, 17.5);
near("Pm = 20", b.pm, 20);
near("design = 20 (minimum governs)", b.design, 20);
check("governs minimum", b.governs === "minimum");

// --- Rain-on-snow: Pg<=20, near-flat, slope < W/50 -> +5 psf ---
const c = computeSnow(flat({ pg: 15 })); // Pf=10.5, slope 0 < 40/50=0.8 -> +5
near("Pf (Pg=15)", c.pf, 10.5);
near("rain-on-snow +5", c.rainOnSnow, 5);
near("balanced = Pf + 5", c.balanced, 15.5);
// No ROS once Pg > 20:
check("no ROS when Pg>20", computeSnow(flat({ pg: 30 })).rainOnSnow === 0);
// No ROS when slope exceeds W/50:
check("no ROS when slope >= W/50", computeSnow(flat({ pg: 15, slopeDeg: 10 })).rainOnSnow === 0);

// --- Sloped roof: warm, non-slippery. Cs=1 to 30°, then linear to 0 at 70° ---
near("Cs warm non-slip @30deg = 1.0", slopeFactor(30, 1.0, "nonslippery"), 1.0);
near("Cs warm non-slip @45deg", slopeFactor(45, 1.0, "nonslippery"), 0.625, 0.01); // 1-(45-30)/40
near("Cs warm slippery @45deg", slopeFactor(45, 1.0, "slippery"), 0.3846, 0.01); // (70-45)/65
near("Cs cold(1.2) slip @40deg", slopeFactor(40, 1.2, "slippery"), 0.5454, 0.01); // (70-40)/55
near("Cs at 70deg = 0", slopeFactor(70, 1.0, "nonslippery"), 0);

const s40 = computeSnow(flat({ pg: 40, slopeDeg: 45 }));
near("sloped Pf (Pg=40)", s40.pf, 28);
near("sloped Ps @45 warm non-slip = 0.625*28", s40.ps, 17.5, 0.1);

// --- Importance factor scales the load ---
near("Is for Risk IV", IS.IV, 1.2);
near("Pf with Risk IV = 1.2 * base", computeSnow(flat({ risk: "IV" })).pf, 25.2, 0.1);

// --- Exposure / thermal table spot-checks (single source of truth) ---
check("Ce[B][sheltered]=1.2", CE.B.sheltered === 1.2);
check("Ce[D][fully]=0.8", CE.D.fully === 0.8);
check("Ct unheated=1.2", CT.unheated === 1.2);
check("Ct greenhouse=0.85", CT.greenhouse === 0.85);

// --- Snow density (Eq. 7.7-1) capped at 30 pcf ---
near("density Pg=30 = 17.9", computeSnow(flat({ pg: 30 })).density, 17.9, 0.05);
check("density capped at 30", computeSnow(flat({ pg: 200 })).density === 30);

// --- Monotonicity + total weight ---
check("higher Pg -> higher design", computeSnow(flat({ pg: 50 })).design > computeSnow(flat({ pg: 20 })).design);
const w = computeSnow(flat({ pg: 30, area: 1000 }));
near("total weight = design * area", w.totalWeightLb ?? 0, w.design * 1000, 1);

// --- Pg = 0 produces zero load, no NaN ---
const z = computeSnow(flat({ pg: 0 }));
check("Pg=0 -> design 0, finite", z.design === 0 && Number.isFinite(z.depth));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
