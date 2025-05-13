import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ScanControlsProps {
  isScanning: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
  onAddDeviceManually: (ipAddress: string, port: number) => void;
}

const ScanControls: React.FC<ScanControlsProps> = ({
  isScanning,
  onStartScan,
  onStopScan,
  onAddDeviceManually,
}) => {
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("8009");

  const handleScanButtonPress = () => {
    if (isScanning) {
      onStopScan();
    } else {
      onStartScan();
    }
  };

  const handleAddManuallyPress = () => {
    console.log("Add Manually button pressed"); // Debug log
    setManualModalVisible(true);
  };

  const validateAndAddDevice = () => {
    // Basic IP address validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
      Alert.alert(
        "Invalid IP Address",
        "Please enter a valid IP address (e.g., 192.168.1.10)"
      );
      return;
    }

    // Port validation
    const portNumber = parseInt(port);
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      Alert.alert("Invalid Port", "Please enter a valid port number (1-65535)");
      return;
    }

    console.log(`Adding device at ${ipAddress}:${portNumber}`); // Debug log

    // Add the device
    onAddDeviceManually(ipAddress, portNumber);

    // Close the modal and reset inputs
    setManualModalVisible(false);
    setIpAddress("");
    setPort("8009");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chromecast Scanner</Text>
      </View>

      <Text style={styles.description}>
        Scan your network for Chromecast devices and analyze them for security
        vulnerabilities.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.scanButton,
            isScanning ? styles.stopButton : styles.startButton,
          ]}
          onPress={handleScanButtonPress}
        >
          <FontAwesome
            name={isScanning ? "stop" : "play"}
            size={16}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>
            {isScanning ? "Stop Scan" : "Start Scan"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.manualButton, isScanning && styles.disabledButton]}
          onPress={handleAddManuallyPress}
          disabled={isScanning}
        >
          <FontAwesome
            name="plus"
            size={16}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Add Manually</Text>
        </TouchableOpacity>
      </View>

      {/* Manual IP Address Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={manualModalVisible}
        onRequestClose={() => setManualModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Chromecast Device</Text>

            <Text style={styles.inputLabel}>IP Address:</Text>
            <TextInput
              style={styles.input}
              value={ipAddress}
              onChangeText={setIpAddress}
              placeholder="192.168.1.10"
              keyboardType="number-pad"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Port Number:</Text>
            <TextInput
              style={styles.input}
              value={port}
              onChangeText={setPort}
              placeholder="8009"
              keyboardType="number-pad"
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  console.log("Cancel button pressed"); // Debug log
                  setManualModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={validateAndAddDevice}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scanButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#F44336",
  },
  manualButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#2196F3",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#B0BEC5",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 14,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#EEEEEE",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#2196F3",
    marginLeft: 10,
  },
  modalButtonText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
});

export default ScanControls;
