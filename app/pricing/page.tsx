import type { Metadata } from "next";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata: Metadata = {
  title: "Pro — Permit-Ready Snow Load Report",
  description: "Generate a permit-ready ASCE 7-22 snow load report PDF for your project — every factor, the governing load case and a clean summary for plan review. $29 one-time.",
  alternates: { canonical: "/pricing" },
};

const FREE = [
  "Full ASCE 7-22 roof snow load calculator",
  "Flat, sloped, minimum and rain-on-snow cases",
  "Snow drift calculator (§7.7)",
  "Every roof type and all 50 states",
  "Shareable result links",
];
const PRO = [
  "Everything in the free calculator",
  "Permit-ready PDF report with all inputs and factors",
  "Governing load case clearly stated with code references",
  "Project + site fields for plan-review submittal",
  "Drift and sliding-load checklist for your reviewer",
];

export default function Pricing() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Simple pricing</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        The calculator is free forever. When you need to hand a clean, defensible snow load calculation
        to a plan reviewer or client, the Pro report packages it as a PDF.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-slate-500">Free</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">$0</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {FREE.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-sky-600">✓</span>{f}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-sky-300 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-sky-700">Pro report</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">$29<span className="text-base font-medium text-slate-400"> one-time</span></div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {PRO.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-sky-600">✓</span>{f}</li>
            ))}
          </ul>
          <div className="mt-5"><CheckoutButton /></div>
          <p className="mt-3 text-xs text-slate-400">
            A SnowLoadCalc report is a calculation aid, not a stamped engineering document. For a permit,
            have a licensed engineer review it and confirm the unbalanced, drift and sliding cases.
          </p>
        </div>
      </div>
    </div>
  );
}
