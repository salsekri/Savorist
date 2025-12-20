import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import type { SearchStackParamList } from "@/navigation/SearchStackNavigator";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { Restaurant } from "@shared/schema";

type NavigationProp = NativeStackNavigationProp<SearchStackParamList & RootStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");

  const { data: restaurants = [], isLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants/search", searchText],
    queryFn: async () => {
      const baseUrl = getApiUrl();
      if (!searchText.trim()) {
        const res = await fetch(new URL("/api/restaurants", baseUrl));
        return res.json();
      }
      const res = await fetch(new URL(`/api/restaurants/search?q=${encodeURIComponent(searchText)}`, baseUrl));
      return res.json();
    },
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="search" size={64} color={Colors.light.border} />
      <Text style={styles.emptyTitle}>No restaurants found</Text>
      <Text style={styles.emptySubtitle}>Try adjusting your search</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onFilterPress={handleFilterPress}
        />
      </View>

      <Text style={styles.resultsCount}>{restaurants.length} Results</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.light.burgundy} style={styles.loader} />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => handleRestaurantPress(item.id)}
              onBook={() => handleBookPress(item.name)}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
            flexGrow: 1,
          }}
          scrollIndicatorInsets={{ bottom: insets.bottom }}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundDefault,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  resultsCount: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  loader: {
    marginTop: Spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.light.text,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    marginTop: Spacing.sm,
  },
});
