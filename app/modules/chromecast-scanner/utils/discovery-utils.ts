// app/modules/chromecast-scanner/utils/discovery-utils.ts
import {
  ChromecastApiEndpoints,
  ChromecastDevice,
  MDNSServiceRecord,
} from "../types";

/**
 * Parse mDNS service record into a Chromecast device object
 */
export function parseMdnsServiceRecord(
  record: MDNSServiceRecord
): ChromecastDevice | null {
  try {
    // Check if this is a Chromecast-related service
    const isChromecastService =
      record.type.includes("_googlecast") ||
      record.type.includes("_googlezone") ||
      record.type.includes("_googlehome");

    if (!isChromecastService) {
      return null;
    }

    // Extract IP address from addresses array (first IPv4 address)
    const ipAddress = record.addresses?.[0] || "";
    if (!ipAddress) {
      console.log(`[WARN] No IP address found for device: ${record.name}`);
      return null;
    }

    // Parse TXT records for additional information
    const metadata: Record<string, any> = {};

    if (record.txt) {
      // Flatten TXT records into metadata
      Object.entries(record.txt).forEach(([key, value]) => {
        // Some common Chromecast TXT record keys
        // id: Device ID
        // fn: Friendly Name
        // md: Model Name
        // ve: Version
        // rs: Status
        // st: Application running
        metadata[key] = value;
      });
    }

    // Create a device ID - use the mDNS provided ID if available, otherwise create from record name
    const deviceId =
      metadata.id || record.name.replace(/\s+/g, "").toLowerCase();

    // Create base device
    const device: ChromecastDevice = {
      id: deviceId,
      name: metadata.fn || record.name,
      hostName: record.host || record.fullName,
      ipAddress: ipAddress,
      port: record.port || 8009, // Default Chromecast port
      serviceTypes: [record.type],
      lastSeen: new Date(),
      discoveryType: "mdns",
      metadata: metadata,
    };

    // Add specific fields if available in metadata
    if (metadata.md) {
      device.modelName = metadata.md;
    }

    if (metadata.ve) {
      device.firmwareVersion = metadata.ve;
    }

    // Extract MAC address if available in TXT records
    if (metadata.ca) {
      device.macAddress = metadata.ca;
    }

    return device;
  } catch (error) {
    console.error("[ERROR] Failed to parse mDNS record:", error);
    return null;
  }
}

/**
 * Build a URL for a specific Chromecast API endpoint
 */
export function buildChromecastApiUrl(
  ipAddress: string,
  endpoint: ChromecastApiEndpoints,
  port: number = 8008, // Default HTTP port for Chromecast API
  useHttps: boolean = false
): string {
  const protocol = useHttps ? "https" : "http";
  return `${protocol}://${ipAddress}:${port}${endpoint}`;
}

/**
 * Extract firmware version from Chromecast eureka_info response
 */
export function extractFirmwareVersion(eurekaInfo: any): string | null {
  try {
    if (eurekaInfo?.version) {
      return eurekaInfo.version;
    }

    if (eurekaInfo?.build_version) {
      return eurekaInfo.build_version;
    }

    return null;
  } catch (error) {
    console.error("[ERROR] Failed to extract firmware version:", error);
    return null;
  }
}

/**
 * Extract model information from device description
 */
export function extractModelInfo(deviceDesc: any): {
  manufacturer?: string;
  model?: string;
} {
  try {
    const info: { manufacturer?: string; model?: string } = {};

    if (deviceDesc?.device?.manufacturer) {
      info.manufacturer = deviceDesc.device.manufacturer;
    }

    if (deviceDesc?.device?.modelName) {
      info.model = deviceDesc.device.modelName;
    }

    return info;
  } catch (error) {
    console.error("[ERROR] Failed to extract model info:", error);
    return {};
  }
}

/**
 * Convert port scan result to Chromecast device
 */
export function createDeviceFromPortScan(
  ipAddress: string,
  port: number,
  serviceInfo?: any
): ChromecastDevice {
  const device: ChromecastDevice = {
    id: `chromecast-${ipAddress.replace(/\./g, "-")}`,
    ipAddress: ipAddress,
    port: port,
    lastSeen: new Date(),
    discoveryType: "scan",
  };

  // If we have additional service info, add it
  if (serviceInfo) {
    if (serviceInfo.name) {
      device.name = serviceInfo.name;
    }

    if (serviceInfo.modelName) {
      device.modelName = serviceInfo.modelName;
    }

    if (serviceInfo.manufacturer) {
      device.manufacturer = serviceInfo.manufacturer;
    }

    if (serviceInfo.friendlyName) {
      device.name = serviceInfo.friendlyName;
    }

    if (serviceInfo.firmwareVersion) {
      device.firmwareVersion = serviceInfo.firmwareVersion;
    }
  }

  return device;
}

