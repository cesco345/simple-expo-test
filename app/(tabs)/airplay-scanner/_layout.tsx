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
            backgroundColor: "#2196F3",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
