// app/(tabs)/port-scanner/components/DebugLogs.tsx
import React from "react";
import {
  FlatList,
  Platform,
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
    <View style={styles.logsContainer}>
      <View style={styles.logsHeader}>
        <Text style={styles.logsTitle}>Debug Logs</Text>
        <TouchableOpacity onPress={onClearLogs} disabled={logs.length === 0}>
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
        renderItem={({ item }) => <Text style={styles.logItem}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
        style={styles.logsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
