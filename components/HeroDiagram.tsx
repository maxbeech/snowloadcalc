"use client";

import { useMemo, useState } from "react";
import { computeSnow, type SnowInputs } from "@/lib/snow";
import RoofDiagram from "./RoofDiagram";

// Figure 1: the live roof section, set as an apparatus in a ruled frame the way
// an interactive figure would sit in a monograph. Abstract on purpose (a section,
// not the full form) but driven by the real ASCE 7-22 engine, so two gestures
// give a visitor the feel of the tool before they fill anything in.
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
    <div className="border border-ink-300 bg-paper shadow-[0_30px_60px_-36px_rgba(20,17,11,0.45)]">
      <RoofDiagram inp={inp} r={r} drawIn className="!border-0 !border-b border-ink-200" />

      <div className="grid grid-cols-3 divide-x divide-ink-200 border-b border-ink-200">
        {[
          { l: "Design load", v: r.design, u: "psf", hi: true },
          { l: "Settled depth", v: r.depth, u: "in" },
          { l: "Slope factor", v: r.Cs, u: "Cs" },
        ].map((s) => (
          <div key={s.l} className="px-3 py-2.5">
            <div className="label text-ink-400">{s.l}</div>
            <div className={`tabular font-display text-xl font-semibold ${s.hi ? "text-frost-600" : "text-ink-900"}`}>
              {s.v}<span className="ml-1 font-sans text-[10px] font-medium text-ink-400">{s.u}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="label text-ink-400">Roof slope</span>
            <span className="tabular font-mono text-xs text-frost-600">{slope}&deg;</span>
          </div>
          <input type="range" min={0} max={45} step={1} value={slope} aria-label="Roof slope"
            onChange={(e) => setSlope(Number(e.target.value))} className="mt-1.5 w-full accent-frost-600" />
        </div>
        <div className="flex items-center gap-3">
          <span className="label text-ink-400">Snow depth</span>
          <div className="flex flex-1 gap-1.5">
            {DEPTHS.map((d) => (
              <button key={d.k} onClick={() => setPg(d.pg)}
                className={`flex-1 border px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition ${pg === d.pg ? "border-frost-500 bg-frost-50 text-frost-700" : "border-ink-200 text-ink-500 hover:border-ink-400"}`}>
                {d.k}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
