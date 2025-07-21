import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useTheme";
import DatePicker from "./DatePicker";
import { EmployeeFormData, ValidationError } from "../utils/validation";

interface EditEmployeeFormProps {
  formData: EmployeeFormData;
  errors: ValidationError[];
  onInputChange: (field: keyof EmployeeFormData, value: string) => void;
  onDateOfBirthChange: (dateString: string) => void;
  getFieldError: (fieldName: string) => string | undefined;
}

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({
  formData,
  errors,
  onInputChange,
  onDateOfBirthChange,
  getFieldError,
}) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const handleDateOfBirthChange = (dateString: string) => {
    onDateOfBirthChange(dateString);
  };

  return (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={[styles.input, getFieldError("name") && styles.inputError]}
          value={formData.name}
          onChangeText={(value) => onInputChange("name", value)}
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
        <Text style={styles.label}>Employee ID *</Text>
        <TextInput
          style={[
            styles.input,
            getFieldError("employeeId") && styles.inputError,
          ]}
          value={formData.employeeId}
          onChangeText={(value) => onInputChange("employeeId", value)}
          placeholder="EMP_12345"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="characters"
        />
        <Text style={styles.helperText}>
          Employee ID must start with 'EMP_' followed by letters/numbers
        </Text>
        {getFieldError("employeeId") && (
          <Text style={styles.errorText}>{getFieldError("employeeId")}</Text>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
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
  });

export default EditEmployeeForm;
