import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type RouteProps = RouteProp<RootStackParamList, "BookingModal">;

const TIMES = ["11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
const GUESTS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function BookingModal() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { restaurantName } = route.params;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<number>(2);

  const handleConfirm = () => {
    if (!selectedTime) {
      Alert.alert("Please select a time", "Choose a time slot to continue with your booking.");
      return;
    }
    Alert.alert(
      "Booking Confirmed",
      `Your table for ${selectedGuests} at ${restaurantName} on ${selectedDate.toLocaleDateString()} at ${selectedTime} has been reserved.`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl + 80,
          paddingHorizontal: Spacing.lg,
        }}
      >
        <Text style={styles.restaurantName}>{restaurantName}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.datesContainer}>
              {dates.map((date) => {
                const isSelected = date.toDateString() === selectedDate.toDateString();
                return (
                  <Pressable
                    key={date.toISOString()}
                    style={[styles.dateButton, isSelected && styles.dateButtonSelected]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text style={[styles.dateDay, isSelected && styles.dateTextSelected]}>
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </Text>
                    <Text style={[styles.dateNumber, isSelected && styles.dateTextSelected]}>
                      {date.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timesContainer}>
            {TIMES.map((time) => {
              const isSelected = time === selectedTime;
              return (
                <Pressable
                  key={time}
                  style={[styles.timeButton, isSelected && styles.timeButtonSelected]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
                    {time}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of Guests</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.guestsContainer}>
              {GUESTS.map((num) => {
                const isSelected = num === selectedGuests;
                return (
                  <Pressable
                    key={num}
                    style={[styles.guestButton, isSelected && styles.guestButtonSelected]}
                    onPress={() => setSelectedGuests(num)}
                  >
                    <Feather
                      name="user"
                      size={16}
                      color={isSelected ? Colors.light.buttonText : Colors.light.textSecondary}
                    />
                    <Text style={[styles.guestText, isSelected && styles.guestTextSelected]}>
                      {num}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Feather name="calendar" size={18} color={Colors.light.textSecondary} />
            <Text style={styles.summaryText}>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Feather name="clock" size={18} color={Colors.light.textSecondary} />
            <Text style={styles.summaryText}>{selectedTime || "Select a time"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Feather name="users" size={18} color={Colors.light.textSecondary} />
            <Text style={styles.summaryText}>{selectedGuests} guests</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <Pressable
          style={({ pressed }) => [styles.confirmButton, pressed && styles.confirmButtonPressed]}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundDefault,
  },
  restaurantName: {
    ...Typography.h1,
    color: Colors.light.burgundy,
    marginBottom: Spacing.xl,
    textAlign: "center",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  datesContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  dateButton: {
    width: 60,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.backgroundRoot,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  dateButtonSelected: {
    backgroundColor: Colors.light.burgundy,
    borderColor: Colors.light.burgundy,
  },
  dateDay: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  dateNumber: {
    ...Typography.h2,
    color: Colors.light.text,
  },
  dateTextSelected: {
    color: Colors.light.buttonText,
  },
  timesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  timeButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.backgroundRoot,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  timeButtonSelected: {
    backgroundColor: Colors.light.burgundy,
    borderColor: Colors.light.burgundy,
  },
  timeText: {
    ...Typography.small,
    color: Colors.light.text,
  },
  timeTextSelected: {
    color: Colors.light.buttonText,
  },
  guestsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  guestButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.backgroundRoot,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: Spacing.xs,
  },
  guestButtonSelected: {
    backgroundColor: Colors.light.burgundy,
    borderColor: Colors.light.burgundy,
  },
  guestText: {
    ...Typography.small,
    color: Colors.light.text,
  },
  guestTextSelected: {
    color: Colors.light.buttonText,
  },
  summaryCard: {
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
  },
  summaryTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  summaryText: {
    ...Typography.body,
    color: Colors.light.text,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.backgroundRoot,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  confirmButton: {
    backgroundColor: Colors.light.burgundy,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  confirmButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  confirmButtonText: {
    ...Typography.body,
    color: Colors.light.buttonText,
    fontWeight: "600",
  },
});
