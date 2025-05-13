// app/modules/chromecast-scanner/utils/device-scanner.ts
import {
  initializeZeroconf,
  startMdnsDiscovery,
  stopMdnsDiscovery,
} from "../../../(tabs)/chromecast-scanner/utils/scanners";
import { identifyDevice } from "../constants/device-database";
import {
  calculateSecurityScore,
  checkDeviceVulnerabilities,
} from "../constants/vulnerability-detector";
import {
  ChromecastDevice,
  ChromecastScanResult,
  CurrentScan,
  MDNSServiceRecord,
} from "../types";

/**
 * DeviceScanner class responsible for discovering, identifying, and analyzing Chromecast devices
 */
export class DeviceScanner {
  private discoveredDevices: Map<string, ChromecastScanResult> = new Map();
  private currentScan: CurrentScan | null = null;
  private scanTimeoutId: NodeJS.Timeout | null = null;
  private scanDuration: number = 15000; // 15 seconds by default
  private zeroconf: any = null;
  private mdnsListeners: Set<string> = new Set();

  // Event callbacks
  private onScanStart?: () => void;
  private onDeviceDiscovered?: (device: ChromecastScanResult) => void;
  private onScanComplete?: (devices: ChromecastScanResult[]) => void;
  private onScanError?: (error: Error) => void;
  private onScanStatusChange?: (status: CurrentScan | null) => void;

  constructor() {
    console.log("[INFO] Initializing Chromecast scanner...");
    this.initializeZeroconf();
  }

  /**
   * Initialize Zeroconf for mDNS device discovery
   */
  private initializeZeroconf(): void {
    try {
      console.log("[INFO] Initializing Zeroconf for service discovery");
      this.zeroconf = initializeZeroconf();

      if (this.zeroconf) {
        // Set up event listeners for Zeroconf
        this.setupZeroconfListeners();
      } else {
        console.log(
          "[WARN] Failed to initialize Zeroconf, will use IP scanning only"
        );
      }
    } catch (error) {
      console.error("[ERROR] Failed to initialize Zeroconf:", error);
    }
  }

  /**
   * Set up event listeners for Zeroconf
   */
  private setupZeroconfListeners(): void {
    if (!this.zeroconf) return;

    try {
      // If resolve method exists, set up listener for it
      if (typeof this.zeroconf.on === "function") {
        // Listen for resolved services
        this.zeroconf.on("resolved", (service: any) => {
          console.log(`[DEBUG] Zeroconf resolved service: ${service.name}`);
          this.handleResolvedService(service);
        });

        // Listen for errors
        this.zeroconf.on("error", (error: any) => {
          console.log(`[INFO] Zeroconf error: ${error}`);
          if (this.onScanError) {
            this.onScanError(new Error(`Zeroconf error: ${error}`));
          }
        });

        // Listen for timeout
        this.zeroconf.on("timeout", () => {
          console.log("[DEBUG] Zeroconf scan timed out");
        });

        console.log("[DEBUG] Zeroconf event listeners set up");
      } else {
        console.log(
          "[WARN] Zeroconf.on is not a function - cannot set up listeners"
        );
      }
    } catch (error) {
      console.log(`[ERROR] Error setting up Zeroconf listeners: ${error}`);
    }
  }

  /**
   * Handle resolved service from Zeroconf
   */
  private handleResolvedService(service: any): void {
    try {
      console.log(`[DEBUG] Processing resolved service: ${service.name}`);

      // Check if this is a Chromecast-related service
      const isChromecast =
        service.type.includes("_googlecast") ||
        service.type.includes("_googlezone") ||
        service.type.includes("_googlehome");

      if (!isChromecast) {
        console.log(`[DEBUG] Not a Chromecast service: ${service.type}`);
        return;
      }

      // Create a device object
      const device: ChromecastDevice = {
        id: `mdns-${service.name.replace(/\s+/g, "-").toLowerCase()}`,
        name: service.name,
        hostName: service.host,
        ipAddress: service.addresses?.[0] || "",
        port: service.port || 8009,
        serviceTypes: [service.type],
        discoveryType: "mdns",
        lastSeen: new Date(),
        metadata: service.txt || {},
      };

      // Process the device
      this.processChromecastDevice(device);
    } catch (error) {
      console.log(`[ERROR] Error handling resolved service: ${error}`);
    }
  }

