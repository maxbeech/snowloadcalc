import { type FaqItem } from "@/lib/faq";

export default function Faq({ items, title = "Frequently asked questions" }: { items: FaqItem[]; title?: string }) {
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900">{title}</h2>
      <div className="mt-5 divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
        {items.map((it, i) => (
          <details key={i} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-[15px] font-semibold text-ink-900">
              {it.q}
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-400 transition group-open:rotate-45 group-open:border-frost-300 group-open:text-frost-600">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">{it.a}</p>
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
