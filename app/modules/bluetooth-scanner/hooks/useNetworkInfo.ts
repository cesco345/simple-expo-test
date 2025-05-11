import * as Network from "expo-network";
import { useCallback, useState } from "react";
import { NetworkInfo } from "../types";
import { addLog } from "./useDebugLogs";

export function useNetworkInfo() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);

  const refreshNetworkInfo = useCallback(async () => {
    try {
      const ipAddress = await Network.getIpAddressAsync();
      const networkState = await Network.getNetworkStateAsync();

      // Parse IP address to get base IP
      const ipParts = ipAddress.split(".");
      const baseIp = ipParts.slice(0, 3).join(".");

      const info: NetworkInfo = {
        ip: ipAddress,
        baseIp: baseIp,
        subnet: "255.255.255.0", // Assume standard Class C subnet
        wifi: networkState.type === Network.NetworkStateType.WIFI,
        type: getNetworkTypeName(networkState.type),
        isConnected: networkState.isConnected,
        networkType: {
          isConnected: networkState.isConnected,
          type: networkState.type,
        },
      };

      setNetworkInfo(info);
      addLog(
        `Network info: IP=${ipAddress}, Connected=${
          networkState.isConnected
        }, Type=${getNetworkTypeName(networkState.type)}`
      );

      return info;
    } catch (error) {
      console.error("Error fetching network info:", error);
      addLog(`Error fetching network info: ${error}`);
      return null;
    }
  }, []);

  // Helper to get readable network type
  const getNetworkTypeName = (type: any): string => {
    switch (type) {
      case Network.NetworkStateType.WIFI:
        return "WiFi";
      case Network.NetworkStateType.CELLULAR:
        return "Cellular";
      case Network.NetworkStateType.BLUETOOTH:
        return "Bluetooth";
      case Network.NetworkStateType.ETHERNET:
        return "Ethernet";
      case Network.NetworkStateType.UNKNOWN:
        return "Unknown";
      case Network.NetworkStateType.NONE:
        return "None";
      default:
        return "Unknown";
    }
  };

  return { networkInfo, refreshNetworkInfo };
}

export default useNetworkInfo;
