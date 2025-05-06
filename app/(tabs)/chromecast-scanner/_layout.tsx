// app/(tabs)/chromecast-scanner/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function ChromecastScannerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Chromecast Scanner",
          headerStyle: {
            backgroundColor: "#FF5722",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
