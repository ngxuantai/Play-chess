import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MoveHistory from "@/components/MoveHistory";
import GlobalLoading from "@/components/GlobalLoading";
import Background from "@/components/Background";
import { useConst } from "@/hooks/useConst";
import { usePlaySound } from "@/hooks/usePlaySound";
import { SIZE } from "@/utils/chessUtils";
import { Colors } from "@/constants/Colors";
import { authApi } from "@/api/auth.api";
import { gameApi } from "@/api/game.api";
import { selectUser } from "@/redux/selectors/authSelectors";
import { selectIsLoading } from "@/redux/selectors/loadingSelectors";
import { stopLoading } from "@/redux/slices/loadingSlice";
import { PlayerInfo } from "@/types";

const { width } = Dimensions.get("window");

type Player = "b" | "w";
type Type = "q" | "r" | "n" | "b" | "k" | "p";
type Piece = `${Player}${Type}`;
type Pieces = Record<Piece, ReturnType<typeof require>>;
export const PIECES: Pieces = {
  br: require("@/assets/chess/br.png"),
  bp: require("@/assets/chess/bp.png"),
  bn: require("@/assets/chess/bn.png"),
  bb: require("@/assets/chess/bb.png"),
  bq: require("@/assets/chess/bq.png"),
  bk: require("@/assets/chess/bk.png"),
  wr: require("@/assets/chess/wr.png"),
  wn: require("@/assets/chess/wn.png"),
  wb: require("@/assets/chess/wb.png"),
  wq: require("@/assets/chess/wq.png"),
  wk: require("@/assets/chess/wk.png"),
  wp: require("@/assets/chess/wp.png"),
};

