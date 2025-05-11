// app/modules/bluetooth-scanner/mdns-scanner.ts
import DeviceScanner from "./device-scanner";
import { NetworkDevice } from "./types";

/**
 * mDNS device scanner for discovering network devices via multicast DNS
 */
export class MDNSScanner {
  private deviceScanner: DeviceScanner;
  private isScanning: boolean = false;
  private scanTimeoutId: NodeJS.Timeout | null = null;

  /**
   * Constructor
   * @param deviceScanner Reference to the main device scanner
   */
  constructor(deviceScanner: DeviceScanner) {
    this.deviceScanner = deviceScanner;
  }

  /**
   * Start mDNS discovery scan
   * @param duration Scan duration in milliseconds
   */
  public startScan(duration: number = 15000): void {
    if (this.isScanning) {
      console.log("[INFO] mDNS scan already in progress");
      return;
    }

    console.log("[INFO] Starting mDNS scan...");
    this.isScanning = true;

    // In a real implementation, you would use an actual mDNS library like 'mdns', 'bonjour', or 'multicast-dns'
    // For this example, we'll simulate discovering devices

    // Simulated discovered devices - in a real app, these would come from actual mDNS responses
    setTimeout(() => {
      this.processMdnsDevice({
        name: "DESKTOP-EARHGN3",
        id: "desktop-earhgn3:local",
        macAddress: "58:01:54:E8:9A:9C",
        ipAddress: "192.168.0.127",
        serviceTypes: ["_oculusal_sp_v2._tcp.local", "_oculusal_sp._tcp.local"],
        hostName: "DESKTOP-EARHGN3.local",
        serviceData: {
          service: "fpisc::DESKTOP-EARHGN3._oculusal_sp_v2._tcp.local",
          port: 50278,
        },
        ttl: 60,
        lastSeen: new Date(),
      });
    }, 1000);

    setTimeout(() => {
      this.processMdnsDevice({
        name: "Bedroom TV",
        id: "5f5a8009dfd3026f9266d55a02d8321c",
        macAddress: "E8:0B:7D:4E:16:0A",
        ipAddress: "192.168.0.162",
        serviceTypes: ["_googlecast._tcp.local"],
        hostName: "5f5a8009-dfd3-026f-9266-d55a02d8321c.local",
        serviceData: {
          service:
            "V435-J01-5f5a8009dfd3026f9266d55a02d8321c._googlecast._tcp.local",
          port: 8009,
          metadata: {
            id: "5f5a8009dfd3026f9266d55a02d8321c",
            md: "V435-J01",
            fn: "Bedroom TV",
          },
        },
        ttl: 120,
        lastSeen: new Date(),
      });
    }, 2000);

    // Set a timeout to stop the scan after the specified duration
    this.scanTimeoutId = setTimeout(() => {
      this.stopScan();
    }, duration);
  }

  /**
   * Stop the ongoing mDNS scan
   */
  public stopScan(): void {
    if (!this.isScanning) {
      return;
    }

    console.log("[INFO] Stopping mDNS scan");
    this.isScanning = false;

    if (this.scanTimeoutId) {
      clearTimeout(this.scanTimeoutId);
      this.scanTimeoutId = null;
    }

    // In a real implementation, you would close the mDNS socket or stop the discovery
  }

  /**
   * Process an mDNS discovered device
   * @param device The network device discovered via mDNS
   */
  private processMdnsDevice(device: NetworkDevice): void {
    console.log(
      `[INFO] mDNS discovered: ${
        device.name || device.hostName || "Unknown"
      } (${device.ipAddress})`
    );

    // Add metadata extracted from mDNS response
    const mdnsMetadata: Record<string, any> = {};

    // Extract service information
    if (device.serviceTypes && device.serviceTypes.length > 0) {
      mdnsMetadata.services = device.serviceTypes;

      // Log the services for debugging
      device.serviceTypes.forEach((service) => {
        console.log(`[DEBUG] Service: ${service}`);

        // Detect specific device types from service names
        if (service.includes("_googlecast")) {
          mdnsMetadata.deviceType = "Chromecast/Smart TV";
        } else if (service.includes("_airplay")) {
          mdnsMetadata.deviceType = "Apple AirPlay";
        } else if (service.includes("_oculusal")) {
          mdnsMetadata.deviceType = "Meta/Oculus VR Headset";
        } else if (service.includes("_spotify")) {
          mdnsMetadata.deviceType = "Spotify Connect";
        } else if (service.includes("_sonos")) {
          mdnsMetadata.deviceType = "Sonos Speaker";
        } else if (service.includes("_hue")) {
          mdnsMetadata.deviceType = "Philips Hue";
        }
      });
    }

    // Extract port and other metadata from serviceData
    if (device.serviceData) {
      mdnsMetadata.portNumber = device.serviceData.port;

      if (device.serviceData.metadata) {
        Object.assign(mdnsMetadata, device.serviceData.metadata);
      }
    }

    // Add the metadata to the device
    const deviceWithMetadata: NetworkDevice = {
      ...device,
      metadata: mdnsMetadata,
    };

    // Pass to the main device scanner for processing
    this.deviceScanner.processNetworkDevice(deviceWithMetadata);
  }

  /**
   * Check if mDNS scanner is currently running
   */
  public isRunning(): boolean {
    return this.isScanning;
  }
}

export default MDNSScanner;
