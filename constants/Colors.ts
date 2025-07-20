const primaryColor = "#eae4d5";
const secondaryColor = "#7dc6b8";
const accentColor = "#000000";

// Light theme colors
const lightColors = {
  primary: primaryColor,
  secondary: secondaryColor,
  accent: accentColor,
  text: accentColor,
  textSecondary: "#666666",
  textTertiary: "#999999",
  background: "#f2f2f2",
  surface: primaryColor,
  surfaceSecondary: "#f5f5f5",
  border: "#e0e0e0",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  tint: secondaryColor,
};

// Dark theme colors
const darkColors = {
  primary: "#2c2a24",
  secondary: secondaryColor,
  accent: "#ffffff",
  text: "#ffffff",
  textSecondary: "#cccccc",
  textTertiary: "#999999",
  background: "#121212",
  surface: "#1e1e1e",
  surfaceSecondary: "#2c2c2c",
  border: "#333333",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  tint: secondaryColor,
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = typeof lightColors;

export default Colors;
