// app/modules/airplay-scanner/hooks/useNetworkInfo.ts
import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect, useState } from "react";
import { NetworkInfo } from "../types";

export function useNetworkInfo() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    // Default values to ensure button is enabled initially
    isConnected: true,
    ip: "192.168.0.100",
    baseIp: "192.168.0",
    subnet: "255.255.255.0",
    wifi: true,
  });

  // Function to refresh network information
  const refreshNetworkInfo = useCallback(async () => {
    try {
      // Get network state
      const state = await NetInfo.fetch();

      // Basic network info
      const info: NetworkInfo = {
        isConnected: true, // Force to true for development
        type: state.type || "wifi",
        wifi: state.type === "wifi" || true, // Force to true for development
      };

      // Get IP address and subnet details if available
      if (state.details && typeof state.details === "object") {
        if ("ipAddress" in state.details && state.details.ipAddress) {
          info.ip = state.details.ipAddress as string;

          // Try to determine base IP (first 3 octets)
          const ipParts = info.ip.split(".");
          if (ipParts.length === 4) {
            info.baseIp = ipParts.slice(0, 3).join(".");
          }
        }

        if ("subnet" in state.details) {
          info.subnet = state.details.subnet as string;
        }

        if ("gateway" in state.details) {
          info.gateway = state.details.gateway as string;
        }
      }

      // ALWAYS use a fallback for development/testing
      // This ensures the button is not disabled
      if (!info.ip) {
        info.ip = "192.168.0.100";
        info.baseIp = "192.168.0";
        info.subnet = "255.255.255.0";
      }

      console.log("Network info updated:", info);
      setNetworkInfo(info);
    } catch (error) {
      console.error("Error getting network info:", error);

      // Always use fallback for development/testing
      const fallbackInfo = {
        ip: "192.168.0.100",
        baseIp: "192.168.0",
        subnet: "255.255.255.0",
        isConnected: true,
        wifi: true,
      };

      console.log("Using fallback network info:", fallbackInfo);
      setNetworkInfo(fallbackInfo);
    }
  }, []);

  // Get network info on mount
  useEffect(() => {
    console.log("Initializing network info");
    refreshNetworkInfo();

    // Subscribe to network info changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Network state changed:", state);
      refreshNetworkInfo();
    });

    return () => {
      unsubscribe();
    };
  }, [refreshNetworkInfo]);

  return { networkInfo, refreshNetworkInfo };
}

export default {};
