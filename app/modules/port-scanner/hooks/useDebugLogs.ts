// app/modules/port-scanner/hooks/useDebugLogs.ts
import { useEffect, useState } from "react";

// Create a singleton debug logs array to share between hooks
export const debugLogs: string[] = [];

export function addLog(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  debugLogs.unshift(`${timestamp}: ${message}`);
  // Keep only the latest 100 logs
  if (debugLogs.length > 100) {
    debugLogs.pop();
  }
  console.log(message);
}

export function useDebugLogs() {
  const [logs, setLogs] = useState<string[]>([...debugLogs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs([...debugLogs]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => {
    debugLogs.length = 0;
    setLogs([]);
  };

  return { logs, clearLogs, addLog };
}

export default useDebugLogs;
