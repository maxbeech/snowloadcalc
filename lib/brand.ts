// Brand constants. The single source of truth for colour and the logo mark.
// Tailwind utilities cover the DOM; this file exists for places that need raw
// hex (the OG image + favicon via Satori, and SVG diagram fills computed in JS).

export const COLOR = {
  ink900: "#0a1622",
  ink800: "#0f1f2e",
  ink700: "#15293b",
  ink600: "#173347",
  ink400: "#4f6a83",
  ink200: "#aebfcf",
  frost700: "#156b82",
  frost600: "#1186a0",
  frost500: "#11a7bd",
  frost400: "#2cc4d8",
  frost300: "#67ddeb",
  frost200: "#a3edf5",
  frost100: "#cef7fb",
  frost50: "#ecfdfe",
  load600: "#c47d18",
  load500: "#e0992a",
  load300: "#f0c06a",
  load100: "#f9e6c6",
  paper: "#f4f7f9",
  snow: "#f8fbfd",
  white: "#ffffff",
} as const;

// Logo geometry (32×32 viewBox). A gable roof carrying a snow cap that drifts
// to the leeward side: the product's own subject, drawn as its mark.
export const MARK = {
  viewBox: "0 0 32 32",
  // Filled roof gable.
  roof: "M4 25 L16 9.5 L28 25 Z",
  // Snow cap riding the ridge, heavier (drifted) on the leeward right slope.
  snowCap:
    "M6 23.2 C9 20 12.5 13.8 15.4 11 C15.8 10.6 16.4 10.7 16.7 11.2 C18.6 14.4 20.4 18 23 20.4 C24.6 21.9 26 22.4 27 22.9 L27 24.2 C24.3 23.2 21.6 23 19 23.4 C15.7 23.9 12.4 24.4 9 24 C8 23.9 7 23.6 6 23.2 Z",
} as const;
