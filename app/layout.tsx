import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { title: SITE.name, description: SITE.description, url: SITE.url, siteName: SITE.name, type: "website" },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
};

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-600 text-sm text-white">❄</span>
          Snow<span className="text-sky-600">LoadCalc</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600 sm:gap-5">
          <Link href="/calculators" className="hover:text-slate-900">Roof types</Link>
          <Link href="/states" className="hidden hover:text-slate-900 sm:inline">By state</Link>
          <Link href="/drift" className="hover:text-slate-900">Drift</Link>
          <Link href="/blog" className="hidden hover:text-slate-900 sm:inline">Guides</Link>
          <Link href="/pricing" className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-700">Pro</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-slate-500">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-slate-900">Snow load calculator</Link>
          <Link href="/calculators/flat-roof-snow-load" className="hover:text-slate-900">Flat roof</Link>
          <Link href="/calculators/metal-building-snow-load" className="hover:text-slate-900">Metal building</Link>
          <Link href="/drift" className="hover:text-slate-900">Snow drift</Link>
          <Link href="/states" className="hover:text-slate-900">By state</Link>
          <Link href="/blog" className="hover:text-slate-900">Guides</Link>
          <Link href="/methodology" className="hover:text-slate-900">How it works</Link>
          <Link href="/pricing" className="hover:text-slate-900">Pro / report PDF</Link>
        </div>
        <p className="mt-4 max-w-2xl text-xs text-slate-400">
          {SITE.name} computes ASCE 7-22 balanced roof snow loads for planning and checking. The
          governing ground snow load for a permit is the value adopted by your building department or
          the ASCE 7 Hazard Tool, and unbalanced, drift and sliding cases must also be checked. Always
          confirm with a licensed engineer. © {year} {SITE.name}.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Header />
        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
