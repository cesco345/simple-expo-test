// app/(tabs)/airplay-scanner/index.tsx
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAirPlayScanner } from "../../modules/airplay-scanner/hooks/useAirPlayScanner";
import { useDebugLogs } from "../../modules/airplay-scanner/hooks/useDebugLogs";
import { useNetworkInfo } from "../../modules/airplay-scanner/hooks/useNetworkInfo";
import DebugLogs from "./components/DebugLogs";
import NetworkInfo from "./components/NetworkInfo";
import ScanControls from "./components/ScanControls";
import ScanProgress from "./components/ScanProgress";

// Import these to modify ResultsList.tsx component
import { AirPlayDevice } from "../../modules/airplay-scanner/types";

// Custom ResultsList component that doesn't use FlatList
const ResultsList = ({ results = [] }: { results: AirPlayDevice[] }) => {
  // Safely check if we have results
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <View>
      {results.map((item) => (
        <View key={item.id} style={styles.resultItem}>
          <View style={styles.resultHeader}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <Text style={styles.deviceAddress}>
              {item.ip}:{item.port}
            </Text>
          </View>

          <View style={styles.deviceDetails}>
            {item.manufacturer && (
              <Text style={styles.detailText}>
                Manufacturer: {item.manufacturer}
              </Text>
            )}

            {item.model && (
              <Text style={styles.detailText}>Model: {item.model}</Text>
            )}

            {item.deviceType && (
              <Text style={styles.detailText}>Type: {item.deviceType}</Text>
            )}

            {item.isVulnerable && (
              <View style={styles.vulnerabilityContainer}>
                <Text style={styles.vulnerabilityTitle}>
                  Vulnerability detected!
                </Text>

                {item.vulnerabilityDetails &&
                  item.vulnerabilityDetails.length > 0 && (
                    <View style={styles.vulnerabilityDetails}>
                      {item.vulnerabilityDetails.map((detail, index) => (
                        <Text key={index} style={styles.vulnerabilityText}>
                          • {detail}
                        </Text>
                      ))}
                    </View>
                  )}
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

export default function AirPlayScannerScreen() {
  const { logs, addLog, clearLogs } = useDebugLogs();
  const { networkInfo, refreshNetworkInfo } = useNetworkInfo();
  const {
    scanResults,
    isScanning,
    progress,
    currentScan,
    startScan,
    stopScan,
  } = useAirPlayScanner(networkInfo, addLog);

  const [showLogs, setShowLogs] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  // Force start network info
  useEffect(() => {
    console.log("Forcing network info refresh");
    refreshNetworkInfo();

    // Add a second refresh after a delay to ensure it's loaded
    const timer = setTimeout(() => {
      console.log("Second network info refresh");
      refreshNetworkInfo();
    }, 1000);

    return () => clearTimeout(timer);
  }, [refreshNetworkInfo]);

  // Log the network info when it changes
  useEffect(() => {
    console.log("Current network info:", networkInfo);
  }, [networkInfo]);

  // Handle scan start/stop
  const handleScan = () => {
    if (isScanning) {
      stopScan();
    } else {
      // Force network info if it's not available
      if (!networkInfo?.ip) {
        refreshNetworkInfo();
      }

      clearLogs();
      startScan();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>AirPlay Vulnerability Scanner</Text>
      <Text style={styles.description}>
        This tool scans your network for AirPlay devices that might be
        vulnerable.
      </Text>

      {/* Network Information */}
      <NetworkInfo networkInfo={networkInfo} />

      {/* Always show scan button as enabled regardless of network status */}
      <ScanControls
        isScanning={isScanning}
        onScan={handleScan}
        disabled={false} // Force to false to ensure button is always clickable
      />

      {/* Scan Progress */}
      {isScanning && (
        <ScanProgress progress={progress} currentScan={currentScan} />
      )}

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, showLogs ? styles.toggleActive : {}]}
          onPress={() => setShowLogs(!showLogs)}
        >
          <Text
            style={[styles.toggleText, showLogs ? styles.toggleTextActive : {}]}
          >
            {showLogs ? "Hide Logs" : "Show Logs"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, showInfo ? styles.toggleActive : {}]}
          onPress={() => setShowInfo(!showInfo)}
        >
          <Text
            style={[styles.toggleText, showInfo ? styles.toggleTextActive : {}]}
          >
            {showInfo ? "Hide Info" : "Show Info"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results List */}
      {scanResults && scanResults.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>
            Detected Devices ({scanResults.length})
          </Text>
          <ResultsList results={scanResults} />
        </View>
      )}

      {/* Debug Logs */}
      {showLogs && (
        <View
          style={[styles.logsContainer, { marginBottom: showInfo ? 10 : 0 }]}
        >
          <Text style={styles.sectionTitle}>Scan Logs</Text>
          <DebugLogs logs={logs} onClearLogs={clearLogs} />
        </View>
      )}

      {/* Vulnerability Info */}
      {showInfo && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About AirBorne Vulnerability</Text>
          <Text style={styles.infoText}>
            AirBorne is a collection of security vulnerabilities
            (CVE-2023-24122) affecting AirPlay devices. These flaws could
            potentially allow attackers to execute code, access information, or
            control devices.
          </Text>
        </View>
      )}

      {/* Extra padding at the bottom for better scrolling */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding at the bottom
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0066cc",
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    color: "#333",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  toggleActive: {
    backgroundColor: "#007bff",
  },
  toggleText: {
    color: "#333",
  },
  toggleTextActive: {
    color: "#fff",
  },
  logsContainer: {
    minHeight: 200, // Minimum height for logs
    marginBottom: 10,
  },
  resultsSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0066cc",
  },
  infoSection: {
    padding: 12,
    backgroundColor: "#e9f5ff",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0066cc",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  bottomPadding: {
    height: 100, // Extra padding at the bottom
  },
  // Styles from ResultsList component
  resultItem: {
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0066cc",
    flex: 1,
  },
  deviceAddress: {
    fontSize: 14,
    color: "#666",
  },
  deviceDetails: {
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  vulnerabilityContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#fff8e1",
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#ffa000",
  },
  vulnerabilityTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e65100",
    marginBottom: 4,
  },
  vulnerabilityDetails: {
    marginTop: 2,
  },
  vulnerabilityText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
});
