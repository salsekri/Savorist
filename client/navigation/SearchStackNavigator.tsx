import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "@/screens/SearchScreen";
import RestaurantDetailsScreen from "@/screens/RestaurantDetailsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type SearchStackParamList = {
  Search: undefined;
  RestaurantDetails: { restaurantId: string };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStackNavigator() {
  const screenOptions = useScreenOptions({ transparent: false });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerTitle: "Search" }}
      />
      <Stack.Screen
        name="RestaurantDetails"
        component={RestaurantDetailsScreen}
        options={{ headerTitle: "Details", headerTransparent: true }}
      />
    </Stack.Navigator>
  );
}
