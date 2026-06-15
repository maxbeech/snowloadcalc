import type { Metadata } from "next";
import { CE, CT, IS } from "@/lib/snow";

export const metadata: Metadata = {
  title: "Methodology — How SnowLoadCalc Computes Snow Load",
  description: "The exact ASCE 7-22 equations, factors and tables SnowLoadCalc uses, with every source cited. Transparent, defensible roof snow load math.",
  alternates: { canonical: "/methodology" },
};

function Cell({ children }: { children: React.ReactNode }) {
  return <td className="border border-slate-200 px-3 py-1.5 text-center">{children}</td>;
}

export default function Methodology() {
  return (
    <div className="prose-slate max-w-none">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Methodology</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        SnowLoadCalc implements the snow load procedure of <strong>ASCE/SEI 7-22, Chapter 7</strong>
        (Minimum Design Loads and Associated Criteria for Buildings and Other Structures). Every factor
        below is exactly the value the calculator uses — this page is the single source of truth.
      </p>

      <section className="mt-8 space-y-3 text-sm text-slate-700">
        <h2 className="text-lg font-bold text-slate-900">The equations</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-[13px]">
          <div>Flat-roof load &nbsp; Pf = 0.7 · Ce · Ct · Is · Pg &nbsp;&nbsp;(Eq. 7.3-1)</div>
          <div className="mt-1">Sloped load &nbsp;&nbsp;&nbsp; Ps = Cs · Pf &nbsp;&nbsp;(Eq. 7.4-1)</div>
          <div className="mt-1">Minimum load &nbsp;&nbsp; Pm = Is · min(Pg, 20) &nbsp;&nbsp;(§7.3.4, slope &lt; 15°)</div>
          <div className="mt-1">Rain-on-snow &nbsp;&nbsp; +5 psf when 0 &lt; Pg ≤ 20 and slope &lt; W/50 &nbsp;(§7.10)</div>
          <div className="mt-1">Snow density &nbsp;&nbsp; γ = 0.13 · Pg + 14 ≤ 30 pcf &nbsp;&nbsp;(Eq. 7.7-1)</div>
          <div className="mt-1">Drift height &nbsp;&nbsp; hd = 0.43 · L^⅓ · (Pg+10)^¼ − 1.5 &nbsp;(Eq. 7.7-1, §7.7)</div>
          <div className="mt-1">Unbalanced &nbsp;&nbsp;&nbsp; gable/hip: leeward Ps + hd·γ/√S surcharge &nbsp;(§7.6.1)</div>
        </div>
      </section>

      <section className="mt-8 text-sm text-slate-700">
        <h2 className="text-lg font-bold text-slate-900">Ground snow load, Pg</h2>
        <p className="mt-2">
          Pg is a site-specific input set by the ASCE 7 Hazard Tool or your local building department —
          SnowLoadCalc never assumes it. Our per-state pages provide a planning range read from the ASCE 7
          ground snow load map; the value adopted by your jurisdiction governs a permit.
        </p>
      </section>

      <section className="mt-8 text-sm text-slate-700">
        <h2 className="text-lg font-bold text-slate-900">Exposure factor Ce — Table 7.3-1</h2>
        <table className="mt-2 w-full border-collapse text-xs">
          <thead><tr className="bg-slate-50"><Cell>Terrain</Cell><Cell>Fully exposed</Cell><Cell>Partially exposed</Cell><Cell>Sheltered</Cell></tr></thead>
          <tbody>
            {(["B", "C", "D", "aboveTreeline"] as const).map((t) => (
              <tr key={t}>
                <Cell>{t === "aboveTreeline" ? "Above treeline" : t}</Cell>
                <Cell>{CE[t].fully}</Cell><Cell>{CE[t].partial}</Cell><Cell>{CE[t].sheltered}</Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 grid gap-6 text-sm text-slate-700 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Thermal factor Ct — Table 7.3-2</h2>
          <table className="mt-2 w-full border-collapse text-xs">
            <tbody>
              <tr><Cell>Heated building</Cell><Cell>{CT.heated}</Cell></tr>
              <tr><Cell>Just above freezing / cold ventilated</Cell><Cell>{CT.slightlyHeated}</Cell></tr>
              <tr><Cell>Unheated / open</Cell><Cell>{CT.unheated}</Cell></tr>
              <tr><Cell>Freezer</Cell><Cell>{CT.freezer}</Cell></tr>
              <tr><Cell>Heated greenhouse</Cell><Cell>{CT.greenhouse}</Cell></tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Importance factor Is — Table 1.5-2</h2>
          <table className="mt-2 w-full border-collapse text-xs">
            <tbody>
              {(["I", "II", "III", "IV"] as const).map((k) => (
                <tr key={k}><Cell>Risk Category {k}</Cell><Cell>{IS[k]}</Cell></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 text-sm text-slate-700">
        <h2 className="text-lg font-bold text-slate-900">Slope factor Cs — §7.4 / Fig. 7.4-1</h2>
        <p className="mt-2">
          Cs is 1.0 up to a breakpoint slope, then falls linearly to 0 at 70°. The breakpoint depends on
          whether the roof is warm (Ct ≤ 1.0), cold ventilated (Ct = 1.1) or cold (Ct ≥ 1.2), and whether
          the surface is slippery: warm slippery 5°, warm other 30°; cold-ventilated slippery 10°, other
          37.5°; cold slippery 15°, other 45°.
        </p>
      </section>

      <section className="mt-8 text-sm text-slate-700">
        <h2 className="text-lg font-bold text-slate-900">What this tool covers — and what it doesn&apos;t</h2>
        <p className="mt-2">
          SnowLoadCalc computes the <strong>balanced</strong> roof snow load, the §7.3.4 minimum and the
          §7.10 rain-on-snow case; the <strong>§7.6.1 unbalanced</strong> case for hip and gable roofs;
          and, on the drift page, the <strong>§7.7 drift</strong> surcharge at roof steps. It does
          <strong> not</strong> yet resolve <strong>sliding-snow</strong> (§7.9), <strong>partial</strong>
          loading (§7.5), the <strong>monoslope/sawtooth unbalanced</strong> cases (§7.6.2–7.6.3), or
          curved roofs — these can govern on specific geometries and must be checked by a qualified
          engineer for a permit submittal. Always confirm the governing ground snow load and have the
          design reviewed by a licensed professional.
        </p>
      </section>
    </div>
  );
}
