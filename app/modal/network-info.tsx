// app/(tabs)/network-info.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Network from "expo-network";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NetworkInfoScreen() {
  const router = useRouter();
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNetworkInfo();
  }, []);

  const fetchNetworkInfo = async () => {
    try {
      setLoading(true);
      const ipAddress = await Network.getIpAddressAsync();
      const networkType = await Network.getNetworkStateAsync();

      // Add a slight delay to ensure UI update after fetching data
      setTimeout(() => {
        setNetworkInfo({
          ip: ipAddress,
          networkType,
          subnet: extractSubnet(ipAddress),
          gateway: extractGateway(ipAddress),
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching network info:", error);
      setLoading(false);
    }
  };

  // Extract subnet from IP (simple implementation)
  const extractSubnet = (ip: string): string => {
    const parts = ip.split(".");
    if (parts.length !== 4) return "Unknown";
    return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
  };

  // Extract probable gateway from IP (simple implementation)
  const extractGateway = (ip: string): string => {
    const parts = ip.split(".");
    if (parts.length !== 4) return "Unknown";
    return `${parts[0]}.${parts[1]}.${parts[2]}.1`;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Network Information</Text>
          <Text style={styles.headerSubtitle}>
            View details about your current network
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9C27B0" />
            <Text style={styles.loadingText}>
              Fetching network information...
            </Text>
          </View>
        ) : (
          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="wifi" size={24} color="#9C27B0" />
                <Text style={styles.cardTitle}>Connection Details</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>IP Address:</Text>
                <Text style={styles.infoValue}>
                  {networkInfo?.ip || "Unknown"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Subnet:</Text>
                <Text style={styles.infoValue}>
                  {networkInfo?.subnet || "Unknown"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gateway:</Text>
                <Text style={styles.infoValue}>
                  {networkInfo?.gateway || "Unknown"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Connected:</Text>
                <Text style={styles.infoValue}>
                  {networkInfo?.networkType?.isConnected ? "Yes" : "No"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Connection Type:</Text>
                <Text style={styles.infoValue}>
                  {networkInfo?.networkType?.type ===
                  Network.NetworkStateType.WIFI
                    ? "WiFi"
                    : networkInfo?.networkType?.type ===
                      Network.NetworkStateType.CELLULAR
                    ? "Cellular"
                    : "Unknown"}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="information-circle" size={24} color="#9C27B0" />
                <Text style={styles.cardTitle}>Advanced Information</Text>
              </View>

              <Text style={styles.advancedInfoText}>
                More detailed network information will be available in Phase 2,
                including:
              </Text>

              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#9C27B0" />
                  <Text style={styles.featureText}>DNS server details</Text>
                </View>

                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#9C27B0" />
                  <Text style={styles.featureText}>
                    Network speed test functionality
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#9C27B0" />
                  <Text style={styles.featureText}>
                    Network traffic monitoring
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.securityTipsCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="shield-checkmark" size={24} color="#9C27B0" />
                <Text style={styles.cardTitle}>Network Security Tips</Text>
              </View>

              <View style={styles.securityTip}>
                <Text style={styles.tipNumber}>1</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>
                    Change Default Credentials
                  </Text>
                  <Text style={styles.tipText}>
                    Always change default usernames and passwords on your router
                    and network devices.
                  </Text>
                </View>
              </View>

              <View style={styles.securityTip}>
                <Text style={styles.tipNumber}>2</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Enable Strong Encryption</Text>
                  <Text style={styles.tipText}>
                    Use WPA3 or WPA2 encryption for your WiFi networks. Avoid
                    WEP and open networks.
                  </Text>
                </View>
              </View>

              <View style={styles.securityTip}>
                <Text style={styles.tipNumber}>3</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Keep Firmware Updated</Text>
                  <Text style={styles.tipText}>
                    Regularly update your router's firmware to patch security
                    vulnerabilities.
                  </Text>
                </View>
              </View>

              <View style={styles.securityTip}>
                <Text style={styles.tipNumber}>4</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Use a Guest Network</Text>
                  <Text style={styles.tipText}>
                    Create a separate guest network for visitors and IoT devices
                    to isolate them from your main network.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchNetworkInfo}
          disabled={loading}
        >
          <Ionicons name="refresh" size={18} color="#ffffff" />
          <Text style={styles.refreshButtonText}>Refresh Network Info</Text>
        </TouchableOpacity>

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
    backgroundColor: "#9C27B0",
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
  loadingContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  infoContainer: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  advancedInfoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  featureList: {
    marginTop: 10,
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
  securityTipsCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  securityTip: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#9C27B0",
    color: "white",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#333",
  },
  tipText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  refreshButton: {
    backgroundColor: "#9C27B0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  refreshButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  backButton: {
    backgroundColor: "#673AB7",
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
