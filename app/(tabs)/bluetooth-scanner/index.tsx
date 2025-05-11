import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBluetoothScanner } from "../../modules/bluetooth-scanner/hooks/useBluetoothScanner";
import { useDebugLogs } from "../../modules/bluetooth-scanner/hooks/useDebugLogs";
import { useNetworkInfo } from "../../modules/bluetooth-scanner/hooks/useNetworkInfo";
import DebugLogs from "./components/DebugLogs";
import NetworkInfo from "./components/NetworkInfo";
import ResultsList from "./components/ResultsList";
import ScanControls from "./components/ScanControls";
import ScanProgress from "./components/ScanProgress";

export default function BluetoothScannerScreen() {
  const { logs, addLog, clearLogs } = useDebugLogs();
  const { networkInfo, refreshNetworkInfo } = useNetworkInfo();
  const {
    scanResults,
    isScanning,
    progress,
    currentScan,
    startScan,
    stopScan,
    bluetoothState,
    isInitialized,
  } = useBluetoothScanner(networkInfo, addLog);

  const [showLogs, setShowLogs] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  // Force network info refresh on load
  useEffect(() => {
    refreshNetworkInfo();
  }, []);

  // Check Bluetooth state when initialized
  useEffect(() => {
    if (isInitialized && bluetoothState !== "on") {
      addLog(
        `[INFO] Bluetooth is ${bluetoothState}. It must be enabled for scanning.`
      );

      if (bluetoothState === "off") {
        Alert.alert(
          "Bluetooth is Off",
          "Please enable Bluetooth in your device settings to scan for vulnerabilities.",
          [{ text: "OK" }]
        );
      }
    }
  }, [isInitialized, bluetoothState]);

  // Handle scan start/stop
  const handleScan = () => {
    if (isScanning) {
      stopScan();
    } else {
      if (bluetoothState !== "on") {
        Alert.alert(
          "Bluetooth Required",
          "Please enable Bluetooth to start scanning.",
          [{ text: "OK" }]
        );
        return;
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
      <Text style={styles.title}>Bluetooth Vulnerability Scanner</Text>
      <Text style={styles.description}>
        This tool scans for nearby Bluetooth devices and identifies potential
        security vulnerabilities.
      </Text>

      {/* Network Information */}
      <NetworkInfo networkInfo={networkInfo} />

      {/* Bluetooth Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Bluetooth Status:</Text>
        <Text
          style={[
            styles.statusValue,
            bluetoothState === "on" ? styles.statusOn : styles.statusOff,
          ]}
        >
          {bluetoothState === "on"
            ? "Enabled"
            : bluetoothState === "off"
            ? "Disabled"
            : "Unknown"}
        </Text>
      </View>

      {/* Scan Controls */}
      <ScanControls
        isScanning={isScanning}
        onScan={handleScan}
        disabled={bluetoothState !== "on"}
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
        <View style={styles.logsContainer}>
          <Text style={styles.sectionTitle}>Scan Logs</Text>
          <DebugLogs logs={logs} onClearLogs={clearLogs} />
        </View>
      )}

      {/* Vulnerability Info */}
      {showInfo && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            About Bluetooth Vulnerabilities
          </Text>
          <Text style={styles.infoText}>
            Bluetooth vulnerabilities like BlueBorne, BlueSnarfing, and
            BlueJacking can expose your device to unauthorized access, data
            theft, and malware. Always keep your device updated, use strong
            PINs, and disable Bluetooth when not in use.
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
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statusOn: {
    color: "#4CAF50",
  },
  statusOff: {
    color: "#F44336",
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
});
