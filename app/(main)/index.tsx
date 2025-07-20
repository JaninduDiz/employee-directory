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
import { fetchRandomQuote } from "@/services/api";
import { loadQuote, saveQuote } from "@/storage/quoteStorage";
import { Quote } from "@/types";
import QuoteCard from "@/components/QuoteCard";

export default function MainScreen() {
  const { isAuthenticated } = useAuthStore();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

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

        <QuoteCard quote={quote} loading={loading} />

        <EmployeeCard />
      </ScrollView>
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
    section: {
      marginBottom: 24,
    },
  });
