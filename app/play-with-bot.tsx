import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, {useCallback, useState} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import MoveHistory from "@/components/MoveHistory";
import ConfirmationDialog from "@/components/ConfirmDialog";
import Background from "@/components/Background";
import Piece from "@/components/Piece";
import {useConst} from "@/hooks/useConst";
import {Chess, Move} from "chess.js";
import {SIZE} from "@/utils/chessUtils";
import {useRouter} from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Colors} from "@/constants/Colors";

const {width} = Dimensions.get("window");

export default function PlayWithBot() {
  const router = useRouter();
  const chess = useConst(() => new Chess());
  const [state, setState] = useState({
    player: "w",
    board: chess.board(),
  });
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [isDialogVisible, setDialogVisible] = useState(false);

  const onTurn = useCallback(
    (move: Move) => {
      setMoveHistory((prev) => [...prev, move]);
      setTimeout(() => {
        setState((prev) => ({
          player: prev.player === "w" ? "b" : "w",
          board: chess.board(),
        }));
      }, 200);
    },
    [chess, state.player]
  );

  const resetBoard = () => {
    chess.reset();
    setState({
      player: "w",
      board: chess.board(),
    });
    setMoveHistory([]);
    setDialogVisible(false);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.status}>
        <View style={styles.statusBar}>
          {moveHistory.length === 0 ? (
            <Text style={styles.statusText}>
              Đang chờ hành động đầu tiên...
            </Text>
          ) : (
            <MoveHistory moveHistory={moveHistory} />
          )}
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => setDialogVisible(true)}
        >
          <Icon
            name="refresh"
            size={24}
            color="#2F80ED"
          />
        </TouchableOpacity>
        <ConfirmationDialog
          visible={isDialogVisible}
          text="Bắt đầu bàn cờ mới?"
          onConfirm={resetBoard}
          onCancel={() => setDialogVisible(false)}
        />
      </View>
      <View
        style={[
          styles.playerInfo,
          state.player === "b" && styles.currentPlayer,
        ]}
      >
        <Image
          source={require("../assets/chess/bk.png")}
          style={styles.playerIcon}
        />
        <Text style={styles.playerText}>Máy tính</Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{width, height: width}}>
          <Background />
          {state.board.map((row, rowIndex) =>
            row.map((square, colIndex) => {
              if (square === null) return null;
              return (
                <Piece
                  key={`${rowIndex}${colIndex}`}
                  id={`${square.color}${square.type}` as const}
                  position={{x: colIndex * SIZE, y: rowIndex * SIZE}}
                  chess={chess}
                  onTurn={onTurn}
                  enabled={state.player === square.color}
                />
              );
            })
          )}
        </View>
      </View>
      <View
        style={[
          styles.playerInfo,
          state.player === "w" && styles.currentPlayer,
        ]}
      >
        <Image
          source={require("../assets/chess/wk.png")}
          style={styles.playerIcon}
        />
        <Text style={styles.playerText}>Bạn</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  statusBar: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.LIGHTBLUE,
    width: "85%",
  },
  statusText: {
    padding: 4,
    fontSize: 16,
    color: Colors.BLACK,
  },
  refreshButton: {
    backgroundColor: Colors.LIGHTBLUE,
    padding: 10,
    borderRadius: 50,
    marginLeft: "auto",
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  currentPlayer: {
    backgroundColor: Colors.LIGHTBLUE,
  },
  playerIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  playerText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.BLACK,
  },
});
