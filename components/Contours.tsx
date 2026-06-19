import { contourField } from "@/lib/contours";

// The topographic-contour backdrop. Renders the shared contour field as faint
// lines that slowly breathe, echoing the elevation contours of an ASCE ground
// snow load map. Server component (deterministic geometry, no client JS).
export default function Contours({ variant = "light", className = "", drift = true }:
  { variant?: "light" | "dark"; className?: string; drift?: boolean }) {
  const paths = contourField({ count: 11, step: 11 });
  const dark = variant === "dark";
  // Two strokes per contour: a brighter index line every third ring, so the field
  // reads like a real topographic map rather than faint noise.
  const base = dark ? "rgba(164,192,199,0.16)" : "rgba(29,26,18,0.08)";
  const index = dark ? "rgba(164,192,199,0.32)" : "rgba(33,67,79,0.22)";
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <g className={drift ? "contour-drift" : ""} style={{ transformOrigin: "50% 50%" }}>
        {paths.map((d, i) => (
          <path key={i} d={d} fill="none" vectorEffect="non-scaling-stroke"
            stroke={i % 3 === 0 ? index : base} strokeWidth={i % 3 === 0 ? 0.5 : 0.3} />
        ))}
      </g>
    </svg>
  );
}
