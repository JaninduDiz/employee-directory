import { useColorScheme } from "react-native";
import {
  Colors,
  type ThemeColors,
  type ColorScheme,
} from "../constants/Colors";

export function useTheme() {
  const colorScheme = useColorScheme() as ColorScheme;
  const theme = colorScheme ?? "light";
  const colors = Colors[theme];

  return {
    colors,
    theme,
    isDark: theme === "dark",
  };
}

export function useThemeColors(): ThemeColors {
  const { colors } = useTheme();
  return colors;
}
