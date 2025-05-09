// app/modules/port-scanner/hooks/useNetworkInfo.ts
import * as Network from "expo-network";
import { useEffect, useState } from "react";
import { NetworkInfo } from "../types";
// Import addLog directly, not through the hook
import { addLog } from "./useDebugLogs";

export function useNetworkInfo() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);

  const fetchNetworkInfo = async () => {
    try {
      const ipAddress = await Network.getIpAddressAsync();
      const networkType = await Network.getNetworkStateAsync();

      const info: NetworkInfo = {
        ip: ipAddress,
        networkType: {
          isConnected: networkType.isConnected,
          type: networkType.type,
        },
      };

      setNetworkInfo(info);
      addLog(
        `Network info: IP=${ipAddress}, Connected=${networkType.isConnected}`
      );

      return info;
    } catch (error) {
      console.error("Error fetching network info:", error);
      addLog(`Error fetching network info: ${error}`);
      return null;
    }
  };

  useEffect(() => {
    fetchNetworkInfo();
  }, []);

  return { networkInfo, fetchNetworkInfo };
}

export default useNetworkInfo;
