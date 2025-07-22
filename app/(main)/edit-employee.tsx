import React, { useState, useEffect, useLayoutEffect } from "react";
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
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useThemeColors } from "../../hooks/useTheme";
import { useEmployeeStore } from "../../store/employeeStore";
import EditEmployeeForm from "../../components/EditEmployeeForm";
import CommonButton from "../../components/CommonButton";
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
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);

  const colors = useThemeColors();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const { updateEmployee, latestEmployees, searchResults } = useEmployeeStore();

  useEffect(() => {
    const findEmployee = async () => {
      if (!employeeId) {
        Alert.alert("Error", "No employee ID provided", [
          { text: "OK", onPress: () => router.back() },
        ]);
        return;
      }

      setIsLoadingEmployee(true);

      try {
        const allEmployees = [...latestEmployees, ...searchResults];
        let foundEmployee = allEmployees.find((emp) => emp.id === employeeId);

        if (!foundEmployee) {
          const { EmployeeService } = await import(
            "../../services/employeeService"
          );
          const allStoredEmployees = await EmployeeService.getAllEmployees();
          foundEmployee = allStoredEmployees.find(
            (emp) => emp.id === employeeId
          );
        }

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
      } catch (error) {
        console.error("Error finding employee:", error);
        Alert.alert("Error", "Failed to load employee data", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } finally {
        setIsLoadingEmployee(false);
      }
    };

    findEmployee();
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

    if (formData.employeeId.trim() !== employee.employeeId) {
      try {
        const { EmployeeService } = await import(
          "../../services/employeeService"
        );
        const existingEmployee = await EmployeeService.getEmployeeById(
          formData.employeeId.trim()
        );

        if (existingEmployee && existingEmployee.id !== employee.id) {
          setErrors([
            { field: "employeeId", message: "This Employee ID already exists" },
          ]);
          Alert.alert("Validation Error", "This Employee ID already exists");
          return;
        }
      } catch (error) {
        console.error("Error checking duplicate employee ID:", error);
      }
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
      console.error("Error updating employee:", error);
      Alert.alert("Error", "Failed to update employee. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (
      employee &&
      (formData.name !== employee.name ||
        formData.age !== employee.age.toString() ||
        formData.dateOfBirth !== employee.dateOfBirth ||
        formData.employeeId !== employee.employeeId)
    ) {
      Alert.alert(
        "Discard Changes",
        "You have unsaved changes. Are you sure you want to discard them?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleCancel}
          disabled={isLoading}
        >
          <Text style={[styles.headerButtonText, { color: colors.accent }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors, isLoading, handleCancel]);

  if (!employee || isLoadingEmployee) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isLoadingEmployee
              ? "Loading employee data..."
              : "Employee not found"}
          </Text>
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
          <CommonButton
            title={isLoading ? "Updating..." : "Update Employee"}
            variant="primary"
            onPress={handleSave}
            disabled={isLoading}
          />
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
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    buttonContainer: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    headerButton: {
      padding: 8,
      minWidth: 60,
      alignItems: "center",
      justifyContent: "center",
    },
    headerButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
  });
