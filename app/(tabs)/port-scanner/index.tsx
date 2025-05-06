// app/(tabs)/port-scanner/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import hooks from modules directory - fixed paths from root
import { useDebugLogs } from "../../modules/port-scanner/hooks/useDebugLogs";
import { useNetworkInfo } from "../../modules/port-scanner/hooks/useNetworkInfo";
import { usePortScanner } from "../../modules/port-scanner/hooks/usePortScanner";

// Import components from local components directory
import DebugLogs from "./components/DebugLogs";
import NetworkInfo from "./components/NetworkInfo";
import ResultsList from "./components/ResultsList";
import ScanControls from "./components/ScanControls";
import ScanProgress from "./components/ScanProgress";

export default function PortScannerScreen() {
  const router = useRouter();
  const [showDebugLogs, setShowDebugLogs] = useState(false);

  // Custom hooks
  const { networkInfo } = useNetworkInfo();
  const { logs, clearLogs } = useDebugLogs();
  const {
    scanResults,
    isScanning,
    progress,
    currentScan,
    startScan,
    stopScan,
  } = usePortScanner(networkInfo);

  const toggleDebugLogs = () => {
    setShowDebugLogs(!showDebugLogs);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Enhanced Network Port Scanner</Text>
          <Text style={styles.headerSubtitle}>
            Scan your network using TCP sockets and HTTP for better accuracy
          </Text>
        </View>

        <NetworkInfo networkInfo={networkInfo} />

        <ScanControls
          isScanning={isScanning}
          hasNetworkInfo={!!networkInfo?.ip}
          onStartScan={startScan}
          onStopScan={stopScan}
        />

        {isScanning && (
          <ScanProgress progress={progress} currentScan={currentScan} />
        )}

        <View style={styles.resultsHeader}>
          <TouchableOpacity onPress={toggleDebugLogs} style={styles.logToggle}>
            <Text style={styles.logToggleText}>
              {showDebugLogs ? "Hide Logs" : "Show Logs"}
            </Text>
          </TouchableOpacity>
        </View>

        {showDebugLogs ? (
          <DebugLogs logs={logs} onClearLogs={clearLogs} />
        ) : (
          <ResultsList scanResults={scanResults} isScanning={isScanning} />
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.navigate("/")}
        >
          <Ionicons name="arrow-back" size={18} color="#fff" />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2196F3",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },
  logToggle: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  logToggleText: {
    fontSize: 12,
    color: "#555",
  },
  backButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: Platform.OS === "android" ? 60 : 20,
    alignSelf: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
