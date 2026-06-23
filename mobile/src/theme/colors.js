/**
 * Viral Stick — Design System Colors
 * Unified for Mobile and Web
 */
import { colors as sharedColors } from './tokens';

export const colors = {
  primary: sharedColors.arch, // Utilisation de l'accent bleu par défaut
  primaryLight: '#a78bfa',
  primaryDark: '#5b21b6',
  secondary: sharedColors.data,
  accent1: sharedColors.bio,
  accent2: sharedColors.art,
  accent3: sharedColors.para,
  bg: sharedColors.background,
  bgCard: 'rgba(255, 255, 255, 0.04)', // À réajuster selon le nouveau fond
  bgCardHover: 'rgba(255, 255, 255, 0.08)',
  text: sharedColors.text,
  textSecondary: sharedColors.textMuted,
  textMuted: sharedColors.textMuted,
  border: sharedColors.border,
};

export const theme = {
  // Surfaces & Backgrounds
  background: colors.bg,
  backgroundCard: colors.bgCard,
  backgroundSecondary: 'rgba(255, 255, 255, 0.08)',
  
  // Text
  textPrimary: colors.text,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  textAccent: colors.primaryLight,
  
  // Accents / Actions
  primaryAction: colors.primary,
  secondaryAction: colors.secondary,
  primary: colors.primary,

  // Borders
  border: colors.border,
};
