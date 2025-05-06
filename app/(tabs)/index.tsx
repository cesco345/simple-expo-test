// app/(tabs)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Define Scanner types
type ScannerOption = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
};

const SCANNER_OPTIONS: ScannerOption[] = [
  {
    id: "port-scanner",
    title: "Network Port Scanner",
    description: "Scan network for open ports and potential vulnerabilities",
    icon: "scan",
    color: "#2196F3",
    route: "port-scanner",
  },
  {
    id: "airplay",
    title: "AirPlay Device Scanner",
    description: "Discover AirPlay devices on your network",
    icon: "wifi",
    color: "#4CAF50",
    route: "airplay-scanner",
  },
  {
    id: "bluetooth",
    title: "Bluetooth Scanner",
    description: "Find Bluetooth devices in your vicinity",
    icon: "bluetooth",
    color: "#3F51B5",
    route: "bluetooth-scanner",
  },
  {
    id: "chromecast",
    title: "Chromecast Scanner",
    description: "Locate Google Chromecast devices on your network",
    icon: "tv",
    color: "#FF5722",
    route: "chromecast-scanner",
  },
  {
    id: "network-info",
    title: "Network Information",
    description: "View details about your current network connection",
    icon: "information-circle",
    color: "#9C27B0",
    route: "network-info",
  },
  {
    id: "explore",
    title: "Explore Network Security",
    description: "Learn about common vulnerabilities and security practices",
    icon: "compass",
    color: "#607D8B", // Blue-grey
    route: "explore",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const navigateToScanner = (route: string) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2196F3"
        translucent={false}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Network Scanner Hub</Text>
          <Text style={styles.headerSubtitle}>
            Select a scanning tool to begin
          </Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardContainer}>
            {SCANNER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.card}
                onPress={() => navigateToScanner(option.route)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: option.color },
                  ]}
                >
                  <Ionicons name={option.icon as any} size={32} color="white" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardDescription}>
                    {option.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#bbb" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>About Network Scanning</Text>
            <Text style={styles.infoText}>
              Network scanning tools help identify devices, services, and
              potential vulnerabilities on your network. Regular scanning is an
              important part of maintaining network security.
            </Text>
            <Text style={styles.infoText}>
              Select a scanner from the options above to begin examining your
              network. Each scanner is specialized for different types of
              devices and security concerns.
            </Text>
            <Text style={styles.infoNote}>
              Note: Use these tools responsibly and only on networks you own or
              have permission to scan.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2196F3", // Match header color for status bar area
    paddingTop: Platform.OS === "android" ? 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === "android" ? 16 : 10,
    paddingBottom: 16,
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === "android" ? 80 : 30, // Extra padding at bottom for tab bar
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#333",
  },
  cardDescription: {
    fontSize: 13,
    color: "#666",
  },
  infoSection: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 10,
  },
  infoNote: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#777",
    marginTop: 8,
  },
});
