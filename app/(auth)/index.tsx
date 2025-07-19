import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, Redirect } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeColors } from "@/hooks/useTheme";

export default function LoginScreen() {
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const { login, isLoading, error, isAuthenticated, clearError } =
    useAuthStore();

  const colors = useThemeColors();
  const styles = createStyles(colors);

  useEffect(() => {
    if (error) {
      setPinError(error);
      clearError();
    }
  }, [error, clearError]);

  if (isAuthenticated) {
    return <Redirect href="/(main)" />;
  }

  const validatePin = (value: string): boolean => {
    if (!value.trim()) {
      setPinError("PIN is required");
      return false;
    }
    if (value.length !== 4) {
      setPinError("PIN must be 4 digits");
      return false;
    }
    if (!/^\d{4}$/.test(value)) {
      setPinError("PIN must contain only numbers");
      return false;
    }
    setPinError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validatePin(pin)) {
      return;
    }

    const success = await login(pin);
    if (success) {
      router.replace("/(main)");
    }
  };

  const handlePinChange = (value: string) => {
    setPin(value);
    if (pinError) {
      setPinError("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Employee Directory</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, pinError ? styles.inputError : null]}
            value={pin}
            onChangeText={handlePinChange}
            placeholder="Enter 4-digit PIN"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            editable={!isLoading}
            autoFocus
          />
          {pinError ? <Text style={styles.errorText}>{pinError}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.hintText}>Hint: Use PIN "1234" for demo</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      color: colors.text,
      marginBottom: 100,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      color: colors.textSecondary,
      marginBottom: 40,
    },
    inputContainer: {
      marginBottom: 24,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      textAlign: "center",
      color: colors.text,
    },
    inputError: {
      borderColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 8,
      textAlign: "center",
    },
    button: {
      backgroundColor: colors.accent,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginBottom: 16,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "600",
    },
    hintText: {
      textAlign: "center",
      color: colors.textTertiary,
      fontSize: 14,
    },
  });
