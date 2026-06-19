import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Calculator from "@/components/Calculator";
import Faq from "@/components/Faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Pill } from "@/components/ui";
import { ROOF_TYPES, getRoofType } from "@/lib/roof-types";
import { STATE_SNOW } from "@/lib/ground-snow";

// Only the known roof-type slugs are valid, so unknown slugs 404 immediately
// without an on-demand render (keeps the build fully static and Vercel-cheap).
export const dynamicParams = false;

const SNOWY = ["colorado", "minnesota", "michigan", "massachusetts", "new-york", "utah", "wisconsin", "maine"];

export function generateStaticParams() {
  return ROOF_TYPES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRoofType(slug);
  if (!r) return {};
  return { title: r.h1, description: r.meta, alternates: { canonical: `/calculators/${r.slug}` } };
}

const linkCls = "rounded-lg border border-ink-100 bg-white px-3 py-1.5 text-sm text-ink-500 transition hover:border-frost-300 hover:text-ink-900";

export default async function RoofTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRoofType(slug);
  if (!r) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Roof types", href: "/calculators" }, { name: r.name, href: `/calculators/${r.slug}` }]} />

      <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{r.h1}</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">{r.intro}</p>
      <div className="mt-4 flex items-center gap-2">
        <Pill tone="load">What is different here</Pill>
        <span className="text-sm text-ink-500">{r.focus}</span>
      </div>

      <div className="mt-8"><Calculator seed={r.defaults} /></div>

      <section className="mt-10 rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink-900">Notes for {r.name.toLowerCase()} roofs</h2>
        <ul className="mt-3 space-y-2">
          {r.notes.map((n, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-frost-400" />{n}
            </li>
          ))}
        </ul>
      </section>

      <Faq items={r.faqs} />

      <section className="mt-12">
        <h2 className="text-sm font-semibold text-ink-700">Other roof types</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {ROOF_TYPES.filter((x) => x.slug !== r.slug).map((x) => (
            <Link key={x.slug} href={`/calculators/${x.slug}`} className={linkCls}>{x.name}</Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-ink-700">Ground snow load in snowy states</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATE_SNOW.filter((s) => SNOWY.includes(s.slug)).map((s) => (
            <Link key={s.slug} href={`/states/${s.slug}`} className={linkCls}>{s.name}</Link>
          ))}
          <Link href="/drift" className={linkCls}>Snow drift calculator</Link>
          <Link href="/methodology" className={linkCls}>How it works</Link>
        </div>
      </section>
    </div>
  );
}
