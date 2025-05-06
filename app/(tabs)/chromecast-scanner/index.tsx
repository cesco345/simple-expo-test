// app/(tabs)/chromecast-scanner.tsx
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

export default function ChromecastScannerScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chromecast Scanner</Text>
          <Text style={styles.headerSubtitle}>
            Coming in Phase 2 of Development
          </Text>
        </View>

        <View style={styles.placeholderContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="tv" size={80} color="#FF5722" />
          </View>
          <Text style={styles.placeholderTitle}>Chromecast Device Scanner</Text>
          <Text style={styles.placeholderText}>
            This feature is currently under development and will be available in
            Phase 2. The Chromecast scanner will allow you to discover Google
            Chromecast and Cast-enabled devices on your network and analyze them
            for potential security vulnerabilities.
          </Text>

          <View style={styles.featureList}>
            <Text style={styles.featureTitle}>Planned Features:</Text>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF5722" />
              <Text style={styles.featureText}>
                Scan for Google Cast-enabled devices
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF5722" />
              <Text style={styles.featureText}>
                Identify device generations and firmware versions
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF5722" />
              <Text style={styles.featureText}>
                Detect misconfigured or open devices
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF5722" />
              <Text style={styles.featureText}>
                Security recommendations for Cast devices
              </Text>
            </View>
          </View>

          <View style={styles.timelineContainer}>
            <Text style={styles.timelineTitle}>Development Timeline</Text>

            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelinePhase}>Phase 1 (Current)</Text>
                <Text style={styles.timelineText}>
                  Core network scanning tools
                </Text>
              </View>
            </View>

            <View style={styles.timelineConnector} />

            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelinePhase}>Phase 2</Text>
                <Text style={styles.timelineText}>
                  Device-specific scanners including Chromecast
                </Text>
              </View>
            </View>

            <View style={styles.timelineConnector} />

            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelinePhase}>Phase 3</Text>
                <Text style={styles.timelineText}>
                  Advanced device analysis and recommendations
                </Text>
              </View>
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
    backgroundColor: "#FF5722",
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
    backgroundColor: "rgba(255, 87, 34, 0.1)",
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
  timelineContainer: {
    width: "100%",
    backgroundColor: "#fff8f6",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#FF5722",
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF5722",
    marginTop: 4,
    marginRight: 10,
  },
  timelineContent: {
    flex: 1,
  },
  timelinePhase: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timelineText: {
    fontSize: 14,
    color: "#555",
  },
  timelineConnector: {
    width: 2,
    height: 20,
    backgroundColor: "#FF5722",
    marginLeft: 6,
    marginVertical: 5,
  },
  backButton: {
    backgroundColor: "#FF5722",
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
