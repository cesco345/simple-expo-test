// app/(tabs)/port-scanner/components/ScanControls.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ScanControlsProps {
  isScanning: boolean;
  hasNetworkInfo: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
}

export default function ScanControls({
  isScanning,
  hasNetworkInfo,
  onStartScan,
  onStopScan,
}: ScanControlsProps) {
  if (isScanning) {
    return (
      <TouchableOpacity
        style={[styles.scanButton, styles.stopButton]}
        onPress={onStopScan}
      >
        <Text style={styles.scanButtonText}>Stop Scanning</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.scanButton}
      onPress={onStartScan}
      disabled={!hasNetworkInfo}
    >
      <Text style={styles.scanButtonText}>Start Enhanced Port Scan</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: "#F44336",
  },
  scanButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
