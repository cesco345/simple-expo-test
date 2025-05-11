// app/modules/bluetooth-scanner/utils/device-scanner.ts
import { identifyDevice } from "../constants/device-database";
import { MAC_OUI_DATABASE } from "../constants/mac-oui-database";
import { DeviceType } from "../constants/service-identifiers";
import {
  calculateSecurityScore,
  checkDeviceVulnerabilities,
} from "../constants/vulnerability-detector";
import {
  BluetoothDevice,
  CurrentScan,
  DeviceProfile,
  DeviceScanResult,
  NetworkDevice,
} from "../types";

/**
 * DeviceScanner class responsible for discovering, identifying, and analyzing devices
 */
export class DeviceScanner {
  private discoveredDevices: Map<string, DeviceScanResult> = new Map();
  private currentScan: CurrentScan = null;
  private scanTimeoutId: NodeJS.Timeout | null = null;
  private scanDuration: number = 15000; // 15 seconds by default

  // Event callbacks
  private onScanStart?: () => void;
  private onDeviceDiscovered?: (device: DeviceScanResult) => void;
  private onScanComplete?: (devices: DeviceScanResult[]) => void;
  private onScanError?: (error: Error) => void;
  private onScanStatusChange?: (status: CurrentScan) => void;

  constructor() {
    // Initialize any dependencies here
    console.log("[INFO] Bluetooth manager initialized successfully");
  }

  /**
   * Set event handlers
   */
  public setEventHandlers(handlers: {
    onScanStart?: () => void;
    onDeviceDiscovered?: (device: DeviceScanResult) => void;
    onScanComplete?: (devices: DeviceScanResult[]) => void;
    onScanError?: (error: Error) => void;
    onScanStatusChange?: (status: CurrentScan) => void;
  }) {
    this.onScanStart = handlers.onScanStart;
    this.onDeviceDiscovered = handlers.onDeviceDiscovered;
    this.onScanComplete = handlers.onScanComplete;
    this.onScanError = handlers.onScanError;
    this.onScanStatusChange = handlers.onScanStatusChange;
  }

