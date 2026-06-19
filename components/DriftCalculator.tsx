"use client";

import { useMemo, useState } from "react";
import { computeDrift, DEFAULT_DRIFT, type DriftInputs } from "@/lib/drift";

const fieldCls =
  "mt-1 w-full tabular rounded-lg border border-ink-200 bg-white px-3 py-2 font-mono text-sm text-ink-900 transition focus-visible:border-frost-400 focus-visible:ring-2 focus-visible:ring-frost-200 focus:outline-none";

function NumField({ value, min, max, step = 1, onChange, ariaLabel }:
  { value: number; min: number; max: number; step?: number; onChange: (n: number) => void; ariaLabel: string }) {
  const [raw, setRaw] = useState(String(value));
  return (
    <input type="number" inputMode="decimal" min={min} max={max} step={step} className={fieldCls} value={raw} aria-label={ariaLabel}
      onChange={(e) => { setRaw(e.target.value); const n = Number(e.target.value); if (e.target.value !== "" && Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n))); }}
      onBlur={() => { const n = raw === "" ? min : Math.min(max, Math.max(min, Number(raw) || min)); setRaw(String(n)); onChange(n); }} />
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-ink-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs leading-snug text-ink-400">{hint}</span>}
    </label>
  );
}

// Schematic of the roof step and the drift wedge built against it.
function StepDiagram({ stepPx, driftPx, driftWide, required }:
  { stepPx: number; driftPx: number; driftWide: number; required: boolean }) {
  const baseY = 130, stepX = 196, lowerSnowTop = baseY - 8;
  const wedgeLeft = Math.max(40, stepX - driftWide);
  return (
    <svg viewBox="0 0 320 170" className="w-full" role="img" aria-label="Roof step with snow drift">
      <line x1="14" y1="150" x2="306" y2="150" className="stroke-ink-200" strokeWidth="1" />
      {/* upper roof block */}
      <path d={`M${stepX} ${baseY} L${stepX} ${baseY - stepPx} L300 ${baseY - stepPx} L300 150 L${stepX} 150 Z`} className="fill-ink-700" />
      {/* lower roof slab */}
      <path d={`M20 ${baseY} L${stepX} ${baseY} L${stepX} 150 L20 150 Z`} className="fill-ink-600" />
      {/* balanced snow on lower roof */}
      <path d={`M20 ${lowerSnowTop} L${stepX} ${lowerSnowTop} L${stepX} ${baseY} L20 ${baseY} Z`} fill="#cef7fb" className="stroke-frost-300" strokeWidth="1" />
      {/* drift wedge against the step */}
      {required && driftPx > 0 && (
        <path d={`M${stepX} ${lowerSnowTop} L${stepX} ${lowerSnowTop - driftPx} L${wedgeLeft} ${lowerSnowTop} Z`} fill="#f0c06a" className="stroke-load-600" strokeWidth="1" />
      )}
      <text x="26" y={baseY - 13} className="fill-frost-700 font-mono text-[9px]">lower roof</text>
      <text x={stepX + 8} y={baseY - stepPx + 13} className="fill-frost-100 font-mono text-[9px]">upper roof</text>
    </svg>
  );
}

export default function DriftCalculator() {
  const [inp, setInp] = useState<DriftInputs>(DEFAULT_DRIFT);
  const r = useMemo(() => computeDrift(inp), [inp]);
  const set = <K extends keyof DriftInputs>(k: K, v: number) => setInp((p) => ({ ...p, [k]: v }));
  const stepPx = Math.max(10, Math.min(70, inp.stepHeight * 7));
  const driftPx = Math.max(0, Math.min(stepPx, r.hd * 7));
  const driftWide = Math.max(20, Math.min(150, r.width * 4));

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm ring-machined">
        <h2 className="font-display text-sm font-semibold text-ink-900">Roof step</h2>
        <div className="mt-4 space-y-3.5">
          <Field label="Ground snow load, Pg (psf)"><NumField value={inp.pg} min={0} max={400} onChange={(n) => set("pg", n)} ariaLabel="Ground snow load" /></Field>
          <Field label="Lower-roof balanced load, Ps (psf)" hint="From the main calculator."><NumField value={inp.ps} min={0} max={400} onChange={(n) => set("ps", n)} ariaLabel="Lower roof balanced load" /></Field>
          <Field label="Step height (ft)" hint="Upper roof minus lower roof."><NumField value={inp.stepHeight} min={0} max={100} step={0.5} onChange={(n) => set("stepHeight", n)} ariaLabel="Step height" /></Field>
          <Field label="Upper roof length, Lu (ft)" hint="Leeward fetch feeding the drift."><NumField value={inp.lu} min={5} max={1000} onChange={(n) => set("lu", n)} ariaLabel="Upper roof length" /></Field>
          <Field label="Lower roof length, Ll (ft)" hint="Windward fetch."><NumField value={inp.ll} min={5} max={1000} onChange={(n) => set("ll", n)} ariaLabel="Lower roof length" /></Field>
        </div>
      </div>

      <div className="space-y-4">
        <figure className="overflow-hidden rounded-2xl border border-ink-100 bg-gradient-to-b from-ink-50/70 to-white p-3">
          <StepDiagram stepPx={stepPx} driftPx={driftPx} driftWide={driftWide} required={r.required} />
        </figure>
        <div className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 p-5 text-white">
          <div className="bg-blueprint-dark absolute inset-0 opacity-70" aria-hidden />
          <div className="relative">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-frost-300">Peak load at the step</div>
            <div className="tabular mt-1 font-display text-4xl font-bold">{r.peakLoad}<span className="ml-2 text-lg font-semibold text-ink-200">psf</span></div>
            <p className="mt-2 text-sm leading-relaxed text-ink-100">
              {r.required
                ? `Drift surcharge of +${r.surcharge} psf (${r.source}) over a ${r.width} ft width, on top of the ${inp.ps} psf balanced load.`
                : "Clear height is small (hc/hb < 0.2), so ASCE 7 §7.7 says drift need not be considered here."}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-4">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-ink-50">
              {[
                ["Snow density, γ", `${r.density} pcf`], ["Balanced snow height, hb", `${r.hb} ft`],
                ["Clear height, hc", `${r.hc} ft`], ["Leeward drift height", `${r.hdLeeward} ft`],
                ["Windward drift height", `${r.hdWindward} ft`], ["Governing drift height, hd", `${r.hd} ft${r.truncated ? " (capped)" : ""}`],
              ].map(([k, v]) => (
                <tr key={k}><td className="py-1.5 text-ink-500">{k}</td><td className="tabular py-1.5 text-right font-mono font-semibold text-ink-900">{v}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-ink-400">§7.7: hd = 0.43·(L)^(1/3)·(Pg+10)^(1/4) − 1.5; surcharge pd = hd·γ. Windward case uses 0.75× of the lower-roof fetch.</p>
        </div>
      </div>
    </div>
  );
}
