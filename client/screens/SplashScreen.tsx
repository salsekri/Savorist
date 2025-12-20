import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Typography } from "@/constants/theme";

export default function SplashScreen() {
  return (
    <LinearGradient
      colors={[Colors.light.burgundy, Colors.light.wine]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>SAVORIST</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    ...Typography.displayLarge,
    color: Colors.light.cream,
    letterSpacing: 4,
  },
});
