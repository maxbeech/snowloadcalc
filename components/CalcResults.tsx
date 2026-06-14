import { type SnowInputs, type SnowResult, interpretSnow } from "@/lib/snow";

const fmt = (n: number) => n.toLocaleString("en-US");

function Stat({ label, value, unit, hint, accent }: { label: string; value: string; unit?: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white"}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-0.5 text-2xl font-bold ${accent ? "text-sky-700" : "text-slate-900"}`}>
        {value}{unit && <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>}
      </div>
      {hint && <div className="mt-0.5 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}

export default function CalcResults({ inp, r }: { inp: SnowInputs; r: SnowResult }) {
  const view = interpretSnow(inp, r);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-300">Design roof snow load</div>
        <div className="mt-0.5 text-4xl font-bold">{r.design}<span className="ml-1 text-lg font-medium text-slate-300">psf</span></div>
        <p className="mt-1 text-sm text-slate-200">{view.governText}</p>
        {r.totalWeightLb !== undefined && (
          <p className="mt-1 text-xs text-slate-300">≈ {fmt(r.totalWeightLb)} lb of snow on a {fmt(inp.area ?? 0)} sq ft roof plan area.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Flat-roof Pf" value={String(r.pf)} unit="psf" hint="0.7·Ce·Ct·Is·Pg" accent />
        <Stat label="Sloped Ps" value={String(r.ps)} unit="psf" hint={`Cs = ${r.Cs}`} />
        <Stat label="Minimum Pm" value={r.slopeAppliesMin ? String(r.pm) : "n/a"} unit={r.slopeAppliesMin ? "psf" : ""} hint={r.slopeAppliesMin ? "§7.3.4" : "slope ≥ 15°"} />
        <Stat label="Rain-on-snow" value={r.rainOnSnow ? `+${r.rainOnSnow}` : "0"} unit="psf" hint="§7.10" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">How this was calculated</div>
        <p className="mt-1 text-sm text-slate-600">{view.designText}</p>
        <table className="mt-3 w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            <Row k="Ground snow load, Pg" v={`${fmt(r.pg)} psf`} note="your site input" />
            <Row k="Exposure factor, Ce" v={String(r.Ce)} note="Table 7.3-1" />
            <Row k="Thermal factor, Ct" v={String(r.Ct)} note="Table 7.3-2" />
            <Row k="Importance factor, Is" v={String(r.Is)} note="Table 1.5-2" />
            <Row k="Slope factor, Cs" v={String(r.Cs)} note="§7.4 / Fig. 7.4-1" />
            <Row k="Snow density, γ" v={`${r.density} pcf`} note="Eq. 7.7-1" />
            <Row k="≈ settled depth at design load" v={`${r.depth} in`} note="design ÷ density" />
          </tbody>
        </table>
      </div>

      <ul className="space-y-1.5">
        {view.notes.map((n, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-600">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />{n}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({ k, v, note }: { k: string; v: string; note: string }) {
  return (
    <tr>
      <td className="py-1.5 pr-2 text-slate-600">{k}</td>
      <td className="py-1.5 pr-2 text-right font-semibold text-slate-900">{v}</td>
      <td className="py-1.5 text-right text-xs text-slate-400">{note}</td>
    </tr>
  );
}
