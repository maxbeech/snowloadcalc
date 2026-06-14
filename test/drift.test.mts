// Verification of the ASCE 7-22 §7.7 snow drift engine against hand-computed
// values. Run via npm test.
import { computeDrift, type DriftInputs } from "../lib/drift.ts";

let pass = 0, fail = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.error(`  FAIL ${name} ${detail}`); }
}
function near(name: string, got: number, want: number, tol = 0.05) {
  check(`${name} (=${got}, want ${want}±${tol})`, Math.abs(got - want) <= tol, `got ${got}`);
}

const base: DriftInputs = { pg: 30, ps: 21, stepHeight: 6, lu: 100, ll: 50 };
const r = computeDrift(base);

// γ = 0.13*30 + 14 = 17.9 pcf
near("density", r.density, 17.9);
// hb = 21 / 17.9 = 1.173 ft
near("balanced height hb", r.hb, 1.17, 0.02);
// hc = 6 - 1.173 = 4.83 ft
near("clear height hc", r.hc, 4.83, 0.02);
// hd_leeward = 0.43*cbrt(100)*(40)^.25 - 1.5 = 3.52 ft
near("leeward drift height", r.hdLeeward, 3.52, 0.03);
// hd_windward = 0.75*(0.43*cbrt(50)*(40)^.25 - 1.5) = 1.86 ft
near("windward drift height", r.hdWindward, 1.86, 0.03);
check("leeward governs", r.source === "leeward");
check("not truncated (hd < hc)", r.truncated === false);
// width = 4*hd = 14.08 ft
near("drift width", r.width, 14.08, 0.1);
// surcharge = hd*γ = 3.52*17.9 = 63.0 psf ; peak = 21 + 63 = 84
near("surcharge pd", r.surcharge, 63.0, 0.5);
near("peak load", r.peakLoad, 84.0, 0.5);
check("drift required (hc/hb >= 0.2)", r.required === true);

// --- Truncation when the step is shallow (hd would exceed hc) ---
const t = computeDrift({ ...base, stepHeight: 2 }); // hc = 2 - 1.173 = 0.827
check("truncated when hd > hc", t.truncated === true);
near("hd capped at hc", t.hd, t.hc, 0.01);

// --- Drift not required when clear height is small (hc/hb < 0.2) ---
// hb ~ 1.173; need hc < 0.2346 -> stepHeight ~ 1.30
const n = computeDrift({ ...base, stepHeight: 1.3 });
check("drift not required when hc/hb < 0.2", n.required === false, `hc=${n.hc} hb=${n.hb}`);

// --- Larger upper roof -> larger leeward drift ---
check("longer Lu -> taller drift", computeDrift({ ...base, lu: 300 }).hdLeeward > r.hdLeeward);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
