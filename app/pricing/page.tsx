import type { Metadata } from "next";
import CheckoutButton from "@/components/CheckoutButton";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pro: Permit-Ready Snow Load Report",
  description: "Generate a permit-ready ASCE 7-22 snow load report PDF for your project: every factor, the governing load case and a clean summary for plan review. $29 one-time.",
  alternates: { canonical: "/pricing" },
};

const FREE = [
  "Full ASCE 7-22 roof snow load calculator",
  "Flat, sloped, minimum and rain-on-snow cases",
  "§7.6.1 unbalanced load and the §7.7 drift calculator",
  "Every roof type and all 50 states",
  "Shareable, bookmarkable result links",
];
const PRO = [
  "Everything in the free calculator",
  "Permit-ready PDF report with all inputs and factors",
  "Governing load case stated with its code references",
  "Project and site fields for the plan-review submittal",
  "Drift and sliding-load checklist for your reviewer",
];

// Read at build time: when Stripe is not wired the Pro card shows an honest
// early-access affordance instead of a dead-end purchase button.
const PRO_ENABLED = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);

function Check() {
  return <svg width="16" height="16" viewBox="0 0 24 24" className="mt-0.5 shrink-0 stroke-frost-500" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;
}

export default function Pricing() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Eyebrow>Pricing</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Simple, honest pricing</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">
        The calculator is free forever. When you need to hand a clean, defensible snow load calculation to a
        plan reviewer or a client, the Pro report packages it as a PDF.
      </p>

      <div className="mt-9 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-ink-100 bg-white p-7">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Free</div>
          <div className="tabular mt-2 font-display text-4xl font-bold text-ink-900">$0</div>
          <ul className="mt-5 space-y-2.5 text-sm text-ink-600">
            {FREE.map((f) => <li key={f} className="flex gap-2.5"><Check />{f}</li>)}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-3xl border-2 border-frost-300 bg-white p-7 shadow-[0_30px_60px_-30px_rgba(10,22,34,0.4)]">
          <div className="frost-aurora absolute inset-0 opacity-60" aria-hidden />
          <div className="relative">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-frost-700">Pro report</div>
            <div className="tabular mt-2 font-display text-4xl font-bold text-ink-900">$29<span className="text-base font-medium text-ink-300"> one-time</span></div>
            <ul className="mt-5 space-y-2.5 text-sm text-ink-600">
              {PRO.map((f) => <li key={f} className="flex gap-2.5"><Check />{f}</li>)}
            </ul>
            <div className="mt-6"><CheckoutButton enabled={PRO_ENABLED} /></div>
            <p className="mt-4 text-xs leading-relaxed text-ink-400">
              A SnowLoadCalc report is a calculation aid, not a stamped engineering document. For a permit,
              have a licensed engineer review it and confirm the unbalanced, drift and sliding cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
