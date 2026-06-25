import React, { createContext, useContext, useState } from "react";
import { colors } from "./tokens";

export const spacing  = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius   = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 };
export const typography = {
  fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 22, xxl: 28, xxxl: 36, display: 40 },
};

export const createShadow = (color = "#FF6B6B", elevation = 4) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: elevation },
  shadowOpacity: 0.22,
  shadowRadius: 2,
  elevation: Math.max(2, elevation),
});

export const lightTheme = {
  isDark: false,
  background:          colors.snowWhite,
  backgroundCard:      colors.snowWhite,
  backgroundSecondary: colors.cloudGray,
  textPrimary:         colors.almostBlack,
  textSecondary:       colors.charcoal,
  textMuted:           colors.silver,
  primary:             colors.coral,
  primaryLight:        colors.coralLight,
  primaryDark:         colors.coralDark,
  secondary:           colors.coralOrange,
  secondaryLight:      "#FFF3E0",
  warning:             colors.sunshineYellow,
  danger:              colors.danger,
  border:              colors.cloudGray,
  divider:             colors.cloudGray,
  cardShadow:          { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
};

export const darkTheme = {
  isDark: true,
  background:          colors.bg,
  backgroundCard:      colors.bgSecondary,
  backgroundSecondary: colors.bg,
  textPrimary:         colors.text,
  textSecondary:       colors.textSecondary,
  textMuted:           colors.textMuted,
  primary:             colors.coral,
  primaryLight:        "rgba(255,107,107,0.15)", // Translucent coral for badges
  primaryDark:         colors.coralDark,
  secondary:           colors.coralOrange,
  secondaryLight:      "rgba(255,142,83,0.15)", // Translucent orange
  warning:             colors.warning,
  danger:              colors.danger,
  border:              colors.border,
  divider:             colors.border,
  cardShadow:          { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
};

const ThemeContext = createContext({
  theme: darkTheme, // Par défaut darkTheme !
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export { colors };
