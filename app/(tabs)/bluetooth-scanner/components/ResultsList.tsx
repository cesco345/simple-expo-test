import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BluetoothScanResult } from "../../../modules/bluetooth-scanner/types";

interface ResultsListProps {
  results: BluetoothScanResult[];
}

// Map of specific recommendations for each vulnerability type
const VULNERABILITY_RECOMMENDATIONS = {
  BLUEJACKING:
    "Set device to non-discoverable mode when not actively pairing. Decline unsolicited connection requests.",
  BLUESNARFING:
    "Use strong PIN codes and ensure your device's firmware is updated. Disable Bluetooth in public places.",
  BLUEBUGGING:
    "Update to the latest firmware and only pair devices in secure environments. Regularly audit connected devices.",
  MISSING_AUTHENTICATION:
    "Enable secure authentication before connecting devices. Use complex pairing passcodes.",
  BLUETOOTH_LE_TRACKING:
    "Use random MAC addresses when available. Disable Bluetooth when not in use to prevent tracking.",
  WEAK_ENCRYPTION:
    "Upgrade firmware to the latest version that supports stronger encryption protocols.",
  UNENCRYPTED_COMMUNICATION:
    "Only use devices that support encrypted Bluetooth communication. Avoid sensitive data transfers.",
  MITM: "Verify device identity before pairing. Only pair devices in secure, private locations.",
  REFLECTION:
    "Update devices to latest firmware. Avoid using legacy Bluetooth protocols.",
  OUTDATED_FIRMWARE:
    "Update device firmware to the latest version to patch known security vulnerabilities.",
  BLUEPRINTING:
    "Disable Bluetooth visibility when not in use. Change device name to avoid revealing device model.",
  MAC_SPOOFING:
    "Use Bluetooth 4.0+ with address randomization features. Verify device identities before connecting.",
  NO_NAME_DEVICE:
    "Avoid connecting to unnamed Bluetooth devices as they may be spoofing legitimate devices.",
  UNBRANDED_DEVICE:
    "Use branded devices with established security practices and regular firmware updates.",
  DEFAULT_CREDENTIALS:
    "Change default PINs and passwords on all Bluetooth devices. Use complex credentials.",
  UPnP_ENABLED:
    "Disable UPnP when not needed. Configure device firewalls to block unauthorized access.",
  INSECURE_PROTOCOLS:
    "Update to devices that support secure protocols. Avoid using devices with legacy Bluetooth versions.",
  MDNS_INFORMATION_DISCLOSURE:
    "Configure mDNS to limit information disclosure. Use network segmentation.",
};

// Fallback recommendations for cases where specific ones aren't defined
const DEFAULT_RECOMMENDATIONS = [
  "Update firmware if available",
  "Disable discovery mode when not in use",
  "Use strong authentication when available",
];

/**
 * Calculate distance from RSSI using the log-distance path loss model
 * @param rssi The received signal strength in dBm
 * @param measuredPower The reference power at 1m (default: -65)
 * @param environmentalFactor The path loss exponent (default: 2.5)
 * @returns Estimated distance in meters
 */
const calculateDistance = (
  rssi: number,
  measuredPower: number = -65,
  environmentalFactor: number = 2.5
): number => {
  if (rssi === 0) {
    return -1; // Cannot determine
  }

  // Log-distance path loss model
  const ratio = rssi / measuredPower;
  if (ratio < 1) {
    return Math.pow(ratio, 10);
  } else {
    // When RSSI is stronger than reference power (very close proximity)
    return Math.pow(10, (measuredPower - rssi) / (10 * environmentalFactor));
  }
};

/**
 * Get a human-readable description of the distance
 * @param distance The calculated distance in meters
 * @returns A human-readable description
 */
const getDistanceDescription = (distance: number): string => {
  if (distance < 0) {
    return "Unknown";
  } else if (distance < 0.5) {
    return "Immediate (<0.5m)";
  } else if (distance < 2) {
    return "Near (0.5-2m)";
  } else if (distance < 5) {
    return "Medium (2-5m)";
  } else if (distance < 10) {
    return "Far (5-10m)";
  } else {
    return "Very Far (>10m)";
  }
};

