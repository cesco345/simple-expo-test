// app/modules/chromecast-scanner/constants/service-identifiers.ts

/**
 * Common device types for categorization
 */
export enum DeviceType {
  CHROMECAST = "Chromecast",
  CHROMECAST_AUDIO = "Chromecast Audio",
  CHROMECAST_ULTRA = "Chromecast Ultra",
  CHROMECAST_WITH_GOOGLE_TV = "Chromecast with Google TV",
  NEST_HUB = "Nest Hub",
  NEST_HUB_MAX = "Nest Hub Max",
  NEST_MINI = "Nest Mini",
  GOOGLE_HOME = "Google Home",
  GOOGLE_HOME_MINI = "Google Home Mini",
  GOOGLE_HOME_MAX = "Google Home Max",
  VIZIO_SMARTCAST = "Vizio SmartCast",
  ANDROID_TV = "Android TV",
  NVIDIA_SHIELD = "NVIDIA Shield",
  SMART_TV = "Smart TV",
  UNKNOWN = "Unknown",
}

/**
 * Map of mDNS/DNS-SD service types related to Chromecast
 */
export const SERVICE_TYPE_MAP: Record<string, DeviceType> = {
  "_googlecast._tcp": DeviceType.CHROMECAST,
  "_googlezone._tcp": DeviceType.GOOGLE_HOME,
  "_googlehome._tcp": DeviceType.GOOGLE_HOME,
  "_viziocast._tcp": DeviceType.VIZIO_SMARTCAST,
  "_androidtvremote._tcp": DeviceType.ANDROID_TV,
  "_nvstream._tcp": DeviceType.NVIDIA_SHIELD,
};

/**
 * Chromecast device model identifiers
 */
export const CHROMECAST_MODEL_IDENTIFIERS: Record<string, string> = {
  // First generation Chromecast
  "H2G2-42": "Chromecast (1st generation)",

  // Second generation Chromecast
  "NC2-6A5": "Chromecast (2nd generation)",

  // Third generation Chromecast
  GA00439: "Chromecast (3rd generation)",

  // Chromecast Ultra
  "NC2-6A5-D": "Chromecast Ultra",
  GA00595: "Chromecast Ultra",

  // Chromecast with Google TV
  GA01919: "Chromecast with Google TV",

  // Google/Nest Home devices
  H0ME: "Google Home",
  A0DA: "Google Home Mini",
  GWRQY: "Google Home Max",
  GA00426: "Google Home Hub / Nest Hub",
  GA01281: "Google Nest Hub (2nd generation)",
  GA00523: "Google Nest Hub Max",
  GA01099: "Google Nest Mini (2nd generation)",
  GA03021: "Google Nest Wi-Fi Point with Assistant",
};

/**
 * Identify device type from mDNS service types
 */
export function identifyDeviceTypeFromServices(
  services: string[]
): DeviceType | null {
  // Normalize services to lowercase for comparison
  const normalizedServices = services.map((s) => s.toLowerCase());

  // Check for combinations that strongly indicate device types
  if (
    normalizedServices.some((s) => s.includes("_googlecast")) &&
    normalizedServices.some((s) => s.includes("_googlezone"))
  ) {
    return DeviceType.GOOGLE_HOME;
  }

  // For simple single service detection, try each service
  for (const service of normalizedServices) {
    for (const [serviceType, deviceType] of Object.entries(SERVICE_TYPE_MAP)) {
      if (service.includes(serviceType.toLowerCase())) {
        return deviceType;
      }
    }
  }

  return null;
}

/**
 * Get device model based on model ID
 */
export function getDeviceModelFromId(modelId: string): string {
  // First check for exact matches
  if (CHROMECAST_MODEL_IDENTIFIERS[modelId]) {
    return CHROMECAST_MODEL_IDENTIFIERS[modelId];
  }

  // Then check for partial matches
  for (const [identifier, model] of Object.entries(
    CHROMECAST_MODEL_IDENTIFIERS
  )) {
    if (modelId.includes(identifier)) {
      return model;
    }
  }

  // Default return
  return "Unknown Chromecast Device";
}

/**
 * Get device type based on model or other indicators
 */
export function getDeviceTypeFromModel(model: string): DeviceType {
  const modelLower = model.toLowerCase();

  if (modelLower.includes("ultra")) {
    return DeviceType.CHROMECAST_ULTRA;
  } else if (modelLower.includes("google tv")) {
    return DeviceType.CHROMECAST_WITH_GOOGLE_TV;
  } else if (modelLower.includes("audio")) {
    return DeviceType.CHROMECAST_AUDIO;
  } else if (modelLower.includes("hub max")) {
    return DeviceType.NEST_HUB_MAX;
  } else if (modelLower.includes("hub")) {
    return DeviceType.NEST_HUB;
  } else if (modelLower.includes("home max")) {
    return DeviceType.GOOGLE_HOME_MAX;
  } else if (
    modelLower.includes("home mini") ||
    modelLower.includes("nest mini")
  ) {
    return DeviceType.NEST_MINI;
  } else if (modelLower.includes("home")) {
    return DeviceType.GOOGLE_HOME;
  } else if (modelLower.includes("chromecast")) {
    return DeviceType.CHROMECAST;
  } else if (modelLower.includes("shield")) {
    return DeviceType.NVIDIA_SHIELD;
  } else if (modelLower.includes("vizio")) {
    return DeviceType.VIZIO_SMARTCAST;
  } else if (modelLower.includes("android tv")) {
    return DeviceType.ANDROID_TV;
  } else if (
    modelLower.includes("tv") ||
    modelLower.includes("lcd") ||
    modelLower.includes("led")
  ) {
    return DeviceType.SMART_TV;
  }

  return DeviceType.UNKNOWN;
}

export default {
  identifyDeviceTypeFromServices,
  getDeviceModelFromId,
  getDeviceTypeFromModel,
};
