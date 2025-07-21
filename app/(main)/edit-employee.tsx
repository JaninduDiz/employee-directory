import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useThemeColors } from "../../hooks/useTheme";
import { useEmployeeStore } from "../../store/employeeStore";
import EditEmployeeForm from "../../components/EditEmployeeForm";
import {
  EmployeeFormData,
  ValidationError,
  validateEmployeeForm,
  calculateAge,
} from "../../utils/validation";
import { Employee } from "../../types";

export default function EditEmployee() {
  const params = useLocalSearchParams();
  const employeeId = params.id as string;

  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    age: "",
    dateOfBirth: "",
    employeeId: "",
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);

  const colors = useThemeColors();
  const styles = createStyles(colors);
  const { updateEmployee, latestEmployees, searchResults } = useEmployeeStore();

  useEffect(() => {
    const findEmployee = () => {
      const allEmployees = [...latestEmployees, ...searchResults];
      const foundEmployee = allEmployees.find((emp) => emp.id === employeeId);

      if (foundEmployee) {
        setEmployee(foundEmployee);

        setFormData({
          name: foundEmployee.name,
          age: foundEmployee.age.toString(),
          dateOfBirth: foundEmployee.dateOfBirth,
          employeeId: foundEmployee.employeeId,
        });
      } else {
        Alert.alert("Error", "Employee not found", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    };

    if (employeeId) {
      findEmployee();
    }
  }, [employeeId, latestEmployees, searchResults]);

  const getFieldError = (fieldName: string): string | undefined => {
    const error = errors.find((err) => err.field === fieldName);
    return error?.message;
  };

  const clearFieldError = (fieldName: string) => {
    setErrors((prev) => prev.filter((err) => err.field !== fieldName));
  };

  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    clearFieldError(field);
  };

  const handleDateOfBirthChange = (dateString: string) => {
    const calculatedAge = calculateAge(new Date(dateString));

    setFormData((prev) => ({
      ...prev,
      dateOfBirth: dateString,
      age: calculatedAge.toString(),
    }));

    clearFieldError("dateOfBirth");
    clearFieldError("age");
  };

  const handleSave = async () => {
    if (!employee) return;

    const validationErrors = validateEmployeeForm(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);

      Alert.alert("Validation Error", validationErrors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const updatedEmployee: Employee = {
        ...employee,
        name: formData.name.trim(),
        age: Number(formData.age),
        dateOfBirth: formData.dateOfBirth.trim(),
        employeeId: formData.employeeId.trim(),
      };

      await updateEmployee(updatedEmployee);

      Alert.alert("Success", "Employee updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update employee. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!employee) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading employee data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Edit Employee</Text>
            <Text style={styles.subtitle}>
              Update {employee.name}'s information
            </Text>
          </View>

          <EditEmployeeForm
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onDateOfBirthChange={handleDateOfBirthChange}
            getFieldError={getFieldError}
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              isLoading && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? "Updating..." : "Update Employee"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardContainer: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 100,
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
    header: {
      marginBottom: 32,
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    buttonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      padding: 20,
      paddingBottom: 4,
      gap: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    button: {
      flex: 1,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      minHeight: 52,
      justifyContent: "center",
    },
    cancelButton: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    disabledButton: {
      opacity: 0.6,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
  });
