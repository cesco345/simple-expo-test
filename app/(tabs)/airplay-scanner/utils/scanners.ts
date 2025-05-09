import { Platform } from "react-native";
import Zeroconf from "react-native-zeroconf";
import { AirPlayDevice } from "../types";

// Singleton for Zeroconf
let zeroconfInstance: Zeroconf | null = null;
let zeroconfErrorCount = 0;
const MAX_ZEROCONF_ERRORS = 3;

export function getZeroconfInstance(): Zeroconf {
  if (!zeroconfInstance) {
    zeroconfInstance = new Zeroconf();
  }
  return zeroconfInstance;
}

// Add this function to properly clean up Zeroconf when needed
export function cleanupZeroconf() {
  if (zeroconfInstance) {
    try {
      zeroconfInstance.stop();
      zeroconfInstance.removeDeviceListeners();
      zeroconfInstance = null;
      console.log("[INFO] Zeroconf instance cleaned up");
    } catch (error) {
      console.log(`[INFO] Error cleaning up Zeroconf: ${error}`);
    }
  }
  // Reset error count
  zeroconfErrorCount = 0;
}

// Reset Zeroconf error count
export function resetZeroconfErrors() {
  zeroconfErrorCount = 0;
}

// Check if we should disable Zeroconf on iOS
export function shouldDisableZeroconf(): boolean {
  return Platform.OS === "ios" && zeroconfErrorCount >= MAX_ZEROCONF_ERRORS;
}

// Helper to build IP address from base and last octet
export function buildIpAddress(baseIp: string, lastOctet: number): string {
  return `${baseIp}.${lastOctet}`;
}

// Generate IP range to scan
export function generateIpRange(
  baseIp: string,
  priorityAddresses: number[] = [],
  fullScan: boolean = false,
  myLastOctet?: number
): number[] {
  const addresses: number[] = [];

  // Always include priority addresses
  priorityAddresses.forEach((addr) => {
    if (!addresses.includes(addr)) {
      addresses.push(addr);
    }
  });

  // For full scan, include 1-254
  if (fullScan) {
    for (let i = 1; i <= 254; i++) {
      if (!addresses.includes(i)) {
        addresses.push(i);
      }
    }
    return addresses;
  }

  // For limited scan, include common ranges and surrounding addresses
  // Common ranges: 1-20, 100-110, 254
  for (let i = 1; i <= 20; i++) {
    if (!addresses.includes(i)) {
      addresses.push(i);
    }
  }

  for (let i = 100; i <= 110; i++) {
    if (!addresses.includes(i)) {
      addresses.push(i);
    }
  }

  if (!addresses.includes(254)) {
    addresses.push(254);
  }

  // Include addresses around the current device
  if (myLastOctet) {
    const range = 5; // 5 addresses above and below
    for (
      let i = Math.max(1, myLastOctet - range);
      i <= Math.min(254, myLastOctet + range);
      i++
    ) {
      if (!addresses.includes(i)) {
        addresses.push(i);
      }
    }
  }

  return addresses;
}

// Create batches for efficient IP scanning
export function batchIpAddresses(
  addresses: number[],
  batchSize: number
): number[][] {
  const batches: number[][] = [];
  for (let i = 0; i < addresses.length; i += batchSize) {
    batches.push(addresses.slice(i, i + batchSize));
  }
  return batches;
}

