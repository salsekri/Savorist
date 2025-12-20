import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Colors, Spacing, Typography } from "@/constants/theme";
import FavoriteCard from "@/components/FavoriteCard";
import SearchBar from "@/components/SearchBar";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import type { FavoritesStackParamList } from "@/navigation/FavoritesStackNavigator";
import type { Restaurant } from "@shared/schema";

type NavigationProp = NativeStackNavigationProp<FavoritesStackParamList>;

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data: allRestaurants = [], isLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });

  const loadFavorites = useCallback(async () => {
    const ids = await getFavorites();
    setFavoriteIds(ids);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleRestaurantPress = useCallback((id: string) => {
    navigation.navigate("RestaurantDetails", { restaurantId: id });
  }, [navigation]);

  const handleToggleFavorite = useCallback(async (id: string) => {
    await toggleFavorite(id);
    await loadFavorites();
  }, [loadFavorites]);

  const favoriteRestaurants = allRestaurants.filter((r) =>
    favoriteIds.includes(r.id)
  );

  const filteredFavorites = searchText
    ? favoriteRestaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(searchText.toLowerCase()) ||
          r.cuisineType.toLowerCase().includes(searchText.toLowerCase())
      )
    : favoriteRestaurants;

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="heart" size={64} color={Colors.light.border} />
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>Save restaurants to see them here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          showFilter={false}
          placeholder="Search favorites..."
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.light.burgundy} style={styles.loader} />
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <FavoriteCard
              restaurant={item}
              onPress={() => handleRestaurantPress(item.id)}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              isFavorite={favoriteIds.includes(item.id)}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
            flexGrow: 1,
          }}
          scrollIndicatorInsets={{ bottom: insets.bottom }}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.light.burgundy}
            />
          }
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
  row: {
    justifyContent: "space-between",
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
