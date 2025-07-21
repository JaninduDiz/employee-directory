import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Employee } from "@/types";
import { useThemeColors } from "@/hooks/useTheme";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

interface EmployeeDetailModalProps {
  visible: boolean;
  employee: Employee;
  onClose: () => void;
  onDelete: () => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  visible,
  employee,
  onClose,
  onDelete,
}) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const handleDelete = () => {
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
          onPress: () => {
            onClose();

            setTimeout(() => {
              onDelete();
            }, 100);
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    onClose();
    router.push(`/(main)/edit-employee?id=${employee.id}`);
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employee Details</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Joined On</Text>
              <Text style={styles.detailValue}>
                {formatCreatedDate(employee.createdAt)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.secondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    headerActions: {
      flexDirection: "row",
      gap: 8,
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
    editButtonText: {
      fontSize: 16,
      color: colors.accent,
      fontWeight: "600",
    },
    deleteButton: {
      padding: 8,
    },
    deleteButtonText: {
      fontSize: 16,
      color: colors.error,
      fontWeight: "600",
    },
    content: {
      flex: 1,
      padding: 20,
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
      marginBottom: 8,
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
  });

export default EmployeeDetailModal;
