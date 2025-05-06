// app/(tabs)/port-scanner/components/ScanProgress.tsx
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
// Fixed import path
import { CurrentScan } from "../../../modules/port-scanner/types";

interface ScanProgressProps {
  progress: number;
  currentScan: CurrentScan;
}

export default function ScanProgress({
  progress,
  currentScan,
}: ScanProgressProps) {
  return (
    <View style={styles.progressContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.progressText}>
        {Math.round(progress * 100)}% Complete
      </Text>
      {currentScan && (
        <Text style={styles.scanningText}>
          Scanning {currentScan.ip}:{currentScan.port}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },
  scanningText: {
    marginTop: 5,
    fontSize: 12,
    color: "#777",
  },
});
