// app/modules/bluetooth-scanner/constants/device-database.ts
import { BluetoothDevice, DeviceSignature, NetworkDevice } from "../types";
import { getManufacturerFromMac } from "./mac-oui-database";
import { DeviceType } from "./service-identifiers";

/**
 * Known Bluetooth and network devices database
 */
export const KNOWN_DEVICES: Record<string, DeviceSignature> = {
  // Bose devices
  "Bose-SoundLink": {
    manufacturer: "Bose",
    model: "SoundLink",
    modelAliases: ["Micro", "Mini", "Revolve"],
    identificationPatterns: ["bose", "soundlink", "le-bose"],
    vulnerableVersions: ["1.0", "1.1", "1.2", "2.0", "2.1"],
    recommendedFirmware: "2.2 or later",
    deviceType: DeviceType.SPEAKER,
    knownMACs: ["60:AB:D2", "04:52:C7", "38:18:4C"],
    knownServices: ["febe"],
  },
  "Bose-QuietComfort": {
    manufacturer: "Bose",
    model: "QuietComfort",
    modelAliases: ["QC", "QC35", "QC45", "NC700"],
    identificationPatterns: ["bose", "qc", "quietcomfort", "nc"],
    vulnerableVersions: ["3.0", "3.1", "4.0"],
    recommendedFirmware: "4.1 or later",
    deviceType: DeviceType.HEADPHONES,
    knownMACs: ["94:B2:CC", "E8:37:7A"],
    knownServices: ["febe", "110A", "110B"],
  },

  // Sony devices
  "Sony-WH1000XM": {
    manufacturer: "Sony",
    model: "WH-1000XM series",
    modelAliases: ["WH-1000XM3", "WH-1000XM4", "WH-1000XM5"],
    identificationPatterns: ["sony", "wh", "1000x"],
    vulnerableVersions: ["1.0", "2.0", "3.0", "4.0.1"],
    recommendedFirmware: "4.1.1 or later",
    deviceType: DeviceType.HEADPHONES,
    knownMACs: ["00:13:A9", "B4:8B:7E", "C4:A5:81"],
    knownServices: ["fda5", "110A", "110B"],
  },
  "Sony-WF1000XM": {
    manufacturer: "Sony",
    model: "WF-1000XM series",
    modelAliases: ["WF-1000XM3", "WF-1000XM4"],
    identificationPatterns: ["sony", "wf", "1000x"],
    vulnerableVersions: ["1.0", "2.0", "2.1"],
    recommendedFirmware: "2.2 or later",
    deviceType: DeviceType.EARBUDS,
    knownMACs: ["00:13:A9", "94:CE:2C", "FC:0F:E6"],
    knownServices: ["fda5", "110A", "110B"],
  },

  // Apple devices
  "Apple-AirPods": {
    manufacturer: "Apple",
    model: "AirPods",
    modelAliases: ["AirPods Pro", "AirPods Max"],
    identificationPatterns: ["airpods", "appleacc"],
    vulnerableVersions: ["3D27", "3E751", "4A400"],
    recommendedFirmware: "4A402 or later",
    deviceType: DeviceType.EARBUDS,
    knownMACs: ["00:C6:10", "3C:AB:8E", "70:73:CB"],
    knownServices: ["FE07", "FEE7", "1805", "180A"],
  },
  "Apple-Watch": {
    manufacturer: "Apple",
    model: "Apple Watch",
    identificationPatterns: ["watch", "applewatch"],
    vulnerableVersions: ["7.0", "7.1", "7.2", "7.3", "7.4", "8.0"],
    recommendedFirmware: "8.1 or later",
    deviceType: DeviceType.SMARTWATCH,
    knownMACs: ["28:7B:8D", "F0:D1:A9", "F8:6F:C1"],
    knownServices: ["FE07", "180D", "1805", "180A"],
  },

  // Samsung devices
  "Samsung-Galaxy-Buds": {
    manufacturer: "Samsung",
    model: "Galaxy Buds",
    modelAliases: ["Buds", "Buds+", "Buds Pro", "Buds Live"],
    identificationPatterns: ["galaxy buds", "buds"],
    vulnerableVersions: ["R170XXU0ATC", "R175XXU0AT"],
    recommendedFirmware: "R175XXU0AUB or later",
    deviceType: DeviceType.EARBUDS,
    knownMACs: ["50:85:69", "8C:BF:A6", "54:40:AD"],
    knownServices: ["1101", "110A", "110B"],
  },
  "Samsung-Galaxy-Watch": {
    manufacturer: "Samsung",
    model: "Galaxy Watch",
    modelAliases: ["Watch3", "Watch4", "Watch5"],
    identificationPatterns: ["galaxy watch", "sm-r"],
    vulnerableVersions: ["R800XXU1C", "R810XXU1C"],
    recommendedFirmware: "R800XXU1D or later",
    deviceType: DeviceType.SMARTWATCH,
    knownMACs: ["98:52:B1", "BC:D0:74", "A0:75:91"],
    knownServices: ["180D", "1805", "180A", "1812"],
  },

  // Meta/Oculus devices
  "Meta-Quest": {
    manufacturer: "Meta",
    model: "Quest",
    modelAliases: ["Quest", "Quest 2", "Quest Pro"],
    identificationPatterns: ["oculus", "quest", "meta quest", "fpisc"],
    vulnerableVersions: ["28.0", "29.0", "30.0", "31.0", "32.0"],
    recommendedFirmware: "33.0 or later",
    deviceType: DeviceType.VR_HEADSET,
    knownMACs: ["28:86:20", "3C:F3:00", "58:AB:6A"],
    knownServices: ["_oculusal_sp._tcp", "_oculusal_sp_v2._tcp", "fdf0"],
  },

  // Google devices
  "Google-Chromecast": {
    manufacturer: "Google",
    model: "Chromecast",
    modelAliases: ["Chromecast Ultra", "Chromecast with Google TV"],
    identificationPatterns: ["chromecast", "google cast", "googlecast"],
    vulnerableVersions: ["1.36", "1.40", "1.42"],
    recommendedFirmware: "1.50 or later",
    deviceType: DeviceType.STREAMING_DEVICE,
    knownMACs: ["54:60:09", "F8:8F:CA", "D8:3C:69"],
    knownServices: ["_googlecast._tcp", "fd5a"],
  },
  "Google-Home": {
    manufacturer: "Google",
    model: "Home",
    modelAliases: ["Home Mini", "Nest Mini", "Home Max", "Nest Hub"],
    identificationPatterns: ["google home", "nest", "google nest"],
    vulnerableVersions: ["157218", "169868", "180014"],
    recommendedFirmware: "193042 or later",
    deviceType: DeviceType.SPEAKER,
    knownMACs: ["F8:8F:CA", "20:DF:B9", "54:60:09"],
    knownServices: ["_googlecast._tcp", "_googlezone._tcp"],
  },

  // Smart TVs
  "Vizio-SmartTV": {
    manufacturer: "Vizio",
    model: "SmartTV",
    modelAliases: ["V-Series", "M-Series", "P-Series", "OLED", "Quantum"],
    identificationPatterns: ["vizio", "viziocast", "v435-j01"],
    vulnerableVersions: ["3.0", "4.0", "5.0", "6.0"],
    recommendedFirmware: "7.0 or later",
    deviceType: DeviceType.TV,
    knownMACs: ["C4:E0:32", "D4:AE:05", "7C:A9:7D"],
    knownServices: ["_viziocast._tcp", "_googlecast._tcp"],
  },
  "LG-SmartTV": {
    manufacturer: "LG",
    model: "SmartTV",
    modelAliases: ["OLED", "NanoCell", "UHD", "QNED"],
    identificationPatterns: ["lg", "lgsmartdevice", "webos"],
    vulnerableVersions: ["3.0", "3.5", "4.0", "4.5"],
    recommendedFirmware: "5.0 or later",
    deviceType: DeviceType.TV,
    knownMACs: ["58:2A:F7", "88:C9:D0", "10:F9:6F"],
    knownServices: ["_lgsmartdevice._tcp", "_lebotvservice._tcp"],
  },
  "Samsung-SmartTV": {
    manufacturer: "Samsung",
    model: "SmartTV",
    modelAliases: ["QLED", "Neo QLED", "Frame", "Serif"],
    identificationPatterns: ["samsung", "samsungtvrc", "tizen"],
    vulnerableVersions: ["3.0", "4.0", "5.0"],
    recommendedFirmware: "6.0 or later",
    deviceType: DeviceType.TV,
    knownMACs: ["8C:71:F8", "98:52:B1", "B8:D9:CE"],
    knownServices: ["_samsungtvrc._tcp", "_googlecast._tcp"],
  },

  // Streaming devices
  "Roku-StreamingStick": {
    manufacturer: "Roku",
    model: "Streaming Stick",
    modelAliases: ["Express", "Premiere", "Ultra", "Streambar"],
    identificationPatterns: ["roku", "roku-remote"],
    vulnerableVersions: ["9.0", "9.4", "10.0"],
    recommendedFirmware: "11.0 or later",
    deviceType: DeviceType.STREAMING_DEVICE,
    knownMACs: ["B8:3E:59", "DC:3A:5E", "B0:A7:37"],
    knownServices: ["_roku-remote._tcp", "_http._tcp"],
  },
  "Amazon-FireTV": {
    manufacturer: "Amazon",
    model: "Fire TV",
    modelAliases: ["Fire TV Stick", "Fire Cube", "Fire TV 4K"],
    identificationPatterns: ["amazon", "firetv", "amzn-wplay"],
    vulnerableVersions: ["5.0", "6.0", "6.2"],
    recommendedFirmware: "7.0 or later",
    deviceType: DeviceType.STREAMING_DEVICE,
    knownMACs: ["74:C2:46", "F0:F0:A4", "FC:65:DE"],
    knownServices: ["_amzn-wplay._tcp", "_http._tcp"],
  },

  // Cameras
  "Olympus-AIR": {
    manufacturer: "Olympus",
    model: "AIR-A01",
    identificationPatterns: ["air-a01", "olympus", "camera"],
    vulnerableVersions: ["1.0", "1.1", "1.2"],
    recommendedFirmware: "1.3 or later",
    deviceType: DeviceType.CAMERA,
    knownMACs: ["90:B6:86"],
    knownServices: ["0391d26e-625b-4736-b4da-3bb0910ecec5"],
  },

  // Smart Home
  "Philips-Hue": {
    manufacturer: "Philips",
    model: "Hue Bridge",
    identificationPatterns: ["hue", "philips hue", "philips-hue"],
    vulnerableVersions: ["1.28", "1.30", "1.31"],
    recommendedFirmware: "1.40 or later",
    deviceType: DeviceType.SMART_HOME_HUB,
    knownMACs: ["EC:B5:FA", "00:17:88", "94:72:B5"],
    knownServices: ["_hue._tcp", "_hap._tcp"],
  },

  // Generic devices that are commonly found
  "Generic-Earbuds": {
    manufacturer: "Unknown",
    model: "Generic Earbuds",
    modelAliases: ["TWS", "Earbuds", "i12", "i7s", "i9s", "F9"],
    identificationPatterns: ["tws", "earbuds", "i7s", "i9s", "i12", "f9"],
    vulnerableVersions: ["*"], // All versions considered vulnerable
    recommendedFirmware: "N/A - Consider replacing with secure alternatives",
    deviceType: DeviceType.EARBUDS,
    knownServices: ["110A", "110B", "1108"],
  },
  "Generic-Headphones": {
    manufacturer: "Unknown",
    model: "Generic Headphones",
    identificationPatterns: ["headphone", "headset", "bt"],
    vulnerableVersions: ["*"], // All versions considered vulnerable
    recommendedFirmware: "N/A - Consider replacing with secure alternatives",
    deviceType: DeviceType.HEADPHONES,
    knownServices: ["110A", "110B", "1108"],
  },
  "Generic-Speaker": {
    manufacturer: "Unknown",
    model: "Generic Speaker",
    modelAliases: ["BT Speaker", "Bluetooth Speaker"],
    identificationPatterns: ["speaker", "bt speaker", "music"],
    vulnerableVersions: ["*"], // All versions considered vulnerable
    recommendedFirmware: "N/A - Consider replacing with secure alternatives",
    deviceType: DeviceType.SPEAKER,
    knownServices: ["110A", "110B", "1108"],
  },
  "Generic-SmartTV": {
    manufacturer: "Unknown",
    model: "Generic Smart TV",
    identificationPatterns: ["smart tv", "smarttv", "television"],
    vulnerableVersions: ["*"], // All versions considered vulnerable
    recommendedFirmware: "Check with manufacturer for latest updates",
    deviceType: DeviceType.TV,
    knownServices: ["_http._tcp"],
  },
  "Generic-Router": {
    manufacturer: "Unknown",
    model: "Generic Router",
    identificationPatterns: ["router", "gateway", "access point", "ap"],
    vulnerableVersions: ["*"], // All versions considered vulnerable
    recommendedFirmware: "Check with manufacturer for latest updates",
    deviceType: DeviceType.ROUTER,
    knownServices: ["_http._tcp", "_https._tcp"],
  },
};

