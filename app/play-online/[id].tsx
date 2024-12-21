import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
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
import ConfirmationDialog from "@/components/ConfirmDialog";
import ChessResultModal from "@/components/ChessResultModal";
import GlobalLoading from "@/components/GlobalLoading";
import Background from "@/components/Background";
import Piece from "@/components/Piece";
import { useConst } from "@/hooks/useConst";
import { usePlaySound } from "@/hooks/usePlaySound";
import { SIZE } from "@/utils/chessUtils";
import { timerFormat } from "@/utils/dateTimeFormat";
import { Colors } from "@/constants/Colors";
import { authApi } from "@/api/auth.api";
import socketService from "@/api/socket.service";
import { selectAccessToken, selectUser } from "@/redux/selectors/authSelectors";
import { selectIsLoading } from "@/redux/selectors/loadingSelectors";
import { stopLoading } from "@/redux/slices/loadingSlice";
import { PlayerInfo } from "@/types";
import ChatModal from "@/components/ChatModal";
import ChatBubble from "react-native-chat-bubble";

const { width } = Dimensions.get("window");

export default function PlayOnline() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const playSound = usePlaySound();

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
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [result, setResult] = useState<string | null>(null);
  const [showResignDialog, setShowResignDialog] = useState<boolean>(false);
  const [showDrawDialog, setShowDrawDialog] = useState<boolean>(false);
  const [showConfirmDrawDialog, setShowConfirmDrawDialog] =
    useState<boolean>(false);
  const [showChessResultModal, setShowChessResultModal] =
    useState<boolean>(false);
  const [isChatVisible, setChatVisible] = useState<boolean>(false);
  const [chatBubble, setChatBubble] = useState<{
    playerId: number;
    message: string;
  } | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { playerId: number; message: string }[]
  >([]);

  useEffect(() => {
    socketService.connect(token);
    socketService.emit("joinGame", { gameId: Number(id) });

    socketService.on("gameState", (data) => {
      setActiveBoard((prev) => (prev === data.status ? prev : data.status));

      setPlayers((prevPlayers) => {
        if (prevPlayers.white.id === null || prevPlayers.black.id === null) {
          const isWhite = data.whitePlayerId === user?.id;
          setSide(isWhite ? "w" : "b");

          return {
            white: {
              id: data.whitePlayerId,
              username: isWhite ? user?.username : prevPlayers.white.username,
            },
            black: {
              id: data.blackPlayerId,
              username: !isWhite ? user?.username : prevPlayers.black.username,
            },
          };
        }
        return prevPlayers;
      });

      chess.load(data.fen);
      setState({
        player: data.turn,
        board: chess.board(),
      });
      setWhiteTime(data.whiteTimeRemaining);
      setBlackTime(data.blackTimeRemaining);
      if (data.lastMoveResult) {
        playSound(data.lastMoveResult.captured ? "captured" : "move");
        setMoveHistory((prev) => [...prev, data.lastMoveResult]);
        setLastMove({
          from: data.lastMoveResult.from,
          to: data.lastMoveResult.to,
        });
      }
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

    socketService.on("drawOffered", (data) => {
      console.log("Draw offered:", data);
      if (data.offeredBy !== user?.id) {
        setShowConfirmDrawDialog(true);
      }
    });

    socketService.on("drawDeclined", (data) => {
      console.log("Draw declined:", data);
    });

    socketService.on("chatMessage", (data) => {
      if (data.senderId) {
        setChatBubble({
          playerId: data.senderId,
          message: data.message,
        });
        setChatHistory((prev) => [
          ...prev,
          { playerId: data.senderId, message: data.message },
        ]);
        setTimeout(() => {
          setChatBubble(null);
        }, 5000);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [token, id]);

  const handleTimer = useCallback(() => {
    let timer: NodeJS.Timeout | null = null;

    if (activeBoard === "active") {
      const updateTimer = () => {
        if (state.player === "w") {
          setWhiteTime((prev) => Math.max(prev - 1, 0));
        } else if (state.player === "b") {
          setBlackTime((prev) => Math.max(prev - 1, 0));
        }
      };
      timer = setInterval(updateTimer, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeBoard, state.player]);

  useEffect(() => {
    const cleanup = handleTimer();
    return cleanup;
  }, [handleTimer]);

  useEffect(() => {
    if (whiteTime === 0 || blackTime === 0) {
      socketService.emit("checkTime", { gameId: Number(id) });
    }
  }, [whiteTime, blackTime]);

  const onTurn = useCallback(
    (move: Move) => {
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
    const fetchPlayerInfo = async (
      playerId: string,
      side: "white" | "black"
    ) => {
      try {
        const { data } = await authApi.getUserById(playerId);
        setPlayers((prev) => ({
          ...prev,
          [side]: {
            ...prev[side],
            username: data?.username,
          },
        }));
      } catch (error) {
        console.log(`Error fetching player info for ${side}:`, error);
      }
    };

    if (activeBoard === "active") {
      const fetchData = async () => {
        if (side === "w" && players.black.id) {
          await fetchPlayerInfo(players.black.id, "black");
        } else if (side === "b" && players.white.id) {
          await fetchPlayerInfo(players.white.id, "white");
        }
      };
      fetchData();
    }
  }, [activeBoard, side, players.black.id, players.white.id]);

  const handleCloseDialog = useCallback(() => {
    setShowResignDialog(false);
    setShowDrawDialog(false);
    setShowConfirmDrawDialog(false);
  }, []);

  if (isLoading)
    return (
      <View style={styles.container}>
        <GlobalLoading />
      </View>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View>
        <ChatModal
          visible={isChatVisible}
          setVisble={setChatVisible}
          chatHistory={chatHistory}
          onMessageSend={(message) => {
            socketService.emit("chatMessage", {
              gameId: Number(id),
              message: message,
            });
          }}
        />
      </View>
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
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => setShowDrawDialog(true)}
        >
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
          text={
            showResignDialog
              ? "Bạn có chắc chắn muốn đầu hàng?"
              : showDrawDialog
              ? "Bạn muốn đề nghị hòa không?"
              : "Đối thủ muốn hòa, bạn có đồng ý không?"
          }
          visible={showResignDialog || showDrawDialog || showConfirmDrawDialog}
          onConfirm={() => {
            if (showResignDialog)
              socketService.emit("resign", { gameId: Number(id) });
            else if (showDrawDialog)
              socketService.emit("offerDraw", { gameId: Number(id) });
            else if (showConfirmDrawDialog)
              socketService.emit("respondToDraw", {
                gameId: Number(id),
                accept: true,
              });
            handleCloseDialog();
          }}
          onCancel={() => {
            // if (showConfirmDrawDialog)
            // socketService.emit("offerDraw", { gameId: Number(id) });
            handleCloseDialog();
          }}
        />
        <ChessResultModal
          visible={showChessResultModal}
          result={result}
          side={side}
          userName={user?.username}
          opponentName={
            side === "w" ? players.black.username : players.white.username
          }
          onExit={() => {
            setShowChessResultModal(false);
            navigation.reset({
              index: 1,
              routes: [{ name: "index" }, { name: "room-list" }],
            });
          }}
          // onPlayAgain={() => {
          //   setShowChessResultModal(false);
          //   socketService.emit("playAgain", { gameId: Number(id) });
          // }}
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
        {chatBubble !== null && chatBubble?.playerId !== user?.id && (
          <View style={styles.chatBubble}>
            <ChatBubble
              isOwnMessage={false}
              bubbleColor={Colors.GREY}
              tailColor={Colors.GREY}
              withTail={true}
              zIndex={1000}
            >
              <Text
                style={[
                  styles.chatBubbleText,
                  {
                    color: Colors.BLACK,
                  },
                ]}
              >
                {chatBubble?.message}
              </Text>
            </ChatBubble>
          </View>
        )}
        <Text style={styles.playerText}>
          {activeBoard === "waiting"
            ? "Đang chờ đối thủ..."
            : side === "w"
            ? players.black.username
            : players.white.username}
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
        {chatBubble !== null && chatBubble?.playerId === user?.id && (
          <View style={styles.chatBubble}>
            <ChatBubble
              isOwnMessage={false}
              bubbleColor={Colors.BLUE}
              tailColor={Colors.BLUE}
              withTail={true}
              zIndex={1000}
            >
              <Text
                style={[
                  styles.chatBubbleText,
                  {
                    color: "white",
                  },
                ]}
              >
                {chatBubble?.message}
              </Text>
            </ChatBubble>
          </View>
        )}
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
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => setChatVisible(true)}
        >
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
    overflow: "hidden",
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
