import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { router } from "expo-router";
import { useThemeColors } from "@/hooks/useTheme";

export default function MainLayout() {
  const logout = useAuthStore((state) => state.logout);
  const colors = useThemeColors();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)");
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Employee Directory",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                marginRight: 16,
                padding: 8,
                minWidth: 40,
                minHeight: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={24}
                color={colors.accent}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="add-employee"
        options={{
          presentation: "modal",
          title: "Add New Employee",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="edit-employee"
        options={{
          presentation: "modal",
          title: "Edit Employee",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="employee-details"
        options={{
          presentation: "modal",
          title: "Employee Details",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          headerLeft: () => null,
        }}
      />
    </Stack>
  );
}
