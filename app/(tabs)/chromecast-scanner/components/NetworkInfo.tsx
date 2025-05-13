// app/(tabs)/chromecast-scanner/components/NetworkInfo.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NetworkInfo } from "../../../modules/chromecast-scanner/types";

interface NetworkInfoProps {
  networkInfo: NetworkInfo | null;
  refreshNetworkInfo: () => Promise<NetworkInfo | null>;
}

const NetworkInfoComponent: React.FC<NetworkInfoProps> = ({
  networkInfo,
  refreshNetworkInfo,
}) => {
  useEffect(() => {
    // Refresh network info when component mounts
    refreshNetworkInfo();
  }, []);

  // Display network type icon based on connection type
  const getNetworkIcon = () => {
    if (!networkInfo || !networkInfo.isConnected) {
      return "wifi-off";
    }

    const type = networkInfo.type?.toLowerCase() || "";
    if (type.includes("wifi")) {
      return "wifi";
    } else if (type.includes("cellular")) {
      return "signal";
    } else if (type.includes("ethernet")) {
      return "ethernet";
    } else {
      return "question";
    }
  };

  // Show network details (removed navigation which was causing errors)
  const showNetworkDetails = () => {
    console.log("[INFO] Network details requested");
    // Display network info in console for debugging
    if (networkInfo) {
      //console.log("[INFO] Network Info:", JSON.stringify(networkInfo, null, 2));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Network Information</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshNetworkInfo}
        >
          <FontAwesome name="refresh" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {networkInfo ? (
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <FontAwesome
              name={getNetworkIcon()}
              size={16}
              color="#007AFF"
              style={styles.icon}
            />
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{networkInfo.type || "Unknown"}</Text>
          </View>

          <View style={styles.row}>
            <FontAwesome
              name="laptop"
              size={16}
              color="#007AFF"
              style={styles.icon}
            />
            <Text style={styles.label}>IP Address:</Text>
            <Text style={styles.value}>{networkInfo.ip}</Text>
          </View>

          <View style={styles.row}>
            <FontAwesome
              name="sitemap"
              size={16}
              color="#007AFF"
              style={styles.icon}
            />
            <Text style={styles.label}>Subnet:</Text>
            <Text style={styles.value}>
              {networkInfo.subnet || "255.255.255.0"}
            </Text>
          </View>

          {/* <TouchableOpacity
            style={styles.detailsButton}
            onPress={showNetworkDetails}
          >
            <Text style={styles.detailsButtonText}>More Details</Text>
          </TouchableOpacity> */}
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading network information...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  refreshButton: {
    padding: 5,
  },
  infoContainer: {
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    width: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    width: 100,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
  },
  detailsButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  detailsButtonText: {
    fontSize: 14,
    color: "#007AFF",
  },
});

export default NetworkInfoComponent;
