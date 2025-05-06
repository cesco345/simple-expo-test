// app/(tabs)/port-scanner/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function PortScannerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Port Scanner",
          headerStyle: {
            backgroundColor: "#2196F3",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
