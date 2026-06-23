/**
 * Viral Stick — Design Tokens
 * Inspiré Duolingo : fond blanc, vert vif, formes arrondies, énergie ludique
 */

export const colors = {
  // ── Brand ──────────────────────────────────
  duoGreen:       "#58cc02",
  duoGreenDark:   "#3f8f01",
  duoGreenLight:  "#d7ffb8",
  skyBlue:        "#1cb0f6",
  skyBlueDark:    "#1899d6",
  sunshineYellow: "#ffc700",
  grapeSoda:      "#a570ff",
  bubblegumPink:  "#cc348d",

  // ── Neutrals ───────────────────────────────
  snowWhite:   "#ffffff",
  cloudGray:   "#e5e5e5",
  silver:      "#afafaf",
  graphite:    "#777777",
  charcoal:    "#4b4b4b",
  almostBlack: "#3c3c3c",

  // ── Semantic ───────────────────────────────
  bg:            "#ffffff",
  bgSecondary:   "#f7f7f7",
  panel:         "#ffffff",
  border:        "#e5e5e5",
  text:          "#3c3c3c",
  textSecondary: "#4b4b4b",
  textMuted:     "#afafaf",
  success:       "#58cc02",
  warning:       "#ffc700",
  danger:        "#ee2a2a",

  // ── Compagnons ─────────────────────────────
  arch: "#58cc02",
  art:  "#ffc700",
  bio:  "#a570ff",
  data: "#1cb0f6",
  para: "#ff9600",
  secu: "#cc348d",
  ubu:  "#ce82ff",
};

export const spacing = {
  unit: 4,
  xs:   8,
  sm:   12,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
  section: 80,
};

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  pill: 9999,
};

export const shadows = {
  // Signature Duolingo : ombre solide en bas = effet bouton pressable
  btnPrimary:   "0 4px 0 #3f8f01",
  btnBlue:      "0 4px 0 #1899d6",
  btnGray:      "0 4px 0 #b5b5b5",
  card:         "0 2px 0 0 #e5e5e5",
  cardHover:    "0 4px 0 0 #d0d0d0",
};

export const typography = {
  // Titres : Fredoka One (substitut "feather")
  // Corps  : Nunito (substitut "din-round")
  display: { fontSize: 48, lineHeight: 1.2, letterSpacing: -0.96, weight: "700" },
  headingLg: { fontSize: 36, lineHeight: 1.2, weight: "700" },
  heading: { fontSize: 28, lineHeight: 1.2, weight: "700" },
  headingSm: { fontSize: 20, lineHeight: 1.2, weight: "700" },
  body: { fontSize: 16, lineHeight: 1.47, letterSpacing: 0.8, weight: "500" },
  caption: { fontSize: 13, lineHeight: 1.4, letterSpacing: 0.69, weight: "500" },
};
