import ParallaxScrollView from "@/components/ParallaxScrollView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";



const dummyAlertHistoryAPI = async () => {
  return [
    { id: 1, message: "Panic alert triggered", date: "2025-05-10 14:22" },
    { id: 2, message: "Emergency contact updated", date: "2025-05-09 18:10" },
  ];
};

export default function ProfileScreen() {
  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [phone, setPhone] = useState("Loading...");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyMessage, setEmergencyMessage] = useState("");
  type Alert = {
  id: number;
  message: string;
  date: string;
};

const [alerts, setAlerts] = useState<Alert[]>([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        if (!storedEmail) {
          console.warn("No email found in storage.");
          return;
        }

        const response = await fetch("http://192.168.1.115:8000/api/user-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: storedEmail }),
        });

        if (!response.ok) {
          console.error("Failed to fetch user. Status:", response.status);
          return;
        }

        const user = await response.json();
        if (!user || !user.name || !user.email) {
          console.warn("Incomplete user data", user);
          return;
        }

        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone || "Not set");

        const alertData = await dummyAlertHistoryAPI();
        setAlerts(alertData);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);



  const handleEmergencyContactSubmit = async () => {
  if (!emergencyContact || !emergencyMessage) {
    Alert.alert("Error", "Both fields are required.");
    return;
  }

  try {
    const storedEmail = await AsyncStorage.getItem("userEmail");

    const response = await fetch("http://192.168.1.115:8000/api/save-emergency-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: storedEmail,
        emergency_phone: emergencyContact,
        emergency_message: emergencyMessage,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save emergency info");
    }

    const resData = await response.json();
    Alert.alert("Success", resData.message);

    setAlerts((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        message: `Emergency info updated`,
        date: new Date().toLocaleString(),
      },
    ]);
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Could not save emergency info.");
  }
};



  return (
    <ParallaxScrollView headerBackgroundColor={{ light: "#eee", dark: "#222" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("@/assets/images/profile.png")}
          style={styles.profileImage}
        />

        <View style={styles.infoBox}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{phone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact Info</Text>

          <Text style={styles.label}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="Enter emergency contact number"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Emergency Message:</Text>
          <TextInput
            style={styles.input}
            value={emergencyMessage}
            onChangeText={setEmergencyMessage}
            placeholder="Enter emergency message"
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleEmergencyContactSubmit}
          >
            <Text style={styles.saveText}>Save Emergency Info</Text>
          </TouchableOpacity>
        </View>



        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alert History</Text>
          {alerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <Text style={styles.alertText}>{alert.message}</Text>
              <Text style={styles.alertDate}>{alert.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    color: "white",
  },
  infoBox: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#3a423c",
    padding: 16,
    borderRadius: 10,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    marginTop: 8,
    color: "white",
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
    color: "white",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderColor: "#494949",
    borderWidth: 1,
    backgroundColor: "#2e2e2e",
    padding: 100,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#494949",
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#2e2e2e",
    fontSize: 16,
    color: "white",
  },
  section: {
    width: "100%",
    marginTop: 20,
    color: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "white",
  },
  saveButton: {
    backgroundColor: "#104cd6",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 6,
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
  alertItem: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  alertText: {
    fontSize: 16,
    fontWeight: "500",
  },
  alertDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
})
