import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useThemeColors } from "../hooks/useTheme";
import { formatDisplayDate } from "../utils/validation";
import { Ionicons } from "@expo/vector-icons";

interface DatePickerProps {
  value?: string;
  onDateChange: (dateString: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  hasError?: boolean;
  errorText?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  placeholder = "Select date",
  label,
  helperText,
  hasError = false,
  errorText,
  required = false,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [date, setDate] = useState(() => {
    if (value) {
      return new Date(value);
    }
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 25);
    return defaultDate;
  });

  const colors = useThemeColors();
  const styles = createStyles(colors);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateConfirm = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setIsDatePickerOpen(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = formatDate(selectedDate);
      onDateChange(formattedDate);

      if (Platform.OS === "ios") {
        setIsDatePickerOpen(false);
      }
    }
  };

  const handleDateCancel = () => {
    setIsDatePickerOpen(false);
  };

  const openDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && " *"}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.dateInput, hasError && styles.inputError]}
        onPress={openDatePicker}
      >
        <Text style={[styles.dateInputText, !value && styles.placeholderText]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar" size={24} color={colors.textSecondary} />
      </TouchableOpacity>

      {helperText && !errorText && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      {errorText && <Text style={styles.errorText}>{errorText}</Text>}

      {/* iOS Modal DatePicker */}
      {isDatePickerOpen && Platform.OS === "ios" && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isDatePickerOpen}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerModal}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleDateCancel}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => handleDateConfirm(null, date)}>
                  <Text style={[styles.modalButton, styles.confirmButton]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  minimumDate={new Date(1959, 0, 1)}
                  onChange={(event, selectedDate) =>
                    setDate(selectedDate || date)
                  }
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android DatePicker */}
      {isDatePickerOpen && Platform.OS === "android" && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          maximumDate={new Date()}
          minimumDate={new Date(1959, 0, 1)}
          onChange={handleDateConfirm}
        />
      )}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    dateInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      backgroundColor: colors.background,
      minHeight: 52,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
    inputError: {
      borderColor: colors.error,
      backgroundColor: colors.errorBackground,
    },
    dateInputText: {
      fontSize: 16,
      color: colors.text,
    },
    placeholderText: {
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
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    datePickerModal: {
      backgroundColor: colors.cardBackground,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 34,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalButton: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "600",
    },
    confirmButton: {
      color: colors.accent,
      fontWeight: "700",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    datePickerContainer: {
      alignItems: "center",
    },
  });

export default DatePicker;
