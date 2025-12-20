import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import type { Restaurant } from "@shared/schema";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.lg * 3) / 2;

interface FavoriteCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export default function FavoriteCard({
  restaurant,
  onPress,
  onToggleFavorite,
  isFavorite,
}: FavoriteCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: restaurant.imageUrl || undefined }}
          style={styles.image}
          contentFit="cover"
        />
        <Pressable
          style={({ pressed }) => [styles.heartButton, pressed && styles.heartPressed]}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          <Feather
            name="heart"
            size={18}
            color={isFavorite ? Colors.light.burgundy : Colors.light.textSecondary}
            style={isFavorite ? styles.heartFilled : undefined}
          />
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {restaurant.name}
        </Text>
        <Text style={styles.cuisine}>{restaurant.cuisineType}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: CARD_WIDTH * 0.8,
    borderRadius: BorderRadius.sm,
  },
  heartButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  heartPressed: {
    transform: [{ scale: 1.2 }],
  },
  heartFilled: {},
  content: {
    padding: Spacing.sm,
  },
  name: {
    ...Typography.body,
    fontWeight: "500",
    color: Colors.light.text,
  },
  cuisine: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
});
