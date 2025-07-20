import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeColors } from "@/hooks/useTheme";
import EmployeeCard from "@/components/EmployeeCard";
import QuoteCard from "@/components/QuoteCard";

export default function MainScreen() {
  const { isAuthenticated } = useAuthStore();

  const colors = useThemeColors();
  const styles = createStyles(colors);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  const openModal = () => {
    router.push("/(main)/add-employee");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={{ marginTop: 16, marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.surface,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 18,
            }}
          >
            <Ionicons
              name="search"
              size={20}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                flex: 1,
                color: colors.textSecondary,
                fontSize: 16,
              }}
            >
              Search employees...
            </Text>
          </View>
        </View>

        <QuoteCard />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Employees (Latest 10)</Text>
        </View>

        <EmployeeCard />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Text style={styles.fabText}>Add New Employee</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
      paddingHorizontal: 16,
    },
    welcomeSection: {
      backgroundColor: colors.secondary,
      padding: 20,
      borderRadius: 12,
      marginTop: 16,
      marginBottom: 16,
    },
    welcomeText: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    userText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 12,
    },
    fab: {
      position: "absolute",
      bottom: 30,
      width: "90%",
      height: 60,
      borderRadius: 12,
      backgroundColor: colors.accent,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    fabText: {
      color: colors.accent === "#000000" ? "#ffffff" : colors.primary,
      fontSize: 14,
      fontWeight: "bold",
    },
  });
