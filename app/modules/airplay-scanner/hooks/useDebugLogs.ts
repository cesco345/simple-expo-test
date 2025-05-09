// app/modules/airplay-scanner/hooks/useDebugLogs.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

// This hook must match the interface expected by the existing DebugLogs component
export function useDebugLogs() {
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<string[]>([]);
  const pendingUpdatesRef = useRef<boolean>(false);
  const appState = useRef(AppState.currentState);

  // Function to force UI update with latest logs
  const updateLogsState = useCallback(() => {
    if (logsRef.current.length > 0) {
      setLogs([...logsRef.current]);
      pendingUpdatesRef.current = false;
    }
  }, []);

  // Add log with immediate UI update
  const addLog = useCallback((message: string) => {
    // For console debugging, add a timestamp and category
    console.log(`[INFO] ${message}`);

    // Update the ref immediately
    logsRef.current.push(message);

    // Limit the number of logs to prevent memory issues
    if (logsRef.current.length > 1000) {
      logsRef.current = logsRef.current.slice(-1000);
    }

    // Mark that we have pending updates
    pendingUpdatesRef.current = true;

    // Update the state immediately to ensure UI refresh
    setLogs([...logsRef.current]);
  }, []);

  // Clear logs
  const clearLogs = useCallback(() => {
    logsRef.current = [];
    setLogs([]);
    pendingUpdatesRef.current = false;
  }, []);

  // Set up a regular update interval to ensure logs are displayed
  useEffect(() => {
    // Update logs every 250ms if there are pending updates
    const intervalId = setInterval(() => {
      if (pendingUpdatesRef.current) {
        updateLogsState();
      }
    }, 250);

    // Handle app state changes
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // When app comes to foreground, force update
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        pendingUpdatesRef.current
      ) {
        updateLogsState();
      }
      appState.current = nextAppState;
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [updateLogsState]);

  // Return the interface expected by the component
  return {
    logs,
    addLog,
    clearLogs,
  };
}

export default {};
