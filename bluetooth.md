# Bluetooth Device Analysis on macOS

This guide explains how to capture and analyze Bluetooth device information on macOS, providing insights into device connections, signal strength, and security characteristics.

## Overview

macOS provides powerful built-in logging capabilities for Bluetooth that can help you:

- Identify nearby Bluetooth devices
- Estimate distance to devices based on signal strength
- Analyze connection quality and security features
- Monitor device behaviors and power management
- Diagnose Bluetooth connectivity issues

## Prerequisites

- macOS computer with Bluetooth capability
- Terminal access
- Administrative privileges

## Step 1: Enable Bluetooth Logging

First, we'll enable enhanced Bluetooth logging through macOS's unified logging system:

```bash
# Create a directory to store our logs
mkdir -p ~/Desktop/Bluetooth

# Enable Bluetooth debug logging
sudo defaults write com.apple.Bluetooth DebugLogging YES
sudo defaults write com.apple.Bluetooth DebugLevel 16
sudo defaults write com.apple.Bluetooth DebugLogFile /var/log/bluetooth/BTlog.log

# Restart Bluetooth to apply changes
sudo pkill -9 bluetoothd
```

## Step 2: Capture Bluetooth Logs

Use the `log` command to capture Bluetooth-specific information:

```bash
# Basic Bluetooth logging (less detailed)
log stream --predicate 'subsystem == "com.apple.bluetooth"' --info --timeout 300 > ~/Desktop/Bluetooth/bluetooth_log.txt

# Detailed debug-level Bluetooth logging (more comprehensive)
log stream --predicate 'subsystem == "com.apple.bluetooth"' --level debug --style compact > ~/Desktop/Bluetooth/bluetooth_debug_log.txt
```

The command will run for 5 minutes (300 seconds) and save the output to a text file. During this time, use your Bluetooth devices normally or perform specific actions you want to analyze.

## Step 3: Analyze Bluetooth Device Information

Once you've captured the logs, you can analyze them to extract valuable information:

### Device Discovery and Identification

Look for entries containing "Device found" to identify Bluetooth devices:

```
Device found: CBDevice [UUID], BDA [MAC ADDRESS], Nm '[DEVICE NAME]'
```

This provides basic device identification including:

- UUID: Unique identifier for the device
- BDA (Bluetooth Device Address): The MAC address
- Name: The advertised device name
- Vendor/Product ID: Manufacturer information

### Signal Strength and Distance Estimation

Look for "RSSI" values in the logs:

```
rssi -55
```

The RSSI (Received Signal Strength Indicator) value helps estimate distance:

- -30 to -60 dBm: Excellent signal (very close, ~0-2 meters)
- -60 to -70 dBm: Good signal (typical working distance, ~2-5 meters)
- -70 to -90 dBm: Fair to poor signal (increasing distance, ~5-10+ meters)
- Below -90 dBm: Very weak signal (likely to have connection issues)

### Security and Connectivity Features

Device flags provide insight into security features and connection types:

```
DvF 0x40000024000 < ClassicPaired HIDBadBehavior Connectable >
```

Common flags include:

- ClassicPaired: Paired using classic Bluetooth
- BLEPaired: Paired using Bluetooth Low Energy
- Connectable: Currently available for connection
- HIDGoodBehavior/HIDBadBehavior: Indicates standard or non-standard input device behavior

### Power Management

Look for "sniff" entries that show power management optimization:

```
Sniff interval changed: device <private>, interval 22500 us, mode 2
```

The sniff interval indicates how often devices check for data:

- Shorter intervals (5-10ms): More responsive but higher power consumption
- Longer intervals (20-100ms): Better battery life but potentially more latency

## Distance Estimation from RSSI

### The Log-Distance Path Loss Model

The most commonly used formula to estimate distance from Bluetooth RSSI (Received Signal Strength Indicator) values is based on the log-distance path loss model:

```
Distance = 10 ^ ((Measured Power - RSSI) / (10 * N))
```

Where:

- **Distance**: The estimated distance in meters
- **Measured Power**: The RSSI value at a reference distance of 1 meter (typically calibrated per device type)
- **RSSI**: The current received signal strength in dBm
- **N**: The path loss exponent that depends on the environment

### Implementation in JavaScript/TypeScript

