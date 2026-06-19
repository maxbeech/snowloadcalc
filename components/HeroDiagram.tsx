"use client";

import { useMemo, useState } from "react";
import { computeSnow, type SnowInputs } from "@/lib/snow";
import RoofDiagram from "./RoofDiagram";

// The hero's interactive illustration. Abstract on purpose (a roof section, not
// a full form) but driven by the real engine, so dragging the slope or stepping
// the snow depth shows the actual ASCE 7-22 response. It gives a visitor the
// feel of the tool in two gestures before they ever fill anything in.
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
    <div className="rounded-3xl border border-ink-100 bg-white/70 p-3 shadow-[0_40px_80px_-40px_rgba(10,22,34,0.5)] backdrop-blur">
      <RoofDiagram inp={inp} r={r} />
      <div className="mt-3 space-y-3 px-2 pb-1">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-ink-500">
            <span>Roof slope</span>
            <span className="tabular font-mono text-frost-700">{slope}°</span>
          </div>
          <input type="range" min={0} max={45} step={1} value={slope}
            aria-label="Roof slope" onChange={(e) => setSlope(Number(e.target.value))}
            className="mt-1.5 w-full accent-frost-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-ink-500">Snow depth</span>
          <div className="flex flex-1 gap-1.5">
            {DEPTHS.map((d) => (
              <button key={d.k} onClick={() => setPg(d.pg)}
                className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${pg === d.pg ? "border-frost-300 bg-frost-50 text-frost-700" : "border-ink-100 bg-white text-ink-500 hover:border-frost-200"}`}>
                {d.k}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
