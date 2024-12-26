import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth } from "@/redux/selectors/authSelectors";
import { startLoading } from "@/redux/slices/loadingSlice";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfileAction } from "@/redux/actions/authActions";
import { AppDispatch } from "@/redux/store";

const { width } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token !== null) {
          dispatch(getProfileAction(token));
          setIsLoading(true);

          setTimeout(() => {
            router.replace("/home");
          }, 3000);
        }
      } catch (error) {
        console.log("Error loading token:", error);
      }
    };

    Promise.all([loadToken()]);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.LIGHTBLUE, Colors.DARKBLUE]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/welcome-image.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>
          Chào mừng bạn đến với ứng dụng chơi cờ vua
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
        disabled={isLoading}
      >
        {isLoading && (
          <ActivityIndicator
            color={Colors.BLACK}
            size={24}
          />
        )}
        <Text style={styles.buttonText}>
          {isLoading ? "Loading..." : "Đăng nhập"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 150,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  subtitle: {
    maxWidth: "90%",
    fontSize: 22,
    color: Colors.BLACK,
    flexWrap: "wrap",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.LIGHTBLUE,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: width / 6,
    marginVertical: 10,
    minWidth: "48%",
    height: width / 6,
    elevation: 10,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.BLACK,
    marginLeft: 10,
    fontWeight: "bold",
    maxWidth: "80%",
  },
});
