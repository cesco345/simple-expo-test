// app/(tabs)/port-scanner/components/ResultsList.tsx
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
// Fixed import paths
import { getVulnerabilitiesForPort } from "../../../modules/port-scanner/constants/vulnerabilities";
import { ScanResult } from "../../../modules/port-scanner/types";

interface ResultsListProps {
  scanResults: ScanResult[];
  isScanning: boolean;
}

export default function ResultsList({
  scanResults,
  isScanning,
}: ResultsListProps) {
  const renderResultItem = ({ item }: { item: ScanResult }) => {
    const vulnerabilities = getVulnerabilitiesForPort(item.port);

    return (
      <View style={styles.resultItem}>
        <View style={styles.resultHeader}>
          <Text style={styles.ipText}>{item.ip}</Text>
          <Text
            style={[
              styles.protocolBadge,
              item.protocol === "TCP"
                ? styles.tcpProtocol
                : styles.httpProtocol,
            ]}
          >
            {item.protocol}
          </Text>
        </View>
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
                <Text style={styles.vulnerabilityName}>{vuln.name}</Text>
                <Text style={styles.vulnerabilityDesc}>{vuln.description}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noVulnerabilities}>No known vulnerabilities</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultsTitle}>
        {scanResults.length > 0
          ? `Found ${scanResults.length} Open Ports`
          : isScanning
          ? "Scanning for open ports..."
          : "No results yet"}
      </Text>

      <FlatList
        data={scanResults}
        keyExtractor={(item, index) => `${item.ip}-${item.port}-${index}`}
        renderItem={renderResultItem}
        style={styles.resultsList}
        contentContainerStyle={styles.resultsContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
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
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  ipText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  protocolBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: "white",
    overflow: "hidden",
  },
  tcpProtocol: {
    backgroundColor: "#2196F3",
  },
  httpProtocol: {
    backgroundColor: "#4CAF50",
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
});
