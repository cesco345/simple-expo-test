// app/modules/chromecast-scanner/constants/vulnerabilities.ts - Added new vulnerabilities
import { ChromecastVulnerability } from "../types";

/**
 * Known vulnerabilities database for Chromecast and Google Home devices
 */
export const VULNERABILITIES: Record<string, ChromecastVulnerability> = {
  UNAUTHENTICATED_API_ACCESS: {
    id: "UNAUTHENTICATED_API_ACCESS",
    name: "Unauthenticated API Access",
    description:
      "Device allows unauthenticated access to local API endpoints that should require authentication.",
    severity: "high",
    recommendation:
      "Update firmware to the latest version. Restrict the device to a separate network segment with limited access.",
  },
  DEAUTH_NAME_OVERFLOW: {
    id: "DEAUTH_NAME_OVERFLOW",
    name: "Deauthentication Name Overflow",
    description:
      "Vulnerability in older Chromecast devices allowing buffer overflow attacks via specially crafted Wi-Fi network names.",
    severity: "high",
    recommendation:
      "Update to the latest firmware version. Keep the device on a secure Wi-Fi network.",
    cve: "CVE-2019-9493",
  },
  DNS_REBINDING: {
    id: "DNS_REBINDING",
    name: "DNS Rebinding Vulnerability",
    description:
      "Device is vulnerable to DNS rebinding attacks that can allow remote attackers to access the local API.",
    severity: "medium",
    recommendation:
      "Update to the latest firmware. Configure your router's DNS settings to prevent rebinding attacks.",
    cve: "CVE-2018-4559",
  },
  CAST_CONTROL: {
    id: "CAST_CONTROL",
    name: "Unauthorized Cast Control",
    description:
      "Device can be controlled by any device on the same network without authentication.",
    severity: "medium",
    recommendation:
      "Segment your network to isolate IoT devices or use a dedicated guest network for casting devices.",
  },
  MDNS_INFORMATION_DISCLOSURE: {
    id: "MDNS_INFORMATION_DISCLOSURE",
    name: "mDNS Information Disclosure",
    severity: "medium",
    description:
      "Device broadcasts sensitive information through mDNS service advertisements including device details and firmware version.",
    recommendation:
      "Place the device on a dedicated IoT network segment to limit the scope of information disclosure.",
  },
  OUTDATED_FIRMWARE: {
    id: "OUTDATED_FIRMWARE",
    name: "Outdated Firmware",
    severity: "high",
    description:
      "Device is running outdated firmware with known security vulnerabilities.",
    recommendation: "Update to the latest firmware version provided by Google.",
  },
  SETUP_PIN_BYPASS: {
    id: "SETUP_PIN_BYPASS",
    name: "Setup PIN Bypass",
    severity: "high",
    description:
      "Vulnerability in the setup process allowing attackers to bypass PIN verification.",
    recommendation:
      "Update to the latest firmware version which addresses this vulnerability.",
    cve: "CVE-2020-8764",
  },
  DEFAULT_CREDENTIALS: {
    id: "DEFAULT_CREDENTIALS",
    name: "Default Credentials",
    severity: "critical",
    description:
      "Device is using default credentials which may allow unauthorized administrative access.",
    recommendation:
      "Change default passwords immediately and follow a strong password policy.",
  },
  NON_STANDARD_PORT: {
    id: "NON_STANDARD_PORT",
    name: "Non-Standard Port Usage",
    severity: "medium",
    description:
      "Device is using non-standard ports for Chromecast services which may indicate tampering or misconfiguration.",
    recommendation:
      "Verify device integrity and check for any suspicious settings or behavior.",
  },
  GUEST_MODE_VULNERABILITY: {
    id: "GUEST_MODE_VULNERABILITY",
    name: "Guest Mode Ultrasonic Pairing Vulnerability",
    severity: "medium",
    description:
      "The ultrasonic pairing feature in Guest Mode can be exploited to allow unauthorized access.",
    recommendation:
      "Disable Guest Mode when not in use or update to the latest firmware version.",
    cve: "CVE-2019-5702",
  },
  OPEN_PORTS: {
    id: "OPEN_PORTS",
    name: "Unnecessary Open Ports",
    severity: "high",
    description:
      "Device has unnecessary network ports open that could be exploited.",
    recommendation:
      "Update firmware to latest version which might close unnecessary ports. Consider network segmentation for IoT devices.",
  },
  INSECURE_HTTP: {
    id: "INSECURE_HTTP",
    name: "Insecure HTTP Communication",
    severity: "medium",
    description:
      "Device uses unencrypted HTTP for local API communication instead of HTTPS.",
    recommendation:
      "Keep the device on a trusted network segment to prevent eavesdropping on local communications.",
  },
  DISCONNECT_ATTACK: {
    id: "DISCONNECT_ATTACK",
    name: "Disconnect Attack Vulnerability",
    severity: "low",
    description:
      "Device can be forced to disconnect from the current stream by any device on the same network.",
    recommendation:
      "Segment your network to limit which devices can access your Chromecast.",
  },
  AMBIENT_MODE_DATA_LEAK: {
    id: "AMBIENT_MODE_DATA_LEAK",
    name: "Ambient Mode Data Leak",
    severity: "low",
    description:
      "Ambient mode may reveal information from linked accounts to anyone with physical access to view the screen.",
    recommendation:
      "Disable ambient mode or limit the information displayed when the device is not actively being used.",
  },
  SOUND_NOTIFICATION_ATTACK: {
    id: "SOUND_NOTIFICATION_ATTACK",
    name: "Sound Notification Attack",
    severity: "low",
    description:
      "Attackers can trigger notification sounds at high volume on voice-enabled devices.",
    recommendation:
      "Keep voice assistants on a separate network or use mute options when not in use.",
  },
  CROSS_SITE_REQUEST_FORGERY: {
    id: "CROSS_SITE_REQUEST_FORGERY",
    name: "Cross-Site Request Forgery",
    severity: "medium",
    description:
      "Local web interface is vulnerable to Cross-Site Request Forgery attacks that can change device settings.",
    recommendation:
      "Update firmware to latest version and avoid accessing unknown websites while on the same network as your Chromecast device.",
    cve: "CVE-2020-8960",
  },
  LOCKSCREEN_BYPASS: {
    id: "LOCKSCREEN_BYPASS",
    name: "Lock Screen Bypass",
    severity: "medium",
    description:
      "Certain voice commands may bypass locked devices when processed by linked smart displays.",
    recommendation:
      "Update firmware and review which voice commands are allowed when the device is locked.",
  },
  FRAGMENTATION_ATTACK: {
    id: "FRAGMENTATION_ATTACK",
    name: "Wi-Fi Fragmentation Attack",
    severity: "high",
    description:
      "Vulnerability in Wi-Fi implementation allowing packet injection through fragmentation.",
    recommendation:
      "Update to latest firmware version which patches this vulnerability.",
    cve: "CVE-2020-24588",
  },
  DDOS_VULNERABILITY: {
    id: "DDOS_VULNERABILITY",
    name: "DDoS Amplification",
    severity: "medium",
    description:
      "Device may be used as an amplifier in DDoS attacks if exposed to the internet.",
    recommendation:
      "Ensure the device is not directly accessible from the internet and is behind a properly configured firewall.",
  },
  BLUBORNE: {
    id: "BLUBORNE",
    name: "BlueBorne Bluetooth Vulnerability",
    severity: "high",
    description:
      "Bluetooth implementation vulnerable to remote code execution via BlueBorne attack.",
    recommendation:
      "Update to the latest firmware version which includes patches for BlueBorne vulnerabilities.",
    cve: "CVE-2017-0785",
  },
  UNENCRYPTED_MEDIA_TRANSPORT: {
    id: "UNENCRYPTED_MEDIA_TRANSPORT",
    name: "Unencrypted Media Transport",
    severity: "medium",
    description:
      "Media content sent to the device may not be encrypted during transmission on the local network.",
    recommendation:
      "Use applications that support encrypted casting and keep devices on a secured network.",
  },
  // NEW VULNERABILITIES
  PROTECTED_DEVICE: {
    id: "PROTECTED_DEVICE",
    name: "Protected Device with Limited Authentication",
    severity: "low",
    description:
      "Device is password protected but could still be vulnerable to brute force attacks or weak authentication mechanisms.",
    recommendation:
      "Ensure the device has a complex password and limit access to the network where the device is located.",
  },
  KRACK_WIFI_VULNERABILITY: {
    id: "KRACK_WIFI_VULNERABILITY",
    name: "KRACK Wi-Fi Vulnerability",
    severity: "high",
    description:
      "Device vulnerable to Key Reinstallation Attacks (KRACK) that allow attackers to decrypt Wi-Fi traffic.",
    recommendation:
      "Update to the latest firmware version which includes patches for KRACK vulnerabilities.",
    cve: "CVE-2017-13077, CVE-2017-13078",
  },
  BLUETOOTH_VULNERABILITY: {
    id: "BLUETOOTH_VULNERABILITY",
    name: "Bluetooth Vulnerability",
    severity: "medium",
    description:
      "Device has Bluetooth capabilities that could be exploited for device tracking or wireless attacks.",
    recommendation:
      "Keep the device's firmware updated and ensure it's not discoverable to unknown devices.",
  },
  VOICE_RECORDING_PRIVACY: {
    id: "VOICE_RECORDING_PRIVACY",
    name: "Voice Recording Privacy Risk",
    severity: "medium",
    description:
      "Voice-enabled device may record and store audio snippets which could contain sensitive information.",
    recommendation:
      "Review and regularly delete voice recordings in your Google account. Consider muting the microphone when discussing sensitive information.",
  },
  NETWORK_POSITION_VULNERABILITY: {
    id: "NETWORK_POSITION_VULNERABILITY",
    name: "Strategic Network Position Risk",
    severity: "medium",
    description:
      "Device has a strategic network position that could be leveraged for Man-in-the-Middle attacks if compromised.",
    recommendation:
      "Place the device in a segregated IoT network away from critical network infrastructure.",
  },
  TLS_VULNERABILITY: {
    id: "TLS_VULNERABILITY",
    name: "TLS/SSL Implementation Issues",
    severity: "high",
    description:
      "Device may use outdated TLS versions or vulnerable cipher suites that can be exploited in man-in-the-middle attacks.",
    recommendation:
      "Update to the latest firmware which includes more secure TLS implementations.",
    cve: "CVE-2018-0737, CVE-2018-0739",
  },
  APP_SIDELOADING_RISK: {
    id: "APP_SIDELOADING_RISK",
    name: "App Sideloading Risk",
    severity: "medium",
    description:
      "Device allows sideloading of applications which could introduce malware or unwanted software.",
    recommendation:
      "Disable Developer Mode when not in use and only install apps from the official Google Play Store.",
  },
  LOCAL_NETWORK_ACCESS: {
    id: "LOCAL_NETWORK_ACCESS",
    name: "Excessive Local Network Access",
    severity: "medium",
    description:
      "Device has unrestricted access to the local network and could potentially access sensitive devices or services.",
    recommendation:
      "Place the device in a segregated IoT VLAN with limited access to other network segments.",
  },
  SMART_HOME_INTEGRATION_RISK: {
    id: "SMART_HOME_INTEGRATION_RISK",
    name: "Smart Home Integration Risk",
    severity: "medium",
    description:
      "Device is integrated with smart home systems and could be used as an attack vector to control other connected devices.",
    recommendation:
      "Limit which smart home devices are linked to your Chromecast and regularly audit connected integrations.",
  },
  ACCOUNT_LINKAGE_RISK: {
    id: "ACCOUNT_LINKAGE_RISK",
    name: "Account Linkage Risk",
    severity: "medium",
    description:
      "Device is linked to multiple online accounts which could expose sensitive information if the device is compromised.",
    recommendation:
      "Regularly review which accounts are linked to your Chromecast and remove unnecessary connections.",
  },
};

export default VULNERABILITIES;