```javascript
/**
 * Convert RSSI to approximate distance in meters
 *
 * @param rssi The received signal strength in dBm
 * @param measuredPower Reference power at 1m (calibration value, typically around -65 to -70 dBm)
 * @param environmentalFactor Path loss exponent (2.0 for free space, 2.5-4.0 for indoor environments)
 * @returns Estimated distance in meters
 */
function calculateDistance(
  rssi: number,
  measuredPower: number = -65,
  environmentalFactor: number = 2.5
): number {
  if (rssi === 0) {
    return -1; // Cannot determine
  }

  // Log-distance path loss model
  return Math.pow(10, (measuredPower - rssi) / (10 * environmentalFactor));
}
```

### Calibration Values

For accurate distance estimation, you'll need appropriate values for:

1. **Measured Power (Reference RSSI)**: This is the RSSI expected at 1 meter from the device

   - For Apple devices: Often around -65 dBm
   - For generic Bluetooth devices: Often between -65 and -75 dBm
   - Best practice: Calibrate this value for each device type by measuring actual RSSI at 1m

2. **Environmental Factor (N)**: This path loss exponent varies with the environment
   - 2.0: Free space/outdoors with no obstacles
   - 2.5: Residential environment with few obstacles
   - 3.0-3.5: Office environment with many obstacles
   - 4.0+: Highly obstructed environments (multiple walls, floors)

### Accuracy Limitations

This formula provides an estimate with several limitations:

- **Interference**: Wi-Fi networks, microwave ovens, and other devices operating in the 2.4 GHz band can cause interference
- **Obstacles**: Walls, furniture, and even human bodies can significantly affect signal propagation
- **Orientation**: Device antenna orientation can impact RSSI values by ±10 dBm
- **Device Variations**: Different devices may report RSSI values differently
- **Multipath Effects**: Signal reflections can cause constructive or destructive interference

### Example Distance Estimations

Using the formula with standard parameters (Measured Power = -65 dBm, N = 2.5):

| RSSI Value | Estimated Distance |
| ---------- | ------------------ |
| -50 dBm    | ~0.6 meters        |
| -60 dBm    | ~1.8 meters        |
| -70 dBm    | ~5.6 meters        |
| -80 dBm    | ~17.8 meters       |
| -90 dBm    | ~56.2 meters       |

In practice, accuracy deteriorates significantly beyond 10 meters.

### Practical Approach: Distance Zones

Rather than relying on exact distances, many applications use RSSI to categorize proximity into zones:

```javascript
function getDistanceDescription(distance: number): string {
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
}
```

This approach is more reliable for most real-world applications, as it acknowledges the inherent limitations in precision.

## Frequency-Hopping Spread Spectrum (FHSS) Information

### Background on Bluetooth FHSS

Bluetooth uses Frequency-Hopping Spread Spectrum (FHSS) as a core technology to:

- Reduce interference with other wireless devices
- Improve security by making eavesdropping more difficult
- Enhance reliability in noisy RF environments

In Bluetooth, FHSS works by:

1. Dividing the 2.4 GHz ISM band into 79 channels (or 40 channels for BLE)
2. Rapidly switching between these channels in a pseudo-random sequence
3. Changing channels up to 1600 times per second in Classic Bluetooth

### Finding FHSS Information in macOS Logs

Standard macOS Bluetooth logs don't explicitly show the frequency-hopping pattern, as this is handled at the lower layers of the Bluetooth stack. However, there are several indicators that provide insights:

1. **Channel Information**:
   Look for "Ch" entries in device discovery logs:

   ```
   Device found: ... Ch 39, ...
   ```

   This indicates which channel (0-39 for BLE) the device was discovered on.

2. **Adaptive Frequency Hopping (AFH)**:
   In more detailed logs, look for "AFH" entries:

   ```
   AFH map updated: channels 0-78, channels used 62
   ```

   This would indicate which channels are being used and which are being avoided due to interference.

3. **Channel Classification**:
   Advanced logs might contain channel classification information:
   ```
   Channel classification updated: channels 0-78, bad channels [30-33,45,62]
   ```
   This shows which channels are being avoided due to detected interference.

### Using Specialized Tools for FHSS Analysis

To fully analyze Bluetooth frequency hopping, specialized hardware is required:

