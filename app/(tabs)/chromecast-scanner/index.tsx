// app/(tabs)/chromecast-scanner/index.tsx
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import useChromecastScanner from "../../modules/chromecast-scanner/hooks/useChromecastScanner";
import useDebugLogs from "../../modules/chromecast-scanner/hooks/useDebugLogs";
import useNetworkInfo from "../../modules/chromecast-scanner/hooks/useNetworkInfo";
import DebugLogs from "./components/DebugLogs";
import NetworkInfo from "./components/NetworkInfo";
import ResultsList from "./components/ResultsList";
import ScanControls from "./components/ScanControls";
import ScanProgress from "./components/ScanProgress";

export default function ChromecastScannerScreen() {
  // Initialize the necessary hooks from the actual module
  const { logs, clearLogs, addLog } = useDebugLogs();
  const { networkInfo, refreshNetworkInfo } = useNetworkInfo();
  const {
    scanResults,
    isScanning,
    progress,
    currentScan,
    startScan,
    stopScan,
    isInitialized,
    addDeviceManually,
    scanIpAddress,
  } = useChromecastScanner(networkInfo);

  // State for UI management
  const [modifiedResults, setModifiedResults] = useState([]);
  const [isScanningDevice, setIsScanningDevice] = useState(false);
  const [deviceScanProgress, setDeviceScanProgress] = useState(0);
  const [scannedDeviceIp, setScannedDeviceIp] = useState(null);

  // Effect to run once when the component mounts
  useEffect(() => {
    const initializeScreen = async () => {
      try {
        addLog("[INFO] Initializing Chromecast Scanner screen...");
        await refreshNetworkInfo();
        addLog("[INFO] Chromecast Scanner screen initialized successfully");
      } catch (error) {
        addLog(`[ERROR] Failed to initialize screen: ${error}`);
      }
    };

    initializeScreen();
  }, []);

  // Update modifiedResults when scanResults change
  useEffect(() => {
    setModifiedResults(scanResults);
  }, [scanResults]);

  // Watch for vulnerability info in logs
  useEffect(() => {
    if (!isScanningDevice || !scannedDeviceIp) return;

    // Get the most recent log entry
    if (logs.length === 0) return;
    const lastLog = logs[logs.length - 1];

    // Check if a vulnerability analysis has been completed
    if (
      lastLog.includes("Analyzed") &&
      lastLog.includes("vulnerabilities found")
    ) {
      // Extract device name and vulnerability count
      const match = lastLog.match(
        /Analyzed\s+([^:]+):\s+(\d+)\s+vulnerabilities\s+found/
      );
      if (match && match[1] && match[2]) {
        const deviceName = match[1].trim();
        const vulnerabilityCount = parseInt(match[2]);

        // Create dummy vulnerability objects
        const vulnerabilities = Array(vulnerabilityCount)
          .fill()
          .map((_, i) => ({
            id: `vuln-${i + 1}`,
            name: `Security Vulnerability ${i + 1}`,
            severity: i < 1 ? "high" : i < 2 ? "medium" : "low",
            description:
              "This device may have security issues that could allow unauthorized access.",
            recommendation:
              "Update device firmware and restrict network access.",
          }));

        // Update the manually added device with vulnerabilities
        setModifiedResults((prevResults) =>
          prevResults.map((item) => {
            if (
              item.device.ipAddress === scannedDeviceIp &&
              item.device.isManuallyAdded
            ) {
              return {
                ...item,
                device: {
                  ...item.device,
                  name: deviceName, // Update with discovered name
                },
                vulnerabilities: vulnerabilities,
                isVulnerable: vulnerabilityCount > 0,
                securityScore: Math.max(0, 100 - vulnerabilityCount * 15),
              };
            }
            return item;
          })
        );
      }
    }
  }, [logs, isScanningDevice, scannedDeviceIp]);

  // Handler for starting the scan
  const handleStartScan = async () => {
    try {
      if (!networkInfo) {
        const info = await refreshNetworkInfo();
        if (!info) {
          addLog("[ERROR] Failed to get network info");
          return;
        }
      }
      startScan();
    } catch (error) {
      addLog(`[ERROR] Failed to start scan: ${error}`);
    }
  };

  // Wrapper for addDeviceManually
  const handleAddDeviceManually = useCallback(
    (ipAddress, port) => {
      addLog(
        `[INFO] Manual device addition triggered for ${ipAddress}:${port}`
      );
      addDeviceManually(ipAddress, port);
    },
    [addDeviceManually, addLog]
  );

  // Scanning vulnerabilities for a specific device
  const handleScanDeviceVulnerabilities = useCallback(
    async (deviceId) => {
      try {
        // Find the device
        const device = modifiedResults.find(
          (item) => item.device.id === deviceId
        );
        if (!device) {
          addLog(`[ERROR] Device with ID ${deviceId} not found`);
          return;
        }

        const ipAddress = device.device.ipAddress;
        addLog(`[INFO] Starting vulnerability scan for device at ${ipAddress}`);

        // Set up UI state
        setIsScanningDevice(true);
        setScannedDeviceIp(ipAddress);
        setDeviceScanProgress(0.1);

        // Perform the scan
        await scanIpAddress(ipAddress);

        // Update progress for better UX
        setDeviceScanProgress(0.7);

        // Complete after a delay to allow for UI updates
        setTimeout(() => {
          setDeviceScanProgress(1.0);
          setTimeout(() => {
            setIsScanningDevice(false);
            setDeviceScanProgress(0);
            setScannedDeviceIp(null);
          }, 1000);
        }, 2000);

        addLog(`[INFO] Completed vulnerability scan for ${ipAddress}`);
      } catch (error) {
        addLog(`[ERROR] Error scanning device vulnerabilities: ${error}`);
        setIsScanningDevice(false);
        setScannedDeviceIp(null);
      }
    },
    [modifiedResults, scanIpAddress, addLog]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Network information */}
        <NetworkInfo
          networkInfo={networkInfo}
          refreshNetworkInfo={refreshNetworkInfo}
        />

        {/* Scan controls */}
        <ScanControls
          isScanning={isScanning || isScanningDevice}
          onStartScan={handleStartScan}
          onStopScan={stopScan}
          onAddDeviceManually={handleAddDeviceManually}
        />

        {/* Scan progress */}
        {(isScanning ||
          isScanningDevice ||
          progress > 0 ||
          deviceScanProgress > 0) && (
          <ScanProgress
            isScanning={isScanning || isScanningDevice}
            progress={isScanningDevice ? deviceScanProgress : progress}
            currentScan={
              isScanningDevice
                ? {
                    stage: "vulnerability-check",
                    deviceName: scannedDeviceIp
                      ? `Device at ${scannedDeviceIp}`
                      : "Device",
                  }
                : currentScan
            }
          />
        )}

        {/* Results list - using our modified results */}
        {modifiedResults.length > 0 && (
          <ResultsList
            results={modifiedResults}
            onScanVulnerabilities={handleScanDeviceVulnerabilities}
          />
        )}

        {/* Debug logs */}
        <DebugLogs logs={logs} clearLogs={clearLogs} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
});
