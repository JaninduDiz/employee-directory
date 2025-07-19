import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { router } from "expo-router";

export default function MainLayout() {
  const logout = useAuthStore((state) => state.logout);

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
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="add-employee"
        options={{
          presentation: "modal",
          title: "Add Employee",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#FFFFFF",
        }}
      />
    </Stack>
  );
}
