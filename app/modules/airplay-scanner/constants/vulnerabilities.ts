/**
 * app/modules/airplay-scanner/constants/vulnerabilities.ts - Vulnerability data
 */

export interface AirPlayVulnerability {
  id: string;
  name: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  cve?: string;
  affectedDevices?: string[];
  recommendation: string;
}

export const AIRPLAY_VULNERABILITIES: AirPlayVulnerability[] = [
  {
    id: "AIRBORNE-2024-001",
    name: "AirBorne",
    description:
      "Remote code execution vulnerability in AirPlay implementation",
    severity: "Critical",
    cve: "CVE-2025-24132",
    affectedDevices: ["Apple TV < 16.3", "HomePod < 16.3", "iOS < 16.3"],
    recommendation: "Update firmware to the latest version available.",
  },
  {
    id: "AIRBORNE-2024-002",
    name: "Authentication Bypass",
    description:
      "Authentication can be bypassed on certain AirPlay implementations",
    severity: "High",
    affectedDevices: ["Multiple AirPlay-compatible devices"],
    recommendation: "Enable authentication if available and update firmware.",
  },
  {
    id: "AIRBORNE-2024-003",
    name: "Buffer Overflow",
    description: "Buffer overflow in older AirPlay implementations",
    severity: "Medium",
    cve: "CVE-2023-XXXX",
    affectedDevices: ["Older AirPlay SDK implementations"],
    recommendation: "Update to the latest AirPlay SDK or firmware.",
  },
];

export function getVulnerabilitiesForDevice(
  device: AirPlayDevice
): AirPlayVulnerability[] {
  if (!device.isVulnerable) return [];

  const vulnerabilities: AirPlayVulnerability[] = [];

  // Check for known vulnerabilities based on device type, manufacturer, model and version
  if (device.manufacturer === "Apple") {
    if (device.model?.includes("TV") && device.version) {
      // Check for Apple TV vulnerabilities
      const versionNum = parseFloat(device.version);
      if (versionNum < 16.3) {
        vulnerabilities.push(AIRPLAY_VULNERABILITIES[0]); // AirBorne
      }
    }
  }

  // Add generic vulnerabilities based on the vulnerability details
  if (device.vulnerabilityDetails) {
    if (
      device.vulnerabilityDetails.some(
        (d) => d.includes("authentication") || d.includes("password")
      )
    ) {
      vulnerabilities.push(AIRPLAY_VULNERABILITIES[1]); // Authentication Bypass
    }

    if (
      device.vulnerabilityDetails.some(
        (d) => d.includes("older") || d.includes("outdated")
      )
    ) {
      vulnerabilities.push(AIRPLAY_VULNERABILITIES[2]); // Buffer Overflow
    }
  }

  return vulnerabilities;
}
export default {};
