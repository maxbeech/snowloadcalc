import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { POSTS, getPost } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.description },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  return (
    <article className="mx-auto max-w-2xl">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/blog" }, { name: p.title, href: `/blog/${p.slug}` }]} />

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{p.title}</h1>
      <p className="mt-2 text-slate-600">{p.description}</p>
      <div className="mt-1 text-xs text-slate-400">{p.readMins} min read</div>

      <div className="mt-6 space-y-5">
        {p.body.map((sec, i) => (
          <section key={i}>
            {sec.h && <h2 className="text-lg font-bold text-slate-900">{sec.h}</h2>}
            {sec.p.map((para, j) => (
              <p key={j} className="mt-2 text-[15px] leading-relaxed text-slate-700">{para}</p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-4">
        <div className="text-sm font-semibold text-slate-900">Run the numbers</div>
        <p className="mt-1 text-sm text-slate-600">Get your design roof snow load in seconds with the free ASCE 7-22 calculator.</p>
        <Link href="/" className="mt-2 inline-block rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">Open the calculator →</Link>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900">Related</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { name: "Snow load by roof type", href: "/calculators" },
            { name: "Ground snow load by state", href: "/states" },
            { name: "Snow drift calculator", href: "/drift" },
            { name: "How it works", href: "/methodology" },
            { name: "More guides", href: "/blog" },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-sky-300 hover:text-slate-900">
              {l.name}
            </Link>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: p.title, description: p.description, datePublished: p.date,
        author: { "@type": "Organization", name: SITE.name },
        publisher: { "@type": "Organization", name: SITE.name },
      }) }} />
    </article>
  );
}
