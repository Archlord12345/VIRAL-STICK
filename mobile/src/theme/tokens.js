// Viral Stick Mobile — Design Tokens — Style Sapphire & Obsidian
export const colors = {
  // ── Primary : Sapphire ─────────────────────
  sapphire:       "#2563EB",
  sapphireDark:   "#1D4ED8",
  sapphireLight:  "#BFDBFE",
  sapphireCyan:   "#06B6D4",

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
  success:       "#10B981",
  warning:       "#F59E0B",
  danger:        "#EF4444",
  
  // ── Compagnons ────────────────────────────
  arch: "#3B82F6",   // bleu
  art:  "#F59E0B",   // ambre
  bio:  "#10B981",   // vert
  data: "#06B6D4",   // cyan
  para: "#8B5CF6",   // violet
  secu: "#6366F1",   // indigo
  ubu:  "#EF4444",   // rouge
};

export const spacing = {
  xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const borderRadius = {
  sm: 8, md: 12, lg: 16, xl: 20, pill: 999,
};

export const radius = borderRadius;

export const shadows = {
  card: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 },
  btn:  { shadowColor: "#2563EB", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
};