  /**
   * Set event handlers
   */
  public setEventHandlers(handlers: {
    onScanStart?: () => void;
    onDeviceDiscovered?: (device: ChromecastScanResult) => void;
    onScanComplete?: (devices: ChromecastScanResult[]) => void;
    onScanError?: (error: Error) => void;
    onScanStatusChange?: (status: CurrentScan | null) => void;
  }) {
    this.onScanStart = handlers.onScanStart;
    this.onDeviceDiscovered = handlers.onDeviceDiscovered;
    this.onScanComplete = handlers.onScanComplete;
    this.onScanError = handlers.onScanError;
    this.onScanStatusChange = handlers.onScanStatusChange;
  }

  /**
   * Start scanning for Chromecast devices
   */
  public async startScan(duration: number = 15000): Promise<void> {
    try {
      // Clean up any previous scan
      this.cleanupScan();

      // Update scan status
      this.currentScan = {
        stage: "discovery",
      };
      this.updateScanStatus();

      // Notify scan started
      if (this.onScanStart) {
        this.onScanStart();
      }

      console.log("[INFO] Starting Chromecast device scan...");

      // Set the scan duration
      this.scanDuration = duration;
      console.log(
        `[INFO] Scan started successfully, will run for ${
          this.scanDuration / 1000
        } seconds`
      );

      // Start mDNS discovery if Zeroconf is available
      if (this.zeroconf) {
        try {
          startMdnsDiscovery(this.zeroconf, (error: any) => {
            console.log(`[ERROR] mDNS discovery error: ${error}`);
            if (this.onScanError) {
              this.onScanError(new Error(`mDNS discovery error: ${error}`));
            }
          });
          console.log(
            "[INFO] mDNS scanning started successfully, waiting for devices..."
          );
        } catch (error) {
          console.log(`[ERROR] Failed to start mDNS discovery: ${error}`);
        }
      } else {
        console.log("[WARN] Zeroconf not available, skipping mDNS discovery");
      }

      // Set a timeout to complete the scan operation after duration
      this.scanTimeoutId = setTimeout(() => {
        this.completeScan();
      }, this.scanDuration);
    } catch (error) {
      console.error("[ERROR] Failed to start Chromecast scan:", error);
      if (this.onScanError) {
        this.onScanError(error as Error);
      }
    }
  }

