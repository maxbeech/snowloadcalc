import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Calculator from "@/components/Calculator";
import Faq from "@/components/Faq";
import { ROOF_TYPES, getRoofType } from "@/lib/roof-types";

export function generateStaticParams() {
  return ROOF_TYPES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRoofType(slug);
  if (!r) return {};
  return { title: r.h1, description: r.meta, alternates: { canonical: `/calculators/${r.slug}` } };
}

export default async function RoofTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRoofType(slug);
  if (!r) notFound();

  return (
    <div>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/calculators" className="hover:text-slate-900">Calculators</Link>
        <span className="mx-1.5">/</span><span className="text-slate-700">{r.name}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{r.h1}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{r.intro}</p>
      <p className="mt-2 inline-block rounded-lg bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
        What&apos;s different here: {r.focus}
      </p>

      <div className="mt-6">
        <Calculator seed={r.defaults} />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Notes for {r.name.toLowerCase()} roofs</h2>
        <ul className="mt-2 space-y-1.5">
          {r.notes.map((n, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />{n}
            </li>
          ))}
        </ul>
      </section>

      <Faq items={r.faqs} />

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-slate-900">Other roof types</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {ROOF_TYPES.filter((x) => x.slug !== r.slug).map((x) => (
            <Link key={x.slug} href={`/calculators/${x.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-sky-300 hover:text-slate-900">
              {x.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
