import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setSetting } from "@/redux/slices/settingsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

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

    // function get all items from async storage
    const getAllItems = async () => {
      try {
        const gameState = {
          board: "rnb1kb1r/ppp2ppp/8/1K2q3/3p4/8/PPPP1PPP/RNBQnBNR w kq - 0 10",
          history: [],
          side: "w",
        };
        await AsyncStorage.setItem("gameState", JSON.stringify(gameState));
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        console.log(items);
      } catch (error) {
        console.error("Error getting all items:", error);
      }
    };
    getAllItems();

    // function remove all key and items from async storage
    // const removeAllItems = async () => {
    //   try {
    //     await AsyncStorage.clear();
    //   } catch (error) {
    //     console.error("Error removing all items:", error);
    //   }
    // };
    // removeAllItems();
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
        <Text style={styles.title}>CHECKMATE!</Text>
        <Text style={styles.subtitle}>Trải nghiệm cờ vua đỉnh cao</Text>
      </View>

      <View>
        <Image
          source={require("../assets/images/home-image.png")}
          style={{ width: "100%", height: 200 }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <GameButton
          icon="web"
          text="Chơi Trực tuyến"
          onPress={() => router.push("/play-online")}
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
          onPress={() => {
            router.push("/login");
          }}
        />
        <GameButton
          icon="cog"
          text="Cài đặt"
          onPress={() => {
            router.push("/settings");
          }}
        />
      </View>
    </LinearGradient>
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
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.BLACK,
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
    paddingInline: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: "48%",
    height: width / 6,
    elevation: 10,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.BLACK,
    marginLeft: 10,
    fontWeight: "bold",
    width: "80%",
    flexWrap: "wrap",
  },
});
