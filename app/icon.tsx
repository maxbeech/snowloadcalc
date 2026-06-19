import { ImageResponse } from "next/og";
import { COLOR, MARK } from "@/lib/brand";

// Favicon: the gable-and-drifted-snow mark on an arctic-ink tile, matching the
// header wordmark exactly (shared MARK geometry).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <svg width="32" height="32" viewBox={MARK.viewBox}>
          <rect width="32" height="32" rx="8" fill={COLOR.ink900} />
          <path d={MARK.roof} fill={COLOR.ink600} />
          <path d={MARK.snowCap} fill={COLOR.frost100} />
          <line x1="6" y1="27.2" x2="26" y2="27.2" stroke={COLOR.frost500} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
