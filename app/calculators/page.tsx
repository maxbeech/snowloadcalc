import type { Metadata } from "next";
import Link from "next/link";
import { ROOF_TYPES } from "@/lib/roof-types";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Snow Load Calculators by Roof Type",
  description: "Roof snow load calculators for every roof type: flat, pitched, metal building, carport, shed, gambrel and greenhouse, all using the ASCE 7-22 method.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsIndex() {
  return (
    <div>
      <PageHeader eyebrow="By roof type" title="Snow load calculators by roof type">
        Each calculator runs the same ASCE 7-22 engine, pre-set for that roof type with the right thermal
        factor, surface and slope, so you land on a relevant answer fast and can refine from there.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-3 sm:grid-cols-2">
          {ROOF_TYPES.map((r) => (
            <Link key={r.slug} href={`/calculators/${r.slug}`}
              className="group border border-ink-200 bg-paper p-5 transition hover:border-frost-500 hover:bg-frost-50">
              <div className="flex items-center justify-between gap-3">
                <div className="font-display text-lg font-semibold text-ink-900 group-hover:text-frost-700">{r.name}</div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 stroke-ink-300 transition group-hover:translate-x-0.5 group-hover:stroke-frost-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{r.focus}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
