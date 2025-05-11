// app/modules/bluetooth-scanner/constants/vulnerabilities.ts
import { Vulnerability } from "../types";

/**
 * Known vulnerabilities database for Bluetooth and network devices
 */
export const VULNERABILITIES: Record<string, Vulnerability> = {
  BLUEJACKING: {
    id: "BLUEJACKING",
    name: "BlueJacking",
    description:
      "Device can receive unsolicited messages over Bluetooth. While this does not typically provide access to files, it can be used for spam or phishing.",
    severity: "low",
    recommendation:
      "Set your device to non-discoverable mode when not actively pairing.",
  },
  BLUESNARFING: {
    id: "BLUESNARFING",
    name: "BlueSnarfing",
    description:
      "Attacker can access your stored data including contacts, calendar, and images without authorization.",
    severity: "high",
    recommendation:
      "Update device firmware and use strong PINs for Bluetooth connections.",
  },
  MAC_SPOOFING: {
    id: "MAC_SPOOFING",
    name: "MAC Address Spoofing",
    description:
      "Attackers can bypass authentication by spoofing MAC addresses before encryption is established.",
    severity: "medium",
    recommendation:
      "Use devices with Bluetooth 4.1+ with Secure Connections feature.",
  },
  PIN_CRACKING: {
    id: "PIN_CRACKING",
    name: "PIN Cracking Vulnerability",
    description:
      "Weak PINs can be brute-forced to gain unauthorized access to paired devices.",
    severity: "medium",
    recommendation: "Use complex, non-default PINs and update them regularly.",
  },
  BLUEBUMP: {
    id: "BLUEBUMP",
    name: "BlueBump Attack",
    description:
      "Social engineering attack that forces authentication and keeps connection open after key deletion.",
    severity: "medium",
    recommendation:
      "Be cautious with Bluetooth connection requests and regularly review paired devices.",
  },
  BLUEPRINTING: {
    id: "BLUEPRINTING",
    name: "BluePrinting",
    description:
      "Device information gathering based on Bluetooth addresses to determine device model and firmware.",
    severity: "low",
    recommendation:
      "Use devices with randomized Bluetooth addresses to prevent tracking.",
  },
  BLUEBUGGING: {
    id: "BLUEBUGGING",
    name: "BlueBugging",
    description:
      "Attacker exploits RFCOMM protocol to gain full control over the device.",
    severity: "critical",
    recommendation:
      "Keep device firmware updated and only pair with trusted devices.",
    cve: "CVE-2022-XXXX",
  },
  BLUEBORNE: {
    id: "BLUEBORNE",
    name: "BlueBorne",
    description:
      "Collection of vulnerabilities including stack buffer overflow that allows attackers to hijack Bluetooth connections.",
    severity: "critical",
    recommendation:
      "Install security patches immediately and keep Bluetooth turned off when not in use.",
    cve: "CVE-2017-0781",
  },
  FUZZING: {
    id: "FUZZING",
    name: "Bluetooth Fuzzing",
    description:
      "Sending corrupted data packets to disrupt functionality and uncover exploitable vulnerabilities.",
    severity: "medium",
    recommendation:
      "Use devices with latest Bluetooth versions and security patches.",
  },
  REFLECTION: {
    id: "REFLECTION",
    name: "Reflection Attack",
    description:
      "Attacker impersonates a device by reflecting authentication data to intercept connections.",
    severity: "high",
    recommendation:
      "Use Bluetooth 4.2+ with Secure Connections for stronger authentication.",
  },
  DDOS: {
    id: "DDOS",
    name: "Distributed Denial of Service",
    description:
      "Overwhelming device with packets to crash, restart, or drain battery.",
    severity: "medium",
    recommendation:
      "Keep Bluetooth turned off when not in use and maintain updated firmware.",
  },
  MITM: {
    id: "MITM",
    name: "Man-in-the-Middle Attack",
    description:
      "Attacker intercepts and potentially alters communications between two Bluetooth devices.",
    severity: "high",
    recommendation:
      "Use Secure Simple Pairing with Numeric Comparison or Out-of-Band methods.",
  },
  MISSING_AUTHENTICATION: {
    id: "MISSING_AUTHENTICATION",
    name: "Missing Authentication",
    severity: "high",
    description:
      "Device does not require authentication for Bluetooth connections.",
    recommendation:
      "Configure device to require PIN or passkey for all connections.",
  },
  WEAK_ENCRYPTION: {
    id: "WEAK_ENCRYPTION",
    name: "Weak Encryption",
    severity: "high",
    description:
      "Device uses weak encryption methods for Bluetooth communication.",
    recommendation:
      "Update firmware or replace device with one using Bluetooth 4.2 or later.",
  },
  NO_NAME_DEVICE: {
    id: "NO_NAME_DEVICE",
    name: "Unnamed Device",
    severity: "low",
    description:
      "Device operating without a human-readable name increases difficulty in identification and may indicate MAC address spoofing.",
    recommendation: "Verify device identity before connecting.",
  },
  UNBRANDED_DEVICE: {
    id: "UNBRANDED_DEVICE",
    name: "Unbranded/Generic Device",
    severity: "medium",
    description:
      "Inexpensive generic devices often lack security updates and may contain vulnerable firmware.",
    recommendation:
      "Consider using devices from reputable manufacturers with regular security updates.",
  },
  OUTDATED_FIRMWARE: {
    id: "OUTDATED_FIRMWARE",
    name: "Outdated Firmware",
    severity: "high",
    description:
      "Device is running outdated firmware with known security vulnerabilities.",
    recommendation:
      "Update to the latest firmware version provided by the manufacturer.",
  },
  OPEN_PORTS: {
    id: "OPEN_PORTS",
    name: "Unnecessary Open Ports",
    severity: "high",
    description:
      "Device has unnecessary network ports open that could be exploited.",
    recommendation: "Close unnecessary ports and disable unused services.",
  },
  DEFAULT_CREDENTIALS: {
    id: "DEFAULT_CREDENTIALS",
    name: "Default Credentials",
    severity: "critical",
    description: "Device is using default username and password combinations.",
    recommendation:
      "Change default passwords to strong, unique credentials immediately.",
  },
  INSECURE_PROTOCOLS: {
    id: "INSECURE_PROTOCOLS",
    name: "Insecure Protocols",
    severity: "high",
    description:
      "Device is using insecure protocols like Telnet, FTP, or unencrypted HTTP.",
    recommendation:
      "Disable insecure protocols and use secure alternatives like SSH, SFTP, and HTTPS.",
  },
  MDNS_INFORMATION_DISCLOSURE: {
    id: "MDNS_INFORMATION_DISCLOSURE",
    name: "mDNS Information Disclosure",
    severity: "medium",
    description:
      "Device is broadcasting sensitive information through mDNS service advertisements.",
    recommendation:
      "Configure mDNS to minimize information disclosure or disable if not needed.",
  },
  UNENCRYPTED_COMMUNICATION: {
    id: "UNENCRYPTED_COMMUNICATION",
    name: "Unencrypted Communication",
    severity: "high",
    description: "Device transmits sensitive data without encryption.",
    recommendation:
      "Enable encryption for all communications and check for HTTPS support.",
  },
  UPnP_ENABLED: {
    id: "UPnP_ENABLED",
    name: "UPnP Enabled",
    severity: "medium",
    description:
      "Universal Plug and Play is enabled, which can expose device to network attacks.",
    recommendation: "Disable UPnP if not absolutely necessary.",
  },
  KRACK: {
    id: "KRACK",
    name: "KRACK (Key Reinstallation Attack)",
    severity: "high",
    description:
      "Vulnerability in WPA2 protocol implementation that allows attackers to decrypt Wi-Fi traffic.",
    recommendation:
      "Update device firmware to include patches for KRACK vulnerability.",
    cve: "CVE-2017-13077",
  },
  BLUETOOTH_LE_TRACKING: {
    id: "BLUETOOTH_LE_TRACKING",
    name: "Bluetooth LE Tracking",
    severity: "medium",
    description:
      "Device is vulnerable to tracking through its Bluetooth LE advertisements.",
    recommendation:
      "Use devices that implement Bluetooth privacy features like address randomization.",
  },
  FRAGMENTATION_ATTACK: {
    id: "FRAGMENTATION_ATTACK",
    name: "Bluetooth Fragmentation Attack",
    severity: "high",
    description:
      "Vulnerability in the way Bluetooth handles fragmented packets, allowing remote code execution.",
    recommendation:
      "Update device firmware to include patches for fragmentation attack vulnerabilities.",
    cve: "CVE-2021-28139",
  },
  SPECTRA: {
    id: "SPECTRA",
    name: "SPECTRA Side-Channel Attack",
    severity: "high",
    description:
      "Side-channel vulnerabilities affecting devices with multi-radio coexistence.",
    recommendation:
      "Update device firmware and maintain physical security of your devices.",
    cve: "CVE-2020-10707",
  },
};

export default {};
