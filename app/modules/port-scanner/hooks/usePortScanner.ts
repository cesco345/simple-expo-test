// app/modules/port-scanner/hooks/usePortScanner.ts
import { useCallback, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import { DEFAULT_SCAN_PORTS, getServiceForPort } from "../constants/ports";
import { CurrentScan, NetworkInfo, ScanResult } from "../types";
import {
  batchIpAddresses,
  generateIPRange,
  scanPort,
  sleep,
} from "../utils/scanners";
// Import addLog directly, not through the hook
import { addLog } from "./useDebugLogs";

export function usePortScanner(networkInfo: NetworkInfo | null) {
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentScan, setCurrentScan] = useState<CurrentScan>(null);

  const shouldStopScanRef = useRef(false);

  const stopScan = useCallback(() => {
    addLog("Stopping scan...");
    shouldStopScanRef.current = true;
    setIsScanning(false);
    setCurrentScan(null);
  }, []);

  const startScan = useCallback(async () => {
    if (!networkInfo || !networkInfo.ip) {
      Alert.alert("Error", "No network connection detected");
      return;
    }

    try {
      shouldStopScanRef.current = false;
      setIsScanning(true);
      setScanResults([]);
      setProgress(0);
      addLog("Starting enhanced network scan with TCP sockets...");

      const ipAddress = networkInfo.ip;
      addLog(`Device IP: ${ipAddress}`);

      const ipRange = generateIPRange(ipAddress);
      addLog(`Generated ${ipRange.length} IPs to scan`);

      const portsToScan = DEFAULT_SCAN_PORTS;
      addLog(`Scanning ports: ${portsToScan.join(", ")}`);

      const totalOperations = ipRange.length * portsToScan.length;
      let completedOperations = 0;

      const batchSize = Platform.OS === "ios" ? 3 : 2;
      const batches = batchIpAddresses(ipRange, batchSize);
      addLog(`Created ${batches.length} batches for scanning`);

      const results: ScanResult[] = [];

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        if (shouldStopScanRef.current) {
          addLog("Scan stopped by user");
          break;
        }

        const batch = batches[batchIndex];
        addLog(`Processing batch ${batchIndex + 1}/${batches.length}`);

        for (const ip of batch) {
          if (shouldStopScanRef.current) break;

          for (const port of portsToScan) {
            if (shouldStopScanRef.current) break;

            setCurrentScan({ ip, port });

            try {
              const { isOpen, protocol } = await scanPort(ip, port);

              completedOperations++;
              const newProgress = Math.min(
                completedOperations / totalOperations,
                1
              );
              setProgress(newProgress);

              if (isOpen) {
                const service = getServiceForPort(port);
                addLog(
                  `Found open port: ${ip}:${port} (${service}) via ${protocol}`
                );

                const result = { ip, port, service, protocol, isOpen: true };
                results.push(result);
                setScanResults([...results]);
              }
            } catch (error) {
              completedOperations++;
              const newProgress = Math.min(
                completedOperations / totalOperations,
                1
              );
              setProgress(newProgress);

              addLog(`Error scanning ${ip}:${port}: ${error}`);
            }

            await sleep(15);
          }
        }

        if (!shouldStopScanRef.current && batchIndex < batches.length - 1) {
          await sleep(200);
        }
      }

      setIsScanning(false);
      setCurrentScan(null);
      addLog(`Scan completed. Found ${results.length} open ports.`);

      if (!shouldStopScanRef.current) {
        if (results.length > 0) {
          Alert.alert("Scan Complete", `Found ${results.length} open ports`);
        } else {
          Alert.alert("Scan Complete", "No open ports found on the network");
        }
      }
    } catch (error) {
      console.error("Error during scan:", error);
      addLog(`Error during scan: ${error}`);
      setIsScanning(false);
      setCurrentScan(null);
    }
  }, [networkInfo]);

  return {
    scanResults,
    isScanning,
    progress,
    currentScan,
    startScan,
    stopScan,
  };
}
