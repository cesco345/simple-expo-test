// app/(tabs)/bluetooth-scanner/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function BluetoothScannerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Bluetooth Scanner",
          headerStyle: {
            backgroundColor: "#3F51B5",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
