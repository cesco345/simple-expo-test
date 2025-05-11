// app/(tabs)/bluetooth-scanner/utils/scanners.ts
import BleManager from "react-native-ble-manager";
import { BluetoothDevice } from "../../../modules/bluetooth-scanner/types";

// Scan for Bluetooth devices with reliable timeout
export const scanForBluetoothDevices = async (
  scanDuration: number = 10000,
  onDeviceFound: (device: any) => void,
  addLog: (message: string) => void
): Promise<boolean> => {
  try {
    // Check Bluetooth state
    const state = await BleManager.checkState();

    if (state !== "on") {
      addLog(`[ERROR] Bluetooth is not enabled (state: ${state})`);
      return false;
    }

    addLog("[INFO] Starting manual Bluetooth scan...");

    // Create a polling mechanism to get devices
    let stopPolling = false;

    // Clear any previous scanning session
    try {
      await BleManager.stopScan();
      addLog("[DEBUG] Cleaned up any previous scan");
    } catch (error) {
      // Ignore any errors from stopScan
    }

    // Start the scan
    await BleManager.scan([], scanDuration, true);
    addLog(
      `[INFO] Scan started successfully, will run for ${
        scanDuration / 1000
      } seconds`
    );

    // Set up polling to get discovered peripherals
    const pollInterval = setInterval(async () => {
      if (stopPolling) {
        clearInterval(pollInterval);
        return;
      }

      try {
        const peripherals = await BleManager.getDiscoveredPeripherals();
        addLog(`[DEBUG] Poll found ${peripherals.length} peripherals`);

        // Process each peripheral
        if (peripherals && peripherals.length > 0) {
          peripherals.forEach((device) => {
            if (device) {
              onDeviceFound(device);
            }
          });
        }
      } catch (error) {
        addLog(`[ERROR] Error polling peripherals: ${error}`);
      }
    }, 2000); // Poll every 2 seconds

    // Set up a timeout to stop the scan
    setTimeout(() => {
      addLog("[DEBUG] Scan duration reached, stopping scan");
      stopPolling = true;
      clearInterval(pollInterval);

      BleManager.stopScan()
        .then(() => {
          addLog("[INFO] Scan completed after timeout");
        })
        .catch((error) => {
          addLog(`[ERROR] Error stopping scan: ${error}`);
        });
    }, scanDuration);

    return true;
  } catch (error) {
    addLog(`[ERROR] Failed to start scan: ${error}`);
    return false;
  }
};

// Stop scanning for Bluetooth devices
export const stopBluetoothScan = async (
  addLog: (message: string) => void
): Promise<boolean> => {
  try {
    await BleManager.stopScan();
    addLog("[INFO] Bluetooth scan stopped manually");
    return true;
  } catch (error) {
    addLog(`[ERROR] Failed to stop scan: ${error}`);
    return false;
  }
};

// Known manufacturer IDs and names
const MANUFACTURER_IDS: Record<string, string> = {
  "004c": "Apple", // Apple
  "0006": "Microsoft", // Microsoft
  "0075": "Samsung", // Samsung
  "0310": "Bose", // Bose
  "00e0": "Google", // Google
  "0059": "Sony", // Sony
  "0046": "Sony Ericsson", // Sony Ericsson
  "01d7": "Jabra", // Jabra
  "0080": "Anker", // Anker
  "00ad": "LG", // LG Electronics
  "0038": "Xiaomi", // Xiaomi
  "000d": "Texas Instruments", // TI (often in IoT devices)
  "0087": "Garmin", // Garmin
  "0126": "Jawbone", // Jawbone
};

// Extract manufacturer name from ID
const getManufacturerName = (manufacturerId: string): string | null => {
  if (!manufacturerId) return null;

  // Normalize the ID (ensure it's lowercase and without any prefix like '0x')
  const normalizedId = manufacturerId.toLowerCase().replace(/^0x/, "");

  // Try to match the full ID
  if (MANUFACTURER_IDS[normalizedId]) {
    return MANUFACTURER_IDS[normalizedId];
  }

  // If we don't have an exact match, try to find a partial match
  // This helps with IDs that might be slightly different formats
  for (const [id, name] of Object.entries(MANUFACTURER_IDS)) {
    if (normalizedId.includes(id) || id.includes(normalizedId)) {
      return name;
    }
  }

  return manufacturerId; // Return the ID if no manufacturer name is found
};

// Convert native device to our app's device format with enhanced parsing
export const parseBluetoothDevice = (device: any): BluetoothDevice => {
  // Log the device for debugging
  console.log(`Parsing device: ${JSON.stringify(device)}`);

  // Create object for all advertising data
  const advertising = device.advertising || {};

  // Extract manufacturer data if available
  let manufacturerData = null;
  if (advertising.manufacturerData) {
    // Try to get manufacturer ID from the first key (common format is to have the ID as the key)
    const manufacturerIds = Object.keys(advertising.manufacturerData);
    if (manufacturerIds.length > 0) {
      const manufacturerId = manufacturerIds[0];
      manufacturerData = getManufacturerName(manufacturerId);
    }
  }

  // If device has the name AIR-A01 or contains AIR-, set manufacturer to Generic
  if (
    device.name &&
    (device.name === "AIR-A01" || device.name.includes("AIR-"))
  ) {
    manufacturerData = "Generic";
  }

  // Try to identify Apple AirPods/Beats/etc by device characteristics
  if (
    advertising.manufacturerData?.["004c"] &&
    !device.name &&
    device.id.includes(":") &&
    device.rssi > -80
  ) {
    manufacturerData = "Apple";
  }

  // Identify Bose products
  if (
    device.name &&
    (device.name.includes("Bose") || device.name.includes("SoundLink"))
  ) {
    manufacturerData = "Bose";
  }

  // Extract service UUIDs if available
  const serviceUUIDs = advertising.serviceUUIDs || [];

  // Build the device object
  return {
    id: device.id,
    name: device.name || null,
    rssi: device.rssi || -100,
    advertising: advertising,
    manufacturerData: manufacturerData,
    serviceUUIDs: serviceUUIDs,
    isConnectable: advertising.isConnectable !== false,
    lastSeen: new Date(),
  };
};

// Init Bluetooth manager
export const initializeBleManager = async (
  addLog: (message: string) => void
): Promise<boolean> => {
  try {
    await BleManager.start({ showAlert: false });
    addLog("[INFO] Bluetooth manager initialized successfully");
    return true;
  } catch (error) {
    addLog(`[ERROR] Failed to initialize Bluetooth manager: ${error}`);
    return false;
  }
};

// Utility to check Bluetooth state
export const getBluetoothState = async (): Promise<string> => {
  try {
    return await BleManager.checkState();
  } catch (error) {
    console.error("Error checking Bluetooth state:", error);
    return "unknown";
  }
};

// Sleep utility
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default {};
