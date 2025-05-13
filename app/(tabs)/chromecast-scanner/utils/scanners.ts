// app/(tabs)/chromecast-scanner/utils/scanners.ts
import Zeroconf from "react-native-zeroconf";

let zeroconfInstance: any = null;

/**
 * Initialize Zeroconf for service discovery
 */
export function initializeZeroconf(): any {
  try {
    if (!zeroconfInstance) {
      console.log("[DEBUG] Creating new Zeroconf instance");
      zeroconfInstance = new Zeroconf();

      try {
        // Some implementations of Zeroconf support setting hostname
        if (
          zeroconfInstance &&
          typeof zeroconfInstance.setHostname === "function"
        ) {
          zeroconfInstance.setHostname("chromecastScanner");
        } else {
          console.log(
            "[WARN] zeroconf.setHostname is not a function - skipping"
          );
        }
      } catch (error) {
        console.log(`[WARN] Error setting Zeroconf hostname: ${error}`);
      }
    }
    console.log("[DEBUG] Zeroconf event listeners set up");
    return zeroconfInstance;
  } catch (error) {
    console.error(`[ERROR] Failed to initialize Zeroconf: ${error}`);
    return null;
  }
}

/**
 * Start mDNS discovery for Chromecast devices
 */
export function startMdnsDiscovery(
  zeroconf: any,
  onError?: (error: any) => void
): void {
  try {
    if (!zeroconf) {
      console.log("[WARN] Zeroconf instance not available");
      return;
    }

    // First try to stop any existing scan
    try {
      stopMdnsDiscovery(zeroconf);
    } catch (error) {
      // Ignore stop errors, as we're about to start a new scan
    }

    console.log("[DEBUG] Starting mDNS discovery");

    // Start different service type scans for Chromecast
    try {
      // Standard Chromecast service type
      zeroconf.scan("_googlecast._tcp.", "local.");

      // Google Home/Nest devices often use this
      setTimeout(() => {
        if (zeroconf) {
          zeroconf.scan("_googlezone._tcp.", "local.");
        }
      }, 1000);

      // Additional service type for Google Home devices
      setTimeout(() => {
        if (zeroconf) {
          zeroconf.scan("_googlehome._tcp.", "local.");
        }
      }, 2000);

      console.log(
        "[INFO] mDNS scanning started successfully, waiting for devices..."
      );
    } catch (error) {
      console.log(`[ERROR] Failed to start mDNS discovery: ${error}`);
      if (onError) {
        onError(error);
      }
    }
  } catch (error) {
    console.log(`[ERROR] General error in startMdnsDiscovery: ${error}`);
    if (onError) {
      onError(error);
    }
  }
}

/**
 * Stop mDNS discovery
 */
export function stopMdnsDiscovery(zeroconf: any): void {
  try {
    if (!zeroconf) {
      return;
    }

    console.log("[DEBUG] Stopping Zeroconf scan");

    // Stop all scans
    if (typeof zeroconf.stop === "function") {
      zeroconf.stop();
    }

    // Some implementations require removeAllListeners
    if (typeof zeroconf.removeAllListeners === "function") {
      zeroconf.removeAllListeners();
    }

    // Some implementations require removeAllServices
    try {
      if (typeof zeroconf.removeAllServices === "function") {
        zeroconf.removeAllServices();
      } else {
        console.log(
          "[WARN] zeroconf.removeAllServices is not a function - skipping"
        );
      }
    } catch (error) {
      console.log(`[INFO] Zeroconf error: ${error}`);
    }
  } catch (error) {
    console.log(`[INFO] Zeroconf error: ${error}`);
  }
}

export default {
  initializeZeroconf,
  startMdnsDiscovery,
  stopMdnsDiscovery,
};
