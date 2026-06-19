import { computeSnow, type SnowInputs } from "@/lib/snow";
import { computeUnbalanced } from "@/lib/unbalanced";
import RoofDiagram from "./RoofDiagram";
import { CTA, SectionHead, MockWindow } from "./ui";

// The plates: the real product shown in several states as numbered figures,
// rather than a stale screenshot. Everything is drawn from the engine.
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
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <SectionHead num="03" eyebrow="The plates"
            title={<>A working drawing, not a <span className="italic text-frost-600">single number</span>.</>}
            sub="The calculator returns the whole load picture: a labelled roof section, the factor breakdown and every load case named, so you can check it, defend it and hand it to a reviewer." />
          <ul className="mt-7 space-y-3 text-sm text-ink-600">
            {["The governing case is named, so you know which load controls.",
              "Every ASCE 7 factor is shown with its table reference.",
              "The leeward drift profile is drawn when §7.6.1 governs."].map((t) => (
              <li key={t} className="flex gap-3 border-t border-ink-100 pt-3">
                <span className="font-mono text-xs text-frost-600">&bull;</span>{t}
              </li>
            ))}
          </ul>
          <CTA href="#calculator" className="mt-8">Try it with your roof</CTA>
        </div>

        <div className="relative">
          <MockWindow title="Plate I · pitched roof, 4:12">
            <RoofDiagram inp={SAMPLE} r={r} interactive={false} />
            <div className="mt-3 grid grid-cols-[1.3fr_1fr] gap-2">
              <div className="border border-ink-300 bg-paper p-3">
                <div className="label text-ink-400">Design load · governs</div>
                <div className="tabular font-display text-3xl font-semibold text-frost-600">{r.design}<span className="ml-1 text-sm text-ink-400">psf</span></div>
                <div className="mt-1 font-mono text-[10px] text-ink-500">≈ {r.totalWeightLb?.toLocaleString("en-US")} lb on {SAMPLE.area?.toLocaleString("en-US")} sq ft</div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {tiles.map(([l, v, hi]) => (
                  <div key={l} className={`border p-1.5 text-center ${hi ? "border-frost-300 bg-frost-50" : "border-ink-200 bg-paper"}`}>
                    <div className="text-[8px] font-semibold uppercase tracking-wide text-ink-400">{l}</div>
                    <div className={`tabular font-display text-sm font-semibold ${hi ? "text-frost-600" : "text-ink-900"}`}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </MockWindow>

          <div className="mt-4 lg:absolute lg:-bottom-14 lg:-right-4 lg:mt-0 lg:w-60 lg:drop-shadow-2xl">
            <MockWindow title="Plate II · §7.6.1 unbalanced">
              <div className="border border-load-300 bg-load-50 p-3">
                <div className="text-[11px] font-semibold text-ink-900">Leeward drift may govern</div>
                <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
                  {[["Wind", u.windward], ["Base", u.leewardBase], ["Peak", u.leewardPeak]].map(([k, v], i) => (
                    <div key={k as string} className="border border-load-100 bg-paper p-1.5">
                      <div className="text-[8px] uppercase text-ink-400">{k}</div>
                      <div className={`tabular font-display text-sm font-semibold ${i === 2 ? "text-load-600" : "text-ink-900"}`}>{v}</div>
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
