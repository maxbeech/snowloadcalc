import Link from "next/link";
import Calculator from "@/components/Calculator";
import Faq from "@/components/Faq";
import { HOME_FAQS } from "@/lib/faq";
import { ROOF_TYPES } from "@/lib/roof-types";
import { STATE_SNOW } from "@/lib/ground-snow";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <div>
      <section className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Roof Snow Load Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Compute the design roof snow load using the ASCE 7-22 method. Enter your ground snow load,
          roof slope, exposure and thermal condition — get the flat, sloped, minimum and governing
          design load in psf, with every factor shown. Free, no sign-up.
        </p>
      </section>

      <Calculator />

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { t: "Real ASCE 7-22 math", d: "The exact Pf = 0.7·Ce·Ct·Is·Pg equation, slope factor, minimum load and rain-on-snow surcharge — not a rule of thumb." },
          { t: "Every factor shown", d: "We display Ce, Ct, Is and Cs and how they combine, so you can check and defend the number." },
          { t: "Your site's ground snow", d: "Pg comes from the ASCE Hazard Tool or your AHJ. Our state pages give a range; you confirm the exact value." },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">{c.t}</div>
            <p className="mt-1 text-sm text-slate-600">{c.d}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">Snow load by roof type</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {ROOF_TYPES.map((rt) => (
            <Link key={rt.slug} href={`/calculators/${rt.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-3 text-sm hover:border-sky-300 hover:bg-sky-50">
              <div className="font-medium text-slate-900">{rt.name}</div>
              <div className="mt-0.5 text-xs text-slate-500">{rt.keyword}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">Ground snow load by state</h2>
        <p className="mt-1 text-sm text-slate-600">Planning ranges for every state, with mountainous case-study states flagged. Confirm your exact site value with your building department.</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {STATE_SNOW.map((s) => (
            <Link key={s.slug} href={`/states/${s.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:border-sky-300 hover:text-slate-900">
              {s.abbr}
            </Link>
          ))}
        </div>
        <Link href="/states" className="mt-3 inline-block text-sm font-medium text-sky-700 hover:underline">See all states →</Link>
      </section>

      <Faq items={HOME_FAQS} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication",
        name: SITE.name, applicationCategory: "EngineeringApplication", operatingSystem: "Web",
        description: SITE.description, url: SITE.url,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }) }} />
    </div>
  );
}
