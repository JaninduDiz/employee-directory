import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PanResponder,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Employee } from "../types";
import { useThemeColors } from "@/hooks/useTheme";

interface EmployeeItemProps {
  employee: Employee;
  onPress: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const SWIPE_THRESHOLD = -100;
const DELETE_BUTTON_WIDTH = 80;

const EmployeeItem: React.FC<EmployeeItemProps> = ({
  employee,
  onPress,
  onDelete,
}) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handleDelete = () => {
    Alert.alert(
      "Delete Employee",
      `Are you sure you want to delete ${employee.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            translateX.value = withSpring(0);
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            opacity.value = withTiming(0, { duration: 300 });
            translateX.value = withTiming(-300, { duration: 300 });
            setTimeout(() => onDelete(employee), 300);
          },
        },
      ]
    );
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return (
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
        Math.abs(gestureState.dx) > 10
      );
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        translateX.value = Math.max(gestureState.dx, -DELETE_BUTTON_WIDTH);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < SWIPE_THRESHOLD) {
        translateX.value = withSpring(-DELETE_BUTTON_WIDTH);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -10 ? 1 : 0,
    transform: [{ translateX: translateX.value + DELETE_BUTTON_WIDTH }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
        <TouchableOpacity
          style={styles.deleteButtonTouchable}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[styles.employeeItem, animatedStyle]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onPress={() => onPress(employee)}
          activeOpacity={0.7}
          style={styles.touchableContent}
        >
          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName}>{employee.name}</Text>
            <Text style={styles.employeeDetails}>
              Age: {employee.age} • DOB: {employee.dateOfBirth}
            </Text>
            <Text style={styles.employeeId}>
              Employee ID: {employee.employeeId}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginVertical: 4,
      marginHorizontal: 16,
    },
    employeeItem: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      shadowColor: colors.accent,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    touchableContent: {
      padding: 16,
    },
    employeeInfo: {
      flex: 1,
    },
    employeeName: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    employeeDetails: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    employeeId: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    deleteButton: {
      position: "absolute",
      right: 0,
      top: 4,
      bottom: 4,
      width: DELETE_BUTTON_WIDTH,
      backgroundColor: colors.error,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      zIndex: -1,
    },
    deleteButtonTouchable: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    deleteButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: 16,
    },
  });

export default EmployeeItem;