/**
 * Create a context object with all available identification information
 */
interface IdentificationContext {
  manufacturerFromMac?: string;
  name?: string;
  id: string;
  serviceUUIDs?: string[];
  serviceTypes?: string[];
  advertisedName?: string;
  signalStrength?: number;
  manufacturerData?: any;
  ipAddress?: string;
}

/**
 * Identify a device based on available information from Bluetooth or network discovery
 */
export function identifyDevice(
  device: BluetoothDevice | NetworkDevice
): DeviceSignature | null {
  // Create identification context object with all available info
  const context: IdentificationContext = {
    id: device.id.toLowerCase(),
    name: device.name?.toLowerCase() || "",
  };

  // Add Bluetooth-specific info
  if ("rssi" in device) {
    const btDevice = device as BluetoothDevice;
    context.serviceUUIDs =
      btDevice.serviceUUIDs?.map((uuid) => uuid.toLowerCase()) || [];
    context.signalStrength = btDevice.rssi;
    context.manufacturerData = btDevice.manufacturerData;

    // Extract MAC address from Bluetooth device ID if available
    const macPrefix = device.id
      .substring(0, 8)
      .toUpperCase()
      .replace(/:/g, "")
      .substring(0, 6);
    context.manufacturerFromMac = getManufacturerFromMac(macPrefix);
  }

  // Add network device specific info
  if ("ipAddress" in device) {
    const netDevice = device as NetworkDevice;
    context.ipAddress = netDevice.ipAddress;
    context.serviceTypes =
      netDevice.serviceTypes?.map((type) => type.toLowerCase()) || [];
    context.advertisedName = netDevice.hostName?.toLowerCase() || "";

    // Extract MAC address from network device
    const macPrefix = netDevice.macAddress
      .substring(0, 8)
      .toUpperCase()
      .replace(/:/g, "")
      .substring(0, 6);
    context.manufacturerFromMac = getManufacturerFromMac(macPrefix);
  }

  // Try to identify the device using our knowledge base

  // 1. Check for exact matches in MAC address known signatures
  for (const [key, signature] of Object.entries(KNOWN_DEVICES)) {
    if (signature.knownMACs) {
      for (const knownMAC of signature.knownMACs) {
        if (
          device.id.toUpperCase().includes(knownMAC) ||
          ("macAddress" in device &&
            (device as NetworkDevice).macAddress
              .toUpperCase()
              .includes(knownMAC))
        ) {
          console.log(
            `[DEBUG] Device identified by MAC address as ${signature.manufacturer} ${signature.model}`
          );
          return signature;
        }
      }
    }
  }

  // 2. Look for known service UUIDs/types matches
  if (context.serviceUUIDs && context.serviceUUIDs.length > 0) {
    for (const [key, signature] of Object.entries(KNOWN_DEVICES)) {
      if (signature.knownServices) {
        for (const knownService of signature.knownServices) {
          if (
            context.serviceUUIDs.some((uuid) =>
              uuid.toLowerCase().includes(knownService.toLowerCase())
            )
          ) {
            console.log(
              `[DEBUG] Device identified by service UUID as ${signature.manufacturer} ${signature.model}`
            );
            return signature;
          }
        }
      }
    }
  }

  if (context.serviceTypes && context.serviceTypes.length > 0) {
    for (const [key, signature] of Object.entries(KNOWN_DEVICES)) {
      if (signature.knownServices) {
        for (const knownService of signature.knownServices) {
          if (
            context.serviceTypes.some((service) =>
              service.toLowerCase().includes(knownService.toLowerCase())
            )
          ) {
            console.log(
              `[DEBUG] Device identified by service type as ${signature.manufacturer} ${signature.model}`
            );
            return signature;
          }
        }
      }
    }
  }

  // 3. Check for identification patterns in the device name or advertised name
  const namesToCheck = [
    context.name || "",
    context.advertisedName || "",
  ].filter(Boolean);

  if (namesToCheck.length > 0) {
    // Create a combined identification text
    const identificationText = namesToCheck.join(" ").toLowerCase();

    for (const [key, signature] of Object.entries(KNOWN_DEVICES)) {
      // Check if any identification pattern matches
      const matchFound = signature.identificationPatterns.some((pattern) =>
        identificationText.includes(pattern.toLowerCase())
      );

      if (matchFound) {
        console.log(
          `[DEBUG] Device identified by name patterns as ${signature.manufacturer} ${signature.model}`
        );
        return signature;
      }
    }
  }

  // 4. Use MAC OUI database to make a best guess if nothing else matched
  if (
    context.manufacturerFromMac &&
    context.manufacturerFromMac !== "Unknown"
  ) {
    console.log(
      `[DEBUG] Identifying device based on MAC OUI as ${context.manufacturerFromMac}`
    );

    // Find a generic device type for this manufacturer
    const genericSignature: DeviceSignature = {
      manufacturer: context.manufacturerFromMac,
      model: "Unknown Model",
      deviceType: DeviceType.UNKNOWN,
      identificationPatterns: [],
    };

    // Try to determine device type from services if available
    if (context.serviceUUIDs && context.serviceUUIDs.length > 0) {
      // Check for audio services
      if (
        context.serviceUUIDs.some(
          (uuid) =>
            uuid.includes("110a") ||
            uuid.includes("110b") ||
            uuid.includes("1108") ||
            uuid.includes("1131")
        )
      ) {
        genericSignature.deviceType = DeviceType.SPEAKER;
        genericSignature.model = "Audio Device";
      }

      // Check for heart rate service
      if (context.serviceUUIDs.some((uuid) => uuid.includes("180d"))) {
        genericSignature.deviceType = DeviceType.SMARTWATCH;
        genericSignature.model = "Wearable Device";
      }
    }

    return genericSignature;
  }

  // No match found
  return null;
}

export default {};
