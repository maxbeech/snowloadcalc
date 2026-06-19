import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CTA } from "@/components/ui";
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

const linkCls = "rounded-lg border border-ink-100 bg-white px-3 py-1.5 text-sm text-ink-500 transition hover:border-frost-300 hover:text-ink-900";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/blog" }, { name: p.title, href: `/blog/${p.slug}` }]} />

      <div className="font-mono text-[11px] text-frost-600">{p.readMins} min read</div>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-ink-900 sm:text-4xl">{p.title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-500">{p.description}</p>

      <div className="mt-8 space-y-6">
        {p.body.map((sec, i) => (
          <section key={i}>
            {sec.h && <h2 className="font-display text-xl font-bold tracking-tight text-ink-900">{sec.h}</h2>}
            {sec.p.map((para, j) => (
              <p key={j} className="mt-3 text-[15px] leading-7 text-ink-600">{para}</p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-frost-200 bg-gradient-to-br from-frost-50 to-white p-6">
        <div className="font-display text-base font-semibold text-ink-900">Run the numbers</div>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-500">Get your design roof snow load in seconds with the free ASCE 7-22 calculator.</p>
        <CTA href="/" className="mt-4">Open the calculator</CTA>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-ink-700">Related</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { name: "Snow load by roof type", href: "/calculators" },
            { name: "Ground snow load by state", href: "/states" },
            { name: "Snow drift calculator", href: "/drift" },
            { name: "How it works", href: "/methodology" },
            { name: "More guides", href: "/blog" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className={linkCls}>{l.name}</Link>
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
