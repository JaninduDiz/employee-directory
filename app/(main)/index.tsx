import React, { useCallback, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Redirect, router, useFocusEffect } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useEmployeeStore } from "@/store/employeeStore";
import { useThemeColors } from "@/hooks/useTheme";
import EmployeeList, { EmployeeListRef } from "@/components/EmployeeList";
import QuoteCard from "@/components/QuoteCard";
import SearchBox from "@/components/SearchBox";

export default function MainScreen() {
  const { isAuthenticated } = useAuthStore();
  const { searchQuery, clearSearch, refreshEmployees } = useEmployeeStore();

  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const quoteCardRef = useRef<any>(null);
  const employeeListRef = useRef<EmployeeListRef>(null);

  const handleSearchChange = (query: string) => {
    setIsSearching(query.trim().length > 0);
  };

  const openModal = () => {
    router.push("/(main)/add-employee");
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      if (searchQuery.trim()) {
        clearSearch();
        setIsSearching(false);
      }

      const promises = [];

      if (quoteCardRef.current?.refreshQuote) {
        promises.push(quoteCardRef.current.refreshQuote());
      }

      promises.push(refreshEmployees());

      if (employeeListRef.current?.refreshEmployees) {
        promises.push(employeeListRef.current.refreshEmployees());
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshEmployees, searchQuery, clearSearch]);

  useFocusEffect(
    useCallback(() => {
      refreshEmployees();

      if (employeeListRef.current?.refreshEmployees) {
        employeeListRef.current.refreshEmployees();
      }
    }, [refreshEmployees])
  );

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBox onSearchChange={handleSearchChange} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accent]}
            tintColor={colors.accent}
            title="Pull to refresh"
            titleColor={colors.text}
          />
        }
      >
        {!isSearching && (
          <QuoteCard ref={quoteCardRef} externalRefreshing={refreshing} />
        )}

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, isSearching && { marginBottom: 12 }]}
          >
            {isSearching
              ? "Search Results"
              : `New Employees (Latest ${Math.min(
                  10,
                  useEmployeeStore.getState().latestEmployees.length
                )})`}
          </Text>
        </View>

        <EmployeeList ref={employeeListRef} />
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
    contentContainer: {
      paddingBottom: 100,
    },
    section: {
      marginBottom: 12,
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
