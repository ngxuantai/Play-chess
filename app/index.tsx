import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { IconButton, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setSetting } from "@/redux/slices/settingsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

export default function index() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await AsyncStorage.getItem("settings");
        let parsedSettings;
        if (settings !== null) {
          parsedSettings = JSON.parse(settings);
          Object.entries(parsedSettings).forEach(([key, value]) => {
            dispatch(setSetting({ key, value }));
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/chess/bb.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>CHECKMATE!</Text>
        <Text style={styles.subtitle}>Trải nghiệm cờ vua đỉnh cao</Text>
      </View>

      <View>
        <Image
          source={require("../assets/images/home_image.png")}
          style={{ width: "100%", height: 200 }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <GameButton
          icon="web"
          text="Chơi Trực tuyến"
        />
        <GameButton
          icon="robot"
          text="Chơi với Máy tính"
          onPress={() => {
            router.push("/play-with-bot");
          }}
        />
        <GameButton
          icon="account-group"
          text="Chơi với bạn bè"
        />
        <GameButton
          icon="cog"
          text="Cài đặt"
          onPress={() => {
            router.push("/settings");
          }}
        />
      </View>
    </View>
  );
}

const GameButton = ({
  icon,
  text,
  onPress,
}: {
  icon: string;
  text: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
  >
    <Icon
      name={icon}
      size={24}
      color={Colors.DARKBLUE}
    />
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.GREY,
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
    backgroundColor: Colors.LIGHTBLUE,
    padding: 10,
    borderRadius: 12,
    marginVertical: 10,
    width: "48%",
    height: width / 5,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.DARKBLUE,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
