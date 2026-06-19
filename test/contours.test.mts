// Geometry checks for the topographic contour motif. Pure path generation, so
// we assert shape/validity and determinism (no Math.random => stable SSR/CSR).
import { smoothClosedPath, contourField, type Pt } from "../lib/contours.ts";

let pass = 0, fail = 0;
function check(name: string, cond: boolean, d = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.error(`  FAIL ${name} ${d}`); }
}

// smoothClosedPath
check("empty for <3 points", smoothClosedPath([[0, 0], [1, 1]] as Pt[]) === "");
const tri = smoothClosedPath([[0, 0], [10, 0], [5, 10]]);
check("starts with M, ends with Z", tri.startsWith("M") && tri.trim().endsWith("Z"));
check("emits cubic beziers", (tri.match(/C/g) || []).length === 3);

// contourField
const f = contourField();
check("default field has 9 contours", f.length === 9);
check("all contours are valid closed paths", f.every((p) => p.startsWith("M") && p.endsWith("Z")));
check("rings grow outward (later path spans wider)", (() => {
  const span = (p: string) => { const xs = (p.match(/-?\d+\.?\d*/g) || []).map(Number).filter((_, i) => i % 2 === 0); return Math.max(...xs) - Math.min(...xs); };
  return span(f[8]) > span(f[0]);
})());

// determinism: same inputs -> identical output (critical for hydration)
check("deterministic across calls", JSON.stringify(contourField({ count: 4 })) === JSON.stringify(contourField({ count: 4 })));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
