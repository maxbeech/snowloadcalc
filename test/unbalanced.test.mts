// Verification of the ASCE 7-22 §7.6.1 unbalanced (gable/hip) engine against
// hand-computed values and the code's applicability band. Run via npm test.
import { computeSnow, type SnowInputs } from "../lib/snow.ts";
import { computeUnbalanced, UNBAL_MIN_DEG, UNBAL_MAX_DEG } from "../lib/unbalanced.ts";

let pass = 0, fail = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.error(`  FAIL ${name} ${detail}`); }
}
function near(name: string, got: number, want: number, tol = 0.3) {
  check(`${name} (=${got}, want ${want}±${tol})`, Math.abs(got - want) <= tol, `got ${got}`);
}

const gable = (o: Partial<SnowInputs> = {}): SnowInputs => ({
  pg: 40, risk: "II", terrain: "C", roofExposure: "partial", thermal: "heated",
  surface: "nonslippery", shape: "gable", slopeDeg: 18.43, width: 40, area: 0, ...o,
});

// --- Large gable (W=40 > 20), Pg=40, 4:12 (18.43°), warm non-slippery ---
// Pf = 0.7*40 = 28; Cs=1.0 at 18.43° -> Ps=28.
// hd = 0.43*cbrt(40)*(50)^.25 - 1.5 = 2.41 ft ; gamma = 0.13*40+14 = 19.2 pcf
// S = cot(18.43°) = 3.0 ; sqrtS = 1.732
// intensity = hd*gamma/sqrtS = 2.41*19.2/1.732 = 26.7 psf
// windward = 0.3*Ps = 8.4 ; leeward peak = 28 + 26.7 = 54.7
const A = gable();
const ra = computeSnow(A);
const ua = computeUnbalanced(A, ra);
check("applies (gable, in band, W>20)", ua.applies && !ua.simple);
near("hd", ua.hd, 2.41);
near("density gamma", ua.density, 19.2, 0.05);
near("windward = 0.3*Ps", ua.windward, 8.4, 0.1);
near("leeward base = Ps", ua.leewardBase, 28, 0.1);
near("surcharge intensity", ua.surchargeIntensity, 26.7, 0.5);
near("leeward peak", ua.leewardPeak, 54.7, 0.6);
near("surcharge width 8*sqrtS*hd/3", ua.surchargeWidth, 11.1, 0.3);
check("leeward peak > base", ua.leewardPeak > ua.leewardBase);

// --- Small gable (W=20): simple uniform leeward = Is*Pg, windward 0 ---
const B = gable({ width: 20 });
const ub = computeUnbalanced(B, computeSnow(B));
check("simple case at W=20", ub.applies && ub.simple);
near("simple leeward = Is*Pg", ub.leewardBase, 40, 0.1); // Is=1.0, Pg=40
check("simple windward = 0", ub.windward === 0);
// Risk IV scales the simple leeward by Is=1.2
const Biv = gable({ width: 18, risk: "IV" });
near("simple leeward Risk IV = 1.2*Pg", computeUnbalanced(Biv, computeSnow(Biv)).leewardBase, 48, 0.1);

// --- Applicability band: not below 2.38°, not above 30.2° ---
const flat0 = gable({ slopeDeg: 0 });
check("flat (0°) -> not applicable", !computeUnbalanced(flat0, computeSnow(flat0)).applies);
const steep = gable({ slopeDeg: 45 });
check("steep (45°) -> not applicable", !computeUnbalanced(steep, computeSnow(steep)).applies);
check("band constants", UNBAL_MIN_DEG === 2.38 && UNBAL_MAX_DEG === 30.2);

// --- Shape gates ---
const flatShape = gable({ shape: "flat" });
check("flat shape -> not applicable", !computeUnbalanced(flatShape, computeSnow(flatShape)).applies);
const mono = gable({ shape: "monoslope" });
const um = computeUnbalanced(mono, computeSnow(mono));
check("monoslope -> not applicable + §7.6.2 hint", !um.applies && um.reason.includes("7.6.2"));

// --- Hip roofs treated like gable ---
const hip = gable({ shape: "hip" });
check("hip applies like gable", computeUnbalanced(hip, computeSnow(hip)).applies);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
