import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useRouter } from 'expo-router';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

    const handleRegister = async () => {
  if (!name || !email || !password) {
    Alert.alert('Error', 'Please fill all fields');
    return;
  }

  try {
  const response = await fetch('http://192.168.1.115:8000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    Alert.alert('Registration Failed', data.message || 'Something went wrong');
    return;
  }
  await AsyncStorage.setItem("userEmail", email);
  await AsyncStorage.setItem('userToken', data.token || JSON.stringify(data.user));
  Alert.alert('Success', 'Registration successful!');
  router.push('/(tabs)/profile');
} catch (error) {
  Alert.alert('Error', 'Something went wrong. Please try again.');
  console.error(error);
}
};



  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>Register Page</ThemedText>
      </ThemedView>
      <View style={styles.form}>
        <TextInput
          placeholder="Name"
          value={name}  
          onChangeText={setName}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title="Register" onPress={handleRegister} />

      <Link href="/login" asChild>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerText}>Have an account? Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    width: '100%',
  },
  form: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  registerButton: {
    marginTop: 12,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  registerText: {
    color: '#007bff',
    fontWeight: '600',
  },
});
