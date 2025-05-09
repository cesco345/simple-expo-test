// app/(tabs)/airplay-scanner/components/DebugLogs.tsx
import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DebugLogsProps {
  logs: string[];
  onClearLogs?: () => void;
}

export default function DebugLogs({ logs, onClearLogs }: DebugLogsProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (scrollViewRef.current && logs.length > 0) {
      // Delay slightly to ensure content is rendered
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [logs]);

  // Function to determine log line style based on content
  const getLogStyle = (log: string) => {
    if (log.includes("SUCCESS") || log.includes("Found device")) {
      return styles.successLog;
    } else if (log.includes("ERROR") || log.includes("error")) {
      return styles.errorLog;
    } else if (log.includes("===")) {
      return styles.sectionHeader;
    } else if (
      log.includes("Device details") ||
      log.includes("Security note")
    ) {
      return styles.deviceInfoLog;
    } else if (log.includes("%")) {
      return styles.progressLog;
    } else {
      return styles.normalLog;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Logs</Text>
        {onClearLogs && (
          <TouchableOpacity onPress={onClearLogs} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
      >
        {logs.length === 0 ? (
          <Text style={styles.emptyLogs}>
            No logs yet. Start a scan to see activity.
          </Text>
        ) : (
          logs.map((log, index) => (
            <Text key={index} style={[styles.logText, getLogStyle(log)]}>
              {log}
            </Text>
          ))
        )}

        {/* Add extra padding at bottom for better scrolling */}
        <View style={styles.scrollPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#0066cc",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  clearButton: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  logText: {
    fontSize: 12,
    marginBottom: 2,
    fontFamily: "monospace",
  },
  normalLog: {
    color: "#333333",
  },
  successLog: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
  errorLog: {
    color: "#c62828",
    fontWeight: "bold",
  },
  sectionHeader: {
    color: "#1565c0",
    fontWeight: "bold",
    marginTop: 3,
    marginBottom: 3,
  },
  deviceInfoLog: {
    color: "#6a1b9a",
    fontStyle: "italic",
  },
  progressLog: {
    color: "#00796b",
    fontWeight: "bold",
  },
  emptyLogs: {
    fontStyle: "italic",
    color: "#757575",
    textAlign: "center",
    marginTop: 20,
  },
  scrollPadding: {
    height: 40, // Extra space at the bottom
  },
});
