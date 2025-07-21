import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Employee } from "@/types";
import EmployeeDetailModal from "./EmployeeDetailModal";
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

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const displayEmployees = searchQuery.trim() ? searchResults : latestEmployees;
  const isShowingSearchResults = searchQuery.trim().length > 0;

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
    setSelectedEmployee(employee);
    setIsDetailModalVisible(true);
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    try {
      if (selectedEmployee?.id === employee.id) {
        setIsDetailModalVisible(false);

        setTimeout(() => {
          setSelectedEmployee(null);
        }, 300);
      }

      await deleteEmployee(employee.id);
    } catch (error) {
      Alert.alert("Error", "Failed to delete employee");
    }
  };

  const handleDeleteEmployeeWithConfirmation = async (employee: Employee) => {
    Alert.alert(
      "Delete Employee",
      `Are you sure you want to delete ${employee.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteEmployee(employee),
        },
      ]
    );
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);

    setTimeout(() => {
      setSelectedEmployee(null);
    }, 300);
  };

  const renderEmployeeItem = ({ item }: { item: Employee }) => (
    <EmployeeItem
      employee={item}
      onPress={handleEmployeePress}
      onDelete={handleDeleteEmployeeWithConfirmation}
    />
  );

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

      <FlatList
        data={displayEmployees}
        renderItem={renderEmployeeItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.list}
      />

      {selectedEmployee && (
        <EmployeeDetailModal
          visible={isDetailModalVisible}
          employee={selectedEmployee}
          onClose={handleCloseDetailModal}
          onDelete={() => {
            handleDeleteEmployee(selectedEmployee);
          }}
        />
      )}
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
      backgroundColor: colors.surface,
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
  });

export default EmployeeList;
