import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[Colors.DARKBLUE, Colors.LIGHTBLUE]}
      style={styles.container}
    >
      <Image
        source={require("../assets/images/welcome-image.png")}
        style={styles.image}
      />
      <Text style={styles.title}>WELCOME TO</Text>
      <Text style={styles.appName}>CHECKMATE!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 220, height: 220 },
  title: { fontSize: 24, color: "#fff" },
  appName: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    fontFamily: "serif",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: { fontSize: 20, color: Colors.DARKBLUE },
});
