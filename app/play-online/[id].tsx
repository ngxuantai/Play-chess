import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TimePickerModal from "@/components/TimePickerModel";
import MoveHistory from "@/components/MoveHistory";
import ConfirmationDialog from "@/components/ConfirmDialog";
import ChessResultModal from "@/components/ChessResultModal";
import GlobalLoading from "@/components/GlobalLoading";
import Background from "@/components/Background";
import Piece from "@/components/Piece";
import { useConst } from "@/hooks/useConst";
import { Chess, Move } from "chess.js";
import { SIZE } from "@/utils/chessUtils";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { timerFormat } from "@/utils/dateTimeFormat";
import socketService from "@/api/socket.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { selectAccessToken, selectUser } from "@/redux/selectors/authSelectors";
import { selectIsLoading } from "@/redux/selectors/loadingSelectors";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { PlayerInfo } from "@/types";
import { authApi } from "@/api/auth.api";

const { width } = Dimensions.get("window");

export default function PlayOnline() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);

  const chess = useConst(() => new Chess());
  const [activeBoard, setActiveBoard] = useState<"waiting" | "active">(
    "waiting"
  );
  const [side, setSide] = useState<string>("");
  const [players, setPlayers] = useState<{
    white: PlayerInfo;
    black: PlayerInfo;
  }>({
    white: {
      id: null,
      username: null,
    },
    black: {
      id: null,
      username: null,
    },
  });
  const [whiteTime, setWhiteTime] = useState<number>(0);
  const [blackTime, setBlackTime] = useState<number>(0);
  const [state, setState] = useState({
    player: "w",
    board: [],
  });
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [showResignDialog, setShowResignDialog] = useState<boolean>(false);
  const [showChessResultModal, setShowChessResultModal] =
    useState<boolean>(false);

  // const handleTimeSelection = (
  //   selectedTime: number,
  //   additionalTime?: number
  // ) => {
  //   setWhiteTime(selectedTime);
  //   setBlackTime(selectedTime);
  //   setAdditionalTime(additionalTime || null);
  // };

  useEffect(() => {
    dispatch(startLoading("Đang tải bàn cờ..."));

    socketService.connect(token);

    socketService.on("gameState", (data) => {
      console.log("Nhận trạng thái game:", data);
      setActiveBoard(data.status);
      if (data.whitePlayerId === user?.id) {
        setSide("w");
        setPlayers((prev) => ({
          ...prev,
          white: {
            id: user?.id,
            username: user?.username,
          },
          black: {
            id: data.blackPlayerId,
          },
        }));
      } else if (data.blackPlayerId === user?.id) {
        setSide("b");
        setPlayers((prev) => ({
          ...prev,
          white: {
            id: data.whitePlayerId,
          },
          black: {
            id: user?.id,
            username: user?.username,
          },
        }));
      }

      chess.load(data.fen);
      console.log("FEN:", chess.history());
      setState({
        player: data.turn,
        board: chess.board(),
      });
      setWhiteTime(data.whiteTimeRemaining);
      setBlackTime(data.blackTimeRemaining);
    });

    socketService.on("gameOver", (data) => {
      if (data.winner === null) {
        setResult("draw");
      } else if (data.winner === user?.id) {
        setResult("win");
      } else {
        setResult("lose");
      }
      setShowChessResultModal(true);
    });

    socketService.emit("joinGame", { gameId: Number(id) });

    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (state.player === "w") {
      timer = setInterval(() => {
        setWhiteTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else if (state.player === "b") {
      timer = setInterval(() => {
        setBlackTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.player]);

  const onTurn = useCallback(
    (move: Move) => {
      console.log("onTurn:", move);
      socketService.emit("move", {
        gameId: Number(id),
        move: move.san,
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
          />
        );
      })
    );
  }, [state.board, side, chess, state.player]);

  useEffect(() => {
    if (state.board.length !== 0) {
      dispatch(stopLoading());
    }
  }, [state.board]);

  useEffect(() => {
    const getUserById = async (id: string) => {
      try {
        const response = await authApi.getUserById(id);
        console.log("getUserById:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Error getUserById:", error);
      }
    };

    if (activeBoard === "active") {
      if (side === "w") {
        getUserById(players.black.id).then((data) => {
          setPlayers((prev) => ({
            ...prev,
            black: {
              ...prev.black,
              username: data?.username,
            },
          }));
        });
      } else if (side === "b") {
        getUserById(players.white.id).then((data) => {
          setPlayers((prev) => ({
            ...prev,
            white: {
              ...prev.white,
              username: data?.username,
            },
          }));
        });
      }
    }
  }, [activeBoard, side]);

  if (isLoading)
    return (
      <View style={styles.container}>
        <GlobalLoading />
      </View>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <TimePickerModal onTimeSelect={handleTimeSelection} /> */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon
            name="arrow-left"
            size={24}
            color={Colors.BLACK}
          ></Icon>
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>
          ID:
          <Text style={{ color: Colors.DARKBLUE }}> {id}</Text>
        </Text>
      </View>
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
        <TouchableOpacity style={styles.refreshButton}>
          <Icon
            name="handshake"
            size={24}
            color={Colors.DARKBLUE}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => setShowResignDialog(true)}
        >
          <Icon
            name="flag"
            size={24}
            color={Colors.DARKBLUE}
          />
        </TouchableOpacity>
        <ConfirmationDialog
          text="Bạn có chắc chắn muốn đầu hàng?"
          visible={showResignDialog}
          onConfirm={() => {
            socketService.emit("resign", { gameId: Number(id) });
            setShowResignDialog(false);
          }}
          onCancel={() => setShowResignDialog(false)}
        />
        <ChessResultModal
          visible={showChessResultModal}
          result={result}
          side={side}
          userName={user?.username}
          opponentName={
            side === "w" ? players.black.username : players.white.username
          }
          onExit={() => setShowChessResultModal(false)}
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
              ? require("@/assets/chess/bk.png")
              : require("@/assets/chess/wk.png")
          }
          style={styles.playerIcon}
        />
        <Text style={styles.playerText}>
          {activeBoard === "waiting"
            ? "Đang chờ đối thủ..."
            : players.black.username}
        </Text>
        <View style={styles.timer}>
          <Icon
            name="clock-outline"
            size={35}
            color={Colors.DARKBLUE}
          />
          <Text style={styles.playerText}>
            {side === "w" ? timerFormat(blackTime) : timerFormat(whiteTime)}
          </Text>
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width, height: width }}>
          <Background flip={side !== "" && side === "b"} />
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
        <View style={styles.timer}>
          <Icon
            name="clock-outline"
            size={35}
            color={Colors.DARKBLUE}
          />
          <Text style={styles.playerText}>
            {side === "w" ? timerFormat(whiteTime) : timerFormat(blackTime)}
          </Text>
        </View>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity style={styles.messageButton}>
          <Icon
            name="chat-processing"
            size={24}
            color={Colors.WHITE}
          />
        </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  statusBar: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.LIGHTBLUE,
    width: "75%",
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
  timer: {
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
});
