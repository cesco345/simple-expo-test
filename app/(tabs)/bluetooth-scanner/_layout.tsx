import { Stack } from "expo-router";
import React from "react";

export default function BluetoothScannerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Bluetooth Scanner",
          headerShown: false, // Hide the header on the main scanner page
        }}
      />
    </Stack>
  );
}