export default function ResultsList({
  results = [], // Default to empty array
}: ResultsListProps) {
  // State to track which cards are expanded
  const [expandedCards, setExpandedCards] = useState<{
    [key: string]: boolean;
  }>({});

  // Toggle expanded state for a card
  const toggleCardExpand = (cardId: string) => {
    setExpandedCards((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId],
    }));
  };

  // Safely check if we have results
  if (!results || results.length === 0) {
    return null;
  }

  // Helper function to get recommendation for a vulnerability
  const getRecommendation = (vulnId: string): string => {
    return (
      VULNERABILITY_RECOMMENDATIONS[vulnId] ||
      `Update firmware and follow best security practices for this type of vulnerability.`
    );
  };

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

        // Calculate estimated distance based on RSSI
        const estimatedDistance = calculateDistance(item.device.rssi);
        const distanceDescription = getDistanceDescription(estimatedDistance);

        const cardId = `device-${index}`;
        const isExpanded = !!expandedCards[cardId];

        return (
          <View key={cardId} style={styles.resultItem}>
            <TouchableOpacity
              onPress={() => toggleCardExpand(cardId)}
              style={styles.cardHeader}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.deviceName}>
                  {item.device.name || "Unknown Device"}
                </Text>
                <Text style={styles.deviceId}>
                  {item.device.id.substring(0, 8)}...
                </Text>
              </View>

              <View style={styles.summaryDetails}>
                <Text style={styles.detailText}>
                  Signal Strength: {item.device.rssi} dBm
                </Text>

                {/* Add distance estimation */}
                <Text style={styles.distanceRow}>
                  <Text style={styles.detailText}>Distance: </Text>
                  <Text style={styles.distanceText}>{distanceDescription}</Text>
                  <Text style={styles.detailTextSmall}>
                    {" "}
                    (~{estimatedDistance.toFixed(1)}m)
                  </Text>
                </Text>

                {item.device.manufacturer && (
                  <Text style={styles.detailText}>
                    Manufacturer: {item.device.manufacturer}
                  </Text>
                )}

                <View style={styles.securityRow}>
                  <Text style={styles.detailText}>Security Score: </Text>
                  <Text
                    style={[styles.securityScore, { color: securityColor }]}
                  >
                    {item.securityScore}/100 ({securityLevel})
                  </Text>
                </View>

                {item.isVulnerable && (
                  <Text style={styles.vulnerabilitySummary}>
                    {item.vulnerabilities.length} Vulnerabilities Detected
                    <Text style={styles.tapIndicator}>
                      {" "}
                      (Tap to {isExpanded ? "collapse" : "expand"})
                    </Text>
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Expanded details section */}
            {isExpanded && item.isVulnerable && (
              <ScrollView
                style={styles.expandedDetails}
                contentContainerStyle={styles.scrollContent}
                nestedScrollEnabled={true}
              >
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

                  {/* Recommendations section */}
                  {item.vulnerabilities.length > 0 && (
                    <View style={styles.recommendationsSection}>
                      <Text style={styles.recommendationsHeader}>
                        Recommendations:
                      </Text>

                      {/* Process each vulnerability for its recommendation */}
                      {item.vulnerabilities.map((vuln, vulnIndex) => (
                        <View
                          key={`rec-${vulnIndex}`}
                          style={styles.recommendationContainer}
                        >
                          <Text style={styles.recommendationTitle}>
                            For {vuln.name || vuln.id}:
                          </Text>
                          <Text style={styles.recommendationText}>
                            • {getRecommendation(vuln.id)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardHeader: {
    padding: 12,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryDetails: {
    marginTop: 4,
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
  detailText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  detailTextSmall: {
    fontSize: 12,
    color: "#666",
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0066cc",
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
  vulnerabilitySummary: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e65100",
    marginTop: 4,
  },
  tapIndicator: {
    fontWeight: "normal",
    fontSize: 12,
    fontStyle: "italic",
    color: "#888",
  },
  expandedDetails: {
    maxHeight: 500, // Increased maximum height
  },
  scrollContent: {
    paddingBottom: 20, // Add padding at bottom to ensure last items are visible
  },
  vulnerabilityContainer: {
    padding: 12,
    backgroundColor: "#fff8e1",
    borderTopWidth: 1,
    borderTopColor: "#ffe0b2",
  },
  vulnerabilityTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e65100",
    marginBottom: 8,
  },
  vulnerabilityText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    paddingLeft: 4,
  },
  recommendationsSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  recommendationsHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 8,
  },
  recommendationContainer: {
    marginTop: 6,
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#e8f5e9",
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#4caf50",
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 12,
    color: "#444",
    lineHeight: 18,
  },
});
