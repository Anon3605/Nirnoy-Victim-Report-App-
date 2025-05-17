import React, { useEffect, useState } from "react";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventSource from 'react-native-sse';  // Correct import

export default function ResponseScreen() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [victimName, setVictimName] = useState<string>("John Doe");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    AsyncStorage.getItem("victimName").then(name => {
      if (name) setVictimName(name);
    });
  }, []);

  useEffect(() => {
    // if (!victimName) return;

    // const interval = setInterval(() => {
    //   fetch(`http://192.168.1.115:8000/api/latest-panic/${encodeURIComponent(victimName)}`)
    //   .then(async (res) => {
    //     const text = await res.text();
    //     try {
    //       const data = JSON.parse(text);
    //       if (data.latitude && data.longitude) {
    //         setLatitude(data.latitude);
    //         setLongitude(data.longitude);
    //         setLoading(false);
    //       }
    //     } catch (err) {
    //       console.error("Failed to parse JSON. Raw response:", text);
    //     }
    //   })
    //   .catch((err) => {
    //     console.error("Polling error:", err);
    //   });
    // }, 3000); // Every 3 seconds

    // const timeout = setTimeout(() => {
    //   clearInterval(interval);
    //   Alert.alert("Session Ended", "Panic data expired after 20 minutes.");
    // }, 20 * 60 * 1000);

    // return () => {
    //   clearInterval(interval);
    //   clearTimeout(timeout);
    // };
    const loadPanicData = async () => {
    const name = await AsyncStorage.getItem("victimName");
    const lat = await AsyncStorage.getItem("victimLatitude");
    const lon = await AsyncStorage.getItem("victimLongitude");

    if (name && lat && lon) {
      setVictimName(name);
      setLatitude(parseFloat(lat));
      setLongitude(parseFloat(lon));
      setLoading(false);
    }
  };

  loadPanicData();
  }, []);//[victimName]);



  const openGoogleMaps = () => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url);
    } else {
      Alert.alert("Location not available");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Victim Location</Text>
      {loading ? (
        <Text style={styles.coordinates}>Waiting for panic data...</Text>
      ) : latitude && longitude ? (
        <>
          <Text style={styles.coordinates}>
            Name: {victimName}{"\n"}
            Latitude: {latitude}{"\n"}
            Longitude: {longitude}
          </Text>
          <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
            <Text style={styles.mapButtonText}>Open in Google Maps</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.coordinates}>No panic response yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  coordinates: {
    color: "white",
    fontSize: 18,
    marginBottom: 30,
    textAlign: "center",
  },
  mapButton: {
    backgroundColor: "#0a84ff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