1. **Ubertooth One**:
   This open-source platform can capture raw Bluetooth packets and show frequency hopping:

   ```bash
   # Install Ubertooth tools (on macOS with Homebrew)
   brew install ubertooth

   # Capture and display frequency hopping patterns
   ubertooth-rx -f -A -r packet_log.pcap
   ```

2. **Software-Defined Radio (SDR)**:
   Using an SDR like HackRF or USRP with appropriate software:

   ```bash
   # Example using GNU Radio with HackRF
   osmocom_fft -f 2.4e9 -s 20e6
   ```

3. **Professional Bluetooth Analyzers**:
   Tools like Ellisys Bluetooth Analyzer can provide detailed FHSS visualization.

### FHSS Information in Example Logs

In our captured logs, FHSS-related information is limited but we can see:

```
Freq 2.4, Ch 39
```

This indicates a device using the 2.4 GHz band and specifically operating on channel 39 at the moment of discovery. For BLE, channel 39 is one of the three advertising channels (37, 38, and 39) that devices use before establishing connections.

Full FHSS analysis would require capturing raw RF data with specialized hardware, which goes beyond what macOS's logging system provides.

## Example Log Analysis: Apple iPad

This example shows a detected iPad with strong signal:

```
Device found: CBDevice B5161CC4-4FC0-6527-47B9-A975BFCA6096, BDA 74:81:14:91:08:18, Nm 'iPad', RSSI -53
```

Analysis:

- Device: iPad
- Signal Strength: -53 dBm (excellent)
- Estimated Distance: ~1-2 meters
- Features: Apple-specific Continuity capabilities

## Example Log Analysis: Macally Bluetooth Keyboard

This example shows a connected keyboard:

```
Device found: CBDevice 32E523B2-85F2-DD27-C2E8-C978CF3FD8AA, BDA 17:03:85:A4:4A:1D, Nm 'MACALLY ACEBTKEY BLUETOOTH KEYBOARD', RSSI -67
```

Analysis:

- Device: Macally Bluetooth Keyboard
- Signal Strength: -67 dBm (good)
- Estimated Distance: ~3-5 meters
- Connection Type: Classic Bluetooth (not BLE)
- Power Management: 22.5ms sniff interval (balanced power/responsiveness)
- Behavior Flag: HIDBadBehavior (non-standard HID implementation)

## What's Happening Behind the Scenes

When your Mac interacts with Bluetooth devices:

1. **Discovery Process**: Your Mac continuously scans for advertising packets from nearby Bluetooth devices.

2. **System Integration**: Multiple system components are notified about discovered devices:

   - ControlCenter: For UI display
   - Bluetooth menu app: For user interaction
   - WindowServer: For input processing
   - Audio subsystems: For audio device handling

3. **Device Classification**: macOS analyzes device characteristics to classify and handle them appropriately:

   - Input devices (keyboards, mice)
   - Audio devices (speakers, headphones)
   - Apple ecosystem devices (special features enabled)
   - Generic Bluetooth devices

4. **Power Optimization**: macOS negotiates power management settings with each device to optimize battery life while maintaining performance.

5. **Security Management**: Pairing status and encryption are verified for each connection.

## Advanced Usage

For deeper analysis, you can combine these logs with system profiler information:

```bash
# Get detailed information about all Bluetooth devices
system_profiler SPBluetoothDataType > ~/Desktop/Bluetooth/bluetooth_devices.txt
```

## Cleaning Up

When finished, you can disable the enhanced logging:

```bash
sudo defaults delete com.apple.Bluetooth DebugLogging
sudo defaults delete com.apple.Bluetooth DebugLevel
sudo defaults delete com.apple.Bluetooth DebugLogFile
sudo pkill -9 bluetoothd
```

## Limitations

- Some information in the logs is marked as `<private>` for security reasons
- Detailed packet-level analysis requires specialized hardware (like Ubertooth)
- Recent macOS versions have increased security restrictions on Bluetooth logging

## Conclusion

macOS's built-in logging provides valuable insights into Bluetooth device characteristics without requiring specialized hardware. By analyzing these logs, you can better understand device behavior, estimate physical proximity, and diagnose connection issues.

For application development, this information can help you build more intelligent proximity-based features and better understand the Bluetooth device ecosystem.
