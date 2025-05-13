// app/(tabs)/chromecast-scanner/components/DebugLogs.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DebugLogsProps {
  logs: string[];
  clearLogs: () => void;
}

const DebugLogs: React.FC<DebugLogsProps> = ({ logs, clearLogs }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Colorize log lines based on content
  const getLogColor = (log: string) => {
    const logLower = log.toLowerCase();
    if (logLower.includes("error")) {
      return "#F44336"; // Red for errors
    } else if (logLower.includes("warn")) {
      return "#FF9800"; // Orange for warnings
    } else if (logLower.includes("info")) {
      return "#2196F3"; // Blue for info
    } else if (logLower.includes("debug")) {
      return "#9E9E9E"; // Gray for debug
    } else if (logLower.includes("discovered") || logLower.includes("found")) {
      return "#4CAF50"; // Green for discoveries
    } else {
      return "#333"; // Default color
    }
  };

  // Only show log message part after timestamp
  const formatLog = (log: string) => {
    const parts = log.split(": ");
    if (parts.length > 1) {
      // First part is timestamp, second part is message
      return parts.slice(1).join(": ");
    }
    return log;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpanded}>
        <Text style={styles.title}>Debug Logs</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearLogs}>
            <FontAwesome name="trash-o" size={16} color="#F44336" />
          </TouchableOpacity>
          <FontAwesome
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="#007AFF"
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.logsContainer}>
          {logs.length === 0 ? (
            <Text style={styles.emptyText}>No logs available</Text>
          ) : (
            <View style={styles.logsList}>
              {/* Display only the last 100 logs for performance */}
              {logs.slice(-100).map((item, index) => (
                <Text
                  key={`log-${index}`}
                  style={[styles.logItem, { color: getLogColor(item) }]}
                  numberOfLines={2}
                >
                  {formatLog(item)}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearButton: {
    marginRight: 15,
    padding: 5,
  },
  logsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 10,
  },
  logsList: {
    maxHeight: 300,
  },
  logItem: {
    fontSize: 12,
    fontFamily: "monospace",
    paddingVertical: 3,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    paddingVertical: 10,
  },
});

export default DebugLogs;
