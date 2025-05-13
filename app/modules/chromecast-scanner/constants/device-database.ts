// app/modules/chromecast-scanner/constants/device-database.ts
import { ChromecastDevice, DeviceSignature } from "../types";
import { DeviceType } from "./service-identifiers";

/**
 * Known Chromecast and Google/Nest device database
 */
export const KNOWN_DEVICES: Record<string, DeviceSignature> = {
  "Chromecast-Gen1": {
    manufacturer: "Google",
    model: "Chromecast (1st generation)",
    modelAliases: ["H2G2-42", "Chromecast", "First Generation Chromecast"],
    identificationPatterns: ["chromecast", "eureka", "h2g2-42"],
    vulnerableVersions: [
      "1.0",
      "1.1",
      "1.2",
      "1.3",
      "1.4",
      "1.5",
      "1.6",
      "1.7",
      "1.8",
    ],
    recommendedFirmware: "1.36.157768 or later",
    deviceType: DeviceType.CHROMECAST,
    knownMACs: ["80:D2:1D", "54:60:09", "30:FD:38"],
    knownServices: ["_googlecast._tcp", "_googlezone._tcp"],
  },
  "Chromecast-Gen2": {
    manufacturer: "Google",
    model: "Chromecast (2nd generation)",
    modelAliases: ["NC2-6A5", "Chromecast 2", "Second Generation Chromecast"],
    identificationPatterns: ["chromecast", "nc2-6a5"],
    vulnerableVersions: ["1.20", "1.21", "1.22", "1.23", "1.24", "1.25"],
    recommendedFirmware: "1.42.172094 or later",
    deviceType: DeviceType.CHROMECAST,
    knownMACs: ["54:60:09", "43:A0:4F", "F4:F5:D8"],
    knownServices: ["_googlecast._tcp", "_googlezone._tcp"],
  },
  "Chromecast-Gen3": {
    manufacturer: "Google",
    model: "Chromecast (3rd generation)",
    modelAliases: ["GA00439", "Chromecast 3", "Third Generation Chromecast"],
    identificationPatterns: ["chromecast", "ga00439"],
    vulnerableVersions: ["1.40", "1.41", "1.42"],
    recommendedFirmware: "1.49.230693 or later",
    deviceType: DeviceType.CHROMECAST,
    knownMACs: ["C8:EC:8E", "30:FD:38", "54:B5:6F"],
    knownServices: ["_googlecast._tcp", "_googlezone._tcp"],
  },
  "Chromecast-Ultra": {
    manufacturer: "Google",
    model: "Chromecast Ultra",
    modelAliases: ["NC2-6A5-D", "GA00595", "Ultra"],
    identificationPatterns: ["chromecast", "ultra", "nc2-6a5-d", "ga00595"],
    vulnerableVersions: ["1.25", "1.26", "1.27", "1.28", "1.29", "1.30"],
    recommendedFirmware: "1.42.180348 or later",
    deviceType: DeviceType.CHROMECAST_ULTRA,
    knownMACs: ["D8:6C:63", "A4:77:33", "54:60:09"],
    knownServices: ["_googlecast._tcp", "_googlezone._tcp"],
  },
  "Chromecast-GoogleTV": {
    manufacturer: "Google",
    model: "Chromecast with Google TV",
    modelAliases: ["GA01919", "Google TV", "Sabrina"],
    identificationPatterns: ["chromecast", "google tv", "sabrina", "ga01919"],
    vulnerableVersions: ["1.0", "1.1", "1.2", "1.3"],
    recommendedFirmware: "QTS1.210311.008 or later",
    deviceType: DeviceType.CHROMECAST_WITH_GOOGLE_TV,
    knownMACs: ["A4:77:33", "50:DC:E7", "D8:6C:63"],
    knownServices: ["_googlecast._tcp", "_androidtvremote._tcp"],
  },
  GoogleHome: {
    manufacturer: "Google",
    model: "Google Home",
    modelAliases: ["H0ME", "Home", "Google Assistant"],
    identificationPatterns: ["google", "home", "h0me", "assistant"],
    vulnerableVersions: ["93937", "100552", "107764", "118944", "131908"],
    recommendedFirmware: "154164 or later",
    deviceType: DeviceType.GOOGLE_HOME,
    knownMACs: ["54:60:09", "F4:F5:D8", "20:DF:B9"],
    knownServices: ["_googlecast._tcp", "_googlezone._tcp", "_googlehome._tcp"],
  },
  GoogleHomeMini: {
    manufacturer: "Google",
    model: "Google Home Mini",
    modelAliases: ["A0DA", "Mini", "Home Mini"],
    identificationPatterns: ["google", "home mini", "a0da", "mini"],
    vulnerableVersions: ["129656", "139464", "141374", "148982", "156776"],
    recommendedFirmware: "170484 or later",
    deviceType: DeviceType.GOOGLE_HOME_MINI,
    knownMACs: ["20:DF:B9", "48:D6:D5", "B4:E6:2D"],
    knownServices: ["_googlecast._tcp", "_googlezone._tcp", "_googlehome._tcp"],
  },
  GoogleHomeMax: {
    manufacturer: "Google",
    model: "Google Home Max",
    modelAliases: ["GWRQY", "Home Max", "Max"],
    identificationPatterns: ["google", "home max", "gwrqy", "max"],
    vulnerableVersions: ["129656", "139464", "141374", "148982", "156776"],
    recommendedFirmware: "170484 or later",
    deviceType: DeviceType.GOOGLE_HOME_MAX,
    knownMACs: ["D8:6C:63", "54:60:09", "A4:77:33"],
    knownServices: ["_googlecast._tcp", "_googlezone._tcp", "_googlehome._tcp"],
  },
  NestHub: {
    manufacturer: "Google",
    model: "Nest Hub (formerly Home Hub)",
    modelAliases: ["GA00426", "Home Hub", "Nest Hub"],
    identificationPatterns: ["google", "nest hub", "home hub", "ga00426"],
    vulnerableVersions: ["168380", "175175", "187160"],
    recommendedFirmware: "194160 or later",
    deviceType: DeviceType.NEST_HUB,
    knownMACs: ["54:60:09", "C8:2E:47", "A4:77:33"],
    knownServices: ["_googlecast._tcp", "_googlezone._tcp", "_googlehome._tcp"],
  },
  NestHubMax: {
    manufacturer: "Google",
    model: "Nest Hub Max",
    modelAliases: ["GA00523", "Hub Max"],
    identificationPatterns: ["google", "nest hub max", "hub max", "ga00523"],
    vulnerableVersions: ["175175", "187160", "200368"],
    recommendedFirmware: "214695 or later",
    deviceType: DeviceType.NEST_HUB_MAX,
    knownMACs: ["54:60:09", "A4:77:33", "C8:2E:47"],
    knownServices: ["_googlecast._tcp", "_googlezone._tcp", "_googlehome._tcp"],
  },
  NestMini: {
    manufacturer: "Google",
    model: "Nest Mini (2nd generation)",
    modelAliases: ["GA01099", "Nest Mini 2", "Second Generation Mini"],
    identificationPatterns: ["google", "nest mini", "ga01099"],
    vulnerableVersions: ["199400", "212619", "218452"],
    recommendedFirmware: "229255 or later",
    deviceType: DeviceType.NEST_MINI,
    knownMACs: ["54:60:09", "A4:77:33", "D8:6C:63"],
    knownServices: ["_googlecast._tcp", "_googlezone._tcp", "_googlehome._tcp"],
  },
  AndroidTV: {
    manufacturer: "Various",
    model: "Android TV Device",
    modelAliases: ["Shield TV", "Sony Bravia", "Mi Box"],
    identificationPatterns: ["android tv", "shield", "bravia", "mi box"],
    vulnerableVersions: ["8.0", "9.0"],
    recommendedFirmware: "Android 10 or later",
    deviceType: DeviceType.ANDROID_TV,
    knownMACs: [],
    knownServices: ["_googlecast._tcp", "_androidtvremote._tcp"],
  },
  NvidiaShield: {
    manufacturer: "NVIDIA",
    model: "SHIELD Android TV",
    modelAliases: ["Shield", "Shield Pro", "Shield TV Pro"],
    identificationPatterns: ["nvidia", "shield", "tegra"],
    vulnerableVersions: ["8.0", "8.1", "8.2"],
    recommendedFirmware: "8.2.3 or later",
    deviceType: DeviceType.NVIDIA_SHIELD,
    knownMACs: ["00:04:4B"],
    knownServices: [
      "_nvstream._tcp",
      "_googlecast._tcp",
      "_androidtvremote._tcp",
    ],
  },
  VizioSmartcast: {
    manufacturer: "Vizio",
    model: "SmartCast TV",
    modelAliases: ["V-Series", "M-Series", "P-Series", "OLED", "Quantum"],
    identificationPatterns: ["vizio", "smartcast", "viziocast"],
    vulnerableVersions: ["3.0", "4.0", "5.0", "6.0"],
    recommendedFirmware: "7.0 or later",
    deviceType: DeviceType.VIZIO_SMARTCAST,
    knownMACs: ["C4:E0:32", "D4:AE:05", "7C:A9:7D"],
    knownServices: ["_viziocast._tcp", "_googlecast._tcp"],
  },
};

