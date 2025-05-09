// app/(tabs)/airplay-scanner/components/ScanControls.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ScanControlsProps {
  isScanning: boolean;
  onScan: () => void;
  disabled?: boolean;
}

export default function ScanControls({
  isScanning,
  onScan,
  disabled = false,
}: ScanControlsProps) {
  // Force enable for development (remove this in production)
  const actuallyDisabled = false; // Overriding disabled to ensure it's always clickable for testing

  return (
    <TouchableOpacity
      style={[
        styles.scanButton,
        isScanning ? styles.stopButton : styles.startButton,
        actuallyDisabled && styles.disabledButton,
      ]}
      onPress={onScan}
      disabled={actuallyDisabled}
    >
      <Text style={styles.scanButtonText}>
        {isScanning ? "Stop Scanning" : "Start Network Scan"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButton: {
    backgroundColor: "#2196F3",
  },
  stopButton: {
    backgroundColor: "#F44336",
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
    opacity: 0.6,
  },
  scanButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
