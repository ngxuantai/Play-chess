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
import { puzzleApi } from "@/api/puzzle.api";
import GlobalLoading from "@/components/GlobalLoading";
import UndoModal from "@/components/UndoModal";
import Background from "@/components/Background";
import Piece from "@/components/Piece";
import { useConst } from "@/hooks/useConst";
import { Chess, Move } from "chess.js";
import { SIZE, toTranslation } from "@/utils/chessUtils";
import IconCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { usePlaySound } from "@/hooks/usePlaySound";
import { timerFormat } from "@/utils/dateTimeFormat";

const { width } = Dimensions.get("window");

export default function PlayPuzzles() {
  const dispatch = useDispatch();
  const chess = useConst(() => new Chess());
  const playSound = usePlaySound();
  const isLoading = useSelector(selectIsLoading);

  const [idPuzzle, setIdPuzzle] = useState<string | null>(null);
  const [fen, setFen] = useState(null);
  const [moves, setMoves] = useState<string[]>([]);
  const [side, setSide] = useState<"w" | "b">("w");
  const [state, setState] = useState({
    player: "",
    board: [] as (Piece | null)[][],
  });
  const [moveIndex, setMoveIndex] = useState(0);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [time, setTime] = useState(0);
  const [isMoveCorrect, setIsMoveCorrect] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const fetchData = async () => {
    try {
      const response = await puzzleApi.getRandomPuzzles();
      setIdPuzzle(response.data.id);
      setFen(response.data.fen);
      setMoves(response.data.moves.split(" "));
    } catch (error) {
      console.log("Error fetching puzzles:", error);
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
  });

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (state.player === side) {
      timer = setInterval(() => {
        setTime((prev) => Math.max(prev + 1, 0));
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [side, state.player]);

  useEffect(() => {
    if (fen) {
      chess.load(fen);
      setState({
        player: chess.turn(),
        board: chess.board(),
      });
      setSide(chess.turn() === "w" ? "b" : "w");
    }
  }, [fen]);

  const onTurn = useCallback(
    (move: Move) => {
      if (move.lan !== moves[moveIndex]) {
        setIsMoveCorrect(false);
      } else {
        setIsMoveCorrect(true);
        setMoveIndex((prev) => prev + 1);
      }
      const moveLog = chess.move(move);
      if (moveLog) {
        setState({
          player: chess.turn(),
          board: chess.board(),
        });
        setShowHint(false);
        setLastMove({
          from: moveLog.from,
          to: moveLog.to,
        });
        playSound(moveLog.captured ? "captured" : "move");
      }
    },
    [chess, moveIndex, moves]
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
  }, [state.board, side, chess, moveIndex, moves]);

  const handleUndo = useCallback(() => {
    chess.load(fen);
    setState({
      player: chess.turn(),
      board: chess.board(),
    });
    setMoveIndex(0);
    setTime(0);
    setLastMove(null);
    setIsMoveCorrect(true);
  }, [chess, fen]);

  const handleMove = useCallback(() => {
    if (
      state.board.length > 0 &&
      state.player !== side &&
      isMoveCorrect &&
      moveIndex < moves.length
    ) {
      dispatch(stopLoading());
      const timerId = setTimeout(() => {
        const moveLog = chess.move(moves[moveIndex]);
        if (moveLog) {
          setState({
            player: chess.turn(),
            board: chess.board(),
          });
          setLastMove({
            from: moveLog.from,
            to: moveLog.to,
          });
          playSound(moveLog.captured ? "captured" : "move");
          setMoveIndex((prev) => prev + 1);
        }
      }, 2000);
      return timerId;
    }
  }, [state.board, state.player, isMoveCorrect, moveIndex]);

  useEffect(() => {
    const timerId = handleMove();
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [handleMove]);

  const handleMoveHint = useCallback(() => {
    if (moveIndex < moves.length) {
      const moveLog = chess.move(moves[moveIndex]);
      setState({
        player: chess.turn(),
        board: chess.board(),
      });
      if (moveLog) {
        setLastMove({
          from: moveLog?.from,
          to: moveLog?.to,
        });
        playSound(moveLog.captured ? "captured" : "move");
      }
      setMoveIndex((prev) => prev + 1);
      setShowHint(false);
    }
  }, [moveIndex]);

  const resetData = () => {
    setMoveIndex(0);
    setTime(0);
    setLastMove(null);
    setIsMoveCorrect(true);
    setShowHint(false);
    setFen(null);
    setMoves([]);
  };

  const handleNextPuzzle = useCallback(async () => {
    dispatch(startLoading("Đang tải câu đố tiếp theo"));
    resetData();
    await puzzleApi.postPuzzleCompleted(idPuzzle as string);
    await fetchData();
  }, [idPuzzle]);

  const circlePosition = useMemo(() => {
    if (moveIndex >= moves.length) return { x: 0, y: 0 };
    const from = moves[moveIndex].slice(0, 2);
    const { x, y } = toTranslation(from, side !== "" && side === "b");
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
            onNext={() => {
              setIsMoveCorrect(true);
              handleNextPuzzle();
            }}
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
            <Background
              flip={side !== "" && side === "b"}
              lastMove={{ from: lastMove?.from, to: lastMove?.to }}
            />
            {showHint && (
              <View
                style={{
                  position: "absolute",
                  width: SIZE,
                  height: SIZE,
                  borderRadius: SIZE / 2,
                  borderColor: "#5EFF1E",
                  borderWidth: 4,
                  transform: [
                    { translateX: circlePosition.x },
                    { translateY: circlePosition.y },
                  ],
                }}
              />
            )}
            {side !== "" && renderBoard}
          </View>
        </View>
        <View style={styles.turnIndicator}>
          {chess.turn() === side && (
            <Animated.Text
              style={[styles.turnText, { transform: [{ scale: scaleAnim }] }]}
            >
              Đến lượt bạn!
            </Animated.Text>
          )}
          {moveIndex > 0 && (
            <View style={styles.timer}>
              <Animated.Text style={{ transform: [{ scale: scaleAnim }] }}>
                <IconCommunity
                  name="clock-outline"
                  size={28}
                  color={"black"}
                />
              </Animated.Text>
              <Text style={styles.timerText}>{timerFormat(time)}</Text>
            </View>
          )}
        </View>
        {chess.turn() === side && (
          <TouchableOpacity
            style={[styles.button, styles.buttonHint]}
            onPress={() => {
              if (showHint) {
                handleMoveHint();
              } else {
                setShowHint(true);
              }
            }}
          >
            {showHint ? (
              <Icon
                name="remove-red-eye"
                size={24}
                color={"green"}
              />
            ) : (
              <IconCommunity
                name="lightbulb-on-outline"
                size={24}
                color={"black"}
              />
            )}
            <Text style={styles.buttonText}>
              {showHint ? "Hiển thị di chuyển" : "Gợi ý"}
            </Text>
          </TouchableOpacity>
        )}
        {moveIndex >= moves.length && (
          <TouchableOpacity
            style={[styles.button, styles.buttonNext]}
            onPress={() => handleNextPuzzle()}
          >
            <Text style={[styles.buttonText, { color: "white" }]}>
              Câu tiếp theo
            </Text>
            <Icon
              name="arrow-forward"
              size={24}
              color={"white"}
            />
          </TouchableOpacity>
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
    marginTop: 10,
    height: 50,
    marginHorizontal: "auto",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 50,
    elevation: 6,
    gap: 10,
  },
  buttonHint: {
    backgroundColor: Colors.LIGHTBLUE,
  },
  buttonNext: {
    backgroundColor: "green",
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
