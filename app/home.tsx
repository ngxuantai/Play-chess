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
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated } from "@/redux/selectors/authSelectors";
import { startLoading } from "@/redux/slices/loadingSlice";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleNavigate = (path: string) => {
    if (isAuthenticated) {
      router.push(`/${path}`);
    } else {
      router.push({
        pathname: "/login",
        params: {
          redirectTo: path,
        },
      });
    }
  };

  return (
    <LinearGradient
      colors={[Colors.LIGHTBLUE, Colors.DARKBLUE]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Icon
            name="cog"
            size={34}
            color={Colors.DARKBLUE}
          />
        </TouchableOpacity>
      </View>
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
          onPress={() => handleNavigate("room-list")}
        />
        <GameButton
          icon="robot"
          text="Chơi với Máy tính"
          onPress={() => {
            dispatch(startLoading("Đang tạo bàn cờ"));
            router.push("play-with-bot");
          }}
        />
        <GameButton
          icon="puzzle"
          text="Câu đố"
          onPress={() => {
            dispatch(startLoading("Đang tạo câu đố"));
            handleNavigate("play-puzzles");
          }}
        />
        <GameButton
          icon="newspaper-variant-outline"
          text="Blog"
          onPress={() => {
            dispatch(startLoading("Đang tải bài viết"));
            handleNavigate("blog-list");
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
  header: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
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
    paddingHorizontal: 20,
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
