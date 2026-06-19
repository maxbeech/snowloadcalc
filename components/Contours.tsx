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
  const base = dark ? "rgba(143,211,224,0.16)" : "rgba(23,51,71,0.09)";
  const index = dark ? "rgba(143,211,224,0.34)" : "rgba(17,134,160,0.20)";
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