// Sleep utility for managing pauses between scans
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start Zeroconf scan with safe iOS handling
export function startZeroconfScan(addLog: (message: string) => void): boolean {
  // Skip Zeroconf on iOS if we've had too many errors
  if (shouldDisableZeroconf()) {
    addLog("[INFO] Skipping mDNS scanning due to too many errors on iOS");
    return false;
  }

  try {
    // Clean up existing instance
    cleanupZeroconf();

    // Create a new instance
    const zeroconf = getZeroconfInstance();

    // Set up error handler with limited retries
    zeroconf.on("error", (error) => {
      addLog(`[INFO] Zeroconf error: ${error}`);
      zeroconfErrorCount++;

      if (Platform.OS === "ios") {
        try {
          zeroconf.stop();
          addLog("[INFO] Stopped Zeroconf after error");
        } catch (stopError) {
          // Silently continue
        }

        // Only retry once, then disable
        if (zeroconfErrorCount < MAX_ZEROCONF_ERRORS) {
          addLog("[INFO] Will attempt one retry for mDNS");
        } else {
          addLog("[INFO] Disabling mDNS scanning on iOS due to errors");
        }
      }
    });

    // Start scan
    if (Platform.OS === "ios") {
      addLog("[INFO] Starting iOS-optimized mDNS scan");
      // Single attempt for iOS, no retries
      setTimeout(() => {
        try {
          zeroconf.scan("_airplay._tcp.", "local.", 5);
        } catch (error) {
          addLog(`[INFO] iOS mDNS scan error: ${error}`);
          zeroconfErrorCount++;
        }
      }, 300);
    } else {
      // Normal scan for Android
      addLog("[INFO] Starting mDNS scan");
      zeroconf.scan("_airplay._tcp.", "local.");

      // Add a second scan for RAOP
      setTimeout(() => {
        try {
          addLog("[INFO] Starting additional scan for _raop._tcp. services");
          zeroconf.scan("_raop._tcp.", "local.");
        } catch (error) {
          addLog(`[INFO] Secondary scan error: ${error}`);
        }
      }, 1000);
    }

    return true;
  } catch (error) {
    addLog(`[INFO] Failed to initialize mDNS scanning: ${error}`);
    return false;
  }
}

