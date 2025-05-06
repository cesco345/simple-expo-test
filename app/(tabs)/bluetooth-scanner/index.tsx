// app/(tabs)/bluetooth-scanner.tsx
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

export default function BluetoothScannerScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bluetooth Scanner</Text>
          <Text style={styles.headerSubtitle}>
            Coming in Phase 2 of Development
          </Text>
        </View>

        <View style={styles.placeholderContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="bluetooth" size={80} color="#3F51B5" />
          </View>
          <Text style={styles.placeholderTitle}>Bluetooth Scanner Feature</Text>
          <Text style={styles.placeholderText}>
            This feature is currently under development and will be available in
            Phase 2. The Bluetooth scanner will allow you to discover nearby
            Bluetooth devices and analyze them for potential security
            vulnerabilities.
          </Text>

          <View style={styles.featureList}>
            <Text style={styles.featureTitle}>Planned Features:</Text>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#3F51B5" />
              <Text style={styles.featureText}>
                Scan for Bluetooth devices in range
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#3F51B5" />
              <Text style={styles.featureText}>
                Identify device types and capabilities
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#3F51B5" />
              <Text style={styles.featureText}>
                Check for outdated protocols and security issues
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#3F51B5" />
              <Text style={styles.featureText}>
                Track signal strength and proximity
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle"
              size={24}
              color="#3F51B5"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              Bluetooth scanning requires appropriate permissions on your
              device. When this feature is available, you'll be prompted to
              grant location and Bluetooth permissions for full functionality.
            </Text>
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
    backgroundColor: "#3F51B5",
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
    backgroundColor: "rgba(63, 81, 181, 0.1)",
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
    marginBottom: 20,
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
  infoBox: {
    backgroundColor: "rgba(63, 81, 181, 0.05)",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#3F51B5",
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: "#3F51B5",
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
