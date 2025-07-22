import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useThemeColors } from "../../hooks/useTheme";
import { useEmployeeStore } from "../../store/employeeStore";
import CommonButton from "../../components/CommonButton";
import Feather from "@expo/vector-icons/Feather";
import { Employee } from "../../types";

export default function EmployeeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const { latestEmployees, searchResults, searchQuery, deleteEmployee } =
    useEmployeeStore();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id && typeof id === "string") {
      const allEmployees = searchQuery.trim() ? searchResults : latestEmployees;
      const foundEmployee = allEmployees.find((emp) => emp.id === id);
      setEmployee(foundEmployee || null);
    }
  }, [id, latestEmployees, searchResults, searchQuery]);

  const handleDelete = async () => {
    if (!employee) return;

    Alert.alert(
      "Delete Employee",
      `Are you sure you want to delete ${employee.name}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteEmployee(employee.id);
              Alert.alert("Success", "Employee deleted successfully!", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              console.error("Error deleting employee:", error);
              Alert.alert(
                "Error",
                "Failed to delete employee. Please try again."
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (employee) {
      router.push(`/(main)/edit-employee?id=${employee.id}`);
    }
  };

  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Text
            style={[styles.headerButtonText, { color: colors.textSecondary }]}
          >
            Close
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  if (!employee) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Employee not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
          </View>
          <Text style={styles.employeeName}>{employee.name}</Text>
          <Text style={styles.employeeId}>{employee.employeeId}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity
            onPress={handleEdit}
            style={styles.editButton}
            activeOpacity={0.7}
            disabled={!employee}
          >
            <Feather name="edit" size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{employee.name}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Age</Text>
            <Text style={styles.detailValue}>{employee.age} years old</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date of Birth</Text>
            <Text style={styles.detailValue}>{employee.dateOfBirth}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Employee ID</Text>
            <Text style={styles.detailValue}>{employee.employeeId}</Text>
          </View>

          <View style={[styles.detailItem, styles.lastDetailItem]}>
            <Text style={styles.detailLabel}>Joined On</Text>
            <Text style={styles.detailValue}>
              {formatCreatedDate(employee.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CommonButton
            title={isLoading ? "Deleting..." : "Delete Employee"}
            variant="danger"
            onPress={handleDelete}
            disabled={isLoading}
          />
        </View>
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
    },
    contentContainer: {
      padding: 20,
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
    },
    profileSection: {
      alignItems: "center",
      marginBottom: 32,
      paddingVertical: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 24,
      fontWeight: "600",
      color: "white",
    },
    employeeName: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    employeeId: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    detailsSection: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
    },
    detailItem: {
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastDetailItem: {
      borderBottomWidth: 0,
      marginBottom: 0,
      paddingBottom: 0,
    },
    detailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    detailValue: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    buttonContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      paddingBottom: 30,
      marginBottom: 20,
    },
    headerButton: {
      padding: 8,
      marginRight: 5,
    },
    headerButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    editButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
  });
