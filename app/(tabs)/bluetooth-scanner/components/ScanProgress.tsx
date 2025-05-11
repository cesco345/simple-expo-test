import React from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CurrentScan } from "../../../modules/bluetooth-scanner/types";

interface ScanProgressProps {
  progress: number;
  currentScan: CurrentScan;
}

export default function ScanProgress({
  progress,
  currentScan,
}: ScanProgressProps) {
  // Helper to get a readable stage name
  const getStageName = (stage: string | undefined): string => {
    switch (stage) {
      case "discovery":
        return "Discovering Devices";
      case "analysis":
        return "Analyzing Device";
      case "vulnerability-check":
        return "Checking for Vulnerabilities";
      default:
        return "Scanning";
    }
  };

  return (
    <View style={styles.progressContainer}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.progressText}>
        {Math.round(progress * 100)}% Complete
      </Text>
      {currentScan && (
        <View>
          <Text style={styles.stageText}>
            {getStageName(currentScan.stage)}
          </Text>
          {currentScan.deviceName && (
            <Text style={styles.deviceText}>
              Device: {currentScan.deviceName || "Unknown"}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  stageText: {
    marginTop: 5,
    fontSize: 14,
    color: "#444",
    textAlign: "center",
  },
  deviceText: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
