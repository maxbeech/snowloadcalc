import Link from "next/link";
import Calculator from "@/components/Calculator";
import HeroDiagram from "@/components/HeroDiagram";
import Contours from "@/components/Contours";
import { Reveal } from "@/components/motion";
import Faq from "@/components/Faq";
import AppGallery from "@/components/AppGallery";
import { HowItWorks, StatStrip, ClosingCTA } from "@/components/HomeSections";
import { CTA, Eyebrow, SectionHead } from "@/components/ui";
import { HOME_FAQS } from "@/lib/faq";
import { ROOF_TYPES } from "@/lib/roof-types";
import { STATE_SNOW } from "@/lib/ground-snow";
import { POSTS } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <div>
      {/* Hero: a dark instrument console */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <Contours variant="dark" />
        <div className="frost-aurora absolute inset-0 opacity-40" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-frost-400/40 to-transparent" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.04fr_0.96fr] lg:py-24">
          <div>
            <Eyebrow tone="dark">ASCE 7-22 · roof snow load instrument</Eyebrow>
            <h1 className="mt-5 font-display text-[2.9rem] font-bold leading-[0.98] tracking-[-0.03em] text-white sm:text-[4.5rem]">
              The weight of winter,
              <span className="block text-frost-300">measured precisely.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-200">
              A roof snow load calculator built on the ASCE 7-22 method. Set your site and roof, then read
              the flat, sloped, minimum, rain-on-snow and §7.6.1 unbalanced loads with every factor on show.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#calculator" className="inline-flex items-center gap-2 rounded-xl bg-frost-400 px-5 py-3 text-sm font-bold text-ink-950 transition hover:bg-frost-300">
                Open the calculator
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link href="/methodology" className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35">
                See the method
              </Link>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {[["5", "load cases"], ["7", "ASCE factors"], ["51", "states + DC"], ["$0", "to use"]].map(([n, l]) => (
                <div key={l} className="border-l border-white/15 pl-3">
                  <dt className="tabular font-display text-2xl font-bold text-white">{n}</dt>
                  <dd className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-300">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroDiagram />
        </div>
      </section>

      <StatStrip />

      {/* Calculator */}
      <section id="calculator" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <SectionHead eyebrow="The workbench"
          title="Run your roof"
          sub="Adjust any input and the section drawing, factor table and governing load update live. Your inputs stay in the URL, so a result is shareable and bookmarkable." />
        <div className="mt-8"><Calculator /></div>
      </section>

      <HowItWorks />
      <AppGallery />

      {/* Roof types */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHead eyebrow="By roof type" title="Calculators tuned to your roof"
          sub="Each one runs the same engine with the right defaults for that roof, from a flat membrane to a slippery standing-seam metal building." />
        <Reveal className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROOF_TYPES.map((rt) => (
            <Link key={rt.slug} href={`/calculators/${rt.slug}`}
              className="group rounded-2xl border border-ink-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-frost-300 hover:shadow-lg">
              <div className="font-display text-sm font-semibold text-ink-900 group-hover:text-frost-700">{rt.name}</div>
              <div className="mt-1 text-xs text-ink-400">{rt.keyword}</div>
            </Link>
          ))}
        </Reveal>
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
        <Reveal className="mt-8 grid gap-3 sm:grid-cols-3">
          {POSTS.slice(0, 3).map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`}
              className="group rounded-2xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-frost-300 hover:shadow-lg">
              <div className="font-mono text-[11px] text-frost-600">{p.readMins} min read</div>
              <div className="mt-2 font-display text-[15px] font-semibold leading-snug text-ink-900 group-hover:text-frost-700">{p.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.description}</p>
            </Link>
          ))}
        </Reveal>
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
