"use client";

import { useState } from "react";

// Pro checkout. The pricing page (a Server Component) passes `enabled`, computed
// from whether the Stripe env vars are configured at build time. When Stripe is
// NOT wired yet we render an honest "early access" affordance instead of a
// misleading "$29" purchase button that would dead-end in a "coming soon" toast.
export default function CheckoutButton({ enabled = false, className }: { enabled?: boolean; className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
        <p className="font-medium text-slate-700">Pro reports are launching shortly.</p>
        <a href="mailto:hello@snowloadcalc.com?subject=SnowLoadCalc%20Pro%20early%20access"
          className="mt-1 inline-block font-semibold text-sky-700 hover:underline">
          Email us for early access →
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
      setError(data.message ?? "Checkout isn't available yet — check back soon.");
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={go} disabled={loading}
        className={className ?? "rounded-lg bg-sky-600 px-5 py-2.5 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"}>
        {loading ? "Starting…" : "Get the Pro report — $29"}
      </button>
      {error && <p className="mt-2 text-sm text-amber-700">{error}</p>}
    </div>
  );
}
