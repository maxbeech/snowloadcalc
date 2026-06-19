import Link from "next/link";

// Shared visual primitives. Every page composes from these so the system stays
// coherent (one eyebrow, one pill, one app-frame, one button) and on-brand.

// Small uppercase kicker that sits above a section heading.
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-frost-700">
      <span className="h-px w-6 bg-frost-400" />
      {children}
    </span>
  );
}

// Standard section header: eyebrow kicker, display title, optional lead-in.
export function SectionHead({ eyebrow, title, sub, center }:
  { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{title}</h2>
      {sub && <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{sub}</p>}
    </div>
  );
}

export function Pill({ children, tone = "frost" }: { children: React.ReactNode; tone?: "frost" | "load" | "ink" }) {
  const tones = {
    frost: "border-frost-200 bg-frost-50 text-frost-700",
    load: "border-load-300/60 bg-load-50 text-load-700",
    ink: "border-ink-200 bg-white text-ink-600",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

// Primary / secondary call-to-action, rendered as a Link.
export function CTA({ href, children, variant = "primary", className = "" }:
  { href: string; children: React.ReactNode; variant?: "primary" | "ghost"; className?: string }) {
  const styles = variant === "primary"
    ? "bg-ink-900 text-white hover:bg-ink-800 ring-machined"
    : "border border-ink-200 bg-white/70 text-ink-700 hover:border-frost-300 hover:text-ink-900";
  return (
    <Link href={href} className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${styles} ${className}`}>
      {children}
    </Link>
  );
}

// An abstract "app window" frame for UI mockups on the marketing pages. It gives
// people a sense of the product without shipping a stale screenshot image.
export function MockWindow({ title = "snowloadcalc.com", children, className = "" }:
  { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-[0_30px_60px_-30px_rgba(10,22,34,0.45)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-load-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-frost-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="ml-2 font-mono text-[11px] text-ink-400">{title}</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

// The big mono readout used for a governing load value (the instrument's dial).
export function Readout({ value, unit = "psf", label, tone = "frost", size = "xl" }:
  { value: string | number; unit?: string; label?: string; tone?: "frost" | "load" | "ink"; size?: "xl" | "lg" | "md" }) {
  const color = tone === "load" ? "text-load-600" : tone === "ink" ? "text-ink-900" : "text-frost-600";
  const sizes = { xl: "text-5xl", lg: "text-4xl", md: "text-3xl" } as const;
  return (
    <div>
      {label && <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">{label}</div>}
      <div className={`tabular font-display font-bold ${sizes[size]} ${color}`}>
        {value}
        {unit && <span className="ml-1.5 text-base font-semibold text-ink-300">{unit}</span>}
      </div>
    </div>
  );
}
