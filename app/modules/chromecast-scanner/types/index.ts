// app/modules/chromecast-scanner/types/index.ts
import { DeviceType } from "../constants/service-identifiers";

/**
 * Network information interface
 */
export interface NetworkInfo {
  ip: string;
  baseIp?: string;
  subnet?: string;
  wifi?: boolean;
  type?: string;
  isConnected: boolean;
  networkType?: {
    isConnected: boolean;
    type: any;
  };
}

/**
 * Chromecast device interface
 */
export interface ChromecastDevice {
  id: string;
  name?: string;
  hostName?: string;
  ipAddress: string;
  macAddress?: string;
  port?: number;
  serviceTypes?: string[];
  manufacturer?: string;
  model?: string;
  modelName?: string;
  firmwareVersion?: string;
  lastSeen: Date;
  discoveryType: "mdns" | "scan" | "manual";
  metadata?: Record<string, any>;
}

/**
 * Chromecast vulnerability interface
 */
export interface ChromecastVulnerability {
  id: string;
  name: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  recommendation: string;
  cve?: string;
  details?: string;
}

/**
 * Known device signature interface
 */
export interface DeviceSignature {
  manufacturer: string;
  model: string;
  modelAliases?: string[];
  identificationPatterns: string[];
  vulnerableVersions?: string[];
  recommendedFirmware?: string;
  deviceType: DeviceType;
  knownMACs?: string[];
  knownServices?: string[];
}

/**
 * Device scan result interface
 */
export interface ChromecastScanResult {
  device: ChromecastDevice;
  vulnerabilities: ChromecastVulnerability[];
  securityScore: number;
  isVulnerable: boolean;
  vulnerabilityDetails: string[];
}

/**
 * Scan progress type for UI state
 */
export interface CurrentScan {
  deviceId?: string;
  deviceName?: string;
  ipAddress?: string;
  stage: "discovery" | "analysis" | "vulnerability-check";
}

/**
 * Chromecast device profile interface
 */
export interface DeviceProfile {
  id: string;
  name?: string;
  manufacturer: string;
  model: string;
  deviceType: DeviceType;
  ipAddress?: string;
  macAddress: string;
  firmwareVersion?: string;
  lastSeen: Date;
  securityScore: number;
  vulnerabilities: ChromecastVulnerability[];
  vulnerabilityDetails: string[];
  advertisedServices: string[];
  metadata: Record<string, any>;
}

/**
 * mDNS service record interface
 */
export interface MDNSServiceRecord {
  name: string;
  fullName: string;
  host?: string;
  port?: number;
  addresses?: string[];
  txt?: Record<string, string>;
  type: string;
}

/**
 * Discovery options interface
 */
export interface DiscoveryOptions {
  useMdns: boolean;
  useScan: boolean;
  duration: number;
  maxDevices?: number;
}

/**
 * API endpoints for Chromecast device
 */
export enum ChromecastApiEndpoints {
  INFO = "/setup/eureka_info",
  DEVICE_DESC = "/ssdp/device-desc.xml",
  STATUS = "/apps/ChromeCast",
  CONFIG = "/setup/configured_networks",
  REBOOT = "/setup/reboot",
  SCAN = "/setup/scan_wifi",
}

export default {};
