import * as Network from "expo-network";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NetworkInfo as NetworkInfoType } from "../../../modules/airplay-scanner/types";

interface NetworkInfoProps {
  networkInfo: NetworkInfoType | null;
}

export default function NetworkInfo({ networkInfo }: NetworkInfoProps) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoTitle}>Network Information</Text>
      {networkInfo ? (
        <>
          <Text>IP: {networkInfo.ip || "Unknown"}</Text>
          <Text>Subnet: {networkInfo.subnet || "255.255.255.0"}</Text>
          <Text>
            Connected: {networkInfo.networkType?.isConnected ? "Yes" : "No"}
          </Text>
          <Text>
            WiFi:{" "}
            {networkInfo.networkType?.type === Network.NetworkStateType.WIFI
              ? "Yes"
              : "No"}
          </Text>
        </>
      ) : (
        <Text>Loading network information...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
