// app/modules/bluetooth-scanner/constants/service-identifiers.ts

/**
 * Common device types for categorization
 */
export enum DeviceType {
  SMARTPHONE = "Smartphone",
  TABLET = "Tablet",
  SMARTWATCH = "Smartwatch",
  LAPTOP = "Laptop",
  DESKTOP = "Desktop",
  TV = "TV",
  STREAMING_DEVICE = "Streaming Device",
  SPEAKER = "Speaker",
  HEADPHONES = "Headphones",
  EARBUDS = "Earbuds",
  GAME_CONSOLE = "Game Console",
  CAMERA = "Camera",
  PRINTER = "Printer",
  ROUTER = "Router",
  ACCESS_POINT = "Access Point",
  SMART_HOME_HUB = "Smart Home Hub",
  SMART_LIGHT = "Smart Light",
  SMART_PLUG = "Smart Plug",
  THERMOSTAT = "Thermostat",
  SECURITY_CAMERA = "Security Camera",
  DOORBELL = "Doorbell",
  VR_HEADSET = "VR Headset",
  UNKNOWN = "Unknown",
}

/**
 * Map of mDNS/DNS-SD service types to device types
 * These help identify device types based on services they advertise
 */
export const SERVICE_TYPE_MAP: Record<string, DeviceType> = {
  // Google Cast/Chromecast devices
  "_googlecast._tcp": DeviceType.STREAMING_DEVICE,

  // Apple services
  "_airplay._tcp": DeviceType.STREAMING_DEVICE,
  "_raop._tcp": DeviceType.SPEAKER,
  "_airport._tcp": DeviceType.ROUTER,
  "_homekit._tcp": DeviceType.SMART_HOME_HUB,
  "_companion-link._tcp": DeviceType.SMARTPHONE,
  "_apple-mobdev._tcp": DeviceType.SMARTPHONE,
  "_apple-mobdev2._tcp": DeviceType.SMARTPHONE,

  // Printing services
  "_printer._tcp": DeviceType.PRINTER,
  "_ipp._tcp": DeviceType.PRINTER,
  "_ipps._tcp": DeviceType.PRINTER,
  "_pdl-datastream._tcp": DeviceType.PRINTER,

  // Media devices
  "_spotify-connect._tcp": DeviceType.SPEAKER,
  "_sonos._tcp": DeviceType.SPEAKER,
  "_heos._tcp": DeviceType.SPEAKER,
  "_yamaha-router._tcp": DeviceType.SPEAKER,
  "_bose-sse._tcp": DeviceType.SPEAKER,

  // Gaming
  "_xboxsystem._tcp": DeviceType.GAME_CONSOLE,
  "_xbox._tcp": DeviceType.GAME_CONSOLE,
  "_nexuslive._tcp": DeviceType.GAME_CONSOLE,
  "_ps4._tcp": DeviceType.GAME_CONSOLE,
  "_ps5._tcp": DeviceType.GAME_CONSOLE,
  "_nintendods._tcp": DeviceType.GAME_CONSOLE,
  "_nintendo._tcp": DeviceType.GAME_CONSOLE,

  // Smart home
  "_hue._tcp": DeviceType.SMART_LIGHT,
  "_hap._tcp": DeviceType.SMART_HOME_HUB,
  "_nest-cam._tcp": DeviceType.SECURITY_CAMERA,
  "_ring._tcp": DeviceType.DOORBELL,
  "_wemo._tcp": DeviceType.SMART_PLUG,
  "_lifx._tcp": DeviceType.SMART_LIGHT,
  "_ecobee._tcp": DeviceType.THERMOSTAT,
  "_nest._tcp": DeviceType.THERMOSTAT,

  // VR devices
  "_oculusal_sp._tcp": DeviceType.VR_HEADSET,
  "_oculusal_sp_v2._tcp": DeviceType.VR_HEADSET,
  "_htcvive._tcp": DeviceType.VR_HEADSET,

  // General computing services
  "_ssh._tcp": DeviceType.DESKTOP,
  "_http._tcp": DeviceType.UNKNOWN,
  "_https._tcp": DeviceType.UNKNOWN,
  "_device-info._tcp": DeviceType.UNKNOWN,
  "_smb._tcp": DeviceType.DESKTOP,
  "_afpovertcp._tcp": DeviceType.DESKTOP,
  "_rfb._tcp": DeviceType.DESKTOP, // VNC
  "_teamviewer._tcp": DeviceType.DESKTOP,
  "_rdp._tcp": DeviceType.DESKTOP,

  // Network infrastructure
  "_nvstream._tcp": DeviceType.DESKTOP, // NVIDIA Shield/Streaming
  "_amzn-wplay._tcp": DeviceType.STREAMING_DEVICE, // Amazon Fire TV
  "_roku-remote._tcp": DeviceType.STREAMING_DEVICE,
  "_viziocast._tcp": DeviceType.TV,
  "_lgsmartdevice._tcp": DeviceType.TV,
  "_samsungtvrc._tcp": DeviceType.TV,
};

/**
 * Known Bluetooth service UUIDs that can help identify device types
 */
