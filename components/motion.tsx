"use client";

import { useEffect, useRef, useState } from "react";

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fade-and-rise a block into view on scroll. The hide/animate is done in CSS
// (gated to `prefers-reduced-motion: no-preference`), so reduced-motion users and
// no-JS readers always see the content; JS just flips `data-shown` when it enters
// the viewport. No synchronous setState in the effect.
export function Reveal({ children, className = "", delay = 0, y = 18 }:
  { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-shown={shown ? "true" : "false"} className={`reveal ${className}`}
      style={{ "--reveal-y": `${y}px`, transitionDelay: `${delay}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}

// Count a number up from 0 when it scrolls into view. Server renders the final
// value (correct with no JS / for crawlers); the animation only kicks in on the
// off-screen-to-on-screen transition, so there is no visible reset at load.
export function CountUp({ value, decimals = 0, duration = 1100, suffix = "", className = "" }:
  { value: number; decimals?: number; duration?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);
  const ran = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || ran.current || reduced()) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return;
      ran.current = true;
      io.disconnect();
      setN(0);
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        setN(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick); else setN(value);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  return (
    <span ref={ref} className={`tabular ${className}`}>
      {n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}
