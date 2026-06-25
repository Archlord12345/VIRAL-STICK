// Viral Stick Mobile — Design Tokens — Style Coral & Midnight
export const colors = {
  // ── Primary : Coral ─────────────────────
  coral:       "#FF6B6B",
  coralDark:   "#E55A5A",
  coralLight:  "#FFB3B3",
  coralOrange: "#FF8E53",

  // ── Success / validation ───────────────────
  successGreen:      "#4ADE80",
  successGreenDark:  "#22C55E",
  successGreenLight: "#DCFCE7",

  // ── Accents illustration ───────────────────
  skyBlue:       "#3B82F6",
  sunshineYellow:"#F59E0B",
  grapeSoda:     "#8B5CF6",
  bubblegumPink: "#F43F5E",
  emerald:       "#10B981",

  // ── Neutrals ──────────────────────────────
  snowWhite:   "#FFFFFF",
  cloudGray:   "#F3F4F6",
  silver:      "#9CA3AF",
  graphite:    "#6B7280",
  charcoal:    "#374151",
  darkGray:    "#1F2937",
  cardBg:      "#141414",
  almostBlack: "#0D0D0D",

  // ── Semantic ──────────────────────────────
  bg:            "#0D0D0D",
  bgSecondary:   "#141414",
  border:        "rgba(255,255,255,0.06)",
  text:          "#FFFFFF",
  textSecondary: "#A0A0A0",
  textMuted:     "#6B7280",
  success:       "#4ADE80",
  warning:       "#F59E0B",
  danger:        "#FF6B6B",
  
  // ── Compagnons ────────────────────────────
  arch: "#3B82F6",   // bleu
  art:  "#F59E0B",   // ambre
  bio:  "#FF6B6B",   // corail
  data: "#10B981",   // vert
  para: "#FF8E53",   // orange
  secu: "#8B5CF6",   // violet
  ubu:  "#F43F5E",   // rose
};

export const spacing = {
  xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const borderRadius = {
  sm: 8, md: 12, lg: 16, xl: 20, pill: 999,
};

export const shadows = {
  card: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 },
  btn:  { shadowColor: "#FF6B6B", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
};
