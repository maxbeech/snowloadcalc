import Link from "next/link";
import Calculator from "@/components/Calculator";
import HeroDiagram from "@/components/HeroDiagram";
import Faq from "@/components/Faq";
import { HowItWorks, WhatYouGet, ClosingCTA } from "@/components/HomeSections";
import { CTA, Eyebrow, Pill, SectionHead } from "@/components/ui";
import { HOME_FAQS } from "@/lib/faq";
import { ROOF_TYPES } from "@/lib/roof-types";
import { STATE_SNOW } from "@/lib/ground-snow";
import { POSTS } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-100">
        <div className="frost-aurora absolute inset-0" aria-hidden />
        <div className="bg-blueprint absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <Eyebrow>ASCE 7-22 · Chapter 7</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.04] tracking-tight text-ink-900 sm:text-[3.25rem]">
              Know exactly how much snow your roof has to carry.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-500">
              A precise roof snow load calculator built on the ASCE 7-22 method. Enter your site and roof,
              then read the flat, sloped, minimum, rain-on-snow and unbalanced loads with every factor on show.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <CTA href="#calculator">Open the calculator</CTA>
              <CTA href="/methodology" variant="ghost">See the method</CTA>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <Pill>Every factor shown</Pill>
              <Pill>Free, no sign-up</Pill>
              <Pill tone="load">Unbalanced and drift</Pill>
              <Pill tone="ink">All 50 states</Pill>
            </div>
          </div>
          <HeroDiagram />
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14">
        <SectionHead eyebrow="The calculator"
          title="Run your roof"
          sub="Adjust any input and the section drawing, factor table and governing load update live. Your inputs stay in the URL, so a result is shareable and bookmarkable." />
        <div className="mt-8"><Calculator /></div>
      </section>

      <HowItWorks />
      <WhatYouGet />

      {/* Roof types */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHead eyebrow="By roof type" title="Calculators tuned to your roof"
          sub="Each one runs the same engine with the right defaults for that roof, from a flat membrane to a slippery standing-seam metal building." />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROOF_TYPES.map((rt) => (
            <Link key={rt.slug} href={`/calculators/${rt.slug}`}
              className="group rounded-2xl border border-ink-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-frost-300 hover:shadow-lg">
              <div className="font-display text-sm font-semibold text-ink-900 group-hover:text-frost-700">{rt.name}</div>
              <div className="mt-1 text-xs text-ink-400">{rt.keyword}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* States */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <SectionHead eyebrow="By state" title="Ground snow load, state by state"
          sub="Planning ranges for the populated parts of every state, with mountain case-study zones flagged. Confirm the exact value for your site with your building department." />
        <div className="mt-7 flex flex-wrap gap-1.5">
          {STATE_SNOW.map((s) => (
            <Link key={s.slug} href={`/states/${s.slug}`}
              className="rounded-lg border border-ink-100 bg-white px-2.5 py-1 text-xs font-medium text-ink-500 transition hover:border-frost-300 hover:text-ink-900">
              {s.abbr}
            </Link>
          ))}
        </div>
        <CTA href="/states" variant="ghost" className="mt-6">Browse all states</CTA>
      </section>

      {/* Guides */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <SectionHead eyebrow="Guides" title="Snow load, explained plainly"
          sub="Practical, accurate walkthroughs for builders, engineers, solar installers and homeowners." />
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {POSTS.slice(0, 3).map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`}
              className="group rounded-2xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-frost-300 hover:shadow-lg">
              <div className="font-mono text-[11px] text-frost-600">{p.readMins} min read</div>
              <div className="mt-2 font-display text-[15px] font-semibold leading-snug text-ink-900 group-hover:text-frost-700">{p.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.description}</p>
            </Link>
          ))}
        </div>
        <CTA href="/blog" variant="ghost" className="mt-6">All guides</CTA>
      </section>

      <div className="mx-auto max-w-6xl px-5"><Faq items={HOME_FAQS} /></div>
      <div className="mt-16"><ClosingCTA /></div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication",
        name: SITE.name, applicationCategory: "EngineeringApplication", operatingSystem: "Web",
        description: SITE.description, url: SITE.url,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }) }} />
    </div>
  );
}
