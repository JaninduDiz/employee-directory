import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { useThemeColors } from "../../hooks/useTheme";
import { useEmployeeStore } from "../../store/employeeStore";
import DatePicker from "../../components/DatePicker";
import CommonButton from "../../components/CommonButton";
import {
  EmployeeFormData,
  ValidationError,
  validateEmployeeForm,
  calculateAge,
  formDataToNewEmployee,
} from "../../utils/validation";

export default function AddEmployee() {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    age: "",
    dateOfBirth: "",
    employeeId: "",
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const colors = useThemeColors();
  const styles = createStyles(colors);
  const { addEmployee } = useEmployeeStore();
  const navigation = useNavigation();

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
    // Clear field error when user starts typing
    clearFieldError(field);
  };

  const handleDateOfBirthChange = (dateString: string) => {
    const calculatedAge = calculateAge(new Date(dateString));

    setFormData((prev) => ({
      ...prev,
      dateOfBirth: dateString,
      age: calculatedAge.toString(),
    }));

    // Clear date-related errors
    clearFieldError("dateOfBirth");
    clearFieldError("age");
  };

  const handleSave = async () => {
    // Validate form data
    const validationErrors = validateEmployeeForm(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      // Show the first error in an alert
      Alert.alert("Validation Error", validationErrors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const newEmployee = formDataToNewEmployee(formData);

      await addEmployee(newEmployee);

      Alert.alert("Success", "Employee added successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add employee. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleCancel}
          style={styles.headerButton}
          disabled={isLoading}
        >
          <Text style={[styles.headerButtonText, { color: colors.accent }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors, isLoading]);

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
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[
                  styles.input,
                  getFieldError("name") && styles.inputError,
                ]}
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                placeholder="Enter full name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
              />
              {getFieldError("name") && (
                <Text style={styles.errorText}>{getFieldError("name")}</Text>
              )}
            </View>

            <DatePicker
              value={formData.dateOfBirth}
              onDateChange={handleDateOfBirthChange}
              label="Date of Birth"
              placeholder="Select date of birth"
              helperText="Tap to select date of birth"
              hasError={!!getFieldError("dateOfBirth")}
              errorText={getFieldError("dateOfBirth")}
              required
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.disabledInput,
                  getFieldError("age") && styles.inputError,
                ]}
                value={formData.age ? `${formData.age} years old` : ""}
                placeholder="Will be calculated from date of birth"
                placeholderTextColor={colors.textSecondary}
                editable={false}
              />
              <Text style={styles.helperText}>
                Age is calculated from date of birth
              </Text>
              {getFieldError("age") && (
                <Text style={styles.errorText}>{getFieldError("age")}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Employee ID</Text>
              <TextInput
                style={styles.input}
                value={formData.employeeId}
                onChangeText={(value) => handleInputChange("employeeId", value)}
                placeholder="Leave empty to auto-generate"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="characters"
              />
              <Text style={styles.helperText}>
                Must start with 'EMP_' or leave empty for auto-generation
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <CommonButton
            title={isLoading ? "Saving..." : "Save"}
            onPress={handleSave}
            disabled={isLoading}
            loading={isLoading}
            style={styles.saveButton}
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
    },
    form: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    inputGroup: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      backgroundColor: colors.background,
      color: colors.text,
    },
    inputError: {
      borderColor: colors.error,
      backgroundColor: colors.errorBackground,
    },
    disabledInput: {
      color: colors.textSecondary,
    },
    helperText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
      fontStyle: "italic",
    },
    errorText: {
      fontSize: 14,
      color: colors.error,
      marginTop: 4,
      fontWeight: "500",
    },
    buttonContainer: {
      position: "absolute",
      bottom: 80,
      left: "5%",
      right: "5%",
      width: "90%",
      alignSelf: "center",
    },
    saveButton: {
      width: "100%",
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
