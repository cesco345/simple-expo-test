// app/(tabs)/chromecast-scanner/_layout.tsx
import { FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";

export default function ChromecastScannerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Chromecast Scanner",
          headerLargeTitle: true,
          headerShadowVisible: false,
          // iOS-specific styles
          ...(Platform.OS === "ios"
            ? {
                headerStyle: {
                  backgroundColor: "#F7F7F7",
                },
              }
            : {}),
          headerRight: () => (
            <FontAwesome
              name="info-circle"
              size={22}
              color="#007AFF"
              style={styles.headerIcon}
            />
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    marginRight: 15,
  },
});