// Check if a port is open using a quick connection test
export async function checkPortOpen(
  ip: string,
  port: number
): Promise<boolean> {
  try {
    // Try a basic fetch with 1s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    try {
      // Just try to connect, no need for a full response
      const response = await fetch(`http://${ip}:${port}`, {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true; // If we get any response, the port is open
    } catch (error) {
      clearTimeout(timeoutId);

      // AbortError means timeout, which doesn't rule out an open port
      if (error instanceof Error && error.name === "AbortError") {
        // Try server-info as a fallback for potential AirPlay devices
        return await quickServerInfoCheck(ip, port);
      }

      return false;
    }
  } catch (error) {
    return false;
  }
}

// Quick check for server-info endpoint
async function quickServerInfoCheck(
  ip: string,
  port: number
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    try {
      await fetch(`http://${ip}:${port}/server-info`, {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      clearTimeout(timeoutId);
      return false;
    }
  } catch (error) {
    return false;
  }
}

// Check for AirPlay service on a specific port - ENHANCED VERSION
export async function checkAirPlayService(
  ip: string,
  port: number,
  addLog: (message: string) => void
): Promise<Record<string, string> | null> {
  try {
    // First check if the port is open at all
    const isOpen = await checkPortOpen(ip, port);
    if (!isOpen) {
      return null;
    }

    // Determine endpoints to check
    const endpoints = ["/server-info", "/info"];

    for (const endpoint of endpoints) {
      const infoUrl = `http://${ip}:${port}${endpoint}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(infoUrl, {
          method: "GET",
          headers: {
            "User-Agent": "AirPlay/420.3",
            Connection: "keep-alive",
            Accept: "*/*",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Process headers for additional identification
        const headerInfo = processHttpHeaders(
          response.headers as any as Record<string, string>,
          ip
        );

        // Check for success or error that still indicates AirPlay
        if (
          response.status === 200 ||
          response.status === 404 ||
          response.status === 403
        ) {
          addLog(
            `Found potential AirPlay device at ${ip}:${port} (status: ${response.status})`
          );

          if (response.status === 200) {
            try {
              // Parse the response
              const text = await response.text();

              // Parse the device info
              const deviceInfo = parseAirPlayServerInfo(text);

              // Add header information and metadata to device info
              return {
                ...deviceInfo,
                ...headerInfo,
                _endpoint: endpoint,
                _detected_port: port.toString(),
                _status: response.status.toString(),
              };
            } catch (parseError) {
              // Return minimal device info with headers
              return {
                ...headerInfo,
                _raw_response: "Error parsing response",
                _status: "200",
                _endpoint: endpoint,
                _detected_port: port.toString(),
              };
            }
          } else {
            // For 404 or 403, still consider a potential AirPlay device
            return {
              ...headerInfo,
              _status: response.status.toString(),
              _detected_port: port.toString(),
              _endpoint: endpoint,
            };
          }
        }
      } catch (endpointError) {
        // Continue to next endpoint
      }
    }

    // If we've tried all endpoints and nothing worked, return minimal info for open port
    return {
      _status: "port_open",
      _detected_port: port.toString(),
      _potential_airplay: "true",
    };
  } catch (error) {
    addLog(`Error checking ${ip}:${port}: ${error}`);
    return null;
  }
}

// Process HTTP headers for additional device identification
export function processHttpHeaders(
  headers: Record<string, string>,
  ip: string
): Record<string, string> {
  const info: Record<string, string> = {};

  // Check for server header
  if (headers["server"]) {
    info.server = headers["server"];
  }

  // Check for other common headers
  if (headers["x-apple-device-id"]) {
    info.deviceId = headers["x-apple-device-id"];
    info.manufacturer = "Apple";
  }

  if (headers["user-agent"]) {
    info.userAgent = headers["user-agent"];
  }

  // Other potential headers to check
  const headerMap: Record<string, string> = {
    "x-apple-version": "appleVersion",
    "x-roku-id": "rokuId",
    "x-roku-version": "rokuVersion",
    "x-sonos-version": "sonosVersion",
    "x-bose-version": "boseVersion",
  };

  for (const [header, infoKey] of Object.entries(headerMap)) {
    if (headers[header]) {
      info[infoKey] = headers[header];
    }
  }

  return info;
}

// Parse AirPlay server-info response
export function parseAirPlayServerInfo(
  responseText: string
): Record<string, string> {
  try {
    const result: Record<string, string> = {
      _raw_response: responseText, // Store the raw response for debugging
    };

    // Common AirPlay fields to extract
    const fields = [
      "deviceid",
      "features",
      "model",
      "protovers",
      "srcvers",
      "vv",
      "name",
      "manufacturer",
      "serialNumber",
      "firmwareVersion",
      "macAddress",
      "osVersion",
      "systemBuild",
    ];

    // Extract fields from the response
    fields.forEach((field) => {
      const regex = new RegExp(`${field}\\s*:\\s*([^\\r\\n]+)`, "i");
      const match = responseText.match(regex);
      if (match && match[1]) {
        result[field] = match[1].trim();
      }
    });

    // Try to extract plist or JSON data if present
    if (responseText.includes("<?xml") || responseText.includes("<plist")) {
      result._format = "plist";
      // Parse XML property lists
      parsePlistFields(responseText, result);
    } else if (responseText.includes("{") || responseText.includes("}")) {
      result._format = "json";
      // Parse JSON
      parseJsonFields(responseText, result);
    }

    return result;
  } catch (error) {
    console.error(`Error parsing AirPlay info: ${error}`);
    return {
      _raw_response: responseText,
      _parse_error: String(error),
    };
  }
}

// Parse XML/Plist fields from response
function parsePlistFields(
  responseText: string,
  result: Record<string, string>
) {
  try {
    // Simple regex-based extraction for plist key-value pairs
    const keyValueRegex = /<key>([^<]+)<\/key>\s*<string>([^<]+)<\/string>/g;
    let match;
    while ((match = keyValueRegex.exec(responseText)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      result[key] = value;
    }

    // Try to get integer values too
    const keyIntRegex = /<key>([^<]+)<\/key>\s*<integer>([^<]+)<\/integer>/g;
    while ((match = keyIntRegex.exec(responseText)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      result[key] = value;
    }
  } catch (error) {
    console.error(`Error parsing plist: ${error}`);
  }
}

// Parse JSON fields from response
function parseJsonFields(responseText: string, result: Record<string, string>) {
  try {
    // Try to extract JSON objects from the response
    const jsonRegex = /{[^{}]*}/g;
    const jsonMatches = responseText.match(jsonRegex);

    if (jsonMatches) {
      for (const jsonStr of jsonMatches) {
        try {
          const jsonObj = JSON.parse(jsonStr);
          // Add all string/number properties to result
          for (const [key, value] of Object.entries(jsonObj)) {
            if (typeof value === "string" || typeof value === "number") {
              result[key] = String(value);
            }
          }
        } catch (parseError) {
          // Continue with next JSON match
        }
      }
    }
  } catch (error) {
    console.error(`Error parsing JSON: ${error}`);
  }
}

// Process mDNS discovery results
export function processMdnsService(service: any): AirPlayDevice | null {
  try {
    if (!service.host || !service.port) return null;

    // Check if it's an AirPlay service
    const isAirPlayService =
      (service.type &&
        (service.type.includes("airplay") || service.type.includes("raop"))) ||
      (service.name && service.name.toLowerCase().includes("airplay"));

    if (!isAirPlayService) return null;

    // Create device info from TXT records
    const deviceInfo: Record<string, string> = {};
    if (service.txt) {
      // Handle different formats of TXT records
      if (typeof service.txt === "object") {
        for (const [key, value] of Object.entries(service.txt)) {
          if (typeof value === "string") {
            deviceInfo[key] = value;
          } else if (value !== null && value !== undefined) {
            deviceInfo[key] = String(value);
          }
        }
      } else if (typeof service.txt === "string") {
        deviceInfo.txt = service.txt;
        // Try to parse comma or space-separated values
        const parts = service.txt.split(/[,\s]+/);
        for (const part of parts) {
          const keyValue = part.split("=");
          if (keyValue.length === 2) {
            deviceInfo[keyValue[0]] = keyValue[1];
          }
        }
      }
    }

    // Create a friendly device name
    let deviceName =
      createDeviceName(deviceInfo) || `AirPlay Device at ${service.host}`;
    let manufacturer = deviceInfo.manufacturer || "Unknown";
    let model = deviceInfo.model || "AirPlay Device";

    // Basic vulnerability detection
    const isVulnerable =
      (manufacturer === "Apple" && !deviceInfo.pw) || // No authentication
      (deviceInfo.features && deviceInfo.features.includes("FPSAppleTV")) || // Older AppleTV
      !deviceInfo.manufacturer; // Unknown manufacturer

    const vulnerabilityDetails = isVulnerable
      ? ["Device potentially vulnerable - further investigation needed"]
      : [];

    // Include raw data for debugging (but limit size)
    deviceInfo._raw_mdns = JSON.stringify(service).slice(0, 500);

    return {
      id: `${service.host}-${service.port}`,
      ip: service.host,
      name: deviceName,
      port: service.port,
      model: model,
      manufacturer: manufacturer,
      detectionMethod: "mdns",
      deviceInfo: deviceInfo,
      isVulnerable: isVulnerable,
      vulnerabilityDetails: vulnerabilityDetails,
      responseData: JSON.stringify(service),
      lastSeen: new Date(),
      hostname: service.name,
    };
  } catch (error) {
    console.error(`Error processing mDNS data: ${error}`);
    return null;
  }
}

// Create a friendly device name from device info
export function createDeviceName(deviceInfo: Record<string, string>): string {
  // If explicit name and manufacturer exist, use them
  if (deviceInfo.name && deviceInfo.manufacturer) {
    return `${deviceInfo.manufacturer} ${deviceInfo.name}`;
  }

  // If model exists with or without manufacturer
  if (deviceInfo.model) {
    return deviceInfo.manufacturer
      ? `${deviceInfo.manufacturer} ${deviceInfo.model}`
      : `${deviceInfo.model}`;
  }

  // Check for common name fields
  const nameFields = ["friendlyName", "deviceName", "DisplayName", "name"];
  for (const field of nameFields) {
    if (deviceInfo[field]) {
      return deviceInfo[field];
    }
  }

  // If we have a server field, use that
  if (deviceInfo.server) {
    return deviceInfo.server.split(".")[0]; // Use the first part of the hostname
  }

  // If all else fails, return Unknown
  return "Unknown AirPlay Device";
}

// Process discovered device - Enhanced with better device identification and vulnerability detection
export function processIpScanDevice(
  ip: string,
  port: number,
  deviceInfo: Record<string, string>
): AirPlayDevice {
  // Enhanced device identification
  let deviceName = createDeviceName(deviceInfo) || `AirPlay Device at ${ip}`;
  let manufacturer = deviceInfo.manufacturer || "Unknown";
  let model = deviceInfo.model || "AirPlay Device";
  let deviceType = "Unknown";
  let confidence = 50; // Default medium confidence
  let version = deviceInfo.firmwareVersion || deviceInfo.osVersion || null;

  // Enhance Apple device identification
  if (deviceInfo._raw_response) {
    const response = deviceInfo._raw_response.toLowerCase();

    if (response.includes("appletv") || response.includes("apple tv")) {
      manufacturer = "Apple";
      model = "Apple TV";
      deviceType = "Streaming Device";
      confidence = 90;

      // Check for specific generations
      if (response.includes("j105a") || response.includes("mediaremote")) {
        model = "Apple TV 4K";
      } else if (
        response.includes("appletv3") ||
        response.includes("appletv/3")
      ) {
        model = "Apple TV 3rd Generation";
      }

      deviceName = model;

      // Extract version information
      const versionRegex = /(\d+\.\d+(\.\d+)?)/;
      const versionMatch = response.match(versionRegex);
      if (versionMatch && versionMatch[1]) {
        version = versionMatch[1];
      }
    } else if (
      response.includes("homepod") ||
      response.includes("audioaccessory")
    ) {
      manufacturer = "Apple";
      model = "HomePod";
      deviceName = "HomePod";
      deviceType = "Speaker";
      confidence = 90;

      if (
        response.includes("homepod mini") ||
        response.includes("audioaccessory5,1")
      ) {
        model = "HomePod mini";
        deviceName = "HomePod mini";
        confidence = 95;
      }
    } else if (response.includes("bose")) {
      manufacturer = "Bose";
      model = response.includes("soundbar") ? "Soundbar" : "Speaker";
      deviceName = `Bose ${model}`;
      deviceType = "Speaker";
      confidence = 85;
    } else if (response.includes("sonos")) {
      manufacturer = "Sonos";
      deviceType = "Speaker";
      confidence = 85;

      // Attempt to identify Sonos model
      if (response.includes("play:1") || response.includes("play1")) {
        model = "Play:1";
      } else if (response.includes("play:5") || response.includes("play5")) {
        model = "Play:5";
      } else if (response.includes("one")) {
        model = "One";
      } else if (response.includes("beam")) {
        model = "Beam";
        deviceType = "Soundbar";
      } else {
        model = "Speaker";
      }

      deviceName = `Sonos ${model}`;
    }
  }

  // Create device object with enhanced information
  const device: AirPlayDevice = {
    id: `${ip}-${port}`,
    ip: ip,
    name: deviceName,
    model: model,
    port: port,
    detectionMethod: "port_scan",
    deviceInfo: deviceInfo,
    deviceType: deviceType,
    confidence: confidence,
    lastSeen: new Date(),
    hostname: `${ip}`,
  };

  // Add manufacturer if available
  if (manufacturer) {
    device.manufacturer = manufacturer;
  }

  // Add version if available
  if (version) {
    device.version = version;
  }

  // Add serial number if available
  if (deviceInfo.serialNumber) {
    device.serialNumber = deviceInfo.serialNumber;
  }

  // Add raw response data for further analysis if needed
  if (deviceInfo._raw_response) {
    device.responseData = deviceInfo._raw_response;
  }

  // Enhanced vulnerability detection
  let isVulnerable = false;
  const vulnerabilityDetails: string[] = [];

  // Check for known vulnerabilities
  if (manufacturer === "Apple") {
    if (port !== 7000) {
      // Non-standard port for Apple
      isVulnerable = true;
      vulnerabilityDetails.push(
        "Using non-standard port - potential vulnerability"
      );
    }

    if (model === "Apple TV 3rd Generation") {
      // Check firmware version - older than 7.0 is vulnerable
      if (version && version.startsWith("6.")) {
        isVulnerable = true;
        vulnerabilityDetails.push(
          `Firmware version ${version} is vulnerable to CVE-2017-13811`
        );
      } else {
        vulnerabilityDetails.push(
          `Firmware version ${version || "unknown"} appears up to date`
        );
      }
    }
  } else if (manufacturer === "Bose") {
    // Bose devices often have authentication issues
    if (deviceInfo._status === "403") {
      isVulnerable = true;
      vulnerabilityDetails.push(
        "No firmware version found - potentially vulnerable"
      );
    }
  } else if (deviceInfo._status === "403" || deviceInfo._status === "401") {
    // Authentication issues but with potential bypass
    isVulnerable = true;
    vulnerabilityDetails.push(
      "Authentication issues detected - potential vulnerability"
    );
  } else if (deviceInfo.server && deviceInfo.server?.includes("AirPlay")) {
    // Generic AirPlay server
    isVulnerable = true;
    vulnerabilityDetails.push(
      "Generic AirPlay implementation may be vulnerable"
    );
  }

  // For minimal device info, add a note
  if (Object.keys(deviceInfo).length <= 2) {
    vulnerabilityDetails.push(
      "Limited device information available - further investigation recommended"
    );
    isVulnerable = true;
  }

  device.isVulnerable = isVulnerable;
  device.vulnerabilityDetails = vulnerabilityDetails;

  return device;
}

export default {};
