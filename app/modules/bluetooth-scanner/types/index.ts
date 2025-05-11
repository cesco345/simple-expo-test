export interface BluetoothDevice {
  id: string;
  name: string | null;
  rssi: number;
  advertising: Record<string, any> | null;
  manufacturerData?: string | null;
  serviceUUIDs?: string[] | null;
  bondState?: string;
  isConnectable?: boolean;
  lastSeen: Date;
}

export interface BluetoothVulnerability {
  id: string;
  name: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  recommendation: string;
  details?: string;
}

export interface BluetoothScanResult {
  device: BluetoothDevice;
  vulnerabilities: BluetoothVulnerability[];
  securityScore: number;
  isVulnerable: boolean;
  vulnerabilityDetails: string[];
}

export type CurrentScan = {
  deviceId?: string;
  deviceName?: string | null;
  stage: "discovery" | "analysis" | "vulnerability-check";
} | null;

export type NetworkInfo = {
  ip: string;
  baseIp?: string;
  subnet?: string;
  wifi?: boolean;
  type?: string;
  networkType?: {
    isConnected: boolean;
    type: any;
  };
  isConnected?: boolean;
};
export default {};