  /**
   * Process a Chromecast device found during scanning
   */
  public processChromecastDevice(device: ChromecastDevice): void {
    try {
      if (!device.ipAddress) {
        console.log("[WARN] Device has no IP address, skipping");
        return;
      }

      console.log(
        `[INFO] Processing Chromecast device: ${device.name || "Unknown"} (${
          device.ipAddress
        })`
      );

      // Generate a consistent ID if one is not provided
      if (!device.id) {
        device.id = `chromecast-${device.ipAddress.replace(/\./g, "-")}-${
          device.port || 8009
        }`;
      }

      // Update scan status
      this.currentScan = {
        deviceId: device.id,
        deviceName: device.name,
        ipAddress: device.ipAddress,
        stage: "analysis",
      };
      this.updateScanStatus();

      // Check if we already have this device
      const existingDevice = this.discoveredDevices.get(device.id);
      if (existingDevice) {
        // Merge with existing device
        const mergedDevice = this.mergeDeviceRecords(
          existingDevice.device,
          device
        );

        // Update the existing record
        existingDevice.device = mergedDevice;
        this.discoveredDevices.set(device.id, existingDevice);

        console.log(
          `[INFO] Updated existing device: ${device.name || "Unknown"} (${
            device.ipAddress
          })`
        );
        return;
      }

      // Identify the device
      const deviceSignature = identifyDevice(device);

      if (deviceSignature) {
        console.log(
          `[INFO] Device identified as ${deviceSignature.manufacturer} ${deviceSignature.model}`
        );

        // Update device with manufacturer information
        device.manufacturer = deviceSignature.manufacturer;
        device.model = deviceSignature.model;
      } else {
        // Make a best guess based on the device info we have
        if (
          !device.manufacturer &&
          (device.name?.includes("Google") ||
            device.name?.includes("Chromecast"))
        ) {
          device.manufacturer = "Google";
        }

        if (!device.model) {
          if (device.name?.includes("Ultra")) {
            device.model = "Chromecast Ultra";
          } else if (device.name?.includes("Google TV")) {
            device.model = "Chromecast with Google TV";
          } else if (device.name?.includes("Home")) {
            device.model = "Google Home";
          } else if (device.name?.includes("Nest")) {
            device.model = "Nest Device";
          } else {
            device.model = "Chromecast Device";
          }
        }
      }

      // Update scan status to vulnerability check
      this.currentScan = {
        deviceId: device.id,
        deviceName: device.name,
        ipAddress: device.ipAddress,
        stage: "vulnerability-check",
      };
      this.updateScanStatus();

      // Check for vulnerabilities
      const { vulnerabilityIds, vulnerabilityDetails, recommendations } =
        checkDeviceVulnerabilities(device, deviceSignature);

      // Calculate security score
      const securityScore = calculateSecurityScore(device, vulnerabilityIds);

      // Create scan result
      const scanResult: ChromecastScanResult = {
        device,
        vulnerabilities: vulnerabilityIds.map((id) => ({
          id,
          name: id,
          severity: "medium",
          description: "",
          recommendation: recommendations[id] || "",
        })),
        securityScore,
        isVulnerable: vulnerabilityIds.length > 0,
        vulnerabilityDetails,
      };

      // Store in discovered devices map
      this.discoveredDevices.set(device.id, scanResult);

      console.log(
        `[INFO] Analyzed ${device.name || "Unknown"}: ${
          vulnerabilityIds.length
        } vulnerabilities found`
      );

      // Notify device discovered
      if (this.onDeviceDiscovered) {
        this.onDeviceDiscovered(scanResult);
      }
    } catch (error) {
      console.error("[ERROR] Failed to process Chromecast device:", error);
    }
  }

  /**
   * Process an mDNS service record
   */
  public processMdnsRecord(record: MDNSServiceRecord): void {
    try {
      console.log(`[INFO] Processing mDNS record: ${record.name}`);

      // Check if this is a Chromecast-related service
      const isChromecast =
        record.type.includes("_googlecast") ||
        record.type.includes("_googlezone") ||
        record.type.includes("_googlehome");

      if (!isChromecast) {
        console.log(`[DEBUG] Not a Chromecast service: ${record.type}`);
        return;
      }

      if (!record.addresses || record.addresses.length === 0) {
        console.log(`[DEBUG] No IP address found for ${record.name}`);
        return;
      }

      // Create a device object
      const device: ChromecastDevice = {
        id: `mdns-${record.name.replace(/\s+/g, "-").toLowerCase()}`,
        name: record.name,
        hostName: record.host,
        ipAddress: record.addresses[0],
        port: record.port,
        serviceTypes: [record.type],
        discoveryType: "mdns",
        lastSeen: new Date(),
        metadata: record.txt || {},
      };

      // Process the device
      this.processChromecastDevice(device);
    } catch (error) {
      console.error("[ERROR] Failed to process mDNS record:", error);
    }
  }

