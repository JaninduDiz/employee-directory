import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useThemeColors } from "../hooks/useTheme";

interface CommonButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryButton;
      case "danger":
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryButtonText;
      case "danger":
        return styles.dangerButtonText;
      default:
        return styles.primaryButtonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <Text style={[getTextStyle(), textStyle]}>
        {loading ? "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    baseButton: {
      borderRadius: 28,
      paddingHorizontal: 32,
      paddingVertical: 16,
      minHeight: 56,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    primaryButton: {
      backgroundColor: colors.accent,
    },
    secondaryButton: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dangerButton: {
      backgroundColor: colors.error,
    },
    disabledButton: {
      opacity: 0.6,
    },
    primaryButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    secondaryButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    dangerButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default CommonButton;
