"use client";

import { useState } from "react";

// Pro checkout. The pricing page (a Server Component) passes `enabled`, computed
// from whether the Stripe env vars are configured at build time. When Stripe is
// not wired yet we render an honest "early access" affordance instead of a
// misleading purchase button that would dead-end in a "coming soon" message.
export default function CheckoutButton({ enabled = false, className }: { enabled?: boolean; className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) {
    return (
      <div className="rounded-xl border border-ink-100 bg-white/70 p-4 text-sm">
        <p className="font-semibold text-ink-800">Pro reports are launching shortly.</p>
        <a href="mailto:hello@snowloadcalc.com?subject=SnowLoadCalc%20Pro%20early%20access"
          className="mt-1 inline-flex items-center gap-1 font-semibold text-frost-700 hover:underline">
          Email us for early access
          <span aria-hidden>&rarr;</span>
        </a>
      </div>
    );
  }

  async function go() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      setError(data.message ?? "Checkout is not available yet. Please check back soon.");
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={go} disabled={loading}
        className={className ?? "w-full rounded-xl bg-ink-900 px-5 py-3 font-semibold text-white transition hover:bg-ink-800 disabled:opacity-60"}>
        {loading ? "Starting checkout" : "Get the Pro report · $29"}
      </button>
      {error && <p className="mt-2 text-sm text-load-700">{error}</p>}
    </div>
  );
}
