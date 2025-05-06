// app/(tabs)/airplay-scanner.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AirPlayScannerScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AirPlay Device Scanner</Text>
          <Text style={styles.headerSubtitle}>
            Coming in Phase 2 of Development
          </Text>
        </View>

        <View style={styles.placeholderContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="wifi-outline" size={80} color="#4CAF50" />
          </View>
          <Text style={styles.placeholderTitle}>AirPlay Scanner Feature</Text>
          <Text style={styles.placeholderText}>
            This feature is currently under development and will be available in
            Phase 2. The AirPlay scanner will allow you to discover and analyze
            Apple AirPlay devices on your network for potential security
            vulnerabilities.
          </Text>

          <View style={styles.featureList}>
            <Text style={styles.featureTitle}>Planned Features:</Text>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>
                Scan for AirPlay-compatible devices
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>
                Identify device manufacturers and models
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>
                Check for known security vulnerabilities
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>
                Provide security recommendations
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/")}
        >
          <Ionicons name="arrow-back" size={18} color="#ffffff" />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
  },
  placeholderContainer: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  featureList: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  backButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  backButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
