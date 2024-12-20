import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";

interface ChessResultModalProps {
  visible: boolean;
  result: "win" | "lose" | "draw";
  side: "w" | "b";
  userName: string;
  opponentName: string;
  onPlayAgain: () => void;
  onExit: () => void;
}

const ChessResultModal = ({
  visible,
  result,
  side,
  userName,
  opponentName,
  onPlayAgain,
  onExit,
}: ChessResultModalProps) => {
  const getResultMessage = () => {
    switch (result) {
      case "win":
        return "🎉 Bạn đã thắng!";
      case "lose":
        return "😔 Bạn đã thua!";
      case "draw":
        return "🤝 Hòa!";
      default:
        return "";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{getResultMessage()}</Text>
            <TouchableOpacity
              onPress={onExit}
              style={styles.closeButton}
            >
              <Icon
                name="close"
                size={26}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.info}>
              <Image
                source={
                  side === "w"
                    ? require("../assets/chess/wk.png")
                    : require("../assets/chess/bk.png")
                }
                style={styles.imageLogo}
              />
              <Text style={styles.infoText}>{userName}</Text>
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
                {result === "win"
                  ? "Thắng"
                  : result === "lose"
                  ? "Thua"
                  : "Hòa"}
              </Text>
            </View>
            <Text style={styles.resultText}>vs</Text>
            <View style={styles.info}>
              <Image
                source={
                  side === "w"
                    ? require("../assets/chess/bk.png")
                    : require("../assets/chess/wk.png")
                }
                style={styles.imageLogo}
              />
              <Text style={styles.infoText}>{opponentName}</Text>
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
                {result === "lose"
                  ? "Thắng"
                  : result === "win"
                  ? "Thua"
                  : "Hòa"}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.buttonContainer,
              onPlayAgain !== undefined
                ? { justifyContent: "space-between" }
                : { justifyContent: "flex-end" },
            ]}
          >
            <TouchableOpacity
              style={[styles.button, styles.exitButton]}
              onPress={onExit}
            >
              <Text style={[styles.buttonText, { color: "white" }]}>Thoát</Text>
            </TouchableOpacity>
            {onPlayAgain !== undefined && (
              <TouchableOpacity
                style={styles.button}
                onPress={onPlayAgain}
              >
                <Text style={styles.buttonText}>Chơi lại</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "gray",
    position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  info: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  imageLogo: {
    width: 80,
    height: 80,
  },
  infoText: {
    fontSize: 20,
    marginBottom: 5,
  },
  infoResult: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: "bold",
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  button: {
    width: "40%",
    backgroundColor: Colors.LIGHTBLUE,
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.BLACK,
    fontWeight: "bold",
    textAlign: "center",
  },
  exitButton: {
    backgroundColor: "#E04622",
    elevation: 6,
  },
});

export default ChessResultModal;
