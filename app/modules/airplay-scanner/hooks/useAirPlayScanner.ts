// app/modules/airplay-scanner/hooks/useAirPlayScanner.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import {
  batchIpAddresses,
  buildIpAddress,
  checkAirPlayService,
  cleanupZeroconf,
  generateIpRange,
  getZeroconfInstance,
  processIpScanDevice,
  processMdnsService,
  resetZeroconfErrors,
  sleep,
  startZeroconfScan,
} from "../../../(tabs)/airplay-scanner/utils/scanners";
import {
  AIRPLAY_PORTS,
  AirPlayDevice,
  CurrentScan,
  DEFAULT_SCAN_CONFIG,
  NetworkInfo,
} from "../types";

export function useAirPlayScanner(
  networkInfo: NetworkInfo | null,
  addLog: (message: string) => void
) {
  const [scanResults, setScanResults] = useState<AirPlayDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentScan, setCurrentScan] = useState<CurrentScan | null>(null);

  // Store devices in a ref to avoid state update issues
  const devicesRef = useRef<AirPlayDevice[]>([]);
  const scanningRef = useRef(false);

  // Add a device to results with proper tracking and enhanced logging
  const addDeviceToResults = useCallback(
    (device: AirPlayDevice) => {
      // Log detailed device information
      addLog(`Found device: ${device.name} at ${device.ip}:${device.port}`);

      // Log manufacturer and model if available
      if (device.manufacturer || device.model) {
        addLog(
          `Device details: ${device.manufacturer || "Unknown"} ${
            device.model || ""
          }`
        );
      }

      // Log device type if available
      if (device.deviceType) {
        addLog(`Device type: ${device.deviceType}`);
      }

      // Log vulnerability information if available
      if (
        device.isVulnerable &&
        device.vulnerabilityDetails &&
        device.vulnerabilityDetails.length > 0
      ) {
        addLog(`Security note: Device may have vulnerabilities:`);
        device.vulnerabilityDetails.forEach((detail) => {
          addLog(`  - ${detail}`);
        });
      }

      // Update the ref immediately to ensure consistent state
      const existingIndex = devicesRef.current.findIndex(
        (d) => d.id === device.id
      );
      if (existingIndex >= 0) {
        // Update existing device
        devicesRef.current[existingIndex] = {
          ...devicesRef.current[existingIndex],
          ...device,
          lastSeen: new Date(),
        };
      } else {
        // Add new device
        devicesRef.current.push(device);
      }

      // Update state for UI
      setScanResults([...devicesRef.current]);
    },
    [addLog]
  );

  // Start mDNS scanning with platform-specific handling
  const startMdnsScan = useCallback(() => {
    addLog("==== STARTING MDNS SCAN ====");

    // For iOS, be more cautious about mDNS
    if (Platform.OS === "ios") {
      addLog("Initializing mDNS scan with iOS optimizations");

      // Skip mDNS completely if on iOS simulator (known to have issues)
      if (__DEV__ && Platform.OS === "ios") {
        try {
          const deviceName = Platform.constants?.uiDeviceInfo?.name || "";
          if (deviceName.includes("Simulator")) {
            addLog(
              "[INFO] Skipping mDNS scan on iOS Simulator - not supported"
            );
            return () => {};
          }
        } catch (error) {
          // Continue even if can't detect simulator
        }
      }

      // Reset error counter for new scan
      resetZeroconfErrors();

      // Use the improved Zeroconf handling with error limits
      const success = startZeroconfScan(addLog);

      if (!success) {
        addLog(
          "[INFO] Could not start mDNS scan, falling back to IP scan only"
        );
        return () => {};
      }

      // Set up listener for when Zeroconf succeeds
      const zeroconf = getZeroconfInstance();
      zeroconf.on("resolved", (service) => {
        if (scanningRef.current) {
          addLog(`mDNS discovered service: ${service.name}`);

          const device = processMdnsService(service);
          if (device) {
            addLog(`SUCCESS! Found AirPlay device via mDNS: ${device.name}`);
            addDeviceToResults(device);
          }
        }
      });

      return () => {
        cleanupZeroconf();
      };
    } else {
      // For Android, use normal mDNS initialization
      addLog("Initializing Zeroconf for service discovery");

      const zeroconf = getZeroconfInstance();
      let discoveredServices = 0;

      // Set up listeners
      zeroconf.on("resolved", (service) => {
        discoveredServices++;

        addLog(
          `mDNS discovered service #${discoveredServices}: ${service.name} (${
            service.type || "unknown type"
          })`
        );

        if (service.host && service.port) {
          addLog(`Service details: ${service.host}:${service.port}`);
        }

        const device = processMdnsService(service);

        if (device) {
          addLog(
            `SUCCESS! Found AirPlay device via mDNS: ${device.name} at ${device.ip}:${device.port}`
          );
          addDeviceToResults(device);
        }
      });

      zeroconf.on("error", (error) => {
        if (error) {
          addLog(`Zeroconf error: ${error}`);
        }
      });

      // Start scanning
      try {
        addLog("Starting scan for _airplay._tcp. services");
        zeroconf.scan("_airplay._tcp.", "local.");

        setTimeout(() => {
          if (scanningRef.current) {
            addLog("Starting additional scan for _raop._tcp. services");
            try {
              zeroconf.scan("_raop._tcp.", "local.");
            } catch (error) {
              // Silently continue
            }
          }
        }, 1000);

        addLog("mDNS scanning started successfully, waiting for devices...");
      } catch (error) {
        addLog(`Error starting mDNS: ${error}`);
      }
    }

    return () => {
      try {
        cleanupZeroconf();
      } catch (error) {
        // Silently handle errors during cleanup
      }
    };
  }, [addLog, addDeviceToResults]);

  // Scan a single IP address
  const scanIpAddress = useCallback(
    async (ip: string, addLog: (message: string) => void) => {
      addLog(`Scanning IP: ${ip}`);

      for (const port of AIRPLAY_PORTS) {
        if (!scanningRef.current) break;

        setCurrentScan({ ip, port });

        try {
          const deviceInfo = await checkAirPlayService(ip, port, addLog);

          if (deviceInfo) {
            addLog(`Success! Found AirPlay service at ${ip}:${port}`);

            const device = processIpScanDevice(ip, port, deviceInfo);
            addLog(`Processed device: ${device.name} at ${ip}:${port}`);

            // Ensure device is added correctly to results
            addDeviceToResults(device);
          }
        } catch (error) {
          addLog(`Error scanning ${ip}:${port}: ${error}`);
        }
      }
    },
    [addDeviceToResults]
  );

  // Start IP range scanning
  const startIpScan = useCallback(async () => {
    if (!networkInfo?.baseIp) {
      addLog("No network info available for IP scanning");
      return;
    }

    addLog("==== STARTING IP SCAN ====");
    addLog(
      `Network information: Base IP: ${networkInfo.baseIp}, Your IP: ${
        networkInfo.ip || "Unknown"
      }`
    );

    const baseIp = networkInfo.baseIp;
    const myLastOctet = networkInfo.ip
      ? parseInt(networkInfo.ip.split(".")[3])
      : undefined;

    if (myLastOctet) {
      addLog(`Your device is at last octet: ${myLastOctet}`);
    }

    // Generate IP range to scan
    const priorityAddresses = DEFAULT_SCAN_CONFIG.priorityAddresses;
    const fullScan = DEFAULT_SCAN_CONFIG.scanFullRange;

    addLog(`Scan configuration: Full scan: ${fullScan ? "Yes" : "No"}`);
    addLog(`Priority addresses: ${priorityAddresses.join(", ")}`);

    const addresses = generateIpRange(
      baseIp,
      priorityAddresses,
      fullScan,
      myLastOctet
    );

    addLog(`Generated IP range with ${addresses.length} addresses to scan`);

    // First scan priority addresses
    if (priorityAddresses.length > 0) {
      addLog(
        `==== SCANNING ${priorityAddresses.length} PRIORITY ADDRESSES ====`
      );

      for (const lastOctet of priorityAddresses) {
        if (!scanningRef.current) {
          addLog("Scan interrupted - stopping priority scan");
          break;
        }

        const ip = buildIpAddress(baseIp, lastOctet);
        addLog(`Scanning priority IP: ${ip}`);

        await scanIpAddress(ip, addLog);
      }

      addLog("==== COMPLETED PRIORITY ADDRESS SCAN ====");
    }

    // Continue if still scanning
    if (!scanningRef.current) {
      addLog("Scan interrupted - stopping after priority addresses");
      return;
    }

    // Filter out already scanned addresses
    const remainingAddresses = addresses.filter(
      (addr) => !priorityAddresses.includes(addr)
    );

    addLog(`Remaining addresses to scan: ${remainingAddresses.length}`);

    // Create batches for scanning - larger batches on iOS for better performance
    const batchSize = Platform.OS === "ios" ? 10 : 5;
    const batches = batchIpAddresses(remainingAddresses, batchSize);

    addLog(
      `Created ${batches.length} batches for scanning (batch size: ${batchSize})`
    );

    // Process each batch
    addLog("==== STARTING BATCH SCANNING ====");

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      if (!scanningRef.current) {
        addLog("Scan interrupted - stopping batch scan");
        break;
      }

      const batch = batches[batchIndex];
      addLog(`Processing batch ${batchIndex + 1}/${batches.length}`);

      // Process batch in parallel
      await Promise.all(
        batch.map(async (lastOctet) => {
          if (!scanningRef.current) return;

          const ip = buildIpAddress(baseIp, lastOctet);
          await scanIpAddress(ip, addLog);
        })
      );

      // Update progress
      const newProgress = (batchIndex + 1) / batches.length;
      setProgress(newProgress);
      addLog(`Scan progress: ${Math.round(newProgress * 100)}%`);

      // Small pause between batches
      if (scanningRef.current && batchIndex < batches.length - 1) {
        await sleep(100);
      }
    }

    // Log results with count from ref for accuracy
    addLog(`==== IP SCAN COMPLETED ====`);
    addLog(`Scan results: Found ${devicesRef.current.length} AirPlay devices`);
  }, [networkInfo, addLog, scanIpAddress]);

  // Start scanning
  const startScan = useCallback(() => {
    if (isScanning || scanningRef.current) return;

    if (!networkInfo?.ip) {
      addLog("No network information available");
      return;
    }

    addLog("==== STARTING AIRPLAY DEVICE SCAN ====");
    addLog(
      `Network info: IP: ${networkInfo.ip}, Subnet: ${
        networkInfo.subnet || "Unknown"
      }`
    );
    addLog(
      `Base IP: ${networkInfo.baseIp || "Unknown"}, Gateway: ${
        networkInfo.gateway || "Unknown"
      }`
    );

    // Reset state
    devicesRef.current = [];
    setScanResults([]);
    setIsScanning(true);
    setProgress(0);
    scanningRef.current = true;

    // Start mDNS scanning
    const stopMdnsScan = startMdnsScan();

    // Start IP scanning without delaying
    addLog("Starting IP scanning");
    startIpScan().finally(() => {
      // Complete scan with enhanced summary
      addLog("==== SCAN COMPLETED ====");
      addLog(
        `Final results: Found ${devicesRef.current.length} AirPlay devices`
      );

      // Add a detailed summary of all found devices
      if (devicesRef.current.length > 0) {
        addLog("==== DEVICE SUMMARY ====");
        devicesRef.current.forEach((device, index) => {
          addLog(
            `${index + 1}. ${device.name} (${
              device.manufacturer || "Unknown"
            } ${device.model || "Unknown"}) at ${device.ip}:${device.port}`
          );

          // Add vulnerability information if available
          if (
            device.isVulnerable &&
            device.vulnerabilityDetails &&
            device.vulnerabilityDetails.length > 0
          ) {
            device.vulnerabilityDetails.forEach((detail) => {
              addLog(`   * ${detail}`);
            });
          }

          // Add firmware/version if available
          if (device.version) {
            addLog(`   * Firmware: ${device.version}`);
          }

          // Add additional device-specific information
          if (device.deviceType) {
            addLog(`   * Type: ${device.deviceType}`);
          }
        });
      }

      // Update state to reflect we're done
      scanningRef.current = false;
      setIsScanning(false);

      // Ensure final device list is accurate in state
      setScanResults([...devicesRef.current]);
    });

    return () => {
      if (stopMdnsScan) {
        stopMdnsScan();
      }
    };
  }, [networkInfo, isScanning, addLog, startMdnsScan, startIpScan]);

  // Stop scanning
  const stopScan = useCallback(() => {
    addLog("==== STOPPING SCAN ====");
    addLog(
      `Scan interrupted by user. Found ${devicesRef.current.length} devices so far.`
    );

    // Update scan state
    scanningRef.current = false;
    setIsScanning(false);

    // Clean up Zeroconf using the improved function
    cleanupZeroconf();
  }, [addLog]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clean up scanning state
      scanningRef.current = false;

      // Clean up Zeroconf using the improved function
      cleanupZeroconf();
    };
  }, []);

  return {
    scanResults,
    isScanning,
    progress,
    currentScan,
    startScan,
    stopScan,
  };
}

export default {};
