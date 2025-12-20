import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export default function FilterChip({ label, isActive, onPress }: FilterChipProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        isActive && styles.activeChip,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  activeChip: {
    backgroundColor: Colors.light.burgundy,
    borderColor: Colors.light.burgundy,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...Typography.small,
    color: Colors.light.textSecondary,
  },
  activeLabel: {
    color: Colors.light.buttonText,
    fontWeight: "500",
  },
});
