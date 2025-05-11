import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BluetoothScanResult } from "../../../modules/bluetooth-scanner/types";

interface ResultsListProps {
  results: BluetoothScanResult[];
}

export default function ResultsList({
  results = [], // Default to empty array
}: ResultsListProps) {
  // Safely check if we have results
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <View style={styles.resultsContainer}>
      {results.map((item, index) => {
        // Calculate security level text and color based on score
        let securityLevel = "Unknown";
        let securityColor = "#888";

        if (item.securityScore >= 90) {
          securityLevel = "Secure";
          securityColor = "#4CAF50";
        } else if (item.securityScore >= 70) {
          securityLevel = "Moderate";
          securityColor = "#FFC107";
        } else if (item.securityScore >= 40) {
          securityLevel = "Poor";
          securityColor = "#FF9800";
        } else {
          securityLevel = "Critical";
          securityColor = "#F44336";
        }

        return (
          <View key={`device-${index}`} style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Text style={styles.deviceName}>
                {item.device.name || "Unknown Device"}
              </Text>
              <Text style={styles.deviceId}>
                {item.device.id.substring(0, 8)}...
              </Text>
            </View>

            <View style={styles.deviceDetails}>
              <Text style={styles.detailText}>
                Signal Strength: {item.device.rssi} dBm
              </Text>

              {item.device.manufacturerData && (
                <Text style={styles.detailText}>
                  Manufacturer: {item.device.manufacturerData}
                </Text>
              )}

              <View style={styles.securityRow}>
                <Text style={styles.detailText}>Security Score: </Text>
                <Text style={[styles.securityScore, { color: securityColor }]}>
                  {item.securityScore}/100 ({securityLevel})
                </Text>
              </View>

              {item.isVulnerable && (
                <View style={styles.vulnerabilityContainer}>
                  <Text style={styles.vulnerabilityTitle}>
                    Vulnerabilities Detected ({item.vulnerabilities.length})
                  </Text>

                  {item.vulnerabilityDetails.map((detail, detailIndex) => (
                    <Text
                      key={`detail-${detailIndex}`}
                      style={styles.vulnerabilityText}
                    >
                      • {detail}
                    </Text>
                  ))}

                  {item.vulnerabilities.map((vulnerability, vulnIndex) => (
                    <View
                      key={`vuln-${vulnIndex}`}
                      style={styles.recommendationContainer}
                    >
                      <Text style={styles.recommendationTitle}>
                        Recommendation for {vulnerability.name}:
                      </Text>
                      <Text style={styles.recommendationText}>
                        {vulnerability.recommendation}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  resultsContainer: {
    marginBottom: 16,
  },
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
  deviceId: {
    fontSize: 12,
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
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  securityScore: {
    fontSize: 14,
    fontWeight: "bold",
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
  vulnerabilityText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
  recommendationContainer: {
    marginTop: 8,
    padding: 6,
    backgroundColor: "#e8f5e9",
    borderRadius: 4,
    marginBottom: 4,
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 2,
  },
  recommendationText: {
    fontSize: 12,
    color: "#444",
  },
});
