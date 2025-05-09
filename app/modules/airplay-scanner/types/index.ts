/**
 * app/modules/airplay-scanner/types/index.ts - Types for AirPlay scanner
 */
export interface AirPlayDevice {
  id: string;
  ip: string;
  name: string;
  port: number;
  model?: string;
  manufacturer?: string;
  deviceType?: string;
  version?: string;
  serialNumber?: string;
  detectionMethod: "mdns" | "port_scan";
  deviceInfo?: Record<string, string>;
  responseData?: string;
  lastSeen?: Date;
  isVulnerable?: boolean;
  vulnerabilityDetails?: string[];
  confidence?: number;
  hostname?: string;
}

export interface NetworkInfo {
  ip?: string;
  subnet?: string;
  baseIp?: string;
  networkType?: {
    type: string;
    isConnected: boolean;
  };
}

export interface ScanResult {
  devices: AirPlayDevice[];
  scanDuration: number;
}

export interface ScanStatus {
  isScanning: boolean;
  progress: number;
  statusMessage?: string;
  deviceCount: number;
}

export interface CurrentScan {
  ip: string;
  port: number;
}

export interface ScanConfig {
  includeIpScan: boolean;
  includeMdns: boolean;
  scanFullRange: boolean;
  timeout: number;
  priorityAddresses: number[];
  detectionEndpoints: string[];
}

export const DEFAULT_SCAN_CONFIG: ScanConfig = {
  includeIpScan: true,
  includeMdns: true,
  scanFullRange: false,
  timeout: 60000, // 60 seconds
  priorityAddresses: [
    1, 2, 50, 100, 101, 102, 150, 154, 170, 180, 200, 254, 123, 185,
  ],
  detectionEndpoints: ["/server-info", "/info"],
};

export const AIRPLAY_PORTS = [7000, 7100, 5000, 49152, 49153, 8080, 8001];
export default {};
