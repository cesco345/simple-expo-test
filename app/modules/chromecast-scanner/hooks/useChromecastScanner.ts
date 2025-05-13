// app/modules/chromecast-scanner/hooks/useChromecastScanner.ts - Improved isNonChromecast check
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import {
  ChromecastDevice,
  ChromecastScanResult,
  CurrentScan,
  NetworkInfo,
} from "../types";
import DeviceScanner from "../utils/device-scanner";
import { addLog } from "./useDebugLogs";

export function useChromecastScanner(networkInfo: NetworkInfo | null) {
  const [isScanning, setIsScanning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [scanResults, setScanResults] = useState<ChromecastScanResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentScan, setCurrentScan] = useState<CurrentScan | null>(null);

  // Refs for managing scan state
  const deviceScannerRef = useRef<DeviceScanner | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldStopScanRef = useRef(false);
  const ipScanStarted = useRef(false);
  const mdnsScanStarted = useRef(false);
  const ipScanCompleted = useRef(false);

  // Initialize Chromecast scanner
  useEffect(() => {
    const initialize = async () => {
      try {
        addLog("[INFO] Initializing Chromecast scanner...");

        // Initialize device scanner
        if (!deviceScannerRef.current) {
          addLog("[DEBUG] Creating DeviceScanner instance");
          deviceScannerRef.current = new DeviceScanner();
          setEventHandlers();
        }

        setIsInitialized(true);
        addLog("[INFO] Chromecast scanner initialized successfully");
      } catch (error) {
        addLog(`[ERROR] Failed to initialize Chromecast scanner: ${error}`);
      }
    };

    initialize();

    // Cleanup on unmount
    return () => {
      cleanupScan();
    };
  }, []);

  // Set up event handlers for device scanner
  const setEventHandlers = useCallback(() => {
    if (!deviceScannerRef.current) return;

    deviceScannerRef.current.setEventHandlers({
      onScanStart: () => {
        addLog("[INFO] Chromecast scan started");
      },
      onDeviceDiscovered: (device: ChromecastScanResult) => {
        addLog(
          `[INFO] Discovered device: ${device.device.name || "Unknown"} (${
            device.device.ipAddress
          })`
        );

        // Add the device to scan results immediately for better feedback
        setScanResults((prev) => {
          // Check if the device already exists
          const exists = prev.some((d) => d.device.id === device.device.id);
          if (exists) return prev;
          return [...prev, device];
        });
      },
      onScanComplete: (devices: ChromecastScanResult[]) => {
        setScanResults(devices);
        setProgress(1);
        setIsScanning(false);
        addLog(`[INFO] Scan completed with ${devices.length} devices found`);
      },
      onScanError: (error: Error) => {
        addLog(`[ERROR] Scan error: ${error.message}`);
        // Don't stop scanning on error, just log it
      },
      onScanStatusChange: (status: CurrentScan | null) => {
        setCurrentScan(status);
        // Update progress based on scan stage
        if (status) {
          switch (status.stage) {
            case "discovery":
              setProgress(0.3);
              break;
            case "analysis":
              setProgress(0.6);
              break;
            case "vulnerability-check":
              setProgress(0.9);
              break;
          }
        }
      },
    });
  }, []);

  // Start the scan process
  const startScan = useCallback(async () => {
    if (isScanning) {
      addLog("[INFO] Scan already in progress");
      return;
    }

    if (!isInitialized) {
      addLog("[INFO] Scanner not initialized, initializing now...");
      try {
        if (!deviceScannerRef.current) {
          deviceScannerRef.current = new DeviceScanner();
          setEventHandlers();
        }
        setIsInitialized(true);
      } catch (error) {
        addLog(`[ERROR] Failed to initialize scanner: ${error}`);
        return;
      }
    }

    if (!networkInfo) {
      addLog("[ERROR] Network info not available");
      return;
    }

    try {
      shouldStopScanRef.current = false;
      ipScanStarted.current = false;
      ipScanCompleted.current = false;
      mdnsScanStarted.current = false;
      setIsScanning(true);
      setProgress(0.1);
      setScanResults([]);

      // Start with discovery stage
      setCurrentScan({
        stage: "discovery",
      });

      addLog("[INFO] Network details requested");
      addLog(`[INFO] Network Info: ${JSON.stringify(networkInfo)}`);

      // Start device scan through our device scanner
      if (deviceScannerRef.current) {
        // Longer timeout (30 seconds) to ensure thorough scanning
        deviceScannerRef.current.startScan(30000);
        mdnsScanStarted.current = true;
      }

      // Start IP scanning in the background - with a full subnet range
      startIpScan(networkInfo);

      // Set timeout to check for scan completion
      scanTimeoutRef.current = setTimeout(() => {
        // If we're still scanning after the timeout, stop the scan
        if (isScanning && !shouldStopScanRef.current) {
          addLog("[INFO] Scan timeout reached, stopping scan");
          stopScan();
        }
      }, 35000); // 35 seconds timeout for total scan
    } catch (error) {
      addLog(`[ERROR] Failed to start scan: ${error}`);
      setIsScanning(false);
      setProgress(0);
    }
  }, [isScanning, isInitialized, networkInfo]);

  // Scan IP addresses directly for Chromecast devices
  const startIpScan = async (networkInfo: NetworkInfo) => {
    ipScanStarted.current = true;
    addLog(`[INFO] Starting direct IP scan for Chromecast devices`);

    try {
      const baseIp =
        networkInfo.baseIp ||
        networkInfo.ip.substring(0, networkInfo.ip.lastIndexOf("."));
      let ownLastOctet = 1;
      try {
        // Get own last octet
        ownLastOctet = parseInt(networkInfo.ip.split(".")[3]) || 1;
      } catch (e) {
        addLog(`[WARN] Error parsing IP address: ${e}`);
      }

      // Create a range covering most of the subnet, but prioritize likely addresses
      const priorityAddresses = [
        1, 2, 50, 100, 101, 102, 150, 154, 170, 180, 200, 254, 123, 185,
      ]; // Common router and device addresses

      // Scan priority addresses first
      addLog(
        `[INFO] ==== SCANNING ${priorityAddresses.length} PRIORITY ADDRESSES ====`
      );
      for (const octet of priorityAddresses) {
        if (shouldStopScanRef.current) break;

        const ipAddress = `${baseIp}.${octet}`;
        addLog(`[INFO] Scanning priority IP: ${ipAddress}`);
        await scanIpAddress(ipAddress);

        // Update progress slightly for feedback
        setProgress((prev) => Math.min(0.5, prev + 0.02));
      }

      addLog(`[INFO] ==== COMPLETED PRIORITY ADDRESS SCAN ====`);

      // Create an efficient IP range around the device's IP for secondary scan
      let scanList: number[] = [];

      // Add some specific octets that are often used for Chromecast devices
      const chromecastCommonOctets = [
        5, 15, 25, 35, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240,
      ];

      // Expand out from our device's IP in both directions
      for (let i = -15; i <= 15; i += 5) {
        const octet = ownLastOctet + i;
        if (
          octet >= 1 &&
          octet <= 254 &&
          !priorityAddresses.includes(octet) &&
          !scanList.includes(octet)
        ) {
          scanList.push(octet);
        }
      }

      // Add the specific Chromecast octets if they're not already included
      for (const octet of chromecastCommonOctets) {
        if (
          !scanList.includes(octet) &&
          !priorityAddresses.includes(octet) &&
          octet >= 1 &&
          octet <= 254
        ) {
          scanList.push(octet);
        }
      }

      // Remove any duplicates and sort
      scanList = [...new Set(scanList)].sort((a, b) => a - b);

      addLog(`[INFO] Remaining addresses to scan: ${scanList.length}`);

      // Batch scanning for efficiency
      const batchSize = Platform.OS === "ios" ? 5 : 5;
      const batches = Math.ceil(scanList.length / batchSize);

      addLog(
        `[INFO] Created ${batches} batches for scanning (batch size: ${batchSize})`
      );
      addLog(`[INFO] ==== STARTING BATCH SCANNING ====`);

      for (let i = 0; i < batches; i++) {
        if (shouldStopScanRef.current) break;

        const start = i * batchSize;
        const end = Math.min((i + 1) * batchSize, scanList.length);
        const batch = scanList.slice(start, end);

        addLog(`[INFO] Processing batch ${i + 1}/${batches}`);

        // Parallel scan of each batch
        await Promise.all(
          batch.map(async (octet) => {
            const ipAddress = `${baseIp}.${octet}`;
            addLog(`[INFO] Scanning IP: ${ipAddress}`);
            return scanIpAddress(ipAddress);
          })
        );

        // Update progress
        const scanProgress = 0.5 + 0.4 * ((i + 1) / batches);
        setProgress(scanProgress);
        addLog(`[INFO] Scan progress: ${Math.round(scanProgress * 100)}%`);
      }

      // Indicate IP scan completed
      ipScanCompleted.current = true;
      addLog(`[INFO] ==== IP SCAN COMPLETED ====`);

      // Force progress to 100% after IP scan completed
      setProgress(1.0);
      addLog(`[INFO] Scan progress: 100%`);

      // Ensure we complete the scan after a delay to process any last results
      setTimeout(() => {
        if (isScanning && !shouldStopScanRef.current) {
          addLog("[INFO] Forcing scan completion after IP scan");
          stopScan();
        }
      }, 1000);
    } catch (error) {
      addLog(`[ERROR] Error during IP scan: ${error}`);
      // Still mark IP scan as completed even if there was an error
      ipScanCompleted.current = true;

      // Force scan completion after error
      setTimeout(() => {
        if (isScanning && !shouldStopScanRef.current) {
          addLog("[INFO] Forcing scan completion after IP scan error");
          stopScan();
        }
      }, 1000);
    }
  };

  // Check a specific IP address and common Chromecast ports
  const scanIpAddress = async (ipAddress: string) => {
    if (shouldStopScanRef.current) return;

    try {
      // Try the most common Chromecast ports
      await Promise.all([
        checkIpAndPort(ipAddress, 8008),
        checkIpAndPort(ipAddress, 8009),
      ]);

      // After a small delay, also check less common ports
      setTimeout(async () => {
        if (!shouldStopScanRef.current) {
          await Promise.all([
            checkIpAndPort(ipAddress, 80),
            checkIpAndPort(ipAddress, 443, true),
            checkIpAndPort(ipAddress, 9080),
          ]);
        }
      }, 100);
    } catch (error) {
      // Don't log individual IP scan errors to avoid cluttering the log
    }
  };

  // Check a specific IP address and port for Chromecast device
  const checkIpAndPort = async (
    ipAddress: string,
    port: number,
    useHttps = false
  ) => {
    if (shouldStopScanRef.current) return;

    try {
      // Try different endpoints that might identify a Chromecast
      const endpoints = [
        "/setup/eureka_info",
        "/setup/device_info",
        "/ssdp/device-desc.xml",
        "/apps",
      ];

      for (const endpoint of endpoints) {
        if (shouldStopScanRef.current) break;

        const protocol = useHttps ? "https" : "http";
        const url = `${protocol}://${ipAddress}:${port}${endpoint}`;

        // Fetch with a short timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json, text/html, application/xml, */*",
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          // Handle response based on status code
          if (response.status === 200) {
            addLog(
              `[INFO] Found potential Chromecast device at ${ipAddress}:${port} (status: 200)`
            );

            // Parse response according to content type
            const contentType = response.headers.get("content-type") || "";
            let data: any = null;
            let responseText = "";

            try {
              if (contentType.includes("json")) {
                data = await response.json();
              } else {
                responseText = await response.text();

                // Try to detect if it's XML
                if (
                  responseText.includes("<?xml") ||
                  responseText.includes("<root")
                ) {
                  data = { xml: responseText.substring(0, 500) }; // Just store a preview
                } else {
                  data = { text: responseText.substring(0, 100) }; // Just store a preview
                }
              }
            } catch (parseError) {
              addLog(`[DEBUG] Error parsing response: ${parseError}`);
              // Continue anyway - we might still be able to identify the device
            }

            // Create a device object with the information we have
            const device: ChromecastDevice = {
              id: `chromecast-${ipAddress.replace(/\./g, "-")}-${port}`,
              ipAddress: ipAddress,
              port: port,
              discoveryType: "scan",
              lastSeen: new Date(),
              name:
                data?.name ||
                data?.friendlyName ||
                `Device at ${ipAddress}:${port}`,
            };

            // Extract additional info if available
            if (data) {
              if (data.manufacturer) device.manufacturer = data.manufacturer;
              if (data.model_name || data.modelName)
                device.model = data.model_name || data.modelName;
              if (data.version || data.firmwareVersion)
                device.firmwareVersion = data.version || data.firmwareVersion;
            }

            // IMPROVED: More comprehensive Chromecast-specific indicators check
            const isChromecastResponse =
              // Check data object for Chromecast properties
              (data &&
                (data.cast_build_revision ||
                  data.cast_version ||
                  data.device_type === "cast" ||
                  (data.manufacturer &&
                    data.manufacturer.toLowerCase() === "google") ||
                  (data.model_name &&
                    (data.model_name.toLowerCase().includes("chromecast") ||
                      data.model_name.toLowerCase().includes("google home") ||
                      data.model_name.toLowerCase().includes("nest"))) ||
                  // Check if data has specific Chromecast-only keys
                  data.hasOwnProperty("eureka_info") ||
                  data.hasOwnProperty("settings") ||
                  data.hasOwnProperty("cast_receiver"))) ||
              // Check raw text response
              (responseText &&
                (responseText.includes("eureka-dongle") ||
                  responseText.includes("googlecast") ||
                  responseText.includes("cast_") ||
                  responseText.includes("<manufacturer>google") ||
                  responseText.includes("<modelname>chromecast</modelname>") ||
                  // Look for more specific XML patterns
                  responseText.includes(
                    "<deviceType>urn:dial-multiscreen-org:device:dial:1</deviceType>"
                  ) ||
                  (responseText.includes(
                    "<manufacturer>Google Inc.</manufacturer>"
                  ) &&
                    responseText.includes(
                      "<modelName>Chromecast</modelName>"
                    ))));

            // IMPROVED: Much more comprehensive check for non-Chromecast devices
            // This is a critical check to prevent false positives
            const isNonChromecast =
              // Check device name for known non-Chromecast devices
              device.name &&
              // Apple devices
              (device.name.toLowerCase().includes("macbook") ||
                device.name.toLowerCase().includes("imac") ||
                device.name.toLowerCase().includes("mac mini") ||
                device.name.toLowerCase().includes("mac studio") ||
                device.name.toLowerCase().includes("mac pro") ||
                device.name.toLowerCase().includes("iphone") ||
                device.name.toLowerCase().includes("ipad") ||
                device.name.toLowerCase().includes("ipod") ||
                device.name.toLowerCase().includes("apple tv") ||
                device.name.toLowerCase().includes("homepod") ||
                // Microsoft/Windows devices
                device.name.toLowerCase().includes("windows") ||
                device.name.toLowerCase().includes("pc") ||
                device.name.toLowerCase().includes("surface") ||
                device.name.toLowerCase().includes("xbox") ||
                // Android devices (not including Google-branded devices)
                device.name.toLowerCase().includes("android") ||
                device.name.toLowerCase().includes("samsung") ||
                device.name.toLowerCase().includes("galaxy") ||
                device.name.toLowerCase().includes("pixel") ||
                device.name.toLowerCase().includes("oneplus") ||
                device.name.toLowerCase().includes("xiaomi") ||
                // Linux devices
                device.name.toLowerCase().includes("linux") ||
                device.name.toLowerCase().includes("ubuntu") ||
                device.name.toLowerCase().includes("raspberry pi") ||
                // Network devices
                device.name.toLowerCase().includes("router") ||
                device.name.toLowerCase().includes("switch") ||
                device.name.toLowerCase().includes("modem") ||
                device.name.toLowerCase().includes("nas") ||
                device.name.toLowerCase().includes("server") ||
                device.name.toLowerCase().includes("synology") ||
                // Sony devices (except for those with Android TV)
                (device.name.toLowerCase().includes("sony") &&
                  !device.name.toLowerCase().includes("android tv")) ||
                // Generic web servers and services
                device.name.toLowerCase().includes("apache") ||
                device.name.toLowerCase().includes("nginx") ||
                device.name.toLowerCase().includes("web server") ||
                // Printers and printing devices
                device.name.toLowerCase().includes("printer") ||
                device.name.toLowerCase().includes("scanner") ||
                device.name.toLowerCase().includes("brother") ||
                device.name.toLowerCase().includes("canon") ||
                device.name.toLowerCase().includes("epson") ||
                device.name.toLowerCase().includes("hp") ||
                // Other IoT devices
                device.name.toLowerCase().includes("camera") ||
                device.name.toLowerCase().includes("doorbell") ||
                device.name.toLowerCase().includes("philips hue") ||
                device.name.toLowerCase().includes("sonos"));

            // Skip if it's definitely not a Chromecast
            if (isNonChromecast) {
              addLog(
                `[DEBUG] Device at ${ipAddress}:${port} is not a Chromecast device (name indicates non-Chromecast device)`
              );
              break;
            }

            // If it looks like a Chromecast OR it's on a typical Chromecast port with correct endpoint
            if (
              isChromecastResponse ||
              ((port === 8008 || port === 8009) &&
                endpoint === "/setup/eureka_info" &&
                !isNonChromecast)
            ) {
              addLog(
                `[INFO] Success! Found Chromecast service at ${ipAddress}:${port}`
              );

              // Process with device scanner - device-database.ts will handle identification
              if (deviceScannerRef.current) {
                deviceScannerRef.current.processChromecastDevice(device);
              }
            } else {
              addLog(
                `[DEBUG] Device at ${ipAddress}:${port} responded but is not a Chromecast device`
              );
            }

            break; // Found a response, no need to check other endpoints
          }
          // Check for 401/403 responses which can indicate protected devices
          else if (response.status === 403 || response.status === 401) {
            // Check for Chromecast-specific headers
            const server = response.headers.get("server") || "";
            const isChromecastAuth =
              server.includes("CrKey") ||
              server.includes("Chrome") ||
              server.includes("Google") ||
              server.includes("Eureka");

            if (isChromecastAuth && (port === 8008 || port === 8009)) {
              addLog(
                `[INFO] Found potential protected Chromecast device at ${ipAddress}:${port} (status: ${response.status})`
              );

              // Create a device for protected Chromecasts
              const device: ChromecastDevice = {
                id: `chromecast-${ipAddress.replace(/\./g, "-")}-${port}`,
                name: `Protected Device (${ipAddress})`,
                ipAddress: ipAddress,
                port: port,
                discoveryType: "scan",
                lastSeen: new Date(),
                isProtected: true,
                manufacturer: "Google", // Likely Google if it's protected and on standard port
                model: "Chromecast Device (Protected)",
              };

              if (deviceScannerRef.current) {
                deviceScannerRef.current.processChromecastDevice(device);
              }
            }
            break;
          }
        } catch (err) {
          // Silent catch - expected for most IPs
        } finally {
          clearTimeout(timeoutId);
        }
      }
    } catch (error) {
      // Silent catch - expected for most IPs
    }
  };

  // Stop scan function
  const stopScan = useCallback(() => {
    if (!isScanning) return;

    shouldStopScanRef.current = true;
    addLog("[INFO] Stopping Chromecast scan...");

    if (deviceScannerRef.current) {
      deviceScannerRef.current.stopScan();
    }

    cleanupScan();

    // If we have found any devices when stopping, keep them in results
    if (scanResults.length === 0 && deviceScannerRef.current) {
      const results = deviceScannerRef.current.getDiscoveredDevices() || [];
      setScanResults(results);
    }

    setIsScanning(false);
    setProgress(1);
    setCurrentScan(null);
  }, [isScanning, scanResults]);

  // Clean up scan resources
  const cleanupScan = useCallback(() => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }

    if (deviceScannerRef.current) {
      deviceScannerRef.current.cleanupScan();
    }

    shouldStopScanRef.current = false;
  }, []);
  const addDeviceManually = useCallback(
    (ipAddress: string, port: number = 8009) => {
      addLog(`[INFO] Adding device manually: ${ipAddress}:${port}`);

      if (!deviceScannerRef.current) {
        addLog("[ERROR] Scanner not initialized");
        return;
      }

      // Creating a minimal device object based on user input
      const device: ChromecastDevice = {
        id: `manual-${ipAddress.replace(/\./g, "-")}`,
        name: `Chromecast (${ipAddress})`,
        ipAddress: ipAddress,
        port: port,
        discoveryType: "manual",
        lastSeen: new Date(),
        manufacturer: "Google",
        model: "Chromecast Device (Manual)",
        isManuallyAdded: true, // Flag to indicate this was manually added
      };

      // Add the device directly to the scan results
      setScanResults((prev) => {
        // Check if the device already exists
        const exists = prev.some((d) => d.device.ipAddress === ipAddress);

        if (exists) {
          addLog(
            `[INFO] Device with IP ${ipAddress} already exists in scan results`
          );
          return prev;
        }

        // Create a minimal scan result without vulnerabilities
        const newScanResult = {
          device: device,
          vulnerabilities: [], // Empty array - no vulnerabilities added yet
          isVulnerable: false,
          securityScore: 100, // Default high score since no vulnerabilities found yet
          lastUpdated: new Date(),
        };

        return [...prev, newScanResult];
      });

      // Notify the user that the device was added
      addLog(`[SUCCESS] Device ${ipAddress}:${port} was added manually`);
    },
    [addLog]
  );

  return {
    scanResults,
    isScanning,
    progress,
    currentScan,
    startScan,
    stopScan,
    isInitialized,
    addDeviceManually,
    scanIpAddress,
    setCurrentScan,
  };
}

export default useChromecastScanner;
