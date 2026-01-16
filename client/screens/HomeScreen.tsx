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
        paddingBottom: tabBarHeight + Spacing.xl,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.light.cream} />
      }
    >
      <LinearGradient
        colors={['#C62F56', '#66001A']}
        style={[styles.heroSection, { paddingTop: insets.top + Spacing.lg }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hi, Good morning!</Text>
          <Text style={styles.title}>Reserve the Best{"\n"}Nearby dining.</Text>
        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            onFilterPress={handleFilterPress}
          />
        </View>

        <Pressable style={({ pressed }) => [styles.promoBanner, pressed && styles.promoPressed]}>
          <View style={styles.promoContent}>
            <Text style={styles.promoLabel}>WEEKEND SPECIAL</Text>
            <Text style={styles.promoTitle}>Up to 50% OFF</Text>
            <Text style={styles.promoSubtitle}>on selected restaurants</Text>
            <View style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Book now</Text>
            </View>
          </View>
        </Pressable>
      </LinearGradient>

      <View style={styles.contentSection}>
        <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Restaurants</Text>
          <Pressable>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#C62F56" style={styles.loader} />
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundDefault,
  },
  heroSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  contentSection: {
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.small,
    fontFamily: "Recoleta-SemiBold",
    fontWeight: "normal",
    color: Colors.light.cream,
    opacity: 0.9,
  },
  title: {
    ...Typography.h1,
    fontFamily: "Recoleta-SemiBold",
    fontWeight: "normal",
    color: Colors.light.cream,
    marginTop: Spacing.sm,
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  promoBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  promoPressed: {
    opacity: 0.9,
  },
  promoContent: {},
  promoLabel: {
    ...Typography.caption,
    color: Colors.light.cream,
    opacity: 0.9,
    marginBottom: Spacing.xs,
    fontWeight: "600",
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
    backgroundColor: Colors.light.text,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignSelf: "flex-start",
    marginTop: Spacing.md,
  },
  promoButtonText: {
    ...Typography.small,
    color: Colors.light.cream,
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
    color: '#C62F56',
  },
  loader: {
    marginTop: Spacing.xl,
  },
});
