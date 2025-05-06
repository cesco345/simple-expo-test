// app/(tabs)/airplay-scanner/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function AirPlayScannerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "AirPlay Scanner",
          headerStyle: {
            backgroundColor: "#4CAF50",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