export const BLUETOOTH_SERVICE_UUIDS: Record<string, string> = {
  // Standard Bluetooth profiles
  "1800": "Generic Access",
  "1801": "Generic Attribute",
  "1802": "Immediate Alert Service",
  "1803": "Link Loss Service",
  "1804": "Tx Power Service",
  "1805": "Current Time Service",
  "1806": "Reference Time Update Service",
  "1807": "Next DST Change Service",
  "1808": "Glucose Service",
  "1809": "Health Thermometer Service",
  "180A": "Device Information Service",
  "180D": "Heart Rate Service",
  "180E": "Phone Alert Status Service",
  "180F": "Battery Service",
  "1810": "Blood Pressure Service",
  "1811": "Alert Notification Service",
  "1812": "Human Interface Device Service",
  "1813": "Scan Parameters Service",
  "1814": "Running Speed and Cadence Service",
  "1815": "Automation IO Service",
  "1816": "Cycling Speed and Cadence Service",
  "1818": "Cycling Power Service",
  "1819": "Location and Navigation Service",
  "181A": "Environmental Sensing Service",
  "181B": "Body Composition Service",
  "181C": "User Data Service",
  "181D": "Weight Scale Service",
  "181E": "Bond Management Service",
  "181F": "Continuous Glucose Monitoring Service",
  "1820": "Internet Protocol Support Service",
  "1821": "Indoor Positioning Service",
  "1822": "Pulse Oximeter Service",
  "1823": "HTTP Proxy Service",
  "1824": "Transport Discovery Service",
  "1825": "Object Transfer Service",
  "1826": "Fitness Machine Service",
  "1827": "Mesh Provisioning Service",
  "1828": "Mesh Proxy Service",
  "1829": "Reconnection Configuration Service",

  // Vendor-specific UUIDs
  "0391d26e-625b-4736-b4da-3bb0910ecec5": "Olympus AIR Camera",
  febe: "Bose SoundLink",
  fe2c: "B&O Sound System",
  fda5: "Sony Audio",
  fd5a: "Google Cast",
  fe07: "Apple Notifications",
  fee7: "Apple Notification Center",
  fd64: "JBL Audio",
  fe59: "Sonos",
  "9e90": "Samsung TV",
  fdf0: "Oculus VR",
};

/**
 * Match devices based on combinations of service types
 * This helps identify device types from multiple service announcements
 */
export function identifyDeviceTypeFromServices(
  services: string[]
): DeviceType | null {
  // Normalize services to lowercase for comparison
  const normalizedServices = services.map((s) => s.toLowerCase());

  // Check for combinations that strongly indicate device types

  // Apple TV
  if (
    normalizedServices.some((s) => s.includes("_airplay")) &&
    normalizedServices.some((s) => s.includes("_raop"))
  ) {
    return DeviceType.STREAMING_DEVICE;
  }

  // Sonos speaker
  if (
    normalizedServices.some((s) => s.includes("_sonos")) &&
    normalizedServices.some((s) => s.includes("_spotify"))
  ) {
    return DeviceType.SPEAKER;
  }

  // Smart TV
  if (
    normalizedServices.some((s) => s.includes("_googlecast")) &&
    (normalizedServices.some((s) => s.includes("_viziocast")) ||
      normalizedServices.some((s) => s.includes("_lgsmartdevice")) ||
      normalizedServices.some((s) => s.includes("_samsungtvrc")))
  ) {
    return DeviceType.TV;
  }

  // VR Headset (Oculus/Meta)
  if (normalizedServices.some((s) => s.includes("_oculusal"))) {
    return DeviceType.VR_HEADSET;
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
 * Identify device type from Bluetooth services
 */
export function identifyDeviceTypeFromBluetoothServices(
  serviceUUIDs: string[]
): DeviceType | null {
  // No services to identify
  if (!serviceUUIDs || serviceUUIDs.length === 0) {
    return null;
  }

  // Check for specific device type indicators
  const hasAudioService = serviceUUIDs.some(
    (uuid) =>
      uuid.includes("1108") || // Audio Source
      uuid.includes("110B") || // Audio Sink
      uuid.includes("110A") || // A2DP
      uuid.includes("111E") || // Handsfree
      uuid.includes("febe") || // Bose
      uuid.includes("fd5a") || // Google Cast
      uuid.includes("fe2c") || // B&O
      uuid.includes("fda5") // Sony Audio
  );

  if (hasAudioService) {
    return DeviceType.SPEAKER;
  }

  // Heart rate, fitness tracking
  const hasFitnessService = serviceUUIDs.some(
    (uuid) =>
      uuid.includes("180D") || // Heart Rate
      uuid.includes("1814") || // Running Speed
      uuid.includes("1816") || // Cycling Speed
      uuid.includes("1826") // Fitness Machine
  );

  if (hasFitnessService) {
    return DeviceType.SMARTWATCH;
  }

  // VR/AR devices
  if (
    serviceUUIDs.some(
      (uuid) =>
        uuid.includes("fdf0") || // Oculus
        uuid.includes("0391d26e-625b-4736-b4da-3bb0910ecec5") // Olympus camera
    )
  ) {
    return DeviceType.VR_HEADSET;
  }

  // Game controllers
  const hasGameController = serviceUUIDs.some(
    (uuid) =>
      uuid.includes("1812") && // HID Service
      (uuid.includes("1124") || // Nintendo
        uuid.includes("1131") || // PlayStation
        uuid.includes("1106")) // Xbox
  );

  if (hasGameController) {
    return DeviceType.GAME_CONSOLE;
  }

  return null;
}

export default {};
