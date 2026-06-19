import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";
import { COLOR, MARK } from "@/lib/brand";

export const alt = `${SITE.name}, ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social share card, generated at build time (no runtime cost). Every multi-child
// div sets display:flex because Satori (next/og) requires it.
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: COLOR.ink900, padding: "72px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox={MARK.viewBox}>
            <rect width="32" height="32" rx="8" fill={COLOR.ink800} />
            <path d={MARK.roof} fill={COLOR.ink600} />
            <path d={MARK.snowCap} fill={COLOR.frost100} />
          </svg>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>
            Snow<span style={{ color: COLOR.frost400 }}>Load</span>Calc
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 1010 }}>
            Roof snow load, computed to ASCE 7-22.
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 30, color: COLOR.ink200, maxWidth: 980 }}>
            Ground snow to flat, sloped, minimum, rain-on-snow and §7.6.1 unbalanced load, with every factor shown.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["Pf = 0.7·Ce·Ct·Is·Pg", "Slope factor Cs", "Drift and unbalanced", "All 50 states"].map((t) => (
            <div key={t} style={{ display: "flex", border: `1px solid ${COLOR.frost700}`, color: COLOR.frost200, padding: "10px 20px", borderRadius: 999, fontSize: 24, fontWeight: 600 }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
