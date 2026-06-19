import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";
import { LogoMark, Wordmark } from "@/components/Brand";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["500", "600", "700"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} · ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { title: SITE.name, description: SITE.description, url: SITE.url, siteName: SITE.name, type: "website" },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
};

const NAV = [
  { href: "/calculators", label: "Roof types" },
  { href: "/states", label: "By state" },
  { href: "/drift", label: "Drift" },
  { href: "/blog", label: "Guides" },
  { href: "/methodology", label: "Method" },
];

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-paper/85 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" aria-label={`${SITE.name} home`}><Wordmark /></Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className="hidden rounded-lg px-3 py-1.5 font-medium text-ink-500 transition hover:bg-white hover:text-ink-900 sm:inline-block">
              {n.label}
            </Link>
          ))}
          <Link href="/pricing"
            className="ml-1 rounded-lg bg-ink-900 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-ink-800">
            Pro report
          </Link>
          {/* Mobile menu: a pure-CSS disclosure so every section stays reachable
              on small screens without shipping client JS into the layout. */}
          <details className="group relative sm:hidden">
            <summary aria-label="Open menu" className="ml-1 grid h-9 w-9 cursor-pointer list-none place-items-center rounded-lg border border-ink-200 text-ink-700 [&::-webkit-details-marker]:hidden">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current group-open:hidden" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="hidden stroke-current group-open:block" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </summary>
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-ink-100 bg-white p-2 shadow-xl">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2 font-medium text-ink-600 hover:bg-ink-50 hover:text-ink-900">{n.label}</Link>
              ))}
            </div>
          </details>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const cols: { head: string; links: { href: string; label: string }[] }[] = [
    { head: "Calculate", links: [
      { href: "/", label: "Snow load calculator" },
      { href: "/drift", label: "Snow drift" },
      { href: "/calculators/ground-snow-to-roof-snow-load", label: "Ground to roof" },
    ] },
    { head: "By roof type", links: [
      { href: "/calculators/flat-roof-snow-load", label: "Flat roof" },
      { href: "/calculators/metal-building-snow-load", label: "Metal building" },
      { href: "/calculators/carport-patio-cover-snow-load", label: "Carport" },
    ] },
    { head: "Reference", links: [
      { href: "/states", label: "Ground snow by state" },
      { href: "/blog", label: "Guides" },
      { href: "/methodology", label: "Methodology" },
    ] },
  ];
  return (
    <footer className="mt-20 border-t border-ink-100 bg-white print:hidden">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" aria-label={`${SITE.name} home`}><Wordmark /></Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-400">
              The ASCE 7-22 roof snow load method, computed transparently with every factor on show.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.head}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">{c.head}</div>
              <ul className="mt-3 space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.href}><Link href={l.href} className="text-ink-500 transition hover:text-frost-700">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center gap-2 border-t border-ink-100 pt-6">
          <LogoMark size={20} />
          <p className="text-xs leading-relaxed text-ink-300">
            {SITE.name} computes ASCE 7-22 balanced, minimum, rain-on-snow and §7.6.1 unbalanced roof
            loads for planning and checking. Your governing ground snow load comes from the ASCE 7 Hazard
            Tool or your building department, and drift and sliding cases must also be reviewed. Confirm
            with a licensed engineer before you build or submit. © {year} {SITE.name}.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-paper text-ink-800 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
