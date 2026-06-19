"use client";

import { useMemo, useState } from "react";
import type { SnowInputs, SnowResult } from "@/lib/snow";
import { diagramGeometry, VIEW } from "@/lib/diagram";

// The roof-section diagram. Reads a live computation and draws it as an
// engineering cross-section: roof at true slope, a snow blanket sized to the
// load, dimension lines and a mono readout. When the §7.6.1 leeward drift
// governs, a toggle reveals the drifted profile. Used in the hero, the results
// panel and (statically) as marketing mockups.
export default function RoofDiagram({ inp, r, interactive = true, drawIn = false, className = "" }:
  { inp: SnowInputs; r: SnowResult; interactive?: boolean; drawIn?: boolean; className?: string }) {
  const g = useMemo(() => diagramGeometry(inp, r), [inp, r]);
  const [mode, setMode] = useState<"balanced" | "drift">("balanced");
  const showDrift = g.drifted !== null && mode === "drift";
  // Anchor the depth dimension on the real roof surface at mid-span (the ridge
  // for a gable, the interpolated centre for a flat or monoslope roof).
  const mid = g.line.length === 3
    ? { x: g.line[1].x, y: g.line[1].y }
    : { x: VIEW.w / 2, y: (g.line[0].y + g.line[1].y) / 2 };
  // Ground hatch ticks, the classic "this is the datum" drawing convention.
  const hatch = Array.from({ length: 17 }, (_, i) => g.ground.x1 + 8 + i * 20);

  return (
    <figure className={`relative overflow-hidden border border-ink-300 bg-gradient-to-b from-frost-50/70 to-paper ${className}`}>
      <div className="bg-grid absolute inset-0 opacity-70" aria-hidden />
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="relative w-full" role="img"
        aria-label={`Roof section: design snow load ${r.design} psf on a ${inp.slopeDeg} degree ${inp.shape} roof`}>
        <defs>
          <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#eaf0f1" />
            <stop offset="1" stopColor="#c9d8db" />
          </linearGradient>
          <linearGradient id="drift" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ecd1c2" />
            <stop offset="1" stopColor="#cf9a7f" />
          </linearGradient>
          <filter id="snowShade" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#1d1a12" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* Ground datum + hatch */}
        <line x1={g.ground.x1} y1={g.ground.y} x2={g.ground.x2} y2={g.ground.y} className="stroke-ink-300" strokeWidth="1" />
        {hatch.map((x) => (
          <line key={x} x1={x} y1={g.ground.y} x2={x - 7} y2={g.ground.y + 8} className="stroke-ink-200" strokeWidth="1" />
        ))}

        {/* Roof body */}
        <path d={g.silhouette} className="fill-ink-700" />
        <path d={g.silhouette} className={`fill-none stroke-ink-900 ${drawIn ? "roof-draw" : ""}`} strokeWidth="1.5" strokeLinejoin="round" />

        {/* Snow: balanced blanket, or the drifted profile when toggled */}
        <g key={`${g.thickness}-${mode}`} className="animate-settle" style={{ transformOrigin: `${mid.x}px ${g.ground.y}px` }} filter="url(#snowShade)">
          <path d={showDrift && g.drifted ? g.drifted : g.balanced}
            fill={showDrift ? "url(#drift)" : "url(#snow)"}
            className={showDrift ? "stroke-load-500" : "stroke-frost-400"} strokeWidth="1.5" strokeLinejoin="round" />
        </g>

        {/* Wind direction arrow when showing the drift case */}
        {showDrift && (
          <g className="stroke-load-600 fill-load-600">
            <line x1="46" y1="58" x2="92" y2="58" strokeWidth="1.5" />
            <path d="M92 58 L85 54 L85 62 Z" />
            <text x="46" y="50" className="fill-load-700 font-mono text-[10px]">wind</text>
          </g>
        )}

        {/* Depth dimension line at mid-span */}
        {g.thickness > 0 && (
          <g className="stroke-frost-600">
            <line x1={mid.x} y1={mid.y - g.thickness} x2={mid.x} y2={mid.y} strokeWidth="1" />
            <line x1={mid.x - 3} y1={mid.y - g.thickness + 2} x2={mid.x + 3} y2={mid.y - g.thickness + 2} strokeWidth="1" />
            <text x={mid.x + 7} y={mid.y - g.thickness / 2 + 3} className="fill-frost-700 font-mono text-[10px]" style={{ stroke: "none" }}>
              ≈{g.depthIn}&quot;
            </text>
          </g>
        )}

        {/* Readout cartouche */}
        <g>
          <rect x="14" y="14" width="120" height="40" className="fill-paper stroke-ink-300" />
          <text x="23" y="31" className="fill-ink-400 font-mono text-[9px] uppercase" style={{ letterSpacing: "0.14em" }}>Design load</text>
          <text x="23" y="49" className="fill-frost-600 font-display text-[19px] font-semibold">{r.design}<tspan className="fill-ink-400 font-sans text-[10px]"> psf</tspan></text>
        </g>
      </svg>

      {interactive && g.drifted && (
        <div className="absolute bottom-3 right-3 flex border border-ink-300 bg-paper/95 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
          {(["balanced", "drift"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-2.5 py-1 transition ${mode === m ? "bg-ink-900 text-paper" : "text-ink-500 hover:text-ink-900"}`}>
              {m === "balanced" ? "Balanced" : "Unbalanced"}
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}
