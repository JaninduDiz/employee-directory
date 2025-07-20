import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Redirect, router } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeColors } from "@/hooks/useTheme";
import EmployeeCard from "@/components/EmployeeCard";
import QuoteCard from "@/components/QuoteCard";
import SearchBox from "@/components/SearchBox";

export default function MainScreen() {
  const { isAuthenticated } = useAuthStore();

  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [refreshing, setRefreshing] = useState(false);
  const quoteCardRef = useRef<any>(null);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  const openModal = () => {
    router.push("/(main)/add-employee");
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      console.log("Starting refresh...");

      if (quoteCardRef.current?.refreshQuote) {
        await quoteCardRef.current.refreshQuote();
      }

      // await refreshOtherData();

      console.log("Refresh completed!");
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            title="Pull to refresh"
            titleColor={colors.text}
          />
        }
      >
        <SearchBox />

        <QuoteCard ref={quoteCardRef} externalRefreshing={refreshing} />

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
