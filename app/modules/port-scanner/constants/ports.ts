// app/(tabs)/port-scanner/constants/ports.ts
import { Port } from "../types";

export const COMMON_PORTS: Port[] = [
  { port: 21, service: "FTP" },
  { port: 22, service: "SSH" },
  { port: 23, service: "Telnet" },
  { port: 25, service: "SMTP" },
  { port: 53, service: "DNS" },
  { port: 80, service: "HTTP" },
  { port: 110, service: "POP3" },
  { port: 143, service: "IMAP" },
  { port: 443, service: "HTTPS" },
  { port: 445, service: "SMB" },
  { port: 993, service: "IMAPS" },
  { port: 995, service: "POP3S" },
  { port: 3306, service: "MySQL" },
  { port: 3389, service: "RDP" },
  { port: 5432, service: "PostgreSQL" },
  { port: 8080, service: "HTTP-Proxy" },
];

export const DEFAULT_SCAN_PORTS = [
  22, 23, 25, 80, 110, 143, 443, 445, 993, 995, 3389, 8080,
];

export const getServiceForPort = (port: number): string => {
  return COMMON_PORTS.find((p) => p.port === port)?.service || "Unknown";
};
export default {};