export default function PlayOnline() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const playSound = usePlaySound();

  const chess = useConst(() => new Chess());
  const [side, setSide] = useState<string>("");
  const [players, setPlayers] = useState<{
    side: PlayerInfo;
    opponent: PlayerInfo;
  }>({
    side: {
      id: null,
      username: null,
    },
    opponent: {
      id: null,
      username: null,
    },
  });
  const [state, setState] = useState({
    player: "w",
    board: chess.board(),
  });
  const [moves, setMoves] = useState<string[]>([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [winner, setWinner] = useState<number | null>(null);
  const [playChess, setPlayChess] = useState(false);
  const [result, setResult] = useState<"side" | "opponent" | "draw" | null>(
    null
  );

  useEffect(() => {
    const fecthGameData = async () => {
      const response = await gameApi.getGameById(Number(id));
      if (response.data) {
        const { data } = response;
        const whitePlayer = await authApi.getUserById(data.whitePlayerId);
        const blackPlayer = await authApi.getUserById(data.blackPlayerId);
        if (whitePlayer.data && blackPlayer.data) {
          const isWhite = whitePlayer.data.id === user?.id;
          setSide(isWhite ? "w" : "b");
          setPlayers({
            side: {
              id: isWhite ? whitePlayer.data.id : blackPlayer.data.id,
              username: isWhite
                ? whitePlayer.data.username
                : blackPlayer.data.username,
            },
            opponent: {
              id: isWhite ? blackPlayer.data.id : whitePlayer.data.id,
              username: isWhite
                ? blackPlayer.data.username
                : whitePlayer.data.username,
            },
          });
        }
        if (data.moves) {
          setMoves(data.moves.split(",").map((move: string) => move.trim()));
        } else {
          setMoves([]);
        }
        setWinner(data.winner);
        dispatch(stopLoading());
      }
    };

    fecthGameData();
  }, [id]);

  const renderBoard = useMemo(() => {
    if (state.board.length === 0) return null;
    return state.board.map((row, rowIndex) =>
      row.map((square, colIndex) => {
        if (square === null) return null;
        return (
          <View
            key={`${rowIndex}${colIndex}`}
            style={{
              position: "absolute",
              width: SIZE,
              height: SIZE,
              transform: [
                { translateX: (side === "b" ? 7 - colIndex : colIndex) * SIZE },
                { translateY: (side === "b" ? 7 - rowIndex : rowIndex) * SIZE },
              ],
            }}
          >
            <Image
              source={PIECES[`${square.color}${square.type}` as const]}
              style={{ width: SIZE, height: SIZE }}
            />
          </View>
        );
      })
    );
  }, [state.board, side, chess, state.player]);

  const handleUndoMove = useCallback(() => {
    const moveLog = chess.undo();

    if (!moveLog) return;

    setMoveIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      if (newIndex <= 0) {
        setMoveHistory([]);
        setLastMove(null);
      } else {
        setMoveHistory((prevHistory) => {
          const newHistory = prevHistory.slice(0, prevHistory.length - 1);
          setLastMove(newHistory[newHistory.length - 1] || null);
          return newHistory;
        });
      }
      return newIndex;
    });
    setState({
      player: chess.turn(),
      board: chess.board(),
    });
  }, []);

  const handleNextMove = useCallback(() => {
    const move = moves[moveIndex];
    const moveLog = chess.move(move);

    if (!moveLog) return;

    if (moveLog) {
      playSound(moveLog.captured ? "capture" : "move");
    }
    setMoveHistory((prevHistory) => [...prevHistory, moveLog]);
    setLastMove({
      from: moveLog.from,
      to: moveLog.to,
    });
    setState({
      player: chess.turn(),
      board: chess.board(),
    });
    setMoveIndex((prevIndex) => prevIndex + 1);
  }, [moveIndex, moves]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (playChess) {
      timer = setInterval(() => {
        handleNextMove();
      }, 2000);
    } else if (!playChess && timer) {
      clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playChess, handleNextMove]);

  useEffect(() => {
    if (moveIndex >= moves.length) {
      setPlayChess(false);
      if (winner === null) {
        setResult("draw");
      } else if (winner === players.side.id) {
        setResult("side");
      } else if (winner === players.opponent.id) {
        setResult("opponent");
      }
    } else setResult(null);
  }, [winner, moveIndex, moves]);

  if (isLoading)
    return (
      <View style={styles.container}>
        <GlobalLoading />
      </View>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.status}>
        <View style={styles.statusBar}>
          {moveHistory.length === 0 ? (
            <Text style={styles.statusText}>
              {/* Đang chờ hành động đầu tiên... */}
            </Text>
          ) : (
            <MoveHistory moveHistory={moveHistory} />
          )}
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={[
              styles.refreshButton,
              { opacity: moveIndex <= 0 ? 0.5 : 1 },
            ]}
            onPress={handleUndoMove}
            disabled={moveIndex <= 0}
          >
            <Icon
              name="step-backward"
              size={24}
              color={"black"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.refreshButton,
              {
                opacity: moves.length === 0 || result !== null ? 0.5 : 1,
              },
            ]}
            onPress={setPlayChess.bind(null, !playChess)}
            disabled={moves.length === 0 || result !== null}
          >
            <Icon
              name={playChess ? "pause" : "play"}
              size={24}
              color={"black"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.refreshButton,
              { opacity: moveIndex >= moves.length ? 0.5 : 1 },
            ]}
            onPress={handleNextMove}
            disabled={moveIndex >= moves.length}
          >
            <Icon
              name="step-forward"
              size={24}
              color={"black"}
            />
          </TouchableOpacity>
        </View>
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
              ? require("@/assets/chess/bk.png")
              : require("@/assets/chess/wk.png")
          }
          style={styles.playerIcon}
        />
        <Text style={styles.playerText}>{players.opponent.username}</Text>
        <View style={styles.iconResult}>
          {result && result !== "side" && (
            <Icon
              name={result === "opponent" ? "crown" : "handshake"}
              size={45}
              color={result === "opponent" ? "#FE9900" : "brown"}
            />
          )}
        </View>
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
              ? require("@/assets/chess/wk.png")
              : require("@/assets/chess/bk.png")
          }
          style={styles.playerIcon}
        />
        <Text style={styles.playerText}>{user?.username}</Text>
        <View style={styles.iconResult}>
          {result && result !== "opponent" && (
            <Icon
              name={result === "side" ? "crown" : "handshake"}
              size={40}
              color={result === "side" ? "#FE9900" : "brown"}
            />
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    gap: 10,
  },
  status: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  statusBar: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.LIGHTBLUE,
    width: "95%",
  },
  statusText: {
    padding: 4,
    fontSize: 16,
    color: Colors.BLACK,
  },
  containerButton: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    gap: 8,
  },
  refreshButton: {
    backgroundColor: Colors.LIGHTBLUE,
    display: "flex",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 15,
    marginVertical: 10,
    overflow: "hidden",
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
  iconResult: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  messageButton: {
    backgroundColor: Colors.DARKBLUE,
    padding: 10,
    borderRadius: 10,
    width: 45,
  },
  chatBubble: {
    position: "absolute",
    top: -40,
    left: 50,
  },
  chatBubbleText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
