// Brand constants. The single source of truth for colour and the logo mark.
// Tailwind utilities cover the DOM; this file exists for places that need raw
// hex (the OG image + favicon via Satori, and SVG diagram fills computed in JS).

export const COLOR = {
  ink950: "#14110b",
  ink900: "#1d1a12",
  ink800: "#2a251b",
  ink700: "#3a3427",
  ink600: "#4f4836",
  ink400: "#8c8369",
  ink200: "#d1c8b1",
  frost700: "#193640",
  frost600: "#21434f",
  frost500: "#2c5462",
  frost400: "#426b77",
  frost300: "#6f969f",
  frost200: "#a4c0c7",
  frost100: "#cddce0",
  frost50: "#e9eff1",
  load600: "#973f22",
  load500: "#b14e2c",
  load300: "#d29b80",
  load100: "#e9cfc2",
  paper: "#f7f3ea",
  snow: "#dde8ea",
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
