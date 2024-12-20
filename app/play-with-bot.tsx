import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "expo-router";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { selectIsLoading } from "@/redux/selectors/loadingSelectors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GlobalLoading from "@/components/GlobalLoading";
import SidePickerModal from "@/components/SidePickerModal";
import MoveHistory from "@/components/MoveHistory";
import ConfirmationDialog from "@/components/ConfirmDialog";
import Background from "@/components/Background";
import Piece from "@/components/Piece";
import ChessResultModal from "@/components/ChessResultModal";
import { useConst } from "@/hooks/useConst";
import { Chess, Move } from "chess.js";
import { SIZE } from "@/utils/chessUtils";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import getBestMove from "@/utils/chessBot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePlaySound } from "@/hooks/usePlaySound";

const { width } = Dimensions.get("window");

export default function PlayWithBot() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const playSound = usePlaySound();

  const isLoading = useSelector(selectIsLoading);
  const chess = useConst(() => new Chess());
  const [isSidePickerVisible, setSidePickerVisible] = useState(true);
  const [side, setSide] = useState<string>("");
  const [state, setState] = useState({
    player: "w",
    board: [] as (Piece | null)[][],
  });
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [result, setResult] = useState("");
  const [isResetDialogVisible, setResetDialogVisible] = useState(false);
  const [isChessResultModalVisible, setChessResultModalVisible] =
    useState(false);

  const loadGameState = useCallback(async () => {
    try {
      dispatch(startLoading("Đang tải bàn cờ cũ"));

      const gameState = await AsyncStorage.getItem("gameState");
      if (gameState) {
        const { board, history, side: savedSide } = JSON.parse(gameState);
        chess.load(board);
        setSide(savedSide);
        setState({
          player: chess.turn(),
          board: chess.board(),
        });
        setMoveHistory(history);
        setLastMove(
          history?.length > 0
            ? {
                from: history[history.length - 1].from,
                to: history[history.length - 1].to,
              }
            : null
        );
        setSidePickerVisible(false);
      } else {
        resetBoard(false);
      }
    } catch (error) {
      console.log("Failed to load game state:", error);
    } finally {
      dispatch(stopLoading());
    }
  }, [chess, dispatch]);

  const saveGameState = useCallback(async () => {
    if (chess.history().length === 0) return;
    try {
      const gameState = {
        board: chess.fen(),
        history: moveHistory,
        side,
      };
      await AsyncStorage.setItem("gameState", JSON.stringify(gameState));
    } catch (error) {
      console.log("Failed to save game state:", error);
    }
  }, [chess, side, moveHistory]);

  const checkGameState = useCallback(() => {
    let result = null;

    if (chess.isCheckmate()) {
      result = chess.turn() === "w" ? "lose" : "win";
    } else if (chess.isDraw()) {
      result = "draw";
    }

    if (result) {
      setResult(result);
      setLastMove(null);
      setChessResultModalVisible(true);
    }
  }, [chess]);

  const resetBoard = useCallback(
    (isInitial = true) => {
      chess.reset();
      setState({
        player: "w",
        board: chess.board(),
      });
      setMoveHistory([]);
      setSide("");
      setSidePickerVisible(true);
      setLastMove(null);
      if (isInitial) {
        AsyncStorage.removeItem("gameState").catch((error) =>
          console.log("Failed to delete game state", error)
        );
      }
    },
    [chess]
  );

  useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      saveGameState();
    });
    return unsubscribe;
  }, [navigation, saveGameState]);

  const onTurn = useCallback(
    (move: Move) => {
      setMoveHistory((prev) => [...prev, move]);
      setState({
        player: chess.turn(),
        board: chess.board(),
      });
      setLastMove({
        from: move.from,
        to: move.to,
      });
      if (move.captured) {
        playSound("captured");
      } else {
        playSound("move");
      }
      setTimeout(() => {
        checkGameState();
      }, 3000);
    },
    [chess, state.player, checkGameState]
  );

  const makeBotMove = useCallback(() => {
    const bestMove = getBestMove(chess, 2, side === "w" ? false : true);
    const moveLog = chess.move(bestMove);
    setMoveHistory((prev) => [...prev, moveLog]);
    setState({
      player: chess.turn(),
      board: chess.board(),
    });
    if (moveLog.captured) {
      playSound("captured");
    } else {
      playSound("move");
    }
    if (moveLog) {
      setLastMove({
        from: moveLog.from,
        to: moveLog.to,
      });
      setTimeout(() => {
        checkGameState();
      }, 10000);
    }
  }, [chess, side, checkGameState]);

  useEffect(() => {
    if (side !== "" && state.board.length > 0 && state.player !== side) {
      makeBotMove();
    }
  }, [state.board, makeBotMove, side, state.player]);

  const renderBoard = useMemo(() => {
    if (state.board.length === 0) return null;
    return state.board.map((row, rowIndex) =>
      row.map((square, colIndex) => {
        if (square === null) return null;
        return (
          <Piece
            key={`${rowIndex}${colIndex}`}
            id={`${square.color}${square.type}` as const}
            position={{
              x: (side === "b" ? 7 - colIndex : colIndex) * SIZE,
              y: (side === "b" ? 7 - rowIndex : rowIndex) * SIZE,
            }}
            chess={chess}
            flip={side !== "" && side === "b"}
            onTurn={onTurn}
            enabled={chess.turn() === side && side === square.color}
          />
        );
      })
    );
  }, [state.board, side, chess, state.player]);

  if (isLoading)
    return (
      <View style={styles.container}>
        <GlobalLoading />
      </View>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SidePickerModal
        visible={isSidePickerVisible}
        onSelectSide={(selectedSide) => {
          setSide(selectedSide);
          setSidePickerVisible(false);
        }}
      />
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
          onPress={() => setResetDialogVisible(true)}
        >
          <Icon
            name="refresh"
            size={24}
            color={Colors.DARKBLUE}
          />
        </TouchableOpacity>
        <ConfirmationDialog
          visible={isResetDialogVisible}
          text="Bắt đầu bàn cờ mới?"
          onConfirm={() => {
            resetBoard();
            setResetDialogVisible(false);
          }}
          onCancel={() => setResetDialogVisible(false)}
        />
        <ChessResultModal
          visible={isChessResultModalVisible}
          result={result}
          side={side}
          userName="You"
          opponentName="Bot"
          onPlayAgain={() => {
            resetBoard(true);
            setChessResultModalVisible(false);
          }}
          onExit={() => {
            setChessResultModalVisible(false);
            resetBoard(true);
            navigation.reset({
              index: 0,
              routes: [{ name: "index" }],
            });
          }}
        />
      </View>
      <View
        style={[
          styles.playerInfo,
          state.player !== side && side !== "" ? styles.currentPlayer : null,
        ]}
      >
        <Image
          source={
            side === "w"
              ? require("../assets/chess/bk.png")
              : require("../assets/chess/wk.png")
          }
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
        <View style={{ width, height: width }}>
          <Background
            flip={side !== "" && side === "b"}
            lastMove={{ from: lastMove?.from, to: lastMove?.to }}
          />
          {side !== "" && renderBoard}
        </View>
      </View>
      <View
        style={[
          styles.playerInfo,
          state.player === side && side !== "" ? styles.currentPlayer : null,
        ]}
      >
        <Image
          source={
            side === "w"
              ? require("../assets/chess/wk.png")
              : require("../assets/chess/bk.png")
          }
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
