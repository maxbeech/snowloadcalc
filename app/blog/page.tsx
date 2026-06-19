import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/posts";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Snow Load Guides",
  description: "Plain-English guides to roof snow load: how to calculate it, ground vs roof snow load, ASCE 7-22 changes, drift, metal roofs, solar and more.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <div>
      <PageHeader eyebrow="Guides" title="Snow load guides">
        Practical, accurate walkthroughs of the ASCE 7 method, written for builders, engineers, solar
        installers and homeowners.
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-3 px-5 py-12 sm:grid-cols-2">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}
            className="group rounded-2xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-frost-300 hover:shadow-lg">
            <div className="font-mono text-[11px] text-frost-600">{p.readMins} min read</div>
            <div className="mt-2 font-display text-base font-semibold leading-snug text-ink-900 group-hover:text-frost-700">{p.title}</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
