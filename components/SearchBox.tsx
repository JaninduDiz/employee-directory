import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useThemeColors } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

const SearchBox = () => {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  return (
    <View style={{ marginTop: 16, marginBottom: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 18,
        }}
      >
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={{ marginRight: 8 }}
        />
        <Text
          style={{
            flex: 1,
            color: colors.textSecondary,
            fontSize: 16,
          }}
        >
          Search employees...
        </Text>
      </View>
    </View>
  );
};

export default SearchBox;

const createStyles = (colors: any) => StyleSheet.create({});
