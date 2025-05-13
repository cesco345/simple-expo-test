import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChromecastScanResult } from "../../../modules/chromecast-scanner/types";

interface ResultsListProps {
  results: ChromecastScanResult[];
  onScanVulnerabilities?: (deviceId: string) => void;
}

const ResultsList: React.FC<ResultsListProps> = ({
  results,
  onScanVulnerabilities,
}) => {
  const [selectedDevice, setSelectedDevice] =
    useState<ChromecastScanResult | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  if (results.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Scan Results</Text>
        </View>
        <Text style={styles.emptyText}>
          No devices found. Start a scan to discover Chromecast devices on your
          network.
        </Text>
      </View>
    );
  }

  // Show device details when a device is selected
  const showDeviceDetails = (device: ChromecastScanResult) => {
    setSelectedDevice(device);
    setDetailsModalVisible(true);
  };

  // Get a color based on security score
  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return "#4CAF50"; // Green
    if (score >= 60) return "#FFEB3B"; // Yellow
    if (score >= 40) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  // Get a color based on vulnerability severity
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "#D32F2F"; // Dark red
      case "high":
        return "#F44336"; // Red
      case "medium":
        return "#FF9800"; // Orange
      case "low":
        return "#FFEB3B"; // Yellow
      default:
        return "#9E9E9E"; // Gray
    }
  };

  // Calculate summary stats
  const vulnerableDevicesCount = results.filter((r) => r.isVulnerable).length;
  const totalVulnerabilitiesCount = results.reduce(
    (total, device) => total + device.vulnerabilities.length,
    0
  );
  const averageSecurityScore = Math.round(
    results.reduce((total, device) => total + device.securityScore, 0) /
      results.length
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Results</Text>
        <Text style={styles.subtitle}>
          {results.length} device{results.length !== 1 ? "s" : ""} found
        </Text>
      </View>

      {/* Summary statistics */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{vulnerableDevicesCount}</Text>
          <Text style={styles.summaryLabel}>Vulnerable Devices</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalVulnerabilitiesCount}</Text>
          <Text style={styles.summaryLabel}>Total Vulnerabilities</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text
            style={[
              styles.summaryValue,
              { color: getSecurityScoreColor(averageSecurityScore) },
            ]}
          >
            {averageSecurityScore}%
          </Text>
          <Text style={styles.summaryLabel}>Avg. Security</Text>
        </View>
      </View>

      {/* Results list */}
      <View style={styles.resultsList}>
        {results.map((item) => (
          <TouchableOpacity
            key={item.device.id}
            style={styles.deviceItem}
            onPress={() => showDeviceDetails(item)}
          >
            <View style={styles.deviceHeader}>
              <Text style={styles.deviceName}>
                {item.device.name || "Unknown Device"}
              </Text>
              <View
                style={[
                  styles.securityScore,
                  {
                    backgroundColor: getSecurityScoreColor(item.securityScore),
                  },
                ]}
              >
                <Text style={styles.scoreText}>{item.securityScore}</Text>
              </View>
            </View>

            <View style={styles.deviceDetails}>
              <Text style={styles.deviceIp}>{item.device.ipAddress}</Text>
              <Text style={styles.deviceType}>
                {item.device.manufacturer || "Unknown"}{" "}
                {item.device.model || "Chromecast Device"}
              </Text>
            </View>

            {/* Add scan button for manually added devices */}
            {item.device.isManuallyAdded &&
              item.vulnerabilities.length === 0 &&
              onScanVulnerabilities && (
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={(e) => {
                    e.stopPropagation(); // Prevent opening details
                    onScanVulnerabilities(item.device.id);
                  }}
                >
                  <FontAwesome
                    name="search"
                    size={14}
                    color="#fff"
                    style={styles.icon}
                  />
                  <Text style={styles.scanButtonText}>
                    Scan for Vulnerabilities
                  </Text>
                </TouchableOpacity>
              )}

            <View style={styles.vulnerabilityBar}>
              {item.isVulnerable ? (
                <View style={styles.vulnerabilityInfo}>
                  <FontAwesome
                    name="warning"
                    size={14}
                    color="#F44336"
                    style={styles.icon}
                  />
                  <Text style={styles.vulnerabilityText}>
                    {item.vulnerabilities.length} vulnerabilit
                    {item.vulnerabilities.length !== 1 ? "ies" : "y"} found
                  </Text>
                </View>
              ) : (
                <View style={styles.safeInfo}>
                  <FontAwesome
                    name="check-circle"
                    size={14}
                    color="#4CAF50"
                    style={styles.icon}
                  />
                  <Text style={styles.safeText}>No vulnerabilities found</Text>
                </View>
              )}
              <FontAwesome name="chevron-right" size={14} color="#999" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Device Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        {selectedDevice && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedDevice.device.name || "Unknown Device"}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setDetailsModalVisible(false)}
                >
                  <FontAwesome name="times" size={20} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                {/* Device Information */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Device Information</Text>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>IP Address:</Text>
                    <Text style={styles.detailValue}>
                      {selectedDevice.device.ipAddress}
                    </Text>
                  </View>

                  {selectedDevice.device.macAddress && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>MAC Address:</Text>
                      <Text style={styles.detailValue}>
                        {selectedDevice.device.macAddress}
                      </Text>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Manufacturer:</Text>
                    <Text style={styles.detailValue}>
                      {selectedDevice.device.manufacturer || "Unknown"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Model:</Text>
                    <Text style={styles.detailValue}>
                      {selectedDevice.device.model || "Unknown"}
                    </Text>
                  </View>

                  {selectedDevice.device.firmwareVersion && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Firmware:</Text>
                      <Text style={styles.detailValue}>
                        {selectedDevice.device.firmwareVersion}
                      </Text>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Discovery:</Text>
                    <Text style={styles.detailValue}>
                      {selectedDevice.device.discoveryType}
                    </Text>
                  </View>
                </View>

                {/* Security Score */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Security Score</Text>

                  <View style={styles.securityScoreContainer}>
                    <View
                      style={[
                        styles.scoreCircle,
                        {
                          borderColor: getSecurityScoreColor(
                            selectedDevice.securityScore
                          ),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.scoreCircleText,
                          {
                            color: getSecurityScoreColor(
                              selectedDevice.securityScore
                            ),
                          },
                        ]}
                      >
                        {selectedDevice.securityScore}
                      </Text>
                    </View>

                    <View style={styles.scoreTextContainer}>
                      <Text style={styles.scoreRating}>
                        {selectedDevice.securityScore >= 80
                          ? "Good"
                          : selectedDevice.securityScore >= 60
                          ? "Fair"
                          : selectedDevice.securityScore >= 40
                          ? "Poor"
                          : "Critical"}
                      </Text>
                      <Text style={styles.scoreDescription}>
                        {selectedDevice.securityScore >= 80
                          ? "This device appears to be relatively secure."
                          : selectedDevice.securityScore >= 60
                          ? "This device has some security concerns."
                          : selectedDevice.securityScore >= 40
                          ? "This device has significant security issues."
                          : "This device has critical security vulnerabilities."}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Vulnerabilities */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Vulnerabilities</Text>

                  {selectedDevice.vulnerabilities.length === 0 ? (
                    <Text style={styles.noVulnerabilitiesText}>
                      No vulnerabilities detected
                    </Text>
                  ) : (
                    selectedDevice.vulnerabilities.map(
                      (vulnerability, index) => (
                        <View
                          key={`vuln-${index}`}
                          style={styles.vulnerabilityItem}
                        >
                          <View style={styles.vulnerabilityHeader}>
                            <View style={styles.vulnerabilityTitleContainer}>
                              <View
                                style={[
                                  styles.severityIndicator,
                                  {
                                    backgroundColor: getSeverityColor(
                                      vulnerability.severity
                                    ),
                                  },
                                ]}
                              />
                              <Text style={styles.vulnerabilityTitle}>
                                {vulnerability.name}
                              </Text>
                            </View>
                            <Text
                              style={[
                                styles.severityText,
                                {
                                  color: getSeverityColor(
                                    vulnerability.severity
                                  ),
                                },
                              ]}
                            >
                              {vulnerability.severity.charAt(0).toUpperCase() +
                                vulnerability.severity.slice(1)}
                            </Text>
                          </View>

                          <Text style={styles.vulnerabilityDescription}>
                            {vulnerability.description}
                          </Text>

                          <Text style={styles.recommendationTitle}>
                            Recommendation:
                          </Text>
                          <Text style={styles.recommendationText}>
                            {vulnerability.recommendation}
                          </Text>

                          {vulnerability.cve && (
                            <Text style={styles.cveText}>
                              CVE: {vulnerability.cve}
                            </Text>
                          )}
                        </View>
                      )
                    )
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  summaryContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#EEEEEE",
    backgroundColor: "#F9F9F9",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
  resultsList: {
    // No max height here, allow content to flow naturally
  },
  deviceItem: {
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  securityScore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  deviceDetails: {
    marginBottom: 10,
  },
  deviceIp: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  deviceType: {
    fontSize: 13,
    color: "#888",
  },
  // New scan button styles
  scanButton: {
    backgroundColor: "#2196F3",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  vulnerabilityBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 10,
  },
  vulnerabilityInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  safeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 6,
  },
  vulnerabilityText: {
    fontSize: 13,
    color: "#F44336",
    fontWeight: "500",
  },
  safeText: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "500",
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  modalScroll: {
    maxHeight: "100%",
  },
  sectionContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  securityScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  scoreCircleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  scoreTextContainer: {
    flex: 1,
  },
  scoreRating: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  scoreDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  noVulnerabilitiesText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#4CAF50",
    textAlign: "center",
    padding: 10,
  },
  vulnerabilityItem: {
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
  },
  vulnerabilityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  vulnerabilityTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  vulnerabilityTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  vulnerabilityDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    lineHeight: 20,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 10,
  },
  cveText: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
  },
});

export default ResultsList;
