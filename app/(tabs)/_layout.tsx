// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2196F3",
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
            backgroundColor: "white",
          },
          default: {
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
            backgroundColor: "white",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="port-scanner"
        options={{
          title: "Port Scanner",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="airplay-scanner"
        options={{
          title: "AirPlay",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wifi" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bluetooth-scanner"
        options={{
          title: "Bluetooth",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bluetooth" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chromecast-scanner"
        options={{
          title: "Chromecast",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="tv" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
