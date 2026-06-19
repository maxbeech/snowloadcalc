import { type FaqItem } from "@/lib/faq";

export default function Faq({ items, title = "Notes & questions" }: { items: FaqItem[]; title?: string }) {
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">{title}</h2>
      <div className="mt-6 border-t-2 border-ink-900">
        {items.map((it, i) => (
          <details key={i} className="group border-b border-ink-200 py-4">
            <summary className="flex cursor-pointer list-none items-baseline gap-4">
              <span className="font-mono text-xs text-frost-600">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 font-display text-[17px] font-medium text-ink-900">{it.q}</span>
              <span className="font-mono text-lg text-ink-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 pl-8 text-sm leading-relaxed text-ink-500">{it.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
      }) }} />
    </section>
  );
}