/**
 * Create a context object with all available identification information
 */
interface IdentificationContext {
  name?: string;
  id: string;
  serviceTypes?: string[];
  advertisedName?: string;
  ipAddress?: string;
  modelName?: string;
  firmwareVersion?: string;
}

/**
 * Identify a device based on available information from network discovery
 */
export function identifyDevice(
  device: ChromecastDevice
): DeviceSignature | null {
  // Create identification context object with all available info
  const context: IdentificationContext = {
    id: device.id.toLowerCase(),
    name: device.name?.toLowerCase() || "",
    serviceTypes: device.serviceTypes?.map((type) => type.toLowerCase()) || [],
    advertisedName: device.hostName?.toLowerCase() || "",
    ipAddress: device.ipAddress,
    modelName: device.modelName?.toLowerCase() || "",
    firmwareVersion: device.firmwareVersion,
  };

  // Try to identify the device using our knowledge base

  // Check for exact device name matches first (most reliable)
  if (device.name) {
    const deviceNameLower = device.name.toLowerCase();

    // Check for specific manufacturer names in device name
    for (const [key, signature] of Object.entries(KNOWN_DEVICES)) {
      // If device name contains manufacturer name and model, it's a strong match
      if (
        deviceNameLower.includes(signature.manufacturer.toLowerCase()) &&
        signature.model &&
        deviceNameLower.includes(signature.model.toLowerCase())
      ) {
        console.log(
          `[DEBUG] Device identified by explicit name match: ${signature.manufacturer} ${signature.model}`
        );
        return signature;
      }

      // Check for model aliases in the name
      if (signature.modelAliases) {
        for (const alias of signature.modelAliases) {
          if (deviceNameLower.includes(alias.toLowerCase())) {
            console.log(
              `[DEBUG] Device identified by model alias in name: ${signature.manufacturer} ${signature.model}`
            );
            return signature;
          }
        }
      }
    }
  }

  // Check for model name match (if available)
  if (context.modelName) {
    for (const [key, signature] of Object.entries(KNOWN_DEVICES)) {
      if (signature.modelAliases) {
        for (const alias of signature.modelAliases) {
          if (context.modelName.includes(alias.toLowerCase())) {
            console.log(
              `[DEBUG] Device identified by model name: ${signature.manufacturer} ${signature.model}`
            );
            return signature;
          }
        }
      }
    }
  }

  // Look for known service types matches
  if (context.serviceTypes && context.serviceTypes.length > 0) {
    for (const [key, signature] of Object.entries(KNOWN_DEVICES)) {
      if (signature.knownServices && signature.knownServices.length > 0) {
        // Count matches for service types
        let matchCount = 0;
        for (const knownService of signature.knownServices) {
          if (
            context.serviceTypes.some((serviceType) =>
              serviceType.toLowerCase().includes(knownService.toLowerCase())
            )
          ) {
            matchCount++;
          }
        }

        // If multiple services match, this is a stronger signal
        if (matchCount > 1) {
          console.log(
            `[DEBUG] Device identified by service types (${matchCount} matches) as ${signature.manufacturer} ${signature.model}`
          );
          return signature;
        }
      }
    }
  }

  // Check for identification patterns in the device name or advertised name
  const namesToCheck = [
    context.name || "",
    context.advertisedName || "",
  ].filter(Boolean);

  if (namesToCheck.length > 0) {
    // Create a combined identification text
    const identificationText = namesToCheck.join(" ").toLowerCase();

    // Create a scoring system for better pattern matching
    let bestMatchScore = 0;
    let bestMatchSignature: DeviceSignature | null = null;

    for (const [key, signature] of Object.entries(KNOWN_DEVICES)) {
      let score = 0;

      // Check if any identification pattern matches
      for (const pattern of signature.identificationPatterns) {
        if (identificationText.includes(pattern.toLowerCase())) {
          // Longer patterns are more specific and reliable
          score += pattern.length;
        }
      }

      // If this is the best match so far, store it
      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatchSignature = signature;
      }
    }

    // Only use pattern matching if we got a decent score
    if (bestMatchScore > 3 && bestMatchSignature) {
      console.log(
        `[DEBUG] Device identified by name patterns (score: ${bestMatchScore}) as ${bestMatchSignature.manufacturer} ${bestMatchSignature.model}`
      );
      return bestMatchSignature;
    }
  }

  // If we haven't identified the device yet but have service type that indicates it's a Chromecast
  if (
    context.serviceTypes &&
    context.serviceTypes.some(
      (type) =>
        type.includes("_googlecast") ||
        type.includes("_googlezone") ||
        type.includes("_androidtvremote")
    )
  ) {
    // Create a generic signature
    return {
      manufacturer: "Google",
      model: "Chromecast Device",
      identificationPatterns: ["chromecast", "googlecast"],
      deviceType: DeviceType.CHROMECAST,
      knownServices: ["_googlecast._tcp"],
    };
  }

  // No match found
  return null;
}

export default {
  KNOWN_DEVICES,
  identifyDevice,
};
