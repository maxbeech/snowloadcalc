import type { Metadata } from "next";
import Link from "next/link";
import { STATE_SNOW, snowBand } from "@/lib/ground-snow";

export const metadata: Metadata = {
  title: "Ground Snow Load by State",
  description: "Ground snow load planning ranges for all 50 states and DC, using the ASCE 7 ground snow load map. Mountainous case-study states are flagged. Confirm your site value with your AHJ.",
  alternates: { canonical: "/states" },
};

export default function StatesIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ground Snow Load by State</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Planning ranges for the populated parts of each state, read from the ASCE 7 ground snow load
        map. Mountainous states are marked <span className="font-medium text-amber-700">case study</span>,
        where elevation sets the value and a site-specific lookup is required. The legally-binding number
        for a permit is the one your building department or the ASCE 7 Hazard Tool gives for your address.
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="px-4 py-2">State</th><th className="px-4 py-2">Range (psf)</th><th className="px-4 py-2">Typical</th><th className="px-4 py-2">Band</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {STATE_SNOW.map((s) => (
              <tr key={s.slug} className="hover:bg-sky-50">
                <td className="px-4 py-2">
                  <Link href={`/states/${s.slug}`} className="font-medium text-sky-700 hover:underline">{s.name}</Link>
                  {s.caseStudy && <span className="ml-2 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">case study</span>}
                </td>
                <td className="px-4 py-2 text-slate-600">{s.lowPg}–{s.highPg}</td>
                <td className="px-4 py-2 font-semibold text-slate-900">{s.typicalPg}</td>
                <td className="px-4 py-2 text-slate-500">{snowBand(s.typicalPg)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
