import { computeSnow, type SnowInputs } from "@/lib/snow";
import { computeUnbalanced } from "@/lib/unbalanced";
import RoofDiagram from "./RoofDiagram";
import { CTA, Eyebrow, MockWindow } from "./ui";

// A composed cluster of app mockups so visitors see the real product in several
// states (the live section, the load readout, the §7.6.1 unbalanced panel)
// without shipping a stale screenshot. Everything is rendered from the engine.
const SAMPLE: SnowInputs = {
  pg: 45, risk: "II", terrain: "C", roofExposure: "partial", thermal: "heated",
  surface: "nonslippery", shape: "gable", slopeDeg: 18.4, width: 44, area: 2200,
};

export default function AppGallery() {
  const r = computeSnow(SAMPLE);
  const u = computeUnbalanced(SAMPLE, r);
  const tiles: [string, string, boolean][] = [
    ["Flat Pf", `${r.pf}`, true], ["Sloped Ps", `${r.ps}`, false], ["Min Pm", `${r.pm}`, false],
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <Eyebrow>Inside the tool</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">A working drawing, not a single number.</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-500">
            The calculator returns the whole load picture: a labelled roof section, the factor breakdown and
            every load case named, so you can check it, defend it and hand it to a reviewer.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-600">
            {["The governing case is named, so you know which load controls.",
              "Every ASCE 7 factor is shown with its table reference.",
              "The leeward drift profile is drawn when §7.6.1 governs."].map((t) => (
              <li key={t} className="flex gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" className="mt-0.5 shrink-0 stroke-frost-500" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                {t}
              </li>
            ))}
          </ul>
          <CTA href="#calculator" className="mt-7">Try it with your roof</CTA>
        </div>

        {/* Layered mockup cluster */}
        <div className="relative">
          <MockWindow title="snowloadcalc.com/calculators/pitched-roof-snow-load">
            <RoofDiagram inp={SAMPLE} r={r} interactive={false} />
            <div className="mt-3 grid grid-cols-[1.3fr_1fr] gap-2">
              <div className="rounded-xl bg-ink-950 p-3 text-white">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-frost-300">Design load · governs</div>
                <div className="tabular font-display text-3xl font-bold">{r.design}<span className="text-sm text-ink-200"> psf</span></div>
                <div className="mt-1 font-mono text-[10px] text-frost-200">≈ {r.totalWeightLb?.toLocaleString("en-US")} lb on {SAMPLE.area?.toLocaleString("en-US")} sq ft</div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {tiles.map(([l, v, hi]) => (
                  <div key={l} className={`rounded-lg border p-1.5 text-center ${hi ? "border-frost-200 bg-frost-50" : "border-ink-100 bg-white"}`}>
                    <div className="text-[8px] font-semibold uppercase tracking-wide text-ink-400">{l}</div>
                    <div className={`tabular font-display text-sm font-bold ${hi ? "text-frost-600" : "text-ink-900"}`}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </MockWindow>

          {/* Secondary window: the §7.6.1 unbalanced panel, tucked off the
              bottom-right corner so it adds depth without hiding the main readout. */}
          <div className="mt-4 lg:absolute lg:-bottom-14 lg:-right-4 lg:mt-0 lg:w-60 lg:drop-shadow-2xl">
            <MockWindow title="§7.6.1 unbalanced">
              <div className="rounded-lg border border-load-300/60 bg-load-50 p-3">
                <div className="text-[11px] font-semibold text-ink-900">Leeward drift may govern</div>
                <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
                  {[["Wind", u.windward], ["Base", u.leewardBase], ["Peak", u.leewardPeak]].map(([k, v], i) => (
                    <div key={k as string} className="rounded-md border border-load-100 bg-white p-1.5">
                      <div className="text-[8px] uppercase text-ink-400">{k}</div>
                      <div className={`tabular font-display text-sm font-bold ${i === 2 ? "text-load-600" : "text-ink-900"}`}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </MockWindow>
          </div>
        </div>
      </div>
    </section>
  );
}
