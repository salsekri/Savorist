import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Colors, Spacing, Typography } from "@/constants/theme";

interface TabSelectorProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          style={({ pressed }) => [
            styles.tab,
            activeTab === tab && styles.activeTab,
            pressed && styles.pressed,
          ]}
          onPress={() => onTabChange(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          {activeTab === tab ? <View style={styles.indicator} /> : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginRight: Spacing.sm,
    position: "relative",
  },
  activeTab: {},
  pressed: {
    opacity: 0.7,
  },
  tabText: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    fontWeight: "500",
  },
  activeTabText: {
    color: Colors.light.burgundy,
    fontWeight: "600",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: Spacing.xl,
    right: Spacing.xl,
    height: 3,
    backgroundColor: Colors.light.burgundy,
    borderRadius: 2,
  },
});
