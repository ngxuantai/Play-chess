import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/welcome-image.png")}
        style={styles.image}
      />
      <Text style={styles.title}>SIGN IN</Text>
      <Text style={styles.title}>TO CONTINUE</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color={Colors.DARKBLUE}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity>
        <LinearGradient
          colors={[Colors.DARKBLUE, Colors.LIGHTBLUE]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </LinearGradient>
      </TouchableOpacity>
      <Text style={{ marginTop: 10 }}>Lost password?</Text>
      <View style={styles.otherOptionsContainer}>
        <TouchableOpacity style={styles.outlinedButton}>
          <Icon
            name="google"
            size={20}
            color={Colors.DARKBLUE}
          />
          <Text style={styles.outlinedButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlinedButton}>
          <Icon
            name="facebook"
            size={20}
            color={Colors.DARKBLUE}
          />
          <Text style={styles.outlinedButtonText}>Facebook</Text>
        </TouchableOpacity>
      </View>
      <Divider
        bold
        style={styles.divider}
      />
      <Text style={styles.footer}>
        Don't have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/register")}
        >
          Register
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: { width: 150, height: 150 },
  title: { fontSize: 24, opacity: 0.5 },
  inputContainer: {
    marginTop: 70,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 20,
    width: "80%",
    borderRadius: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  otherOptionsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    padding: 50,
  },
  outlinedButton: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.DARKBLUE,
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
  },
  outlinedButtonText: {
    fontWeight: "bold",
  },
  footer: { marginTop: 20 },
  divider: {
    width: "40%",
  },
  link: { color: Colors.DARKBLUE, fontWeight: "bold" },
});
