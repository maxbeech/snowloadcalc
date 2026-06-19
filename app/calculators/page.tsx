import type { Metadata } from "next";
import Link from "next/link";
import { ROOF_TYPES } from "@/lib/roof-types";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Snow Load Calculators by Roof Type",
  description: "Roof snow load calculators for every roof type: flat, pitched, metal building, carport, shed, gambrel and greenhouse, all using the ASCE 7-22 method.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Eyebrow>By roof type</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
        Snow load calculators by roof type
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">
        Each calculator runs the same ASCE 7-22 engine, pre-set for that roof type with the right thermal
        factor, surface and slope, so you land on a relevant answer fast and can refine from there.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {ROOF_TYPES.map((r) => (
          <Link key={r.slug} href={`/calculators/${r.slug}`}
            className="group rounded-2xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-frost-300 hover:shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="font-display text-base font-semibold text-ink-900 group-hover:text-frost-700">{r.name}</div>
              <div className="font-mono text-xs text-ink-300">{r.volume}</div>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{r.focus}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
