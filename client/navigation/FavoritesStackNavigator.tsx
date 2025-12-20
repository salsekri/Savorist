import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FavoritesScreen from "@/screens/FavoritesScreen";
import RestaurantDetailsScreen from "@/screens/RestaurantDetailsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type FavoritesStackParamList = {
  Favorites: undefined;
  RestaurantDetails: { restaurantId: string };
};

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export default function FavoritesStackNavigator() {
  const screenOptions = useScreenOptions({ transparent: false });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerTitle: "Favorites" }}
      />
      <Stack.Screen
        name="RestaurantDetails"
        component={RestaurantDetailsScreen}
        options={{ headerTitle: "Details", headerTransparent: true }}
      />
    </Stack.Navigator>
  );
}