/**
 * Helper to determine if a device is a Chromecast based on ports and service info
 */
export function isChromecastDevice(port: number, serviceInfo?: any): boolean {
  // Check if it's a Chromecast port
  if (port === 8008 || port === 8009) {
    return true;
  }

  // Check service info
  if (serviceInfo) {
    // Check if service name contains known Chromecast identifiers
    if (serviceInfo.name && typeof serviceInfo.name === "string") {
      const nameLower = serviceInfo.name.toLowerCase();
      if (
        nameLower.includes("chromecast") ||
        nameLower.includes("google") ||
        nameLower.includes("nest")
      ) {
        return true;
      }
    }

    // Check for Chromecast headers or responses
    if (
      serviceInfo.headers?.["application"] === "join" ||
      serviceInfo.userAgent?.includes("CrKey") ||
      serviceInfo.server?.includes("CrKey")
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Merge multiple device records for the same physical device
 */
export function mergeDeviceRecords(
  existingDevice: ChromecastDevice,
  newDevice: ChromecastDevice
): ChromecastDevice {
  // Create a merged device record
  const mergedDevice: ChromecastDevice = {
    ...existingDevice,
    lastSeen: new Date(), // Always update the last seen timestamp
  };

  // Prefer values from the new device where available
  if (newDevice.name) {
    mergedDevice.name = newDevice.name;
  }

  if (newDevice.modelName) {
    mergedDevice.modelName = newDevice.modelName;
  }

  if (newDevice.manufacturer) {
    mergedDevice.manufacturer = newDevice.manufacturer;
  }

  if (newDevice.firmwareVersion) {
    mergedDevice.firmwareVersion = newDevice.firmwareVersion;
  }

  if (newDevice.macAddress) {
    mergedDevice.macAddress = newDevice.macAddress;
  }

  // Merge service types arrays without duplicates
  if (newDevice.serviceTypes && newDevice.serviceTypes.length > 0) {
    const existingServiceTypes = mergedDevice.serviceTypes || [];
    mergedDevice.serviceTypes = [
      ...new Set([...existingServiceTypes, ...newDevice.serviceTypes]),
    ];
  }

  // Merge metadata objects
  if (newDevice.metadata) {
    mergedDevice.metadata = {
      ...mergedDevice.metadata,
      ...newDevice.metadata,
    };
  }

  return mergedDevice;
}

/**
 * Sleep utility function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate IP range for scanning
 */
export function generateIpRange(
  baseIp: string,
  start: number = 1,
  end: number = 254
): string[] {
  const ipPrefix = baseIp.substring(0, baseIp.lastIndexOf(".") + 1);
  const ipAddresses: string[] = [];

  for (let i = start; i <= end; i++) {
    ipAddresses.push(`${ipPrefix}${i}`);
  }

  return ipAddresses;
}

/**
 * Optimize scan range based on the device's own IP
 */
export function optimizeScanRange(deviceIp: string): {
  start: number;
  end: number;
} {
  // Extract the last octet
  const ipParts = deviceIp.split(".");
  const lastOctet = parseInt(ipParts[3]);

  // Create a range of +/- 15 around the device's IP, staying within valid range
  let start = Math.max(1, lastOctet - 15);
  let end = Math.min(254, lastOctet + 15);

  return { start, end };
}

/**
 * Create batches of IPs for efficient scanning
 */
export function createIpBatches(
  ips: string[],
  batchSize: number = 10
): string[][] {
  const batches: string[][] = [];

  for (let i = 0; i < ips.length; i += batchSize) {
    batches.push(ips.slice(i, i + batchSize));
  }

  return batches;
}

export default {
  parseMdnsServiceRecord,
  buildChromecastApiUrl,
  extractFirmwareVersion,
  extractModelInfo,
  createDeviceFromPortScan,
  isChromecastDevice,
  mergeDeviceRecords,
  sleep,
  generateIpRange,
  optimizeScanRange,
  createIpBatches,
};
