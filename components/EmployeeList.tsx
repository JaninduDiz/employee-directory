import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Employee } from "@/types";
import { useThemeColors } from "@/hooks/useTheme";
import EmployeeItem from "./EmployeeItem";
import { useEmployeeStore } from "@/store/employeeStore";
import { EMPLOYEE_COUNT } from "@/constants";

export interface EmployeeListRef {
  refreshEmployees: () => Promise<void>;
}

const EmployeeList = forwardRef<EmployeeListRef>((props, ref) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const {
    latestEmployees,
    searchResults,
    isLoading,
    isSearching,
    error,
    searchQuery,
    initializeEmployees,
    deleteEmployee,
    clearError,
    getLatestEmployees,
    clearEmployees,
  } = useEmployeeStore();

  const displayEmployees = searchQuery.trim() ? searchResults : latestEmployees;
  const isShowingSearchResults = searchQuery.trim().length > 0;

  useImperativeHandle(ref, () => ({
    refreshEmployees: async () => {
      await getLatestEmployees(EMPLOYEE_COUNT);
    },
  }));

  const sectionedEmployees = useMemo(() => {
    if (!displayEmployees.length) return [];

    if (isShowingSearchResults) {
      return [
        {
          title: "Results",
          data: displayEmployees,
        },
      ];
    }

    const sortedEmployees = [...displayEmployees].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const grouped = sortedEmployees.reduce((acc, employee) => {
      const firstLetter = employee.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(employee);
      return acc;
    }, {} as Record<string, Employee[]>);

    return Object.keys(grouped)
      .sort()
      .map((letter) => ({
        title: letter,
        data: grouped[letter],
      }));
  }, [displayEmployees, isShowingSearchResults]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await initializeEmployees();
        await getLatestEmployees(EMPLOYEE_COUNT);
      } catch (error) {
        console.error("Failed to initialize employees:", error);
      }
    };

    initializeData();
  }, [initializeEmployees, getLatestEmployees, EMPLOYEE_COUNT]);

  useImperativeHandle(
    ref,
    () => ({
      refreshEmployees: async () => {
        try {
          await initializeEmployees();
          await getLatestEmployees(EMPLOYEE_COUNT);
        } catch (error) {
          console.error("Failed to refresh employees:", error);
        }
      },
    }),
    [initializeEmployees, getLatestEmployees, EMPLOYEE_COUNT]
  );

  const handleEmployeePress = (employee: Employee) => {
    router.push(`/(main)/employee-details?id=${employee.id}`);
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    try {
      await deleteEmployee(employee.id);
    } catch (error) {
      console.error("Error deleting employee:", error);
      Alert.alert("Error", "Failed to delete employee. Please try again.");
    }
  };

  const renderEmployeeItem = ({ item }: { item: Employee }) => (
    <EmployeeItem
      employee={item}
      onPress={handleEmployeePress}
      onDelete={handleDeleteEmployee}
    />
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => {
    if (isShowingSearchResults) {
      return null;
    }

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isShowingSearchResults) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="search-outline"
            size={48}
            color={colors.textSecondary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyStateText}>No employees found</Text>
          <Text style={styles.emptyStateSubtext}>
            No employees match "{searchQuery}". Try a different search term.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="people-outline"
          size={48}
          color={colors.textSecondary}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyStateText}>No employees found</Text>
        <Text style={styles.emptyStateSubtext}>
          Add some employees to get started
        </Text>
      </View>
    );
  };

  const renderSearchingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.loadingText}>Searching employees...</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading employees...</Text>
      </View>
    );
  }

  if (isSearching) {
    return renderSearchingState();
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={async () => {
            clearError();
            await initializeEmployees();
            await getLatestEmployees(EMPLOYEE_COUNT);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isShowingSearchResults && (
        <View style={styles.searchHeader}>
          <Text style={styles.searchResultsText}>
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}{" "}
            for "{searchQuery}"
          </Text>
        </View>
      )}

      <SectionList
        sections={sectionedEmployees}
        renderItem={renderEmployeeItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.list}
        stickySectionHeadersEnabled={true}
      />
    </View>
  );
});

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    list: {
      flex: 1,
    },
    deleteButton: {
      backgroundColor: colors.error,
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      marginVertical: 4,
      marginRight: 16,
      borderRadius: 12,
    },
    deleteButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: 16,
    },
    emptyState: {
      padding: 40,
      alignItems: "center",
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
    },
    searchHeader: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor:
        colors.background === "#121212" ? colors.surface : colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: 8,
    },
    searchResultsText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 10,
    },
    errorContainer: {
      padding: 20,
      alignItems: "center",
    },
    errorText: {
      fontSize: 16,
      color: colors.error,
      textAlign: "center",
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: 16,
    },
    sectionHeader: {
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginTop: 8,
    },
    sectionHeaderText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.accent,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
  });

export default EmployeeList;
