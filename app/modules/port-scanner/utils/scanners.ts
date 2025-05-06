// app/(tabs)/port-scanner/utils/scanners.ts
import TcpSocket from "react-native-tcp-socket";

export const scanPortTCP = (host: string, port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(false);
    }, 2000);

    try {
      const socket = TcpSocket.createConnection({
        port,
        host,
        timeout: 1500,
      });

      socket.on("connect", () => {
        clearTimeout(timeoutId);
        socket.end();
        resolve(true);
      });

      socket.on("error", () => {
        clearTimeout(timeoutId);
        resolve(false);
      });

      socket.on("close", () => {
        clearTimeout(timeoutId);
        resolve(false);
      });

      socket.on("timeout", () => {
        clearTimeout(timeoutId);
        socket.destroy();
        resolve(false);
      });
    } catch (error) {
      clearTimeout(timeoutId);
      resolve(false);
    }
  });
};

export const scanPortHTTP = (host: string, port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(false);
    }, 1500);

    try {
      const protocol = port === 443 ? "https" : "http";

      fetch(`${protocol}://${host}:${port}`, {
        method: "HEAD",
        redirect: "manual",
      })
        .then(() => {
          clearTimeout(timeoutId);
          resolve(true);
        })
        .catch(() => {
          clearTimeout(timeoutId);
          resolve(false);
        });
    } catch (error) {
      clearTimeout(timeoutId);
      resolve(false);
    }
  });
};

export const scanPort = async (
  host: string,
  port: number
): Promise<{ isOpen: boolean; protocol: "TCP" | "HTTP" }> => {
  if (port === 80 || port === 443 || port === 8080) {
    const isOpen = await scanPortHTTP(host, port);
    return { isOpen, protocol: "HTTP" };
  }

  const isOpen = await scanPortTCP(host, port);
  return { isOpen, protocol: "TCP" };
};

export const generateIPRange = (ipAddress: string): string[] => {
  const ipParts = ipAddress.split(".");
  if (ipParts.length !== 4) {
    return [ipAddress];
  }

  const baseIP = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;
  const lastOctet = parseInt(ipParts[3], 10);

  const range: string[] = [];
  const start = Math.max(1, lastOctet - 5);
  const end = Math.min(255, lastOctet + 10);

  for (let i = start; i <= end; i++) {
    range.push(`${baseIP}.${i}`);
  }

  return range;
};

export const batchIpAddresses = (
  ips: string[],
  batchSize: number
): string[][] => {
  const batches: string[][] = [];

  for (let i = 0; i < ips.length; i += batchSize) {
    batches.push(ips.slice(i, i + batchSize));
  }

  return batches;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
export default {};
