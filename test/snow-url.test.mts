// Verify URL encode/decode round-trips and that stale / tracking-only links
// never produce NaN or out-of-range inputs.
import { encodeInputs, decodeInputs } from "../lib/snow-url.ts";
import { DEFAULT_SNOW, type SnowInputs } from "../lib/snow.ts";

let pass = 0, fail = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.error(`  FAIL ${name} ${detail}`); }
}

const sample: SnowInputs = {
  pg: 42, risk: "III", terrain: "D", roofExposure: "fully", thermal: "unheated",
  surface: "slippery", slopeDeg: 33.5, width: 60, area: 2400,
};

// Round-trip
const decoded = decodeInputs("?" + encodeInputs(sample));
check("pg round-trips", decoded.pg === sample.pg, `${decoded.pg}`);
check("risk round-trips", decoded.risk === sample.risk);
check("terrain round-trips", decoded.terrain === sample.terrain);
check("thermal round-trips", decoded.thermal === sample.thermal);
check("surface round-trips", decoded.surface === sample.surface);
check("slope round-trips", decoded.slopeDeg === sample.slopeDeg, `${decoded.slopeDeg}`);
check("width round-trips", decoded.width === sample.width);
check("area round-trips", decoded.area === sample.area);

// Empty search -> defaults (merged with seed)
const d0 = decodeInputs("");
check("empty -> default pg", d0.pg === DEFAULT_SNOW.pg);

// Tracking-only link -> defaults, NOT zero (the Number(null)===0 trap)
const dT = decodeInputs("?utm_source=google&fbclid=abc");
check("tracking-only -> default pg (not 0)", dT.pg === DEFAULT_SNOW.pg, `${dT.pg}`);

// Seed overrides default when no params
const dSeed = decodeInputs("", { pg: 55 });
check("seed applies when no params", dSeed.pg === 55);

// Out-of-range / garbage values are clamped or fall back
const dBad = decodeInputs("?pg=99999&sl=400&r=ZZ&te=Q");
check("pg clamped to 400", dBad.pg === 400, `${dBad.pg}`);
check("slope clamped to 70", dBad.slopeDeg === 70, `${dBad.slopeDeg}`);
check("bad risk -> default", dBad.risk === DEFAULT_SNOW.risk);
check("bad terrain -> default", dBad.terrain === DEFAULT_SNOW.terrain);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
