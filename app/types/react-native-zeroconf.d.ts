// Create this file at: app/types/react-native-zeroconf.d.ts

declare module "react-native-zeroconf" {
  export default class Zeroconf {
    constructor();

    /**
     * Start the zeroconf scan
     */
    scan(type: string, protocol?: string, domain?: string): void;

    /**
     * Stop the scan
     */
    stop(): void;

    /**
     * Remove all event listeners
     */
    removeDeviceListeners(): void;

    /**
     * Add event listener
     */
    on(
      event: "resolved" | "error" | "found" | "remove",
      callback: (data: any) => void
    ): void;

    /**
     * Remove event listener
     */
    removeListener(event: string, callback: Function): void;

    /**
     * Get all devices already resolved
     */
    getServices(): { [key: string]: any };

    /**
     * Check if the service is published
     */
    isPublishing(): boolean;

    /**
     * Check if the service scanning is in progress
     */
    isScanning(): boolean;
  }
}
export default {};
