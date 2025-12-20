import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import FilterChip from "@/components/FilterChip";

const CUISINE_TYPES = ["All", "Italian", "Japanese", "Indian", "Arabian", "American", "French"];
const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"];

export default function FilterModal() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [cuisineType, setCuisineType] = useState("All");
  const [minRating, setMinRating] = useState(3);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [starRating, setStarRating] = useState<number | null>(null);

  const handleApply = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    setCuisineType("All");
    setMinRating(3);
    setPriceRange(null);
    setStarRating(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl + 80,
          paddingHorizontal: Spacing.lg,
        }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuisine Type</Text>
          <View style={styles.chipsContainer}>
            {CUISINE_TYPES.map((type) => (
              <FilterChip
                key={type}
                label={type}
                isActive={cuisineType === type}
                onPress={() => setCuisineType(type)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.chipsContainer}>
            {PRICE_RANGES.map((range) => (
              <FilterChip
                key={range}
                label={range}
                isActive={priceRange === range}
                onPress={() => setPriceRange(priceRange === range ? null : range)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sectionTitle}>Minimum Rating</Text>
            <Text style={styles.sliderValue}>{minRating.toFixed(1)}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={0.5}
            value={minRating}
            onValueChange={setMinRating}
            minimumTrackTintColor={Colors.light.burgundy}
            maximumTrackTintColor={Colors.light.border}
            thumbTintColor={Colors.light.burgundy}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1.0</Text>
            <Text style={styles.sliderLabel}>5.0</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Star Rating</Text>
          <View style={styles.starRatingContainer}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <Pressable
                key={rating}
                style={({ pressed }) => [
                  styles.starButton,
                  starRating === rating && styles.starButtonActive,
                  pressed && styles.starButtonPressed,
                ]}
                onPress={() => setStarRating(starRating === rating ? null : rating)}
              >
                <Feather
                  name="star"
                  size={20}
                  color={starRating === rating ? Colors.light.buttonText : Colors.light.starGold}
                />
                <Text
                  style={[
                    styles.starButtonText,
                    starRating === rating && styles.starButtonTextActive,
                  ]}
                >
                  {rating}+
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <Pressable style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.applyButton, pressed && styles.applyButtonPressed]}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundDefault,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderValue: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.light.burgundy,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  starRatingContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  starButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: Spacing.xs,
  },
  starButtonActive: {
    backgroundColor: Colors.light.burgundy,
    borderColor: Colors.light.burgundy,
  },
  starButtonPressed: {
    opacity: 0.7,
  },
  starButtonText: {
    ...Typography.small,
    color: Colors.light.text,
  },
  starButtonTextActive: {
    color: Colors.light.buttonText,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.backgroundRoot,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  clearButton: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  clearButtonText: {
    ...Typography.body,
    color: Colors.light.burgundy,
  },
  applyButton: {
    backgroundColor: Colors.light.burgundy,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  applyButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  applyButtonText: {
    ...Typography.body,
    color: Colors.light.buttonText,
    fontWeight: "600",
  },
});
