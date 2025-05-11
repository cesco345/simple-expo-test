// app/modules/bluetooth-scanner/index.ts
import { getManufacturerFromMac } from "./constants/mac-oui-database";
import { DeviceType } from "./constants/service-identifiers";
import { VULNERABILITIES } from "./constants/vulnerabilities";
import NetworkDiscovery from "./network-discovery";
import { DeviceProfile, DeviceScanResult, NetworkInfo } from "./types";
import DeviceScanner from "./utils/device-scanner";

/**
 * DeviceSecurityScanner class that provides a public API for the device scanner functionality
 */
class DeviceSecurityScanner {
  private deviceScanner: DeviceScanner;
  private networkDiscovery: NetworkDiscovery;
  private initCompleted: boolean = false;

  /**
   * Constructor
   */
  constructor() {
    this.deviceScanner = new DeviceScanner();
    this.networkDiscovery = new NetworkDiscovery(this.deviceScanner);
  }

  /**
   * Initialize the scanner
   */
  public async initialize(): Promise<void> {
    if (this.initCompleted) {
      return;
    }

    try {
      console.log("[INFO] Initializing device security scanner...");

      // Set up event handlers - in a real app, you might connect these to UI updates
      this.deviceScanner.setEventHandlers({
        onScanStart: () => {
          console.log("[INFO] Scan started");
        },
        onDeviceDiscovered: (device) => {
          console.log(
            `[INFO] Device discovered: ${device.device.name || "Unknown"}`
          );
        },
        onScanComplete: (devices) => {
          console.log(`[INFO] Scan completed with ${devices.length} devices`);
        },
        onScanError: (error) => {
          console.error("[ERROR] Scan error:", error);
        },
        onScanStatusChange: (status) => {
          console.log(
            `[DEBUG] Scan status changed: ${status ? status.stage : "idle"}`
          );
        },
      });

      this.initCompleted = true;
      console.log("[INFO] Device security scanner initialized successfully");
    } catch (error) {
      console.error(
        "[ERROR] Failed to initialize device security scanner:",
        error
      );
      throw error;
    }
  }

  /**
   * Start a full network scan using all available methods
   */
  public async startFullScan(
    duration: number = 15000
  ): Promise<DeviceScanResult[]> {
    if (!this.initCompleted) {
      await this.initialize();
    }

    return this.networkDiscovery.startDiscovery({
      useBluetooth: true,
      useMdns: true,
      useArpScan: true,
      usePing: true,
      duration,
    });
  }

  /**
   * Start a Bluetooth-only scan
   */
  public async startBluetoothScan(
    duration: number = 15000
  ): Promise<DeviceScanResult[]> {
    if (!this.initCompleted) {
      await this.initialize();
    }

    return this.networkDiscovery.startDiscovery({
      useBluetooth: true,
      useMdns: false,
      useArpScan: false,
      usePing: false,
      duration,
    });
  }

  /**
   * Start a network-only scan
   */
  public async startNetworkScan(
    duration: number = 15000
  ): Promise<DeviceScanResult[]> {
    if (!this.initCompleted) {
      await this.initialize();
    }

    return this.networkDiscovery.startDiscovery({
      useBluetooth: false,
      useMdns: true,
      useArpScan: true,
      usePing: true,
      duration,
    });
  }

  /**
   * Stop all ongoing scans
   */
  public stopAllScans(): void {
    this.networkDiscovery.stopDiscovery();
  }

  /**
   * Get all discovered devices
   */
  public getDiscoveredDevices(): DeviceScanResult[] {
    return this.deviceScanner.getDiscoveredDevices();
  }

  /**
   * Get device by ID
   */
  public getDeviceById(id: string): DeviceScanResult | undefined {
    return this.deviceScanner.getDeviceById(id);
  }

  /**
   * Create a device profile from a scan result
   */
  public createDeviceProfile(scanResult: DeviceScanResult): DeviceProfile {
    return this.deviceScanner.createDeviceProfile(scanResult);
  }

  /**
   * Update network information
   */
  public updateNetworkInfo(info: NetworkInfo): void {
    this.networkDiscovery.updateNetworkInfo(info);
  }

  /**
   * Get available vulnerability information
   */
  public getVulnerabilityInfo(): typeof VULNERABILITIES {
    return VULNERABILITIES;
  }

  /**
   * Get device manufacturer from MAC address
   */
  public getManufacturerFromMac(macAddress: string): string {
    const macPrefix = macAddress
      .substring(0, 8)
      .toUpperCase()
      .replace(/:/g, "")
      .substring(0, 6);
    return getManufacturerFromMac(macPrefix);
  }

  /**
   * Get device type descriptions
   */
  public getDeviceTypes(): Record<string, string> {
    const deviceTypeRecord: Record<string, string> = {};

    for (const type in DeviceType) {
      deviceTypeRecord[type] = DeviceType[type as keyof typeof DeviceType];
    }

    return deviceTypeRecord;
  }
}

export default new DeviceSecurityScanner();

// Export types for use in consuming code
export { DeviceType } from "./constants/service-identifiers";
export * from "./types";
