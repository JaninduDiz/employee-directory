import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useThemeColors } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useEmployeeStore } from "@/store/employeeStore";

interface SearchBoxProps {
  onSearchChange?: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearchChange }) => {
  const colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { searchEmployees, clearSearch, searchQuery } = useEmployeeStore();
  const [localQuery, setLocalQuery] = useState(searchQuery || "");

  useEffect(() => {
    if (searchQuery !== localQuery) {
      setLocalQuery(searchQuery || "");
    }
  }, [searchQuery]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (localQuery.trim() !== searchQuery) {
        if (localQuery.trim()) {
          searchEmployees(localQuery.trim());
        } else {
          clearSearch();
        }
        onSearchChange?.(localQuery.trim());
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localQuery, searchQuery, searchEmployees, clearSearch, onSearchChange]);

  const handleClearSearch = () => {
    setLocalQuery("");
    clearSearch();
    onSearchChange?.("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          value={localQuery}
          onChangeText={setLocalQuery}
          placeholder="Search employees..."
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {localQuery.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchBox;

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginTop: 16,
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingVertical: 6,
    },
    clearButton: {
      marginLeft: 8,
      padding: 4,
    },
  });
