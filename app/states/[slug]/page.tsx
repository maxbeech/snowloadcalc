import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Calculator from "@/components/Calculator";
import { STATE_SNOW, getStateSnow, snowBand } from "@/lib/ground-snow";

export function generateStaticParams() {
  return STATE_SNOW.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getStateSnow(slug);
  if (!s) return {};
  return {
    title: `${s.name} Ground Snow Load & Roof Snow Load Calculator`,
    description: `${s.name} ground snow load is typically ${s.lowPg}–${s.highPg} psf (${snowBand(s.typicalPg)}). Calculate the roof snow load for your ${s.name} building with the ASCE 7-22 method.`,
    alternates: { canonical: `/states/${s.slug}` },
  };
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getStateSnow(slug);
  if (!s) notFound();

  return (
    <div>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/states" className="hover:text-slate-900">By state</Link>
        <span className="mx-1.5">/</span><span className="text-slate-700">{s.name}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{s.name} Roof Snow Load Calculator</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Ground snow load across the populated parts of {s.name} is roughly{" "}
        <strong>{s.lowPg}–{s.highPg} psf</strong> ({snowBand(s.typicalPg)}). The calculator below is
        pre-loaded with a typical {s.name} value of <strong>{s.typicalPg} psf</strong> — change it to
        your site&apos;s confirmed ground snow load and adjust your roof.
      </p>

      {s.caseStudy ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <strong>Case-study state.</strong> {s.note}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">{s.note}</div>
      )}

      <div className="mt-6">
        <Calculator seed={{ pg: s.typicalPg }} />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">Finding your exact {s.name} ground snow load</h2>
        <p className="mt-2">
          The number above is a planning value, not a permit value. For {s.name}, get your site&apos;s
          design ground snow load from the <a href="https://ascehazardtool.org" target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">ASCE 7 Hazard Tool</a> or
          your local building department — many {s.name} jurisdictions adopt a published county or town
          value. {s.caseStudy && "Because elevation drives the value here, two nearby sites can differ a lot — always use the value for your exact address."}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900">Nearby states</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {STATE_SNOW.filter((x) => x.slug !== s.slug).slice(0, 12).map((x) => (
            <Link key={x.slug} href={`/states/${x.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-sky-300 hover:text-slate-900">
              {x.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