  /**
   * Complete the scan and notify listeners
   */
  private completeScan(): void {
    console.log("[INFO] Scan completed");

    // Stop mDNS discovery if it was started
    if (this.zeroconf) {
      try {
        stopMdnsDiscovery(this.zeroconf);
      } catch (error) {
        console.log(`[ERROR] Error stopping mDNS discovery: ${error}`);
      }
    }

    console.log(
      `[INFO] Discovered ${this.discoveredDevices.size} Chromecast devices`
    );

    // Count vulnerable devices
    const vulnerableDevices = Array.from(
      this.discoveredDevices.values()
    ).filter((result) => result.isVulnerable);

    console.log(
      `[INFO] Analysis completed. Found ${vulnerableDevices.length} vulnerable devices out of ${this.discoveredDevices.size} total.`
    );

    // Notify scan complete
    if (this.onScanComplete) {
      this.onScanComplete(Array.from(this.discoveredDevices.values()));
    }

    // Reset scan status
    this.currentScan = null;
    this.scanTimeoutId = null;
    this.updateScanStatus();
  }

  /**
   * Clean up scan resources
   */
  public cleanupScan(): void {
    if (this.scanTimeoutId) {
      clearTimeout(this.scanTimeoutId);
      this.scanTimeoutId = null;
    }

    // Stop mDNS discovery if it was started
    if (this.zeroconf) {
      try {
        stopMdnsDiscovery(this.zeroconf);
      } catch (error) {
        console.log(`[ERROR] Error stopping mDNS discovery: ${error}`);
      }
    }

    // Reset the current scan
    this.currentScan = null;
    this.updateScanStatus();
  }

  /**
   * Stop the current scan
   */
  public stopScan(): void {
    console.log("[INFO] Manually stopping scan");

    if (this.scanTimeoutId) {
      clearTimeout(this.scanTimeoutId);
      this.scanTimeoutId = null;
    }

    this.completeScan();
  }

  /**
   * Add a manually specified device
   */
  public addManualDevice(ipAddress: string, port: number = 8009): void {
    try {
      const deviceId = `manual-${ipAddress.replace(/\./g, "-")}`;

      const device: ChromecastDevice = {
        id: deviceId,
        ipAddress: ipAddress,
        port: port,
        lastSeen: new Date(),
        discoveryType: "manual",
        name: `Chromecast (${ipAddress})`,
      };

      this.processChromecastDevice(device);
    } catch (error) {
      console.error("[ERROR] Failed to add manual device:", error);
      if (this.onScanError) {
        this.onScanError(error as Error);
      }
    }
  }

  /**
   * Get all discovered devices
   */
  public getDiscoveredDevices(): ChromecastScanResult[] {
    return Array.from(this.discoveredDevices.values());
  }

  /**
   * Get device by ID
   */
  public getDeviceById(id: string): ChromecastScanResult | undefined {
    return this.discoveredDevices.get(id);
  }

  /**
   * Update scan status and notify listeners
   */
  private updateScanStatus(): void {
    if (this.onScanStatusChange) {
      this.onScanStatusChange(this.currentScan);
    }
  }

  /**
   * Merge device records
   */
  private mergeDeviceRecords(
    existingDevice: ChromecastDevice,
    newDevice: ChromecastDevice
  ): ChromecastDevice {
    const mergedDevice: ChromecastDevice = {
      ...existingDevice,
      lastSeen: new Date(),
    };

    // Use newer values if available
    if (newDevice.name) mergedDevice.name = newDevice.name;
    if (newDevice.manufacturer)
      mergedDevice.manufacturer = newDevice.manufacturer;
    if (newDevice.model) mergedDevice.model = newDevice.model;
    if (newDevice.firmwareVersion)
      mergedDevice.firmwareVersion = newDevice.firmwareVersion;
    if (newDevice.macAddress) mergedDevice.macAddress = newDevice.macAddress;

    // Merge service types
    if (newDevice.serviceTypes && newDevice.serviceTypes.length > 0) {
      const existingTypes = mergedDevice.serviceTypes || [];
      mergedDevice.serviceTypes = [
        ...new Set([...existingTypes, ...newDevice.serviceTypes]),
      ];
    }

    // Merge metadata
    if (newDevice.metadata) {
      mergedDevice.metadata = {
        ...mergedDevice.metadata,
        ...newDevice.metadata,
      };
    }

    return mergedDevice;
  }
}

export default DeviceScanner;
