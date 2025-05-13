/**
 * Utility functions for signal processing and distance estimation
 */

// Environmental factor (adjust based on environment)
// 2.0 for free space, 2.5-4.0 for indoor environments
const N = 2.5;

// Reference RSSI at 1 meter distance (calibration value)
// This should be calibrated for each device type ideally
const MEASURED_POWER = -65;

/**
 * Convert RSSI to approximate distance in meters
 * Uses the log-distance path loss model
 *
 * @param rssi The received signal strength in dBm
 * @param measuredPower Optional reference power at 1m (defaults to -65)
 * @param environmentalFactor Optional path loss exponent (defaults to 2.5)
 * @returns Estimated distance in meters
 */
export const calculateDistance = (
  rssi: number,
  measuredPower: number = MEASURED_POWER,
  environmentalFactor: number = N
): number => {
  if (rssi === 0) {
    return -1; // Cannot determine
  }

  // Log-distance path loss model
  const ratio = rssi / measuredPower;
  if (ratio < 1) {
    return Math.pow(ratio, 10);
  } else {
    // When RSSI is stronger than reference power (very close proximity)
    return Math.pow(10, (measuredPower - rssi) / (10 * environmentalFactor));
  }
};

/**
 * Get a human-readable description of the distance
 *
 * @param distance The calculated distance in meters
 * @returns A human-readable description
 */
export const getDistanceDescription = (distance: number): string => {
  if (distance < 0) {
    return "Unknown";
  } else if (distance < 0.5) {
    return "Immediate (<0.5m)";
  } else if (distance < 2) {
    return "Near (0.5-2m)";
  } else if (distance < 5) {
    return "Medium (2-5m)";
  } else if (distance < 10) {
    return "Far (5-10m)";
  } else {
    return "Very Far (>10m)";
  }
};

// Add default export to prevent Expo Router from treating this as a route
export default {
  calculateDistance,
  getDistanceDescription,
};
