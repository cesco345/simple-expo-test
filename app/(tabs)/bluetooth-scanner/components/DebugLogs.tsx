import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DebugLogsProps {
  logs: string[];
  onClearLogs: () => void;
}

export default function DebugLogs({ logs, onClearLogs }: DebugLogsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Debug Logs</Text>
        <TouchableOpacity onPress={onClearLogs} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.logsContainer}>
        {logs.length === 0 ? (
          <Text style={styles.emptyText}>No logs yet.</Text>
        ) : (
          logs.map((log, index) => (
            <Text key={index} style={styles.logLine}>
              {log}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  clearButtonText: {
    fontSize: 12,
    color: "#333",
  },
  logsContainer: {
    maxHeight: 200,
    padding: 8,
  },
  logLine: {
    fontSize: 11,
    color: "#555",
    marginBottom: 2,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  emptyText: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 10,
  },
});
