/**
 * General Intelligence Company — Design System Colors
 * Adapted for Viral Stick React Native App
 */

export const colors = {
  hudsonBlue: '#0081c0',
  slateCyan: '#41a1cf',
  graphiteNight: '#282834',
  ink: '#171717',
  carbon: '#2c2c2c',
  iron: '#444141',
  steel: '#646464',
  fog: '#b4b8b4',
  ash: '#a5afaf',
  mist: '#cfd3cf',
  sage: '#dee2de',
  cream: '#fefffc',
  linen: '#f9faf7',
  paper: '#ffffff',
  obsidian: '#1f1f29',
};

export const lightTheme = {
  // Surfaces & Backgrounds
  background: colors.cream,
  backgroundCard: colors.paper,
  glassBackground: 'rgba(255, 255, 255, 0.6)',
  glassBorder: colors.sage,

  // Text
  textPrimary: colors.ink,
  textSecondary: colors.carbon,
  textMuted: colors.steel,
  textAccent: colors.hudsonBlue,

  // Accents / Actions
  primaryAction: colors.obsidian, // Primary button fill
  secondaryAction: colors.slateCyan, // Outlined borders
  accent: colors.hudsonBlue,

  // Borders
  border: colors.sage,
  divider: colors.fog,

  // Shadow
  shadowColor: colors.ink,
  
  isDark: false,
};

// Dark theme is kept as a minimal fallback, adapted to maintain the GIC style
export const darkTheme = {
  background: colors.graphiteNight,
  backgroundCard: colors.obsidian,
  glassBackground: 'rgba(40, 40, 52, 0.7)',
  glassBorder: colors.iron,
  textPrimary: colors.paper,
  textSecondary: colors.mist,
  textMuted: colors.steel,
  textAccent: colors.slateCyan,
  primaryAction: colors.paper,
  secondaryAction: colors.slateCyan,
  accent: colors.hudsonBlue,
  border: colors.iron,
  divider: colors.iron,
  shadowColor: '#000000',
  isDark: true,
};
