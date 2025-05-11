// app/modules/bluetooth-scanner/constants/mac-oui-database.ts

/**
 * MAC OUI (Organizationally Unique Identifier) Database
 * Contains the first 6 characters of MAC addresses (without colons) and their corresponding manufacturers
 * Based on the IEEE OUI registry
 */
export const MAC_OUI_DATABASE: Record<string, string> = {
  // Apple devices
  "000393": "Apple",
  "000502": "Apple",
  "000A27": "Apple",
  "000A95": "Apple",
  "001E52": "Apple",
  "001FF3": "Apple",
  "0021E9": "Apple",
  "0023DF": "Apple",
  "0025BC": "Apple",
  "00264A": "Apple",
  "0026B0": "Apple",
  "0026BB": "Apple",
  "003065": "Apple",
  "0050E4": "Apple",
  "0090A9": "Apple",
  "00C610": "Apple",
  "18E7F4": "Apple",
  "28CFDA": "Apple",
  "28E7CF": "Apple",
  "3C0754": "Apple",
  "3CAB8E": "Apple",
  "70073C": "Apple",
  "7CF05F": "Apple",
  "8C7B9D": "Apple",
  A85B78: "Apple",
  D89E3F: "Apple",
  D4619D: "Apple",
  D83062: "Apple",
  E0B9BA: "Apple",
  F0DCE2: "Apple",

  // Samsung devices
  "0000F0": "Samsung",
  "0007AB": "Samsung",
  "001247": "Samsung",
  "001599": "Samsung",
  "0017D5": "Samsung",
  "001FCD": "Samsung",
  "002339": "Samsung",
  "002490": "Samsung",
  "002566": "Samsung",
  "0026E4": "Samsung",
  "1C6258": "Samsung",
  "3C5A37": "Samsung",
  "4C6641": "Samsung",
  "508569": "Samsung",
  "5C3C27": "Samsung",
  "602AD0": "Samsung",
  "6C2F2C": "Samsung",
  "786C1C": "Samsung",
  "84119E": "Samsung",
  "8C71F8": "Samsung",
  "9852B1": "Samsung",
  B8D9CE: "Samsung",
  C4731E: "Samsung",
  DCF756: "Samsung",
  F0E77E: "Samsung",

  // Bose
  "000C8A": "Bose",
  "0452C7": "Bose",
  "38184C": "Bose",
  "60ABD2": "Bose",
  "7CE95C": "Bose",
  D86162: "Bose",

  // Sony
  "00014A": "Sony",
  "0013A9": "Sony",
  "001A80": "Sony",
  "001CA4": "Sony",
  "001D0D": "Sony",
  "001FC7": "Sony",
  "002345": "Sony",
  "0024BE": "Sony",
  "647FDA": "Sony",
  "78843C": "Sony",
  "783CE3": "Sony",
  "94CE2C": "Sony",
  B48B7E: "Sony",
  C4A581: "Sony",
  FC0FE6: "Sony",

  // Olympus
  "0012FB": "Olympus",
  "6077EF": "Olympus",
  "90B686": "Olympus",

  // Google
  "001A11": "Google",
  "3C5AB4": "Google",
  "546009": "Google",
  "94EB2C": "Google",
  A47733: "Google",
  D83C69: "Google",
  F88FCA: "Google", // Google Home/Nest devices

  // Meta/Oculus
  "288620": "Meta/Oculus",
  "3CF300": "Meta/Oculus",
  "58AB6A": "Meta/Oculus",
  A4D18C: "Meta/Oculus",

  // Xiaomi
  "009EC8": "Xiaomi",
  "0C1DAF": "Xiaomi",
  "102AB3": "Xiaomi",
  "286C07": "Xiaomi",
  "3CBD3E": "Xiaomi",
  "64B473": "Xiaomi",
  "98FAE3": "Xiaomi",
  ACF7F3: "Xiaomi",
  F8A45F: "Xiaomi",

  // Microsoft
  "0003FF": "Microsoft",
  "0017FA": "Microsoft",
  "0050F2": "Microsoft",
  "3C8375": "Microsoft",
  "5CCA1A": "Microsoft",
  B4E1C4: "Microsoft",
  C83F26: "Microsoft",
  F01DBC: "Microsoft",

  // LG
  "0019A1": "LG",
  "001E75": "LG",
  "002483": "LG",
  "10F96F": "LG",
  "2021A5": "LG",
  "30766F": "LG",
  "3CCD5A": "LG",
  "582AF7": "LG",
  "64995D": "LG",
  "88C9D0": "LG",
  A816B2: "LG",
  C49A02: "LG",
  E8F2E2: "LG",

  // Amazon
  "0C47C9": "Amazon",
  "34D270": "Amazon",
  "44650D": "Amazon",
  "68378E": "Amazon",
  "74C246": "Amazon",
  "84D6D0": "Amazon",
  A002DC: "Amazon",
  B47C9C: "Amazon",
  FC65DE: "Amazon",

  // Roku
  "000D4B": "Roku",
  "086748": "Roku",
  "204E7F": "Roku",
  "24FC0D": "Roku",
  "885533": "Roku",
  B0A737: "Roku",
  B83E59: "Roku",
  DC3A5E: "Roku",

  // Vizio
  "247C4C": "Vizio",
  "7CA97D": "Vizio",
  "8C5A25": "Vizio",
  A4E31B: "Vizio",
  C4E032: "Vizio",
  D4AE05: "Vizio",

  // Sonos
  "00051A": "Sonos",
  "34A68C": "Sonos",
  "485D60": "Sonos",
  "549F13": "Sonos",
  "58C934": "Sonos",
  "5C81A7": "Sonos",
  "94B2CC": "Sonos",
  B8E937: "Sonos",
  F46DE2: "Sonos",

  // Philips Hue/Signify
  "0017EE": "Philips",
  "001BD1": "Philips",
  "1068F0": "Philips",
  "1A9D21": "Philips",
  "2082C0": "Philips",
  "3CCDDB": "Philips",
  "9472B5": "Philips",
  ECB5FA: "Philips",
  F0B4D2: "Philips",

  // TP-Link
  "0086A0": "TP-Link",
  "14CC20": "TP-Link",
  "18D6C7": "TP-Link",
  "54C80F": "TP-Link",
  "5C899A": "TP-Link",
  "645601": "TP-Link",
  "8CBEBE": "TP-Link",
  B0487A: "TP-Link",
  D89EF3: "TP-Link",
  EC086B: "TP-Link",

  // Ubiquiti
  "002722": "Ubiquiti",
  "0418D6": "Ubiquiti",
  "18E8DD": "Ubiquiti",
  "24A43C": "Ubiquiti",
  "44D9E7": "Ubiquiti",
  "68D79A": "Ubiquiti",
  "74ACB9": "Ubiquiti",
  "784558": "Ubiquiti",
  "802AA8": "Ubiquiti",
  B4FBE4: "Ubiquiti",
  DC9FDB: "Ubiquiti",
  F09FC2: "Ubiquiti",
  FC52CE: "Ubiquiti",

  // Intel
  "001111": "Intel",
  "001B21": "Intel",
  "0021D8": "Intel",
  "0024D7": "Intel",
  "181EB0": "Intel",
  "3471BF": "Intel",
  "446D57": "Intel",
  "5CC5D4": "Intel",
  "88967A": "Intel",
  A0369F: "Intel",
  D8FC93: "Intel",

  // Dell
  "00188B": "Dell",
  "0024E8": "Dell",
  "18FB7B": "Dell",
  "246E96": "Dell",
  "34E6D7": "Dell",
  "5887E2": "Dell",
  "845B12": "Dell",
  B8AC6F: "Dell",
  C81F66: "Dell",
  F0DEF1: "Dell",

  // NetGear
  "00146C": "Netgear",
  "00184D": "Netgear",
  "001E2A": "Netgear",
  "001F33": "Netgear",
  "001FB3": "Netgear",
  "2078F0": "Netgear",
  "4C60DE": "Netgear",
  "6CB0CE": "Netgear",
  "9C3DCF": "Netgear",
  A42B8C: "Netgear",
  CC40D0: "Netgear",
  E0469A: "Netgear",
  E091F5: "Netgear",

  // D-Link
  "00155D": "D-Link",
  "001CF0": "D-Link",
  "001E58": "D-Link",
  "0022B0": "D-Link",
  "1C7EE5": "D-Link",
  "284C53": "D-Link",
  "3C1E04": "D-Link",
  "7C3548": "D-Link",
  D0B6BC: "D-Link",

  // Linksys
  "001217": "Linksys",
  "001310": "Linksys",
  "0018F8": "Linksys",
  "00226B": "Linksys",
  "086D41": "Linksys",
  "24F5A2": "Linksys",
  "4C1FCC": "Linksys",

  C0C1C0: "Linksys",
  E8FDA0: "Linksys",
};

/**
 * Get manufacturer name from MAC address OUI prefix
 * @param macPrefix The first 6 characters of the MAC address (without colons)
 * @returns The manufacturer name or "Unknown" if not found
 */
export function getManufacturerFromMac(macPrefix: string): string {
  // Normalize the MAC prefix by removing colons and converting to uppercase
  const normalizedPrefix = macPrefix.replace(/:/g, "").toUpperCase();

  // Try to find in our database
  return MAC_OUI_DATABASE[normalizedPrefix] || "Unknown";
}

export default {};
