import { MARK } from "@/lib/brand";

// The logo mark: a gable roof under a wind-drifted snow cap. Rendered from the
// shared MARK geometry so the favicon and OG card stay identical to the header.
export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={MARK.viewBox}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" className="fill-ink-900" />
      <path d={MARK.roof} className="fill-ink-600" />
      <path d={MARK.snowCap} className="fill-frost-100" />
      <path d={MARK.snowCap} className="fill-none stroke-frost-300" strokeWidth={0.5} />
      {/* Settled-snow datum line + a single load tick, the instrument detail. */}
      <line x1="6" y1="27.2" x2="26" y2="27.2" className="stroke-frost-500" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

// Full lockup used in the header and footer.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={30} />
      <span className="font-display text-[17px] font-bold tracking-tight text-ink-900">
        Snow<span className="text-frost-600">Load</span>Calc
      </span>
    </span>
  );
}
