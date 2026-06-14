import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Snow Load Guides",
  description: "Plain-English guides to roof snow load: how to calculate it, ground vs roof snow load, ASCE 7-22 changes, drift, metal roofs, solar and more.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Snow Load Guides</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Practical, accurate guides to roof snow load — the ASCE 7 method explained for builders,
        engineers, solar installers and homeowners.
      </p>
      <div className="mt-6 space-y-3">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}
            className="block rounded-2xl border border-slate-200 bg-white p-4 hover:border-sky-300 hover:bg-sky-50">
            <div className="font-semibold text-slate-900">{p.title}</div>
            <p className="mt-1 text-sm text-slate-600">{p.description}</p>
            <div className="mt-1 text-xs text-slate-400">{p.readMins} min read</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
