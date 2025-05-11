// bluetooth-plugin.js
const { withInfoPlist } = require("expo/config-plugins");

const withBluetoothPermissions = (config) => {
  return withInfoPlist(config, (config) => {
    const infoPlist = config.modResults;

    // Add Bluetooth permissions
    infoPlist.NSBluetoothAlwaysUsageDescription =
      "We need Bluetooth access to scan for security vulnerabilities in nearby devices";
    infoPlist.NSBluetoothPeripheralUsageDescription =
      "We need Bluetooth access to scan for security vulnerabilities in nearby devices";
    infoPlist.NSLocationWhenInUseUsageDescription =
      "We need location access because it's required for Bluetooth scanning";

    return config;
  });
};

module.exports = withBluetoothPermissions;
