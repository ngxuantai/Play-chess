import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { selectIsLoading } from "@/redux/selectors/loadingSelectors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GlobalLoading from "@/components/GlobalLoading";
import MoveHistory from "@/components/MoveHistory";
import UndoModal from "@/components/UndoModal";
import Background from "@/components/Background";
import Piece from "@/components/Piece";
import ChessResultModal from "@/components/ChessResultModal";
import { useConst } from "@/hooks/useConst";
import { Chess, Move } from "chess.js";
import { SIZE, toTranslation } from "@/utils/chessUtils";
import IconCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePlaySound } from "@/hooks/usePlaySound";

const { width } = Dimensions.get("window");

const moveSoundPath = require("../assets/sound/move.mp3");
const captureSoundPath = require("../assets/sound/capture.mp3");

export default function PlayPuzzles() {
  const dispatch = useDispatch();
  const chess = useConst(() => new Chess());
  const isLoading = useSelector(selectIsLoading);

  const fen = "q3k1nr/1pp1nQpp/3p4/1P2p3/4P3/B1PP1b2/B5PP/5K2 b k - 0 17";
  const moves = ["e8d7", "a2e6", "d7d8", "f7f8"];

  const [side, setSide] = useState<"w" | "b">("w");
  const [state, setState] = useState({
    player: "",
    board: [] as (Piece | null)[][],
  });
  const [moveIndex, setMoveIndex] = useState(0);
  const [isMoveCorrect, setIsMoveCorrect] = useState(true);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, [scaleAnim]);

  useEffect(() => {
    chess.load(fen);
    setSide(chess.turn() === "w" ? "b" : "w");
    setState({
      player: chess.turn(),
      board: chess.board(),
    });
  }, []);

  const onTurn = useCallback(
    (move: Move) => {
      console.log("moveIndex", moves[moveIndex]);
      console.log("move", move.lan);
      if (move.lan !== moves[moveIndex]) {
        setIsMoveCorrect(false);
      } else {
        console.log("move", move);
        setIsMoveCorrect(true);
        setMoveIndex((prev) => prev + 1);
      }
      chess.move(move);

      setState({
        player: chess.turn(),
        board: chess.board(),
      });
    },
    [chess, state.player]
  );

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
            isPuzzle={true}
          />
        );
      })
    );
  }, [state.board, side, chess, state.player]);

  const handleUndo = useCallback(() => {
    chess.undo();
    setState({
      player: chess.turn(),
      board: chess.board(),
    });
    setIsMoveCorrect(true);
  }, [chess]);

  useEffect(() => {
    if (state.board.length > 0 && state.player !== side && isMoveCorrect) {
      dispatch(stopLoading());
      console.log("state.board", state.board);
      console.log("state.player", state.player);
      setTimeout(() => {
        console.log("state.board", chess.move(moves[moveIndex]));
        setState({
          player: chess.turn(),
          board: chess.board(),
        });
        setMoveIndex((prev) => prev + 1);
      }, 2000);
    }
  }, [state.board, state.player, isMoveCorrect]);

  const circlePosition = useMemo(() => {
    if (moveIndex >= moves.length) return { x: 0, y: 0 };
    const from = moves[moveIndex].slice(0, 2);
    console.log("from", from);
    const { x, y } = toTranslation(from, side !== "" && side === "b");
    console.log("x, y", x, y);
    return { x, y };
  }, [moveIndex]);
  if (isLoading)
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <GlobalLoading />
      </View>
    );

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View>
          <UndoModal
            visible={!isMoveCorrect}
            onUndo={handleUndo}
            onNext={() => setIsMoveCorrect(true)}
          />
        </View>
        <View style={styles.titleContainer}>
          <IconCommunity
            name="puzzle"
            size={30}
            color={"green"}
          />
          <Text style={styles.titleText}>Tìm nước đi tốt nhất</Text>
        </View>
        <View style={styles.boardContainer}>
          <View style={[styles.board, { position: "relative" }]}>
            <Background flip={side !== "" && side === "b"} />
            {side !== "" && renderBoard}
            <View
              style={{
                position: "absolute",
                width: SIZE,
                height: SIZE,
                borderRadius: SIZE / 2,
                borderColor: Colors.GREEN,
                borderWidth: 2,
                transform: [
                  { translateX: circlePosition.x },
                  { translateY: circlePosition.y },
                ],
              }}
            />
          </View>
        </View>
        {chess.turn() === side && (
          <>
            <View style={styles.turnIndicator}>
              <Animated.Text
                style={[styles.turnText, { transform: [{ scale: scaleAnim }] }]}
              >
                Đến lượt bạn!
              </Animated.Text>
              <View style={styles.timer}>
                <IconCommunity
                  name="clock-outline"
                  size={28}
                  color={"black"}
                />
                <Text style={styles.timerText}>00:00</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.button}>
              <Icon
                name="tips-and-updates"
                size={24}
                color={"black"}
              />
              <Text style={styles.buttonText}>Gợi ý</Text>
            </TouchableOpacity>
          </>
        )}
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    height: 110,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    color: Colors.GREEN,
  },
  boardContainer: {
    borderRadius: 10,
    marginTop: 50,
    elevation: 10,
  },
  board: {
    width: width,
    height: width,
  },
  turnIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  turnText: {
    padding: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "green",
    borderRadius: 10,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.BLACK,
  },
  button: {
    // width: "80%",
    height: 50,
    marginInline: "auto",
    paddingInline: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.LIGHTBLUE,
    padding: 12,
    borderRadius: 50,
    elevation: 6,
    gap: 10,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.BLACK,
    fontWeight: 500,
  },
  hintContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  hintText: {
    fontSize: 20,
    color: Colors.GREEN,
  },
});
