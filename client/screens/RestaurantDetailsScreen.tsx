import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";
import ReviewCard from "@/components/ReviewCard";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { Restaurant, Review } from "@shared/schema";

type RouteProps = RouteProp<HomeStackParamList, "RestaurantDetails">;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList & RootStackParamList>;

export default function RestaurantDetailsScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { restaurantId } = route.params;
  const [isFav, setIsFav] = useState(false);

  const { data: restaurant, isLoading: loadingRestaurant } = useQuery<Restaurant>({
    queryKey: ["/api/restaurants", restaurantId],
    queryFn: async () => {
      const baseUrl = getApiUrl();
      const res = await fetch(new URL(`/api/restaurants/${restaurantId}`, baseUrl));
      return res.json();
    },
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/restaurants", restaurantId, "reviews"],
    queryFn: async () => {
      const baseUrl = getApiUrl();
      const res = await fetch(new URL(`/api/restaurants/${restaurantId}/reviews`, baseUrl));
      return res.json();
    },
  });

  useEffect(() => {
    const checkFavorite = async () => {
      const result = await isFavorite(restaurantId);
      setIsFav(result);
    };
    checkFavorite();
  }, [restaurantId]);

  const handleToggleFavorite = useCallback(async () => {
    const result = await toggleFavorite(restaurantId);
    setIsFav(result);
  }, [restaurantId]);

  const handleCall = useCallback(() => {
    if (restaurant?.phone) {
      Linking.openURL(`tel:${restaurant.phone}`);
    }
  }, [restaurant]);

  const handleDirections = useCallback(() => {
    if (restaurant?.address) {
      const url = Platform.select({
        ios: `maps:0,0?q=${encodeURIComponent(restaurant.address)}`,
        android: `geo:0,0?q=${encodeURIComponent(restaurant.address)}`,
        default: `https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`,
      });
      Linking.openURL(url);
    }
  }, [restaurant]);

  const handleBook = useCallback(() => {
    if (restaurant) {
      navigation.navigate("BookingModal", { restaurantName: restaurant.name });
    }
  }, [navigation, restaurant]);

  if (loadingRestaurant || !restaurant) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.light.burgundy} />
      </View>
    );
  }

  const rating = parseFloat(restaurant.rating || "0");

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: restaurant.imageUrl || undefined }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <Pressable
            style={({ pressed }) => [styles.favoriteButton, pressed && styles.buttonPressed]}
            onPress={handleToggleFavorite}
          >
            <Feather
              name="heart"
              size={20}
              color={isFav ? Colors.light.burgundy : Colors.light.textSecondary}
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{restaurant.name}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Feather
                  key={star}
                  name="star"
                  size={16}
                  color={star <= rating ? Colors.light.starGold : Colors.light.border}
                  style={styles.star}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({restaurant.reviewCount} reviews)</Text>
            <Text style={styles.price}>{restaurant.priceRange}</Text>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={styles.description}>{restaurant.description}</Text>
            <Pressable style={styles.seeMore}>
              <Text style={styles.seeMoreText}>See more</Text>
            </Pressable>
          </View>

          <View style={styles.actionButtons}>
            <Pressable
              style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
              onPress={handleCall}
            >
              <Feather name="phone" size={20} color={Colors.light.burgundy} />
              <Text style={styles.actionButtonText}>Call</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
              onPress={handleDirections}
            >
              <Feather name="navigation" size={20} color={Colors.light.burgundy} />
              <Text style={styles.actionButtonText}>Direction</Text>
            </Pressable>
          </View>

          <View style={styles.menuButton}>
            <Feather name="menu" size={20} color={Colors.light.burgundy} />
            <Text style={styles.menuButtonText}>View Full Menu</Text>
          </View>

          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Guest Reviews</Text>
              <View style={styles.ratingBadge}>
                <Feather name="star" size={12} color={Colors.light.starGold} />
                <Text style={styles.ratingBadgeText}>{rating.toFixed(1)}</Text>
              </View>
            </View>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bookButtonContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <Pressable
          style={({ pressed }) => [styles.bookButton, pressed && styles.bookButtonPressed]}
          onPress={handleBook}
        >
          <Text style={styles.bookButtonText}>Book a Table</Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundDefault,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 250,
  },
  favoriteButton: {
    position: "absolute",
    top: 60,
    right: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  stars: {
    flexDirection: "row",
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.light.text,
    marginLeft: Spacing.sm,
  },
  reviewCount: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.xs,
  },
  price: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.light.burgundy,
    marginLeft: "auto",
  },
  detailsCard: {
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  seeMore: {
    marginTop: Spacing.sm,
  },
  seeMoreText: {
    ...Typography.small,
    color: Colors.light.burgundy,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.burgundy,
    gap: Spacing.sm,
  },
  actionButtonText: {
    ...Typography.body,
    color: Colors.light.burgundy,
    fontWeight: "500",
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.backgroundRoot,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  menuButtonText: {
    ...Typography.body,
    color: Colors.light.burgundy,
    fontWeight: "500",
  },
  reviewsSection: {
    marginBottom: Spacing.lg,
  },
  reviewsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundRoot,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    marginLeft: Spacing.sm,
    gap: 4,
  },
  ratingBadgeText: {
    ...Typography.small,
    fontWeight: "600",
    color: Colors.light.text,
  },
  bookButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.backgroundDefault,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  bookButton: {
    backgroundColor: Colors.light.burgundy,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  bookButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  bookButtonText: {
    ...Typography.body,
    color: Colors.light.buttonText,
    fontWeight: "600",
  },
});
