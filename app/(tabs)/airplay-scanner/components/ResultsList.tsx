// app/(tabs)/airplay-scanner/components/ResultsList.tsx
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { AirPlayDevice } from "../../../modules/airplay-scanner/types";

interface ResultsListProps {
  results: AirPlayDevice[];
}

export default function ResultsList({
  results = [], // Default to empty array to prevent undefined errors
}: ResultsListProps) {
  // Safely check if we have results
  if (!results || results.length === 0) {
    return null;
  }

  const renderResultItem = ({ item }: { item: AirPlayDevice }) => {
    return (
      <View style={styles.resultItem}>
        <View style={styles.resultHeader}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text style={styles.deviceAddress}>
            {item.ip}:{item.port}
          </Text>
        </View>

        <View style={styles.deviceDetails}>
          {item.manufacturer && (
            <Text style={styles.detailText}>
              Manufacturer: {item.manufacturer}
            </Text>
          )}

          {item.model && (
            <Text style={styles.detailText}>Model: {item.model}</Text>
          )}

          {item.deviceType && (
            <Text style={styles.detailText}>Type: {item.deviceType}</Text>
          )}

          {item.isVulnerable && (
            <View style={styles.vulnerabilityContainer}>
              <Text style={styles.vulnerabilityTitle}>
                Vulnerability detected!
              </Text>

              {item.vulnerabilityDetails &&
                item.vulnerabilityDetails.length > 0 && (
                  <View style={styles.vulnerabilityDetails}>
                    {item.vulnerabilityDetails.map((detail, index) => (
                      <Text key={index} style={styles.vulnerabilityText}>
                        • {detail}
                      </Text>
                    ))}
                  </View>
                )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => item.id}
      renderItem={renderResultItem}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 8,
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
  deviceAddress: {
    fontSize: 14,
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
  vulnerabilityDetails: {
    marginTop: 2,
  },
  vulnerabilityText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
});
