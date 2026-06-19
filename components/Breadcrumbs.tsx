import Link from "next/link";
import { SITE } from "@/lib/site";

export interface Crumb { name: string; href: string }

// Breadcrumb nav + BreadcrumbList structured data, from one source. The last
// crumb is the current page (rendered as plain text, still listed in JSON-LD).
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm text-ink-400">
      {items.map((c, i) => (
        <span key={c.href}>
          {i > 0 && <span className="mx-1.5 text-ink-200">/</span>}
          {i < items.length - 1 ? (
            <Link href={c.href} className="transition hover:text-frost-700">{c.name}</Link>
          ) : (
            <span className="font-medium text-ink-600">{c.name}</span>
          )}
        </span>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: items.map((c, i) => ({
          "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE.url}${c.href}`,
        })),
      }) }} />
    </nav>
  );
}
