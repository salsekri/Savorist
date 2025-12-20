import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import FilterModal from "@/screens/FilterModal";
import BookingModal from "@/screens/BookingModal";
import SplashScreen from "@/screens/SplashScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type FilterParams = {
  cuisineType?: string;
  minRating?: number;
  priceRange?: string;
};

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  FilterModal: { onApply?: (filters: FilterParams) => void } | undefined;
  BookingModal: { restaurantName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FilterModal"
        component={FilterModal}
        options={{
          presentation: "modal",
          headerTitle: "Filter",
        }}
      />
      <Stack.Screen
        name="BookingModal"
        component={BookingModal}
        options={{
          presentation: "modal",
          headerTitle: "Book a Table",
        }}
      />
    </Stack.Navigator>
  );
}
