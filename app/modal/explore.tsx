// app/(tabs)/explore.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Define Resource type
type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
};

// Sample resources for network security
const RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Understanding Common Vulnerabilities",
    description:
      "Learn about the most common vulnerabilities found in networks and how they can be exploited.",
    category: "Education",
    icon: "book-outline",
  },
  {
    id: "2",
    title: "Securing Your Home Network",
    description:
      "Best practices for securing your home network against common threats.",
    category: "Guide",
    icon: "home-outline",
  },
  {
    id: "3",
    title: "Network Protocols and Security",
    description:
      "An overview of common network protocols and their security implications.",
    category: "Technical",
    icon: "analytics-outline",
  },
  {
    id: "4",
    title: "Wireless Network Security",
    description:
      "Understanding the security challenges specific to wireless networks.",
    category: "Guide",
    icon: "wifi-outline",
  },
  {
    id: "5",
    title: "Introduction to Port Scanning",
    description:
      "Learn how port scanning works and how it's used in security assessments.",
    category: "Education",
    icon: "scan-outline",
  },
  {
    id: "6",
    title: "Firewall Configuration Best Practices",
    description:
      "Guidelines for configuring firewalls to maximize network security.",
    category: "Technical",
    icon: "shield-checkmark-outline",
  },
];

export default function ExploreScreen() {
  const router = useRouter();

  // Group resources by category
  const resourcesByCategory = RESOURCES.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Explore Network Security",
          headerStyle: {
            backgroundColor: "#2196F3",
          },
          headerTintColor: "#fff",
        }}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Network Security Resources</Text>
        <Text style={styles.headerSubtitle}>
          Explore resources and information about network security
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {Object.entries(resourcesByCategory).map(([category, resources]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>

            {resources.map((resource) => (
              <TouchableOpacity key={resource.id} style={styles.resourceCard}>
                <View style={styles.resourceIconContainer}>
                  <Ionicons
                    name={resource.icon as any}
                    size={24}
                    color="#2196F3"
                  />
                </View>
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceDescription}>
                    {resource.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Network Scanning</Text>
          <Text style={styles.infoText}>
            Network scanning is a procedure for identifying active devices on a
            network by employing different techniques to collect information
            about hosts and services. This is crucial for assessing potential
            security vulnerabilities.
          </Text>
          <Text style={styles.infoText}>
            The Network Vulnerability Scanner lets you identify open ports on
            your network that could potentially be exploited. Regular scanning
            is an important component of maintaining network security.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color="#ffffff" />
            <Text style={styles.backButtonText}>Back to Scanner</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#2196F3",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  resourceCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  resourceIconContainer: {
    marginRight: 12,
    justifyContent: "center",
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0066cc",
  },
  resourceDescription: {
    fontSize: 14,
    color: "#555",
  },
  infoSection: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  backButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
