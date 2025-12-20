import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
  showFilter?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = "Search for restaurants...",
  showFilter = true,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color={Colors.light.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.textSecondary}
      />
      {showFilter ? (
        <Pressable
          style={({ pressed }) => [styles.filterButton, pressed && styles.filterPressed]}
          onPress={onFilterPress}
        >
          <Feather name="sliders" size={20} color={Colors.light.burgundy} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.light.text,
  },
  filterButton: {
    padding: Spacing.xs,
  },
  filterPressed: {
    opacity: 0.7,
  },
});