  /**
   * Start Bluetooth scan
   */
  public async startBluetoothScan(duration: number = 15000): Promise<void> {
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

      console.log("[INFO] Starting manual Bluetooth scan...");
      console.log("[DEBUG] discoveredDevices changed: 0 devices");
      console.log("[DEBUG] Cleaned up any previous scan");

      // Set the scan duration
      this.scanDuration = duration;
      console.log(
        `[INFO] Scan started successfully, will run for ${
          this.scanDuration / 1000
        } seconds`
      );

      // In a real implementation, you would start the actual Bluetooth scan here
      // For this example, we'll just set a timeout to simulate the scan completion
      this.scanTimeoutId = setTimeout(() => {
        this.completeScan();
      }, this.scanDuration);
    } catch (error) {
      console.error("[ERROR] Failed to start Bluetooth scan:", error);
      if (this.onScanError) {
        this.onScanError(error as Error);
      }
    }
  }

  /**
   * Process discovered Bluetooth device
   */
  public processBluetoothDevice(device: BluetoothDevice): void {
    try {
      console.log(`Parsing device: ${JSON.stringify(device)}`);

      // Update scan status
      this.currentScan = {
        deviceId: device.id,
        deviceName: device.name,
        stage: "analysis",
      };
      this.updateScanStatus();

      // Log discovery
      console.log(
        `[INFO] Discovered device: ${device.name || "Unknown"} (${device.id})`
      );

      // Identify the device
      const deviceSignature = identifyDevice(device);

      if (deviceSignature) {
        console.log(
          `[DEBUG] Device identified by MAC address as ${deviceSignature.manufacturer} ${deviceSignature.model}`
        );
        console.log(
          `[INFO] Identified device as ${deviceSignature.manufacturer} ${deviceSignature.model}`
        );

        // Important: Update the device object with manufacturer information
        device.manufacturer = deviceSignature.manufacturer;
        device.model = deviceSignature.model;
      } else {
        console.log(
          `[INFO] Could not identify device ${device.name || "Unknown"} (${
            device.id
          })`
        );

        // Try to enhance with MAC manufacturer
        const enhancedDevice = this.enhanceDeviceWithManufacturerInfo(device);
        if (
          enhancedDevice.manufacturer &&
          enhancedDevice.manufacturer !== device.manufacturer
        ) {
          device.manufacturer = enhancedDevice.manufacturer;
          console.log(
            `[DEBUG] Enhanced device with manufacturer: ${device.manufacturer}`
          );
        }
      }

      // Update scan status to vulnerability check
      this.currentScan = {
        deviceId: device.id,
        deviceName: device.name,
        stage: "vulnerability-check",
      };
      this.updateScanStatus();

      // Check for vulnerabilities
      const { vulnerabilityIds, vulnerabilityDetails } =
        checkDeviceVulnerabilities(device, deviceSignature);

      // Calculate security score
      const securityScore = calculateSecurityScore(device, vulnerabilityIds);

      // Create scan result
      const scanResult: DeviceScanResult = {
        device,
        signature: deviceSignature,
        vulnerabilities: vulnerabilityIds.map((id) => ({
          id,
          name: id,
          severity: "medium",
          description: "",
          recommendation: "",
        })),
        securityScore,
        isVulnerable: vulnerabilityIds.length > 0,
        vulnerabilityDetails,
        firstSeen: new Date(),
        lastSeen: new Date(),
        identificationMethod: deviceSignature
          ? "signature_match"
          : "best_guess",
      };

      // Store in discovered devices map
      this.discoveredDevices.set(device.id, scanResult);

      // Update device count
      console.log(
        `[DEBUG] discoveredDevices changed: ${this.discoveredDevices.size} devices`
      );

      // Log vulnerability info
      if (vulnerabilityIds.length > 0) {
        console.log(
          `[INFO] Analyzed ${device.name || "Unknown"}: ${
            vulnerabilityIds.length
          } vulnerabilities found`
        );
      } else {
        console.log(
          `[INFO] Analyzed ${
            device.name || "Unknown"
          }: No vulnerabilities found`
        );
      }

      // Notify device discovered
      if (this.onDeviceDiscovered) {
        this.onDeviceDiscovered(scanResult);
      }
    } catch (error) {
      console.error("[ERROR] Failed to process Bluetooth device:", error);
      if (this.onScanError) {
        this.onScanError(error as Error);
      }
    }
  }

  /**
   * Process discovered network device
   */
  public processNetworkDevice(device: NetworkDevice): void {
    try {
      console.log(`Parsing network device: ${JSON.stringify(device)}`);

      // Update scan status
      this.currentScan = {
        deviceId: device.id,
        deviceName: device.name,
        stage: "analysis",
      };
      this.updateScanStatus();

      // Log discovery
      console.log(
        `[INFO] Discovered network device: ${
          device.name || device.hostName || "Unknown"
        } (${device.ipAddress})`
      );

      // Identify the device
      const deviceSignature = identifyDevice(device);

      if (deviceSignature) {
        console.log(
          `[INFO] Identified network device as ${deviceSignature.manufacturer} ${deviceSignature.model}`
        );

        // Important: Update the device object with manufacturer information
        device.manufacturer = deviceSignature.manufacturer;
        device.model = deviceSignature.model;
      } else {
        console.log(
          `[INFO] Could not identify network device ${
            device.name || device.hostName || "Unknown"
          } (${device.ipAddress})`
        );
      }

      // Update scan status to vulnerability check
      this.currentScan = {
        deviceId: device.id,
        deviceName: device.name,
        stage: "vulnerability-check",
      };
      this.updateScanStatus();

      // Check for vulnerabilities
      const { vulnerabilityIds, vulnerabilityDetails } =
        checkDeviceVulnerabilities(device, deviceSignature);

      // Calculate security score
      const securityScore = calculateSecurityScore(device, vulnerabilityIds);

      // Create scan result
      const scanResult: DeviceScanResult = {
        device,
        signature: deviceSignature,
        vulnerabilities: vulnerabilityIds.map((id) => ({
          id,
          name: id,
          severity: "medium",
          description: "",
          recommendation: "",
        })),
        securityScore,
        isVulnerable: vulnerabilityIds.length > 0,
        vulnerabilityDetails,
        firstSeen: new Date(),
        lastSeen: new Date(),
        identificationMethod: deviceSignature
          ? "signature_match"
          : "best_guess",
      };

      // Store in discovered devices map
      this.discoveredDevices.set(device.id, scanResult);

      // Update device count
      console.log(
        `[DEBUG] discoveredDevices changed: ${this.discoveredDevices.size} devices`
      );

      // Log vulnerability info
      if (vulnerabilityIds.length > 0) {
        console.log(
          `[INFO] Analyzed network device ${
            device.name || device.hostName || "Unknown"
          }: ${vulnerabilityIds.length} vulnerabilities found`
        );
      } else {
        console.log(
          `[INFO] Analyzed network device ${
            device.name || device.hostName || "Unknown"
          }: No vulnerabilities found`
        );
      }

      // Notify device discovered
      if (this.onDeviceDiscovered) {
        this.onDeviceDiscovered(scanResult);
      }
    } catch (error) {
      console.error("[ERROR] Failed to process network device:", error);
      if (this.onScanError) {
        this.onScanError(error as Error);
      }
    }
  }

  /**
   * Complete the scan and analyze results
   */
  private completeScan(): void {
    console.log("[DEBUG] Scan duration reached, stopping scan");
    console.log("[INFO] Scan completed after timeout");
    console.log(
      `[DEBUG] Scan timeout reached with ${this.discoveredDevices.size} devices`
    );

    // Analyze all devices
    console.log(
      `[DEBUG] Analyzing ${this.discoveredDevices.size} devices from map`
    );
    console.log(
      `[INFO] Analyzing ${this.discoveredDevices.size} discovered devices...`
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

    // Clear the discovered devices map for a fresh scan
    this.discoveredDevices.clear();

    // Reset the current scan
    this.currentScan = null;
    this.updateScanStatus();
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
   * Get all discovered devices
   */
  public getDiscoveredDevices(): DeviceScanResult[] {
    return Array.from(this.discoveredDevices.values());
  }

  /**
   * Get device by ID
   */
  public getDeviceById(id: string): DeviceScanResult | undefined {
    return this.discoveredDevices.get(id);
  }

  /**
   * Enhance device with manufacturer information from MAC OUI database
   * This method was missing in the original implementation
   */
  public enhanceDeviceWithManufacturerInfo(
    device: BluetoothDevice
  ): BluetoothDevice {
    if (!device || !device.id) {
      return device;
    }

    try {
      // Lookup manufacturer by MAC address OUI (first 3 bytes/6 characters)
      if (device.id && device.id.length >= 8) {
        // Get the first 6 characters of the MAC address (excluding colons)
        const macPrefix = device.id
          .split(":")
          .slice(0, 3)
          .join("")
          .toUpperCase();

        // If the MAC_OUI_DATABASE is not available, handle gracefully
        if (typeof MAC_OUI_DATABASE !== "undefined") {
          const manufacturer = MAC_OUI_DATABASE[macPrefix];

          if (manufacturer) {
            return {
              ...device,
              manufacturer,
            };
          }
        }
      }
    } catch (error) {
      console.error(
        "[ERROR] Failed to enhance device with manufacturer info:",
        error
      );
    }

    return device;
  }

  /**
   * Create a comprehensive device profile from a scan result
   */
  public createDeviceProfile(scanResult: DeviceScanResult): DeviceProfile {
    const {
      device,
      signature,
      vulnerabilities,
      securityScore,
      vulnerabilityDetails,
    } = scanResult;

    // Create a basic profile
    const profile: DeviceProfile = {
      id: device.id,
      name: device.name,
      manufacturer: device.manufacturer || signature?.manufacturer || "Unknown",
      model: device.model || signature?.model || "Unknown Model",
      deviceType: signature?.deviceType || DeviceType.UNKNOWN,
      isConnectable: "isConnectable" in device ? !!device.isConnectable : false,
      macAddress:
        "macAddress" in device
          ? (device as NetworkDevice).macAddress
          : device.id,
      advertisedServices: [],
      securityScore,
      vulnerabilities: vulnerabilities,
      vulnerabilityDetails,
      firstSeen: scanResult.firstSeen,
      lastSeen: scanResult.lastSeen,
      signalStrengthHistory: [],
      metadata: {},
    };

    // Add Bluetooth specific info
    if ("rssi" in device) {
      const btDevice = device as BluetoothDevice;
      profile.signalStrengthHistory.push({
        timestamp: new Date(),
        rssi: btDevice.rssi,
      });

      if (btDevice.serviceUUIDs) {
        profile.advertisedServices = btDevice.serviceUUIDs;
      }

      if (btDevice.manufacturerData) {
        profile.metadata.manufacturerData = btDevice.manufacturerData;
      }

      if (btDevice.advertising) {
        profile.metadata.advertising = btDevice.advertising;
      }
    }

    // Add Network specific info
    if ("ipAddress" in device) {
      const netDevice = device as NetworkDevice;
      profile.ipAddress = netDevice.ipAddress;

      if (netDevice.serviceTypes) {
        profile.advertisedServices = netDevice.serviceTypes;
      }

      if (netDevice.hostName) {
        profile.metadata.hostName = netDevice.hostName;
      }

      if (netDevice.serviceData) {
        profile.metadata.serviceData = netDevice.serviceData;
      }
    }

    return profile;
  }

  /**
   * Update device firmware status in profile
   */
  public updateDeviceFirmware(deviceId: string, firmwareVersion: string): void {
    const device = this.discoveredDevices.get(deviceId);
    if (device) {
      // Update the device signature if it exists
      if (device.signature) {
        // Check if this firmware version is vulnerable
        const isVulnerable =
          device.signature.vulnerableVersions?.includes(firmwareVersion) ||
          false;

        // If it's not vulnerable, remove the OUTDATED_FIRMWARE vulnerability
        if (!isVulnerable) {
          device.vulnerabilities = device.vulnerabilities.filter(
            (v) => v.id !== "OUTDATED_FIRMWARE"
          );
          device.vulnerabilityDetails = device.vulnerabilityDetails.filter(
            (d) => !d.includes("outdated firmware")
          );

          // Recalculate security score
          device.securityScore = calculateSecurityScore(
            device.device,
            device.vulnerabilities.map((v) => v.id)
          );
          device.isVulnerable = device.vulnerabilities.length > 0;
        }
      }

      // Store the firmware version in the metadata
      if (!device.device.hasOwnProperty("metadata")) {
        (device.device as any).metadata = {};
      }
      (device.device as any).metadata.firmwareVersion = firmwareVersion;

      // Update last seen timestamp
      device.lastSeen = new Date();
    }
  }

  /**
   * Stop the current scan
   */
  public stopScan(): void {
    console.log("[INFO] Manually stopping scan");
    if (this.scanTimeoutId) {
      clearTimeout(this.scanTimeoutId);
      this.scanTimeoutId = null;
      this.completeScan();
    }
  }
}

export default DeviceScanner;
