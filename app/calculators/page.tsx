import type { Metadata } from "next";
import Link from "next/link";
import { ROOF_TYPES } from "@/lib/roof-types";

export const metadata: Metadata = {
  title: "Snow Load Calculators by Roof Type",
  description: "Roof snow load calculators for every roof type — flat, pitched, metal building, carport, shed, gambrel and greenhouse — all using the ASCE 7-22 method.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Snow Load Calculators by Roof Type</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Each calculator runs the same ASCE 7-22 engine, pre-set for that roof type — the right thermal
        factor, surface and slope to get you a relevant starting answer fast.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {ROOF_TYPES.map((r) => (
          <Link key={r.slug} href={`/calculators/${r.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-sky-300 hover:bg-sky-50">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-900">{r.name}</div>
              <div className="text-xs text-slate-400">{r.volume}</div>
            </div>
            <p className="mt-1 text-sm text-slate-600">{r.focus}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
