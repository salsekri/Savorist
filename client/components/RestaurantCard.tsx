import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import type { Restaurant } from "@shared/schema";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  onBook?: () => void;
  showBookButton?: boolean;
}

export default function RestaurantCard({
  restaurant,
  onPress,
  onBook,
  showBookButton = true,
}: RestaurantCardProps) {
  const rating = parseFloat(restaurant.rating || "0");

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Image
        source={{ uri: restaurant.imageUrl || undefined }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={styles.cuisine}>{restaurant.cuisineType}</Text>
        <View style={styles.ratingRow}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Feather
                key={star}
                name="star"
                size={12}
                color={star <= rating ? Colors.light.starGold : Colors.light.border}
                style={styles.star}
              />
            ))}
          </View>
          <Text style={styles.distance}>{restaurant.distance}</Text>
        </View>
        <Text style={styles.price}>{restaurant.priceRange}</Text>
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [styles.viewButton, pressed && styles.buttonPressed]}
            onPress={onPress}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </Pressable>
          {showBookButton && onBook ? (
            <Pressable
              style={({ pressed }) => [styles.bookButton, pressed && styles.buttonPressed]}
              onPress={onBook}
            >
              <Text style={styles.bookButtonText}>Book</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xs,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    ...Typography.h2,
    color: Colors.light.text,
  },
  cuisine: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  stars: {
    flexDirection: "row",
  },
  star: {
    marginRight: 2,
  },
  distance: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.sm,
  },
  price: {
    ...Typography.small,
    color: Colors.light.burgundy,
    fontWeight: "600",
    marginTop: Spacing.xs,
  },
  buttons: {
    flexDirection: "row",
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  viewButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.burgundy,
  },
  viewButtonText: {
    ...Typography.small,
    color: Colors.light.burgundy,
    fontWeight: "500",
  },
  bookButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.burgundy,
  },
  bookButtonText: {
    ...Typography.small,
    color: Colors.light.buttonText,
    fontWeight: "500",
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
