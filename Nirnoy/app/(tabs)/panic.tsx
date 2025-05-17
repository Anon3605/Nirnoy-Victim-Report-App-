import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useRouter } from "expo-router";

export default function PanicScreen() {
  const router = useRouter();
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyMessage, setEmergencyMessage] = useState("");

  // Fetch emergency info when screen loads
  useEffect(() => {
    console.log("Updated contact and message:", emergencyContact, emergencyMessage);
    const fetchEmergencyInfo = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      if (!email) return;
      try {
        const response = await fetch("http://192.168.1.115:8000/api/get-emergency-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

      if (response.ok) {
        const data = await response.json();
        console.log("Emergency data from API:", data); // 

        setEmergencyContact(data.emergency_phone);
        setEmergencyMessage(data.emergency_message);
      } 
      else {
        console.warn("Could not fetch emergency info.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  fetchEmergencyInfo();
}, []);


  const handlePanic = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const email = await AsyncStorage.getItem("userEmail");

    if (!email) {
      Alert.alert("Error", "User email not found.");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.115:8000/api/panic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, latitude, longitude }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to send panic alert.");
        return;
      }

      Alert.alert("PANIC", "Location sent and stored.");

      // 🔽 ADD THIS for demo:
      await AsyncStorage.setItem("victimName", "John Doe");
      await AsyncStorage.setItem("victimLatitude", latitude.toString());
      await AsyncStorage.setItem("victimLongitude", longitude.toString());
      
    } catch (error) {
      Alert.alert("Error", "Could not send panic alert.");
      console.error(error);
    }
  };


  const handleSOS = () => {
    const number = Platform.OS === "android" ? "tel:911" : "telprompt:911";
    Linking.openURL(number);
  };

  const handleEmergencyMessage = async () => {
   const isAvailable = await SMS.isAvailableAsync();
  if (!isAvailable) {
    Alert.alert("Error", "SMS service not available.");
    return;
  }

  console.log("emergencyContact:", emergencyContact);
  console.log("emergencyMessage:", emergencyMessage);

  if (!emergencyContact || !emergencyMessage) {
    Alert.alert("Missing Info", "Emergency contact or message is not set.");
    return;
  }

  const { result } = await SMS.sendSMSAsync([emergencyContact], emergencyMessage);
  Alert.alert("EMERGENCY", `Message status: ${result}`);
};

const handleCaller = () => {
  if (!emergencyContact) {
    Alert.alert("Missing Info", "Emergency contact number is not set.");
    return;
  }

  Linking.openURL(`tel:${emergencyContact}`);
};

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.panicButton} onPress={handlePanic}>
          <Text style={styles.panicText}>Show Yourself</Text>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
            <Text style={styles.bottomButtonText}>SOS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={handleEmergencyMessage}
          >
            <Text style={styles.bottomButtonText}>Emergency</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.callButton} onPress={handleCaller}>
          <Text style={styles.panicText}>Caller</Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: height,
  },
  panicButton: {
    width: 300,
    height: 200,
    backgroundColor: "#b30000",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  callButton: {
    width: 300,
    height: 70,
    backgroundColor: "#06bd61",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  panicText: {
    color: "white",
    fontSize: 32,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    gap: 12,
  },
  sosButton: {
    backgroundColor: "#ffb400",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  emergencyButton: {
    backgroundColor: "#104cd6",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  bottomButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
