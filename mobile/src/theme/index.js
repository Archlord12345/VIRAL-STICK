/**
 * General Intelligence Company — Theme System
 * Adapted for Viral Stick React Native App
 */

import React, { createContext, useContext, useState } from 'react';
import { darkTheme, lightTheme } from './colors';

// ─── Spacing scale (4px base) ──────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

// ─── Border radii ─────────────────────────────────────────────────────────
export const radius = {
  button: 4,
  cards: 12,
  elevatedCards: 16,
  heroCards: 24,
  nav: 50,
};

// ─── Typography ────────────────────────────────────────────────────────────
export const typography = {
  // We use standard fonts available, approximating the editorial feel
  fontFamily: {
    display: 'System', // ppmondwest
    body: 'System',    // af
  },
  fontSize: {
    caption: 13,
    bodySm: 15,
    subheading: 18,
    heading: 40,
    headingLg: 48,
    display: 54,
  },
  lineHeight: {
    caption: 1.4,
    bodySm: 1.5,
    subheading: 1.3,
    heading: 1.1,
  },
  letterSpacing: {
    caption: -0.156,
    bodySm: -0.15,
    subheading: -0.18,
    heading: -0.8,
  }
};

// ─── Shadow presets (adapted from GIC) ─────────────────────────────────────
export const getShadow = (elevation) => {
  if (elevation === 'sm') return { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 2 };
  if (elevation === 'subtle') return { shadowColor: '#dee2de', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 1, elevation: 1 };
  return { elevation: 0 };
};

// ─── Theme Context ────────────────────────────────────────────────────────
const ThemeContext = createContext({ theme: lightTheme, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  // Default to light theme as per GIC design
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// ─── Frosted/Glass style helper ──────────────────────────────────────────
export const glassStyle = (theme) => ({
  backgroundColor: theme.glassBackground,
  borderWidth: 1,
  borderColor: theme.glassBorder,
  borderRadius: radius.heroCards,
});
