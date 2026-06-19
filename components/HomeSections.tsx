import Link from "next/link";
import { computeSnow, type SnowInputs } from "@/lib/snow";
import RoofDiagram from "./RoofDiagram";
import { CTA, Eyebrow, MockWindow, SectionHead } from "./ui";

const STEPS = [
  { n: "01", h: "Set your ground snow load", p: "Pg comes from the ASCE 7 Hazard Tool or your building department. The per-state pages give you a planning range to start from." },
  { n: "02", h: "Describe the roof", p: "Slope, shape, warmth, surface, exposure and importance. Each one maps to a published ASCE 7 factor, not a guess." },
  { n: "03", h: "Read every load case", p: "Flat, sloped, minimum, rain-on-snow and the §7.6.1 unbalanced load, with the governing value and a settled-depth section." },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-ink-900 text-white">
      <div className="bg-blueprint-dark absolute inset-0 opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 py-16">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          From a ground snow number to a defensible roof load, in three steps.
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-ink-900 p-6">
              <div className="font-mono text-sm font-bold text-frost-400">{s.n}</div>
              <div className="mt-3 font-display text-lg font-semibold text-white">{s.h}</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-200">{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// A static app mockup so visitors see the product without a stale screenshot.
const SAMPLE: SnowInputs = {
  pg: 40, risk: "II", terrain: "C", roofExposure: "partial", thermal: "heated",
  surface: "nonslippery", shape: "gable", slopeDeg: 18.4, width: 40, area: 1800,
};

export function WhatYouGet() {
  const r = computeSnow(SAMPLE);
  const rows = [
    ["Flat-roof, Pf", `${r.pf} psf`], ["Sloped, Ps", `${r.ps} psf`],
    ["Exposure, Ce", String(r.Ce)], ["Thermal, Ct", String(r.Ct)], ["Slope, Cs", String(r.Cs)],
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHead eyebrow="What you read off it"
            title="A working drawing, not a single number."
            sub="The calculator returns the whole load picture as a labelled roof section plus the factor breakdown, so you can check it, defend it and hand it to a reviewer." />
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
        <MockWindow title="snowloadcalc.com">
          <RoofDiagram inp={SAMPLE} r={r} interactive={false} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-ink-900 p-3 text-white">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-frost-300">Design load</div>
              <div className="tabular font-display text-3xl font-bold">{r.design}<span className="text-sm text-ink-200"> psf</span></div>
            </div>
            <dl className="rounded-xl border border-ink-100 bg-white p-3 text-[11px]">
              {rows.slice(0, 4).map(([k, v]) => (
                <div key={k} className="flex justify-between py-0.5"><dt className="text-ink-400">{k}</dt><dd className="tabular font-mono font-semibold text-ink-800">{v}</dd></div>
              ))}
            </dl>
          </div>
        </MockWindow>
      </div>
    </section>
  );
}

export function ClosingCTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-frost-200 bg-gradient-to-br from-frost-50 to-white p-8 sm:p-12">
        <div className="frost-aurora absolute inset-0 opacity-70" aria-hidden />
        <div className="relative max-w-xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Sizing a permit submittal?</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
            The Pro report packages your calculation as a clean, referenced PDF: every input, every factor,
            the governing case and the cases a reviewer will ask about.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTA href="/pricing">See the Pro report</CTA>
            <Link href="/methodology" className="inline-flex items-center px-2 py-2.5 text-sm font-semibold text-frost-700 hover:underline">Read the methodology</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
