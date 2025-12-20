import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Switch,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";

const PROFILE_KEY = "savorist_profile";

export default function ProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState("Guest");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await AsyncStorage.getItem(PROFILE_KEY);
        if (data) {
          const profile = JSON.parse(data);
          setDisplayName(profile.displayName || "Guest");
          setNotificationsEnabled(profile.notificationsEnabled ?? true);
        }
      } catch {
        console.error("Failed to load profile");
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({ displayName, notificationsEnabled })
      );
    } catch {
      console.error("Failed to save profile");
    }
  };

  const handleNameChange = (text: string) => {
    setDisplayName(text);
  };

  const handleNameBlur = () => {
    saveProfile();
  };

  const handleNotificationsToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    setTimeout(saveProfile, 100);
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={styles.container}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Feather name="user" size={48} color={Colors.light.buttonText} />
        </View>
        <Text style={styles.displayName}>{displayName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Settings</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={handleNameChange}
            onBlur={handleNameBlur}
            placeholder="Enter your name"
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Feather name="bell" size={20} color={Colors.light.burgundy} />
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: Colors.light.border, true: Colors.light.burgundy }}
            thumbColor={Colors.light.backgroundRoot}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
          <Feather name="info" size={20} color={Colors.light.textSecondary} />
          <Text style={styles.menuItemText}>App Version</Text>
          <Text style={styles.menuItemValue}>1.0.0</Text>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
          <Feather name="file-text" size={20} color={Colors.light.textSecondary} />
          <Text style={styles.menuItemText}>Terms of Service</Text>
          <Feather name="chevron-right" size={20} color={Colors.light.textSecondary} />
        </Pressable>

        <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
          <Feather name="shield" size={20} color={Colors.light.textSecondary} />
          <Text style={styles.menuItemText}>Privacy Policy</Text>
          <Feather name="chevron-right" size={20} color={Colors.light.textSecondary} />
        </Pressable>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundDefault,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.burgundy,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  displayName: {
    ...Typography.h1,
    color: Colors.light.text,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  settingItem: {
    marginBottom: Spacing.md,
  },
  settingLabel: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.light.text,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuItemText: {
    ...Typography.body,
    color: Colors.light.text,
    flex: 1,
  },
  menuItemValue: {
    ...Typography.small,
    color: Colors.light.textSecondary,
  },
});
