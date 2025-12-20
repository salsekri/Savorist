import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import TabSelector from "@/components/TabSelector";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { Restaurant } from "@shared/schema";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList & RootStackParamList>;

const TABS = ["ALL", "NEARBY", "TRENDING"];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchText, setSearchText] = useState("");

  const getEndpoint = () => {
    switch (activeTab) {
      case "NEARBY":
        return "/api/restaurants/nearby";
      case "TRENDING":
        return "/api/restaurants/trending";
      default:
        return "/api/restaurants";
    }
  };

  const { data: restaurants = [], isLoading, refetch, isRefetching } = useQuery<Restaurant[]>({
    queryKey: [getEndpoint()],
  });

  const handleRestaurantPress = useCallback((id: string) => {
    navigation.navigate("RestaurantDetails", { restaurantId: id });
  }, [navigation]);

  const handleBookPress = useCallback((name: string) => {
    navigation.navigate("BookingModal", { restaurantName: name });
  }, [navigation]);

  const handleFilterPress = useCallback(() => {
    navigation.navigate("FilterModal", undefined);
  }, [navigation]);

  const filteredRestaurants = searchText
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(searchText.toLowerCase()) ||
          r.cuisineType.toLowerCase().includes(searchText.toLowerCase())
      )
    : restaurants;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.light.burgundy} />
      }
    >
      <LinearGradient
        colors={[Colors.light.burgundy, Colors.light.wine]}
        style={styles.header}
      >
        <Text style={styles.greeting}>Hi, Good morning!</Text>
        <Text style={styles.title}>Reserve the Best{"\n"}Nearby dining.</Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onFilterPress={handleFilterPress}
        />
      </View>

      <Pressable style={({ pressed }) => [styles.promoBanner, pressed && styles.promoPressed]}>
        <View style={styles.promoContent}>
          <Text style={styles.promoLabel}>LIMITED OFFER</Text>
          <Text style={styles.promoTitle}>Up to 50% OFF</Text>
          <Text style={styles.promoSubtitle}>on selected restaurants</Text>
          <View style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Book now</Text>
          </View>
        </View>
      </Pressable>

      <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Restaurants</Text>
        <Pressable>
          <Text style={styles.viewAll}>View all</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.light.burgundy} style={styles.loader} />
      ) : (
        filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={() => handleRestaurantPress(restaurant.id)}
            onBook={() => handleBookPress(restaurant.name)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundDefault,
  },
  header: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.small,
    color: Colors.light.cream,
    opacity: 0.9,
  },
  title: {
    ...Typography.h1,
    color: Colors.light.cream,
    marginTop: Spacing.sm,
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  promoBanner: {
    backgroundColor: Colors.light.burgundy,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  promoPressed: {
    opacity: 0.9,
  },
  promoContent: {},
  promoLabel: {
    ...Typography.caption,
    color: Colors.light.cream,
    opacity: 0.8,
    marginBottom: Spacing.xs,
  },
  promoTitle: {
    ...Typography.h1,
    color: Colors.light.cream,
  },
  promoSubtitle: {
    ...Typography.small,
    color: Colors.light.cream,
    opacity: 0.9,
  },
  promoButton: {
    backgroundColor: Colors.light.cream,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignSelf: "flex-start",
    marginTop: Spacing.md,
  },
  promoButtonText: {
    ...Typography.small,
    color: Colors.light.burgundy,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.light.text,
  },
  viewAll: {
    ...Typography.small,
    color: Colors.light.burgundy,
  },
  loader: {
    marginTop: Spacing.xl,
  },
});
