import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/slices/loadingSlice";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { PlayerInforHistory } from "@/types";
import { formatDateTimeVN } from "@/utils/dateTimeFormat";

const chessPieces = {
  "w": require("../assets/chess/wk.png"),
  "b": require("../assets/chess/bk.png"),
};

type GameHistoryCardProps = {
  gameInfo: {
    gameId: number;
    sidePlayer: PlayerInforHistory;
    opponentPlayer: PlayerInforHistory;
    winner: number | null;
    createdAt: string;
  };
};

const GameHistoryCard = ({ gameInfo }: GameHistoryCardProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [result, setResult] = useState<"win" | "lose" | "draw">("draw");

  useEffect(() => {
    if (gameInfo.winner === null) {
      setResult("draw");
    } else if (gameInfo.winner === gameInfo.sidePlayer.id) {
      setResult("win");
    } else {
      setResult("lose");
    }
  }, []);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        dispatch(startLoading("Đang tải dữ liệu ..."));
        router.push(`/game-history/${gameInfo.gameId}`);
      }}
    >
      <Text style={styles.timeText}>
        <Icon
          name="calendar"
          size={16}
          color="gray"
        />
        {formatDateTimeVN(gameInfo.createdAt)}
      </Text>
      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <Image
            source={chessPieces[gameInfo.sidePlayer.color]}
            style={styles.imageLogo}
          />
          <View style={styles.infoRow}>
            <Text
              style={styles.usernameText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {gameInfo.sidePlayer.username}
            </Text>
            <Text style={styles.ratingText}>
              ({gameInfo.sidePlayer.rating})
            </Text>
          </View>
          <Text
            style={[
              styles.infoResult,
              result === "win"
                ? styles.userWin
                : result === "lose"
                ? styles.userLose
                : styles.userDraw,
            ]}
          >
            {result === "win" ? "Thắng" : result === "lose" ? "Thua" : "Hòa"}
          </Text>
        </View>
        <Text style={styles.resultText}>vs</Text>
        <View style={styles.info}>
          <Image
            source={chessPieces[gameInfo.opponentPlayer.color]}
            style={styles.imageLogo}
          />
          <View style={styles.infoRow}>
            <Text
              style={styles.usernameText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {gameInfo.opponentPlayer.username}
            </Text>
            <Text style={styles.ratingText}>
              ({gameInfo.opponentPlayer.rating})
            </Text>
          </View>
          <Text
            style={[
              styles.infoResult,
              result === "lose"
                ? styles.userWin
                : result === "win"
                ? styles.userLose
                : styles.userDraw,
            ]}
          >
            {result === "lose" ? "Thắng" : result === "win" ? "Thua" : "Hòa"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    backgroundColor: Colors.LIGHTBLUE,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 10,
    color: "gray",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    gap: 8,
  },
  info: {
    width: "40%",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  imageLogo: {
    width: 50,
    height: 50,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  usernameText: {
    maxWidth: "100%",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
    textAlign: "center",
    overflow: "hidden",
  },
  ratingText: {
    fontSize: 16,
    color: "gray",
  },
  infoText: {
    width: 100,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoResult: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 600,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  userWin: {
    color: "#4CAF50",
  },
  userLose: {
    color: "#E04622",
  },
  userDraw: {
    color: "gray",
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default GameHistoryCard;
