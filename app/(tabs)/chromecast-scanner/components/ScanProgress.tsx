// app/(tabs)/chromecast-scanner/components/ScanProgress.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { CurrentScan } from "../../../modules/chromecast-scanner/types";

interface ScanProgressProps {
  isScanning: boolean;
  progress: number;
  currentScan: CurrentScan | null;
}

const ScanProgress: React.FC<ScanProgressProps> = ({
  isScanning,
  progress,
  currentScan,
}) => {
  if (!isScanning && progress === 0) {
    return null;
  }

  // Calculate percentage for display
  const progressPercentage = Math.round(progress * 100);

  // Get icon and message based on current scan stage
  const getScanStageInfo = () => {
    if (!currentScan) {
      return {
        icon: "search",
        message: "Preparing scan...",
      };
    }

    switch (currentScan.stage) {
      case "discovery":
        return {
          icon: "search",
          message: "Discovering Chromecast devices...",
        };
      case "analysis":
        return {
          icon: "file-text-o",
          message: `Analyzing device: ${currentScan.deviceName || "Unknown"} (${
            currentScan.ipAddress || "..."
          })`,
        };
      case "vulnerability-check":
        return {
          icon: "lock",
          message: `Checking for vulnerabilities: ${
            currentScan.deviceName || "Unknown"
          }`,
        };
      default:
        return {
          icon: "info-circle",
          message: "Scanning...",
        };
    }
  };

  const { icon, message } = getScanStageInfo();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Progress</Text>
        {!isScanning && progress === 1 ? (
          <FontAwesome name="check-circle" size={18} color="#4CAF50" />
        ) : (
          <ActivityIndicator size="small" color="#2196F3" />
        )}
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progressPercentage}%` },
            !isScanning && progress === 1 && styles.progressComplete,
          ]}
        />
      </View>

      <View style={styles.progressDetails}>
        <View style={styles.stageContainer}>
          <FontAwesome
            name={icon}
            size={16}
            color="#2196F3"
            style={styles.icon}
          />
          <Text style={styles.stageText}>{message}</Text>
        </View>
        <Text style={styles.percentage}>{progressPercentage}%</Text>
      </View>

      {!isScanning && progress === 1 && (
        <Text style={styles.completedText}>Scan completed</Text>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 4,
  },
  progressComplete: {
    backgroundColor: "#4CAF50",
  },
  progressDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stageContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 8,
    width: 20,
    textAlign: "center",
  },
  stageText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  percentage: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  completedText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
  },
});

export default ScanProgress;
