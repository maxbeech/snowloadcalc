import Link from "next/link";
import Contours from "./Contours";
import { Eyebrow } from "./ui";
import { CountUp, Reveal } from "./motion";

const STEPS = [
  { n: "01", h: "Set your ground snow load", p: "Pg comes from the ASCE 7 Hazard Tool or your building department. The per-state pages give you a planning range to start from." },
  { n: "02", h: "Describe the roof", p: "Slope, shape, warmth, surface, exposure and importance. Each one maps to a published ASCE 7 factor, not a guess." },
  { n: "03", h: "Read every load case", p: "Flat, sloped, minimum, rain-on-snow and the §7.6.1 unbalanced load, with the governing value and a settled-depth section." },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <Contours variant="dark" />
      <div className="frost-aurora absolute inset-0 opacity-25" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 py-20">
        <Eyebrow tone="dark">How it works</Eyebrow>
        <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          From a ground snow number to a defensible roof load, in three steps.
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="group relative bg-ink-950 p-7">
              <div className="absolute right-5 top-6 h-10 w-1.5 text-white/10 tick-rule" aria-hidden />
              <div className="font-mono text-sm font-bold text-frost-400">{s.n}</div>
              <div className="mt-4 font-display text-lg font-semibold text-white">{s.h}</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-200">{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// The snow-load measurement scale: a reference for reading any result, built from
// the same qualitative bands the engine uses. On-theme and genuinely useful.
const BANDS = [
  { label: "very low", range: "0 to 5", w: 8, c: "bg-frost-100" },
  { label: "low", range: "5 to 15", w: 14, c: "bg-frost-200" },
  { label: "moderate", range: "15 to 30", w: 22, c: "bg-frost-400" },
  { label: "high", range: "30 to 50", w: 26, c: "bg-load-300" },
  { label: "very high", range: "50+", w: 30, c: "bg-load-500" },
];

export function StatStrip() {
  return (
    <section className="border-y border-ink-100 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>The scale</Eyebrow>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">Read any result at a glance</h2>
          </div>
          <div className="flex gap-8">
            {[[8, "roof types"], [51, "states + DC"], [12, "guides"]].map(([n, l]) => (
              <div key={l as string}>
                <div className="tabular font-display text-3xl font-bold text-ink-900"><CountUp value={n as number} /></div>
                <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-400">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <Reveal className="mt-7">
          <div className="flex h-5 overflow-hidden rounded-lg shadow-inner">
            {BANDS.map((b) => <div key={b.label} className={b.c} style={{ width: `${b.w}%` }} />)}
          </div>
          <div className="mt-1 flex font-mono text-[10px] text-ink-400">
            {["0", "5", "15", "30", "50", "70+ psf"].map((t, i) => (
              <span key={t} className={i === 0 ? "" : "flex-1 text-right"} style={i === 0 ? { width: 0 } : undefined}>{t}</span>
            ))}
          </div>
          <div className="mt-3 flex">
            {BANDS.map((b) => (
              <div key={b.label} style={{ width: `${b.w}%` }} className="border-l border-ink-100 pl-2">
                <span className={`mb-1 block h-1 w-4 rounded-full ${b.c}`} />
                <div className="text-[11px] font-semibold capitalize text-ink-700">{b.label}</div>
                <div className="font-mono text-[10px] text-ink-400">{b.range}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ClosingCTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-ink-800 bg-ink-950 p-8 text-white sm:p-12">
        <Contours variant="dark" />
        <div className="frost-aurora absolute inset-0 opacity-30" aria-hidden />
        <div className="relative max-w-xl">
          <Eyebrow tone="dark">Pro report</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">Sizing a permit submittal?</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-200">
            The Pro report packages your calculation as a clean, referenced PDF: every input, every factor,
            the governing case and the cases a reviewer will ask about.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-frost-400 px-5 py-3 text-sm font-bold text-ink-950 transition hover:bg-frost-300">See the Pro report</Link>
            <Link href="/methodology" className="text-sm font-semibold text-frost-300 hover:underline">Read the methodology</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
