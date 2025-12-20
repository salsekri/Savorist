import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "savorist_favorites";

export async function getFavorites(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addFavorite(restaurantId: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(restaurantId)) {
      favorites.push(restaurantId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch {
    console.error("Failed to add favorite");
  }
}

export async function removeFavorite(restaurantId: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    const updated = favorites.filter((id) => id !== restaurantId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch {
    console.error("Failed to remove favorite");
  }
}

export async function isFavorite(restaurantId: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    return favorites.includes(restaurantId);
  } catch {
    return false;
  }
}

export async function toggleFavorite(restaurantId: string): Promise<boolean> {
  const isCurrentlyFavorite = await isFavorite(restaurantId);
  if (isCurrentlyFavorite) {
    await removeFavorite(restaurantId);
    return false;
  } else {
    await addFavorite(restaurantId);
    return true;
  }
}
