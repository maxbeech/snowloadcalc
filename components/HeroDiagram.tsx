"use client";

import { useMemo, useState } from "react";
import { computeSnow, type SnowInputs } from "@/lib/snow";
import RoofDiagram from "./RoofDiagram";

// The hero's instrument. A dark machined housing around the bright roof-section
// display, with live readouts and two controls. Abstract on purpose (a roof
// section, not the full form) but driven by the real ASCE 7-22 engine, so two
// gestures give a visitor the feel of the tool before they fill anything in.
const DEPTHS: { k: string; pg: number }[] = [
  { k: "Light", pg: 15 },
  { k: "Moderate", pg: 35 },
  { k: "Heavy", pg: 70 },
];

export default function HeroDiagram() {
  const [slope, setSlope] = useState(22);
  const [pg, setPg] = useState(35);

  const inp: SnowInputs = useMemo(() => ({
    pg, risk: "II", terrain: "C", roofExposure: "partial", thermal: "heated",
    surface: "nonslippery", shape: "gable", slopeDeg: slope, width: 40, area: 0,
  }), [pg, slope]);
  const r = useMemo(() => computeSnow(inp), [inp]);

  return (
    <div className="relative rounded-[26px] border border-white/10 bg-ink-900/80 p-3 shadow-[0_50px_90px_-40px_rgba(0,0,0,0.7)] backdrop-blur-xl">
      {/* machined housing details: registration corner marks + a tick rule bezel */}
      <span className="pointer-events-none absolute left-2.5 top-2.5 h-3 w-3 border-l border-t border-frost-400/50" aria-hidden />
      <span className="pointer-events-none absolute right-2.5 top-2.5 h-3 w-3 border-r border-t border-frost-400/50" aria-hidden />
      <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l border-frost-400/50" aria-hidden />
      <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-3 w-3 border-b border-r border-frost-400/50" aria-hidden />
      <div className="absolute bottom-6 left-1.5 top-6 w-2 text-white/15 tick-rule" aria-hidden />

      <div className="overflow-hidden rounded-2xl">
        <RoofDiagram inp={inp} r={r} drawIn />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
        {[
          { l: "Design load", v: r.design, u: "psf", hi: true },
          { l: "Settled depth", v: r.depth, u: "in" },
          { l: "Slope factor", v: r.Cs, u: "Cs" },
        ].map((s) => (
          <div key={s.l} className="bg-ink-900 px-3 py-2.5">
            <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-300">{s.l}</div>
            <div className={`tabular font-display text-xl font-bold ${s.hi ? "text-frost-300" : "text-white"}`}>
              {s.v}<span className="ml-1 text-[10px] font-medium text-ink-400">{s.u}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-3 px-1 pb-1">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-ink-200">
            <span className="uppercase tracking-[0.1em] text-ink-400">Roof slope</span>
            <span className="tabular font-mono text-frost-300">{slope}&deg;</span>
          </div>
          <input type="range" min={0} max={45} step={1} value={slope} aria-label="Roof slope"
            onChange={(e) => setSlope(Number(e.target.value))} className="mt-1.5 w-full accent-frost-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-400">Snow depth</span>
          <div className="flex flex-1 gap-1.5">
            {DEPTHS.map((d) => (
              <button key={d.k} onClick={() => setPg(d.pg)}
                className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${pg === d.pg ? "border-frost-400/50 bg-frost-400/15 text-frost-200" : "border-white/10 bg-white/5 text-ink-200 hover:border-white/25"}`}>
                {d.k}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
