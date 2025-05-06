// app/(tabs)/port-scanner/index.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Network from "expo-network";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Define types for scan results
type ScanResult = {
  ip: string;
  port: number;
  service: string;
};

// Common ports to scan and their associated services
const COMMON_PORTS = [
  { port: 21, service: "FTP" },
  { port: 22, service: "SSH" },
  { port: 23, service: "Telnet" },
  { port: 25, service: "SMTP" },
  { port: 53, service: "DNS" },
  { port: 80, service: "HTTP" },
  { port: 110, service: "POP3" },
  { port: 143, service: "IMAP" },
  { port: 443, service: "HTTPS" },
  { port: 445, service: "SMB" },
  { port: 3306, service: "MySQL" },
  { port: 3389, service: "RDP" },
  { port: 8080, service: "HTTP-Proxy" },
];

// Known vulnerabilities by port and service
const KNOWN_VULNERABILITIES: Record<
  number,
  Array<{ name: string; severity: string; description: string }>
> = {
  21: [
    {
      name: "FTP Anonymous Access",
      severity: "Medium",
      description: "FTP server allows anonymous login.",
    },
    {
      name: "FTP Cleartext Authentication",
      severity: "Medium",
      description: "Credentials sent in cleartext.",
    },
  ],
  22: [
    {
      name: "SSH Weak Ciphers",
      severity: "Medium",
      description: "Server may support weak encryption.",
    },
    {
      name: "SSH Brute Force",
      severity: "Medium",
      description: "No rate limiting on auth attempts.",
    },
  ],
  23: [
    {
      name: "Telnet Cleartext",
      severity: "High",
      description: "Telnet sends all data unencrypted.",
    },
  ],
  25: [
    {
      name: "SMTP Open Relay",
      severity: "High",
      description: "May allow spammers to relay messages.",
    },
  ],
  80: [
    {
      name: "HTTP Unencrypted",
      severity: "Medium",
      description: "Sensitive data may be transmitted in cleartext.",
    },
  ],
  445: [
    {
      name: "SMB Vulnerabilities",
      severity: "High",
      description: "May be vulnerable to attacks like EternalBlue.",
    },
  ],
  3389: [
    {
      name: "RDP BlueKeep",
      severity: "Critical",
      description: "May be vulnerable to RCE via BlueKeep.",
    },
  ],
};

// Debug logs to help track scanning process
const debugLogs: string[] = [];

function addLog(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  debugLogs.unshift(`${timestamp}: ${message}`);
  // Keep only the latest 100 logs
  if (debugLogs.length > 100) {
    debugLogs.pop();
  }
  console.log(message);
}

