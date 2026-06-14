// Snow drift engine — ASCE/SEI 7-22 §7.7 drift loads on lower roofs at a roof
// step (and §7.8 against walls/parapets, same formula with the windward case).
// Pure, deterministic, transparent. Targets the "snow drift calculator" queries.
//
//   Snow density         γ = 0.13·Pg + 14  ≤ 30 pcf        (Eq. 7.7-1)
//   Balanced snow height hb = Ps / γ
//   Clear height         hc = stepHeight − hb
//   Leeward drift height hd = 0.43·(Lu)^(1/3)·(Pg+10)^(1/4) − 1.5   (Eq. 7.7-1)
//   Windward drift height hd_w = 0.75 · [0.43·(Ll)^(1/3)·(Pg+10)^(1/4) − 1.5]
//   Governing hd = max(leeward, windward), capped at hc.
//   Drift width   w = 4·hd      (if hd ≤ hc)   else   w = 4·hd²/hc  (≤ 8·hc)
//   Max surcharge pd = hd · γ      Peak total at step = Ps + pd

export interface DriftInputs {
  pg: number; // ground snow load, psf
  ps: number; // balanced (sloped) roof snow load on the lower roof, psf
  stepHeight: number; // height difference between upper and lower roof, ft
  lu: number; // length of the UPPER roof (leeward fetch), ft
  ll: number; // length of the LOWER roof (windward fetch), ft
}

export interface DriftResult {
  density: number; // γ, pcf
  hb: number; // balanced snow height, ft
  hc: number; // clear height above balanced snow, ft
  hdLeeward: number; // leeward drift height, ft
  hdWindward: number; // windward drift height, ft
  hd: number; // governing drift height (≤ hc), ft
  source: "leeward" | "windward";
  truncated: boolean; // true if drift was capped by the clear height hc
  width: number; // drift width w, ft
  surcharge: number; // peak drift surcharge load pd, psf
  peakLoad: number; // Ps + pd at the step, psf
  required: boolean; // whether drift must be considered (hc/hb ≥ 0.2)
}

function r2(n: number) { return Math.round(n * 100) / 100; }
function driftHeight(len: number, pg: number): number {
  // 0.43·L^(1/3)·(Pg+10)^(1/4) − 1.5, never negative.
  return Math.max(0, 0.43 * Math.cbrt(Math.max(0, len)) * Math.pow(pg + 10, 0.25) - 1.5);
}

export function computeDrift(inp: DriftInputs): DriftResult {
  const pg = Math.max(0, inp.pg);
  const density = Math.min(30, 0.13 * pg + 14);
  const hb = density > 0 ? inp.ps / density : 0;
  const hc = Math.max(0, inp.stepHeight - hb);

  const hdLeeward = driftHeight(inp.lu, pg);
  const hdWindward = 0.75 * driftHeight(inp.ll, pg);
  let hd = Math.max(hdLeeward, hdWindward);
  const source: "leeward" | "windward" = hdLeeward >= hdWindward ? "leeward" : "windward";

  // Drift need not be considered where the clear height is small (§7.7.1: hc/hb < 0.2).
  const required = hb > 0 ? hc / hb >= 0.2 : hc > 0;

  // The drift is truncated to a triangle of height hc when it would exceed it.
  let truncated = false;
  let width: number;
  if (hd <= hc) {
    width = 4 * hd;
  } else {
    truncated = true;
    width = Math.min(8 * hc, hc > 0 ? (4 * hd * hd) / hc : 0);
    hd = hc; // surcharge peak limited to the clear height
  }

  const surcharge = hd * density;
  const peakLoad = inp.ps + surcharge;

  return {
    density: r2(density), hb: r2(hb), hc: r2(hc),
    hdLeeward: r2(hdLeeward), hdWindward: r2(hdWindward), hd: r2(hd), source,
    truncated, width: r2(width), surcharge: r2(surcharge), peakLoad: r2(peakLoad), required,
  };
}

export const DEFAULT_DRIFT: DriftInputs = {
  pg: 40,
  ps: 28,
  stepHeight: 6,
  lu: 100,
  ll: 50,
};
