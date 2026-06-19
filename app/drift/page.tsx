import type { Metadata } from "next";
import DriftCalculator from "@/components/DriftCalculator";
import Faq from "@/components/Faq";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Snow Drift Load Calculator (ASCE 7-22 §7.7)",
  description: "Free snow drift load calculator. Size the drift surcharge at a roof step, parapet or wall using the ASCE 7-22 §7.7 leeward and windward drift method.",
  alternates: { canonical: "/drift" },
};

const FAQS = [
  { q: "When do I need to check snow drift?", a: "Whenever a lower roof sits next to a taller roof, a parapet or a long rooftop unit. ASCE 7 §7.7 says drift can be ignored only when the clear height above the balanced snow is small (hc/hb < 0.2); otherwise the drift surcharge often governs the lower roof." },
  { q: "How is the drift height calculated?", a: "The leeward drift height is hd = 0.43 × (Lu)^(1/3) × (Pg + 10)^(1/4) − 1.5 ft, where Lu is the upper roof length and Pg the ground snow load. The windward case uses 0.75× of the same formula with the lower-roof length. The larger governs, capped at the clear height." },
  { q: "What load does the drift add?", a: "The peak surcharge is pd = hd × γ, where γ = 0.13·Pg + 14 pcf (capped at 30). It is a triangular load that sits on top of the balanced load against the step, tapering to zero over the drift width." },
];

export default function DriftPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>§7.7 drift</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Snow drift load calculator</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">
        Size the snow drift surcharge at a roof step using the ASCE 7-22 §7.7 method. Enter the ground snow
        load, the lower roof&apos;s balanced load (from the main calculator), the step height and the two roof
        lengths to get the leeward and windward drift heights and the peak load at the step.
      </p>

      <div className="mt-8"><DriftCalculator /></div>

      <Faq items={FAQS} />
    </div>
  );
}