export default function PortScannerScreen() {
  const router = useRouter();
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [currentScan, setCurrentScan] = useState<{
    ip: string;
    port: number;
  } | null>(null);
  const [logs, setLogs] = useState<string[]>(debugLogs);
  const [showDebugLogs, setShowDebugLogs] = useState(false);

  // Reference to track if scanning should be stopped
  const shouldStopScanRef = useRef(false);

  useEffect(() => {
    // Get network information when component mounts
    fetchNetworkInfo();

    // Set up log update interval
    const logInterval = setInterval(() => {
      setLogs([...debugLogs]);
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(logInterval);
      shouldStopScanRef.current = true; // Ensure any ongoing scan stops
    };
  }, []);

  const fetchNetworkInfo = async () => {
    try {
      const ipAddress = await Network.getIpAddressAsync();
      const networkType = await Network.getNetworkStateAsync();

      setNetworkInfo({
        ip: ipAddress,
        networkType,
      });

      addLog(
        `Network info: IP=${ipAddress}, Connected=${networkType.isConnected}`
      );
    } catch (error) {
      console.error("Error fetching network info:", error);
      addLog(`Error fetching network info: ${error}`);
    }
  };

  // Clear logs
  const clearLogs = () => {
    debugLogs.length = 0;
    setLogs([]);
  };

  // Generate a range of IP addresses in the same subnet
  const generateIPRange = (ipAddress: string): string[] => {
    const ipParts = ipAddress.split(".");
    if (ipParts.length !== 4) {
      return [ipAddress];
    }

    // Generate a small range around the device IP for scanning
    const baseIP = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;
    const lastOctet = parseInt(ipParts[3], 10);

    const range: string[] = [];
    // Generate a range of IPs
    const start = Math.max(1, lastOctet - 5);
    const end = Math.min(255, lastOctet + 10);

    for (let i = start; i <= end; i++) {
      range.push(`${baseIP}.${i}`);
    }

    return range;
  };

  // Scan a host port using fetch with a timeout
  const scanPort = (host: string, port: number): Promise<boolean> => {
    return new Promise((resolve) => {
      // Create a hard timeout that will resolve after 1500ms maximum
      const timeoutId = setTimeout(() => {
        resolve(false);
      }, 1500);

      try {
        // Use a simple HTTP fetch with a timeout to check if port is responsive
        const protocol = port === 443 ? "https" : "http";

        fetch(`${protocol}://${host}:${port}`, {
          method: "HEAD",
          redirect: "manual",
        })
          .then((response) => {
            clearTimeout(timeoutId);
            addLog(`Port open: ${host}:${port}`);
            resolve(true);
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            resolve(false);
          });
      } catch (error) {
        clearTimeout(timeoutId);
        resolve(false);
      }
    });
  };

  // Stop scan function
  const stopScan = () => {
    addLog("Stopping scan...");
    shouldStopScanRef.current = true;
    setIsScanning(false);
    setCurrentScan(null);
  };

  // Batch IP addresses into smaller groups
  const batchIpAddresses = (ips: string[], batchSize: number): string[][] => {
    const batches: string[][] = [];

    for (let i = 0; i < ips.length; i += batchSize) {
      batches.push(ips.slice(i, i + batchSize));
    }

    return batches;
  };

  // Wait function
  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Start scan with batching and improved error handling
  const startScan = async () => {
    // Validate network connectivity
    if (!networkInfo || !networkInfo.ip) {
      Alert.alert("Error", "No network connection detected");
      return;
    }

    try {
      // Reset stop flag
      shouldStopScanRef.current = false;

      setIsScanning(true);
      setScanResults([]);
      setProgress(0);
      addLog("Starting network scan...");

      // Get IP address from network info
      const ipAddress = networkInfo.ip;
      addLog(`Device IP: ${ipAddress}`);

      // Generate range of IP addresses to scan
      const ipRange = generateIPRange(ipAddress);
      addLog(`Generated ${ipRange.length} IPs to scan`);

      // Define ports to scan - avoid HTTPS (443) ports to prevent hanging
      const portsToScan = [80, 8080, 3000, 8000, 8888];
      addLog(`Scanning ports: ${portsToScan.join(", ")}`);

      // Calculate total operations
      const totalOperations = ipRange.length * portsToScan.length;
      let completedOperations = 0;

      // Create batches for scanning (5 IPs per batch)
      const batchSize = Platform.OS === "ios" ? 5 : 3;
      const batches = batchIpAddresses(ipRange, batchSize);
      addLog(`Created ${batches.length} batches for scanning`);

      // Storage for results
      const results: ScanResult[] = [];

      // Scan each batch
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        // Check if scan should stop
        if (shouldStopScanRef.current) {
          addLog("Scan stopped by user");
          break;
        }

        const batch = batches[batchIndex];
        addLog(`Processing batch ${batchIndex + 1}/${batches.length}`);

        // Process each IP in this batch
        for (const ip of batch) {
          // Check if scan should stop
          if (shouldStopScanRef.current) {
            break;
          }

          // Process each port
          for (const port of portsToScan) {
            // Check if scan should stop
            if (shouldStopScanRef.current) {
              break;
            }

            // Update current scan
            setCurrentScan({ ip, port });

            try {
              // Scan this port
              const isOpen = await scanPort(ip, port);

              // Update progress
              completedOperations++;
              const newProgress = Math.min(
                completedOperations / totalOperations,
                1
              );
              setProgress(newProgress);

              // If port is open, add to results
              if (isOpen) {
                const service =
                  COMMON_PORTS.find((p) => p.port === port)?.service ||
                  "Unknown";
                addLog(`Found open port: ${ip}:${port} (${service})`);

                const result = { ip, port, service };
                results.push(result);
                setScanResults([...results]);
              }
            } catch (error) {
              // Update progress even on error
              completedOperations++;
              const newProgress = Math.min(
                completedOperations / totalOperations,
                1
              );
              setProgress(newProgress);

              addLog(`Error scanning ${ip}:${port}: ${error}`);
            }

            // Brief pause between port scans to avoid UI freezing
            await sleep(10);
          }
        }

        // Brief pause between batches
        if (!shouldStopScanRef.current && batchIndex < batches.length - 1) {
          await sleep(100);
        }
      }

      // Scan complete
      setIsScanning(false);
      setCurrentScan(null);
      addLog(`Scan completed. Found ${results.length} open ports.`);

      if (!shouldStopScanRef.current) {
        if (results.length > 0) {
          Alert.alert("Scan Complete", `Found ${results.length} open ports`);
        } else {
          Alert.alert("Scan Complete", "No open ports found on the network");
        }
      }
    } catch (error) {
      console.error("Error during scan:", error);
      addLog(`Error during scan: ${error}`);
      setIsScanning(false);
      setCurrentScan(null);
    }
  };

  const getVulnerabilitiesForPort = (
    port: number
  ): Array<{ name: string; severity: string; description: string }> => {
    return KNOWN_VULNERABILITIES[port] || [];
  };

  const toggleDebugLogs = () => {
    setShowDebugLogs(!showDebugLogs);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Network Port Scanner</Text>
          <Text style={styles.headerSubtitle}>
            Scan your network for open ports and security issues
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Network Information</Text>
          {networkInfo ? (
            <>
              <Text>IP: {networkInfo.ip || "Unknown"}</Text>
              <Text>
                Connected: {networkInfo.networkType?.isConnected ? "Yes" : "No"}
              </Text>
              <Text>
                WiFi:{" "}
                {networkInfo.networkType?.type === Network.NetworkStateType.WIFI
                  ? "Yes"
                  : "No"}
              </Text>
            </>
          ) : (
            <Text>Loading network information...</Text>
          )}
        </View>

        {isScanning ? (
          <TouchableOpacity
            style={[styles.scanButton, styles.stopButton]}
            onPress={stopScan}
          >
            <Text style={styles.scanButtonText}>Stop Scanning</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.scanButton}
            onPress={startScan}
            disabled={!networkInfo?.ip}
          >
            <Text style={styles.scanButtonText}>Start Port Scan</Text>
          </TouchableOpacity>
        )}

        {isScanning && (
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
        )}

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {scanResults.length > 0
              ? `Found ${scanResults.length} Open Ports`
              : isScanning
              ? "Scanning for open ports..."
              : "No results yet"}
          </Text>

          <TouchableOpacity onPress={toggleDebugLogs} style={styles.logToggle}>
            <Text style={styles.logToggleText}>
              {showDebugLogs ? "Hide Logs" : "Show Logs"}
            </Text>
          </TouchableOpacity>
        </View>

        {showDebugLogs ? (
          <View style={styles.logsContainer}>
            <View style={styles.logsHeader}>
              <Text style={styles.logsTitle}>Debug Logs</Text>
              <TouchableOpacity
                onPress={clearLogs}
                disabled={logs.length === 0}
              >
                <Text
                  style={[
                    styles.clearButton,
                    logs.length === 0 && styles.disabledButton,
                  ]}
                >
                  Clear
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={logs}
              renderItem={({ item }) => (
                <Text style={styles.logItem}>{item}</Text>
              )}
              keyExtractor={(item, index) => index.toString()}
              style={styles.logsList}
            />
          </View>
        ) : (
          <FlatList
            data={scanResults}
            keyExtractor={(item, index) => `${item.ip}-${item.port}-${index}`}
            renderItem={({ item }) => {
              const vulnerabilities = getVulnerabilitiesForPort(item.port);

              return (
                <View style={styles.resultItem}>
                  <Text style={styles.ipText}>{item.ip}</Text>
                  <Text style={styles.portText}>
                    Port {item.port} ({item.service})
                  </Text>

                  {vulnerabilities.length > 0 ? (
                    <View style={styles.vulnerabilityContainer}>
                      <Text style={styles.vulnerabilityTitle}>
                        Potential Vulnerabilities:
                      </Text>
                      {vulnerabilities.map((vuln, idx) => (
                        <View key={idx} style={styles.vulnerability}>
                          <Text
                            style={[
                              styles.severityBadge,
                              vuln.severity === "Critical"
                                ? styles.criticalSeverity
                                : vuln.severity === "High"
                                ? styles.highSeverity
                                : vuln.severity === "Medium"
                                ? styles.mediumSeverity
                                : styles.lowSeverity,
                            ]}
                          >
                            {vuln.severity}
                          </Text>
                          <Text style={styles.vulnerabilityName}>
                            {vuln.name}
                          </Text>
                          <Text style={styles.vulnerabilityDesc}>
                            {vuln.description}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noVulnerabilities}>
                      No known vulnerabilities
                    </Text>
                  )}
                </View>
              );
            }}
            style={styles.resultsList}
            contentContainerStyle={styles.resultsContent}
          />
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
  infoBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
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
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 20,
  },
  resultItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  ipText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  portText: {
    fontSize: 14,
    color: "#0066cc",
    marginBottom: 8,
  },
  vulnerabilityContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  vulnerabilityTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  vulnerability: {
    marginTop: 5,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  vulnerabilityName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  vulnerabilityDesc: {
    fontSize: 13,
    color: "#555",
  },
  severityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    marginBottom: 5,
    overflow: "hidden",
    color: "white",
  },
  criticalSeverity: {
    backgroundColor: "#d32f2f",
  },
  highSeverity: {
    backgroundColor: "#f57c00",
  },
  mediumSeverity: {
    backgroundColor: "#fbc02d",
  },
  lowSeverity: {
    backgroundColor: "#388e3c",
  },
  noVulnerabilities: {
    marginTop: 5,
    color: "#388e3c",
    fontStyle: "italic",
  },
  logsContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  logsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  logsTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  clearButton: {
    color: "#2196F3",
    fontSize: 12,
  },
  disabledButton: {
    color: "#ccc",
  },
  logsList: {
    flex: 1,
  },
  logItem: {
    fontSize: 11,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: "#555",
    paddingVertical: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
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
    marginBottom: Platform.OS === "android" ? 60 : 20, // Extra margin on Android
    alignSelf: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
