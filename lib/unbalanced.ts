// Unbalanced snow load for hip & gable roofs — ASCE/SEI 7-22 §7.6.1. Wind blows
// snow from the windward slope onto the leeward slope, which is the case that
// often governs the ridge and leeward rafters. Pure, deterministic, transparent.
//
// Applies only to hip/gable roofs with slope between 2.38° (½-on-12) and 30.2°
// (7-on-12). Outside that band §7.6.1 says unbalanced need not be applied.
//
//   W ≤ 20 ft (simply supported ridge-to-eave): leeward = Is·Pg, windward = 0.
//   W > 20 ft: windward = 0.3·Ps; leeward = Ps + a ridge surcharge of intensity
//     hd·γ/√S extending 8·√S·hd/3 horizontally from the ridge, where
//     hd = 0.43·W^(1/3)·(Pg+10)^(1/4) − 1.5,  γ = 0.13·Pg + 14 ≤ 30 pcf,
//     S = roof run per unit rise = cot(slope).
import type { SnowInputs, SnowResult } from "./snow";

// Slope band (degrees) where §7.6.1 unbalanced load must be considered.
export const UNBAL_MIN_DEG = 2.38; // ½ on 12
export const UNBAL_MAX_DEG = 30.2; // 7 on 12

export interface UnbalancedResult {
  applies: boolean; // shape is gable/hip AND slope in the §7.6.1 band
  reason: string; // why it does / doesn't apply (shown to the user)
  simple: boolean; // true => W ≤ 20 ft simply-supported case
  windward: number; // windward-slope load, psf
  leewardBase: number; // leeward-slope uniform load, psf
  surchargeIntensity: number; // ridge drift surcharge intensity, psf (W>20 only)
  leewardPeak: number; // leeward load at the ridge = base + surcharge, psf
  surchargeWidth: number; // horizontal extent of the surcharge from the ridge, ft
  hd: number; // drift height, ft
  density: number; // γ, pcf
}

function r2(n: number) { return Math.round(n * 100) / 100; }

export function computeUnbalanced(inp: SnowInputs, r: SnowResult): UnbalancedResult {
  const empty: UnbalancedResult = {
    applies: false, reason: "", simple: false, windward: 0, leewardBase: 0,
    surchargeIntensity: 0, leewardPeak: 0, surchargeWidth: 0, hd: 0, density: r.density,
  };

  if (inp.shape !== "gable" && inp.shape !== "hip") {
    return { ...empty, reason: inp.shape === "monoslope"
      ? "Monoslope/shed roofs use the §7.6.2 unbalanced case (not the gable rule) — check it separately."
      : "Unbalanced snow load (§7.6.1) applies to hip and gable roofs." };
  }
  if (inp.slopeDeg < UNBAL_MIN_DEG) {
    return { ...empty, reason: `At ${inp.slopeDeg}° (below ½-on-12) §7.6.1 unbalanced load need not be applied.` };
  }
  if (inp.slopeDeg > UNBAL_MAX_DEG) {
    return { ...empty, reason: `At ${inp.slopeDeg}° (above 7-on-12) the roof is steep enough that §7.6.1 unbalanced load need not be applied.` };
  }

  const pg = Math.max(0, inp.pg);
  const density = Math.min(30, 0.13 * pg + 14);

  // W ≤ 20 ft, simply-supported ridge-to-eave members: simpler uniform case.
  if (inp.width <= 20) {
    const leeward = r.Is * pg;
    return {
      applies: true, simple: true,
      reason: "Small gable roof (W ≤ 20 ft): leeward side carries a uniform Is·Pg, windward side is unloaded.",
      windward: 0, leewardBase: r2(leeward), surchargeIntensity: 0,
      leewardPeak: r2(leeward), surchargeWidth: 0, hd: 0, density: r2(density),
    };
  }

  // W > 20 ft: 0.3·Ps windward, Ps + ridge drift surcharge leeward.
  const hd = Math.max(0, 0.43 * Math.cbrt(inp.width) * Math.pow(pg + 10, 0.25) - 1.5);
  const slopeRad = (inp.slopeDeg * Math.PI) / 180;
  const S = inp.slopeDeg > 0 ? 1 / Math.tan(slopeRad) : 1e9; // run per rise = cot(θ)
  const sqrtS = Math.sqrt(S);
  const intensity = sqrtS > 0 ? (hd * density) / sqrtS : 0;
  const width = (8 * sqrtS * hd) / 3;
  const windward = 0.3 * r.ps;
  const leewardPeak = r.ps + intensity;

  return {
    applies: true, simple: false,
    reason: "Large gable roof (W > 20 ft): windward side at 0.3·Ps, leeward side at Ps plus a drift surcharge from the ridge.",
    windward: r2(windward), leewardBase: r2(r.ps), surchargeIntensity: r2(intensity),
    leewardPeak: r2(leewardPeak), surchargeWidth: r2(width), hd: r2(hd), density: r2(density),
  };
}
