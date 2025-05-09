// app/(tabs)/port-scanner/types/index.ts
export type ScanResult = {
  ip: string;
  port: number;
  service: string;
  protocol: "TCP" | "HTTP";
  isOpen: boolean;
};

export type Vulnerability = {
  name: string;
  severity: string;
  description: string;
};

export type NetworkInfo = {
  ip: string;
  networkType: {
    isConnected: boolean;
    type: any;
  };
};

export type Port = {
  port: number;
  service: string;
};

export type CurrentScan = {
  ip: string;
  port: number;
};

export default {};
