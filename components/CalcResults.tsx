"use client";

import { type SnowInputs, type SnowResult, interpretSnow } from "@/lib/snow";
import { computeUnbalanced } from "@/lib/unbalanced";
import RoofDiagram from "./RoofDiagram";

const fmt = (n: number) => n.toLocaleString("en-US");

function Stat({ label, value, unit, hint, accent }:
  { label: string; value: string; unit?: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? "border-frost-200 bg-frost-50" : "border-ink-100 bg-white"}`}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">{label}</div>
      <div className={`tabular mt-0.5 font-display text-2xl font-bold ${accent ? "text-frost-600" : "text-ink-900"}`}>
        {value}{unit && <span className="ml-1 text-sm font-medium text-ink-300">{unit}</span>}
      </div>
      {hint && <div className="mt-0.5 font-mono text-[11px] text-ink-400">{hint}</div>}
    </div>
  );
}

export default function CalcResults({ inp, r }: { inp: SnowInputs; r: SnowResult }) {
  const view = interpretSnow(inp, r);
  const unbal = computeUnbalanced(inp, r);
  const showUnbal = inp.shape === "gable" || inp.shape === "hip";

  return (
    <div className="space-y-4">
      <RoofDiagram inp={inp} r={r} />

      {/* Governing load, the instrument readout */}
      <div className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 p-5 text-white">
        <div className="bg-blueprint-dark absolute inset-0 opacity-70" aria-hidden />
        <div className="relative">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-frost-300">Design roof snow load · balanced</div>
          <div className="tabular mt-1 font-display text-5xl font-bold text-white">
            {r.design}<span className="ml-2 text-xl font-semibold text-ink-200">psf</span>
          </div>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-100">{view.governText}</p>
          {r.totalWeightLb !== undefined && (
            <p className="mt-1 font-mono text-xs text-frost-200">
              ≈ {fmt(r.totalWeightLb)} lb total on {fmt(inp.area ?? 0)} sq ft of roof plan
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Flat Pf" value={String(r.pf)} unit="psf" hint="0.7·Ce·Ct·Is·Pg" accent />
        <Stat label="Sloped Ps" value={String(r.ps)} unit="psf" hint={`Cs ${r.Cs}`} />
        <Stat label="Minimum Pm" value={r.slopeAppliesMin ? String(r.pm) : "n/a"} unit={r.slopeAppliesMin ? "psf" : ""} hint={r.slopeAppliesMin ? "§7.3.4" : "slope ≥ 15°"} />
        <Stat label="Rain-on-snow" value={r.rainOnSnow ? `+${r.rainOnSnow}` : "0"} unit="psf" hint="§7.10" />
      </div>

      {showUnbal && (
        <div className={`rounded-2xl border p-4 ${unbal.applies ? "border-load-300/70 bg-load-50" : "border-ink-100 bg-white"}`}>
          <div className="flex items-center justify-between">
            <div className="font-display text-sm font-semibold text-ink-900">Unbalanced load · §7.6.1 {inp.shape}</div>
            {unbal.applies && <span className="rounded-full bg-load-100 px-2 py-0.5 text-[10px] font-semibold text-load-700">may govern leeward / ridge</span>}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{unbal.reason}</p>
          {unbal.applies && (
            <>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  { k: "Windward", v: unbal.windward, lo: true },
                  { k: "Leeward base", v: unbal.leewardBase, lo: true },
                  { k: "Leeward peak", v: unbal.leewardPeak, lo: false },
                ].map((c) => (
                  <div key={c.k} className="rounded-lg border border-load-100 bg-white p-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">{c.k}</div>
                    <div className={`tabular font-display text-lg font-bold ${c.lo ? "text-ink-900" : "text-load-600"}`}>{c.v}<span className="text-[11px] text-ink-300"> psf</span></div>
                  </div>
                ))}
              </div>
              {!unbal.simple && (
                <p className="mt-2 font-mono text-[11px] text-ink-400">surcharge {unbal.surchargeIntensity} psf over {unbal.surchargeWidth} ft · hd {unbal.hd} ft · γ {unbal.density} pcf</p>
              )}
            </>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-ink-100 bg-white p-4">
        <div className="font-display text-sm font-semibold text-ink-900">How this was calculated</div>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">{view.designText}</p>
        <table className="mt-3 w-full text-sm">
          <tbody className="divide-y divide-ink-50">
            <Row k="Ground snow load, Pg" v={`${fmt(r.pg)} psf`} note="site input" />
            <Row k="Exposure factor, Ce" v={String(r.Ce)} note="Table 7.3-1" />
            <Row k="Thermal factor, Ct" v={String(r.Ct)} note="Table 7.3-2" />
            <Row k="Importance factor, Is" v={String(r.Is)} note="Table 1.5-2" />
            <Row k="Slope factor, Cs" v={String(r.Cs)} note="Fig. 7.4-1" />
            <Row k="Snow density, γ" v={`${r.density} pcf`} note="Eq. 7.7-1" />
            <Row k="Settled depth at design load" v={`${r.depth} in`} note="design ÷ density" />
          </tbody>
        </table>
      </div>

      <ul className="space-y-1.5">
        {view.notes.map((n, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink-500">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-frost-400" />{n}
          </li>
        ))}
      </ul>

      <button onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-frost-300 hover:text-ink-900 print:hidden">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" /></svg>
        Print or save as PDF
      </button>
    </div>
  );
}

function Row({ k, v, note }: { k: string; v: string; note: string }) {
  return (
    <tr>
      <td className="py-1.5 pr-2 text-ink-500">{k}</td>
      <td className="tabular py-1.5 pr-2 text-right font-mono font-semibold text-ink-900">{v}</td>
      <td className="py-1.5 text-right font-mono text-[11px] text-ink-300">{note}</td>
    </tr>
  );
}
