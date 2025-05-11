// app/modules/bluetooth-scanner/hooks/useBluetoothScanner.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  getBluetoothState,
  initializeBleManager,
  parseBluetoothDevice,
  scanForBluetoothDevices,
  sleep,
  stopBluetoothScan,
} from "../../../(tabs)/bluetooth-scanner/utils/scanners";
import { identifyDevice } from "../constants/device-database";
import { BLUETOOTH_VULNERABILITIES } from "../constants/vulnerabilities";
import {
  calculateSecurityScore,
  checkDeviceVulnerabilities,
} from "../constants/vulnerability-detector";
import {
  BluetoothDevice,
  BluetoothScanResult,
  BluetoothVulnerability,
  CurrentScan,
  NetworkInfo,
} from "../types/index";

// Import enhanced device detection functionality
import { DeviceScanner } from "../utils/device-scanner";

export function useBluetoothScanner(
  networkInfo: NetworkInfo | null,
  addLog: (message: string) => void
) {
  const [isScanning, setIsScanning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [bluetoothState, setBluetoothState] = useState<string>("unknown");
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDevice[]>(
    []
  );
  const [scanResults, setScanResults] = useState<BluetoothScanResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentScan, setCurrentScan] = useState<CurrentScan | null>(null);

  // Refs for managing scan state
  const shouldStopScanRef = useRef(false);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const deviceMapRef = useRef<Map<string, BluetoothDevice>>(new Map());

  // Reference to our enhanced device scanner
  const deviceScannerRef = useRef<DeviceScanner | null>(null);

  // Initialize device scanner
  useEffect(() => {
    if (!deviceScannerRef.current) {
      try {
        deviceScannerRef.current = new DeviceScanner();
        deviceScannerRef.current.setEventHandlers({
          onDeviceDiscovered: (deviceResult) => {
            // Optional: Log discovered devices from enhanced scanner
            if (deviceResult.signature) {
              addLog(
                `[DEBUG] Device identified as ${deviceResult.signature.manufacturer} ${deviceResult.signature.model}`
              );
            }
          },
          onScanError: (error) => {
            addLog(`[ERROR] Enhanced scanner error: ${error.message}`);
          },
        });
      } catch (error) {
        console.error("[ERROR] Failed to initialize device scanner:", error);
      }
    }
  }, []);

  // Initialize Bluetooth manager
  useEffect(() => {
    const initialize = async () => {
      try {
        const success = await initializeBleManager(addLog);
        if (success) {
          setIsInitialized(true);
          const state = await getBluetoothState();
          setBluetoothState(state);
          addLog(`[INFO] Bluetooth state: ${state}`);
        }
      } catch (error) {
        addLog(`[ERROR] useBluetoothScanner init error: ${error}`);
      }
    };

    initialize();

    // Cleanup on unmount
    return () => {
      if (isScanning) {
        stopScan();
      }

      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  // Debug logging to track state changes
  useEffect(() => {
    console.log(
      `[DEBUG] discoveredDevices changed: ${discoveredDevices.length} devices`
    );
  }, [discoveredDevices]);

  // Handle discovered device
  const handleDiscoveredDevice = useCallback((device: any) => {
    if (!device?.id) return;

    // Parse discovered device into our format
    const btDevice = parseBluetoothDevice(device);

    // Store in the ref map to ensure we don't lose devices
    deviceMapRef.current.set(btDevice.id, btDevice);

    // Update current scan info
    setCurrentScan({
      deviceId: btDevice.id,
      deviceName: btDevice.name,
      stage: "discovery",
    });

    // Add to discoveredDevices state
    setDiscoveredDevices((prev) => {
      const existingDeviceIndex = prev.findIndex((d) => d.id === btDevice.id);
      if (existingDeviceIndex === -1) {
        addLog(
          `[INFO] Discovered device: ${btDevice.name || "Unknown"} (${
            btDevice.id
          })`
        );
        return [...prev, btDevice];
      } else {
        // Update existing device with new RSSI and other data
        const updatedDevices = [...prev];
        updatedDevices[existingDeviceIndex] = {
          ...updatedDevices[existingDeviceIndex],
          rssi: btDevice.rssi,
          lastSeen: new Date(),
        };
        return updatedDevices;
      }
    });

    // Process with enhanced device scanner
    if (deviceScannerRef.current) {
      try {
        deviceScannerRef.current.processBluetoothDevice(btDevice);
      } catch (error) {
        // Silently handle errors from enhanced scanner - we'll fall back to basic detection
        console.log(`[DEBUG] Enhanced scanner error (non-critical): ${error}`);
      }
    }
  }, []);

  // Request necessary permissions
  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      try {
        let permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

        // Add Bluetooth permissions for Android 12+ (API 31+)
        if (Platform.Version >= 31) {
          permissions = [
            ...permissions,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ];
        }

        const granted = await PermissionsAndroid.requestMultiple(permissions);

        // Check if all permissions were granted
        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );

        addLog(
          `[INFO] Bluetooth permissions ${allGranted ? "granted" : "denied"}`
        );
        return allGranted;
      } catch (error) {
        addLog(`[ERROR] Error requesting permissions: ${error}`);
        return false;
      }
    }

    // iOS handles permissions through Info.plist
    return true;
  };

  // Start scanning with polling-based device discovery
  const startScan = useCallback(async () => {
    if (isScanning) {
      addLog("[INFO] Scan already in progress");
      return;
    }

    if (!isInitialized) {
      addLog("[INFO] Bluetooth manager not initialized, initializing now...");
      const success = await initializeBleManager(addLog);
      if (!success) {
        addLog("[ERROR] Failed to initialize Bluetooth manager");
        return;
      }
      setIsInitialized(true);
    }

    // Check if Bluetooth is on
    const state = await getBluetoothState();
    setBluetoothState(state);

    if (state !== "on") {
      addLog(`[ERROR] Bluetooth is not enabled (state: ${state})`);
      return;
    }

    // Request permissions
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      addLog("[ERROR] Insufficient permissions for Bluetooth scanning");
      return;
    }

    try {
      shouldStopScanRef.current = false;
      setIsScanning(true);
      setProgress(0);
      setDiscoveredDevices([]);
      setScanResults([]);
      deviceMapRef.current.clear();

      // Clear previous results in enhanced scanner
      if (deviceScannerRef.current) {
        try {
          // Clean up any existing scan in the enhanced scanner
          deviceScannerRef.current.cleanupScan();
        } catch (error) {
          console.error("[ERROR] Failed to cleanup enhanced scanner:", error);
          // Continue with the scan even if cleanup fails
        }
      }

      // Start scanning with our custom scanner
      const scanDuration = 15000; // 15 seconds

      const success = await scanForBluetoothDevices(
        scanDuration,
        handleDiscoveredDevice,
        addLog
      );

      if (!success) {
        setIsScanning(false);
        return;
      }

      // Set a timeout to complete the scan operation
      scanTimeoutRef.current = setTimeout(() => {
        // Scan should be complete now, analyze results
        addLog(
          `[DEBUG] Scan timeout reached with ${deviceMapRef.current.size} devices`
        );
        setIsScanning(false);

        // Ensure we have the latest devices from both the state and the ref
        const devicesToAnalyze = Array.from(deviceMapRef.current.values());
        addLog(`[DEBUG] Analyzing ${devicesToAnalyze.length} devices from map`);

        if (devicesToAnalyze.length > 0) {
          analyzeDevicesFromMap(devicesToAnalyze);
        } else {
          addLog("[INFO] No devices found to analyze");
          setProgress(1);
        }
      }, scanDuration + 1000);
    } catch (error) {
      addLog(`[ERROR] Failed to start scan: ${error}`);
      setIsScanning(false);
    }
  }, [isScanning, isInitialized, handleDiscoveredDevice]);

  // Stop scanning
  const stopScan = useCallback(() => {
    if (!isScanning) return;

    shouldStopScanRef.current = true;
    addLog("[INFO] Stopping Bluetooth scan...");

    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }

    stopBluetoothScan(addLog)
      .then(() => {
        setIsScanning(false);

        // Get devices from map
        const devicesToAnalyze = Array.from(deviceMapRef.current.values());
        addLog(
          `[DEBUG] Analyzing ${devicesToAnalyze.length} devices from map after manual stop`
        );

        if (devicesToAnalyze.length > 0) {
          analyzeDevicesFromMap(devicesToAnalyze);
        } else {
          addLog("[INFO] No devices found to analyze");
          setProgress(1);
        }
      })
      .catch(() => {
        setIsScanning(false);

        // Get devices from map
        const devicesToAnalyze = Array.from(deviceMapRef.current.values());
        addLog(
          `[DEBUG] Analyzing ${devicesToAnalyze.length} devices from map after error`
        );

        if (devicesToAnalyze.length > 0) {
          analyzeDevicesFromMap(devicesToAnalyze);
        } else {
          addLog("[INFO] No devices found to analyze");
          setProgress(1);
        }
      });
  }, [isScanning]);

  // Analyze devices from the ref map
  const analyzeDevicesFromMap = useCallback(
    async (devices: BluetoothDevice[]) => {
      if (devices.length === 0) {
        addLog("[INFO] No devices found to analyze");
        setProgress(1);
        return;
      }

      addLog(`[INFO] Analyzing ${devices.length} discovered devices...`);
      const results: BluetoothScanResult[] = [];

      // Process each device
      for (let i = 0; i < devices.length; i++) {
        const device = devices[i];

        // Update progress
        const progressValue = (i + 1) / devices.length;
        setProgress(progressValue);

        // Update current scan status
        setCurrentScan({
          deviceId: device.id,
          deviceName: device.name,
          stage: "vulnerability-check",
        });

        // Small delay to avoid blocking UI
        await sleep(50);

        try {
          // Try using enhanced detection first
          if (deviceScannerRef.current) {
            try {
              const enhancedResult = deviceScannerRef.current.getDeviceById(
                device.id
              );

              if (enhancedResult) {
                // Convert from enhanced device result to BluetoothScanResult format
                const enhancedVulnerabilities: BluetoothVulnerability[] =
                  enhancedResult.vulnerabilities.map((v) => ({
                    id: v.id,
                    name: v.name,
                    description: v.description || "",
                    severity: v.severity as any,
                    recommendation: v.recommendation || "",
                  }));

                // Create enhanced device with manufacturer info
                // Use the enhancedResult.device which should already have the manufacturer info
                // from the DeviceScanner processing
                let enhancedDevice = enhancedResult.device as BluetoothDevice;

                addLog(
                  `[INFO] Analyzed ${
                    enhancedDevice.name || "Unknown"
                  } using enhanced detection: ${
                    enhancedVulnerabilities.length
                  } vulnerabilities found`
                );

                // Add to results
                results.push({
                  device: enhancedDevice,
                  vulnerabilities: enhancedVulnerabilities,
                  securityScore: enhancedResult.securityScore,
                  isVulnerable: enhancedResult.isVulnerable,
                  vulnerabilityDetails: enhancedResult.vulnerabilityDetails,
                });

                // Skip to next device
                continue;
              }
            } catch (enhancedError) {
              addLog(`[ERROR] Enhanced detection failed: ${enhancedError}`);
              // Fall through to use original detection
            }
          }

          // Fallback to original detection if enhanced detection not available or failed
          // Identify device from our database
          const deviceSignature = identifyDevice(device);

          // Add log about device identification
          if (deviceSignature) {
            addLog(
              `[INFO] Identified device as ${deviceSignature.manufacturer} ${deviceSignature.model}`
            );

            // Update the device with identification info
            device.manufacturer = deviceSignature.manufacturer;
            device.model = deviceSignature.model;
          } else {
            addLog(
              `[INFO] Could not identify device ${device.name || "Unknown"} (${
                device.id
              })`
            );

            // Try to enhance with MAC manufacturer lookup directly
            try {
              if (device.id && device.id.length >= 8) {
                const macPrefix = device.id
                  .split(":")
                  .slice(0, 3)
                  .join("")
                  .toUpperCase();

                try {
                  // Try to import MAC_OUI_DATABASE
                  const {
                    MAC_OUI_DATABASE,
                  } = require("../constants/mac-oui-database");
                  if (MAC_OUI_DATABASE && MAC_OUI_DATABASE[macPrefix]) {
                    device.manufacturer = MAC_OUI_DATABASE[macPrefix];
                    addLog(
                      `[DEBUG] Enhanced device with manufacturer from MAC: ${device.manufacturer}`
                    );
                  }
                } catch (err) {
                  // Ignore errors in MAC lookup
                }
              }
            } catch (e) {
              // Ignore any MAC lookup errors
            }
          }

          // Check device for vulnerabilities
          const { vulnerabilityIds, vulnerabilityDetails } =
            checkDeviceVulnerabilities(device, deviceSignature);

          // Get full vulnerability objects
          const vulnerabilities: BluetoothVulnerability[] = vulnerabilityIds
            .map((id) => BLUETOOTH_VULNERABILITIES[id])
            .filter((v): v is BluetoothVulnerability => v !== undefined);

          // Calculate security score
          const securityScore = calculateSecurityScore(
            device,
            vulnerabilityIds
          );

          // Add to results - use the device object that now has manufacturer info
          results.push({
            device: device,
            vulnerabilities,
            securityScore,
            isVulnerable: vulnerabilities.length > 0,
            vulnerabilityDetails,
          });

          addLog(
            `[INFO] Analyzed ${device.name || "Unknown"}: ${
              vulnerabilities.length
            } vulnerabilities found`
          );
        } catch (error) {
          addLog(`[ERROR] Error analyzing device ${device.id}: ${error}`);

          // Add the device anyway with minimal information
          results.push({
            device,
            vulnerabilities: [],
            securityScore: 50, // Neutral score for error cases
            isVulnerable: false,
            vulnerabilityDetails: [`Error analyzing device: ${error}`],
          });
        }
      }

      // Update results and complete
      setScanResults(results);
      setProgress(1);
      setCurrentScan(null);

      const vulnerableCount = results.filter((r) => r.isVulnerable).length;
      addLog(
        `[INFO] Analysis completed. Found ${vulnerableCount} vulnerable devices out of ${results.length} total.`
      );
    },
    []
  );

  return {
    scanResults,
    isScanning,
    progress,
    currentScan,
    startScan,
    stopScan,
    bluetoothState,
    isInitialized,
  };
}

export default useBluetoothScanner;
