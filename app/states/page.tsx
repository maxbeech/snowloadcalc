import type { Metadata } from "next";
import Link from "next/link";
import { STATE_SNOW, snowBand, REGIONS, regionOf } from "@/lib/ground-snow";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ground Snow Load by State",
  description: "Ground snow load planning ranges for all 50 states and DC, using the ASCE 7 ground snow load map. Mountainous case-study states are flagged. Confirm your site value with your AHJ.",
  alternates: { canonical: "/states" },
};

export default function StatesIndex() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Eyebrow>By state</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
        Ground snow load by state
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">
        Planning ranges for the populated parts of each state, read from the ASCE 7 ground snow load map.
        Mountainous states are marked <span className="font-semibold text-load-700">case study</span>, where
        elevation sets the value and a site-specific lookup is required. The number that governs a permit is
        the one your building department or the ASCE 7 Hazard Tool gives for your address.
      </p>
      <div className="mt-8 space-y-8">
        {REGIONS.map((region) => (
          <div key={region}>
            <div className="mb-2 flex items-center gap-3">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.1em] text-ink-700">{region}</h2>
              <span className="h-px flex-1 bg-ink-100" />
            </div>
            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-ink-50/60 text-left text-[11px] uppercase tracking-[0.12em] text-ink-400">
                  <tr><th className="px-4 py-2.5 font-semibold">State</th><th className="px-4 py-2.5 font-semibold">Range (psf)</th><th className="px-4 py-2.5 font-semibold">Typical</th><th className="px-4 py-2.5 font-semibold">Band</th></tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {STATE_SNOW.filter((s) => regionOf(s.abbr) === region).map((s) => (
                    <tr key={s.slug} className="transition hover:bg-frost-50/60">
                      <td className="px-4 py-2.5">
                        <Link href={`/states/${s.slug}`} className="font-medium text-frost-700 hover:underline">{s.name}</Link>
                        {s.caseStudy && <span className="ml-2 rounded bg-load-50 px-1.5 py-0.5 text-[10px] font-semibold text-load-700">case study</span>}
                      </td>
                      <td className="tabular px-4 py-2.5 font-mono text-ink-500">{s.lowPg}&ndash;{s.highPg}</td>
                      <td className="tabular px-4 py-2.5 font-mono font-semibold text-ink-900">{s.typicalPg}</td>
                      <td className="px-4 py-2.5 text-ink-400">{snowBand(s.typicalPg)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
