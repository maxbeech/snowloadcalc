"use client";

import { useMemo, useState } from "react";
import { computeDrift, DEFAULT_DRIFT, type DriftInputs } from "@/lib/drift";

const selectCls =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus:outline-none";

function NumField({ value, min, max, step = 1, onChange, ariaLabel }:
  { value: number; min: number; max: number; step?: number; onChange: (n: number) => void; ariaLabel: string }) {
  const [raw, setRaw] = useState(String(value));
  return (
    <input type="number" inputMode="decimal" min={min} max={max} step={step} className={selectCls} value={raw}
      aria-label={ariaLabel}
      onChange={(e) => { setRaw(e.target.value); const n = Number(e.target.value); if (e.target.value !== "" && Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n))); }}
      onBlur={() => { const n = raw === "" ? min : Math.min(max, Math.max(min, Number(raw) || min)); setRaw(String(n)); onChange(n); }} />
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-0.5 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

export default function DriftCalculator() {
  const [inp, setInp] = useState<DriftInputs>(DEFAULT_DRIFT);
  const r = useMemo(() => computeDrift(inp), [inp]);
  const set = <K extends keyof DriftInputs>(k: K, v: number) => setInp((p) => ({ ...p, [k]: v }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Roof step</h2>
        <div className="mt-3 space-y-3">
          <Field label="Ground snow load, Pg (psf)"><NumField value={inp.pg} min={0} max={400} onChange={(n) => set("pg", n)} ariaLabel="Ground snow load" /></Field>
          <Field label="Lower-roof balanced load, Ps (psf)" hint="From the main calculator."><NumField value={inp.ps} min={0} max={400} onChange={(n) => set("ps", n)} ariaLabel="Lower roof balanced load" /></Field>
          <Field label="Step height (ft)" hint="Upper roof minus lower roof."><NumField value={inp.stepHeight} min={0} max={100} step={0.5} onChange={(n) => set("stepHeight", n)} ariaLabel="Step height" /></Field>
          <Field label="Upper roof length, Lu (ft)" hint="Leeward fetch feeding the drift."><NumField value={inp.lu} min={5} max={1000} onChange={(n) => set("lu", n)} ariaLabel="Upper roof length" /></Field>
          <Field label="Lower roof length, Ll (ft)" hint="Windward fetch."><NumField value={inp.ll} min={5} max={1000} onChange={(n) => set("ll", n)} ariaLabel="Lower roof length" /></Field>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-300">Peak load at the step</div>
          <div className="mt-0.5 text-4xl font-bold">{r.peakLoad}<span className="ml-1 text-lg font-medium text-slate-300">psf</span></div>
          <p className="mt-1 text-sm text-slate-200">
            {r.required
              ? `Drift surcharge +${r.surcharge} psf (${r.source}) over a ${r.width} ft width, on top of the ${inp.ps} psf balanced load.`
              : "Clear height is small (hc/hb < 0.2) — ASCE 7 §7.7 says drift need not be considered here."}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              <tr><td className="py-1.5 text-slate-600">Snow density, γ</td><td className="py-1.5 text-right font-semibold">{r.density} pcf</td></tr>
              <tr><td className="py-1.5 text-slate-600">Balanced snow height, hb</td><td className="py-1.5 text-right font-semibold">{r.hb} ft</td></tr>
              <tr><td className="py-1.5 text-slate-600">Clear height, hc</td><td className="py-1.5 text-right font-semibold">{r.hc} ft</td></tr>
              <tr><td className="py-1.5 text-slate-600">Leeward drift height</td><td className="py-1.5 text-right font-semibold">{r.hdLeeward} ft</td></tr>
              <tr><td className="py-1.5 text-slate-600">Windward drift height</td><td className="py-1.5 text-right font-semibold">{r.hdWindward} ft</td></tr>
              <tr><td className="py-1.5 text-slate-600">Governing drift height, hd</td><td className="py-1.5 text-right font-semibold">{r.hd} ft{r.truncated ? " (capped)" : ""}</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-slate-400">ASCE 7-22 §7.7: hd = 0.43·(L)^(1/3)·(Pg+10)^(1/4) − 1.5; surcharge pd = hd·γ. Windward case uses 0.75× of the lower-roof fetch.</p>
        </div>
      </div>
    </div>
  );
}
