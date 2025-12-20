import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import type { Review } from "@shared/schema";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Feather name="user" size={16} color={Colors.light.buttonText} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{review.reviewerName}</Text>
          <Text style={styles.date}>{review.date}</Text>
        </View>
        <View style={styles.rating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Feather
              key={star}
              name="star"
              size={12}
              color={star <= review.rating ? Colors.light.starGold : Colors.light.border}
              style={styles.star}
            />
          ))}
        </View>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.backgroundDefault,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.burgundy,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  name: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.light.text,
  },
  date: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  rating: {
    flexDirection: "row",
  },
  star: {
    marginLeft: 2,
  },
  comment: {
    ...Typography.body,
    color: Colors.light.text,
  },
});
