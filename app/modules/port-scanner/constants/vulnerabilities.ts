// app/(tabs)/port-scanner/constants/vulnerabilities.ts
import { Vulnerability } from "../types";

export const KNOWN_VULNERABILITIES: Record<number, Vulnerability[]> = {
  21: [
    {
      name: "FTP Anonymous Access",
      severity: "Medium",
      description: "FTP server allows anonymous login.",
    },
    {
      name: "FTP Cleartext Authentication",
      severity: "Medium",
      description: "Credentials sent in cleartext.",
    },
  ],
  22: [
    {
      name: "SSH Weak Ciphers",
      severity: "Medium",
      description: "Server may support weak encryption.",
    },
    {
      name: "SSH Brute Force",
      severity: "Medium",
      description: "No rate limiting on auth attempts.",
    },
  ],
  23: [
    {
      name: "Telnet Cleartext",
      severity: "High",
      description: "Telnet sends all data unencrypted.",
    },
  ],
  25: [
    {
      name: "SMTP Open Relay",
      severity: "High",
      description: "May allow spammers to relay messages.",
    },
  ],
  80: [
    {
      name: "HTTP Unencrypted",
      severity: "Medium",
      description: "Sensitive data may be transmitted in cleartext.",
    },
  ],
  445: [
    {
      name: "SMB Vulnerabilities",
      severity: "High",
      description: "May be vulnerable to attacks like EternalBlue.",
    },
  ],
  3389: [
    {
      name: "RDP BlueKeep",
      severity: "Critical",
      description: "May be vulnerable to RCE via BlueKeep.",
    },
  ],
};

export const getVulnerabilitiesForPort = (port: number): Vulnerability[] => {
  return KNOWN_VULNERABILITIES[port] || [];
};
export default {};
