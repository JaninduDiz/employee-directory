import { useColorScheme } from "@/components/useColorScheme";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import Colors from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function MainLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Main",

          headerRight: () => (
            <Link href="/add-employee" asChild>
              <Pressable>
                {({ pressed }) => (
                  <AntDesign
                    name="logout"
                    size={20}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      {/* 👇 Modal screen */}
      <Stack.Screen
        name="add-employee"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  );
}
