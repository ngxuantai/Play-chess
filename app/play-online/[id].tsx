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
import SidePickerModal from "@/components/SidePickerModal";
import TimePickerModal from "@/components/TimePickerModel";
import MoveHistory from "@/components/MoveHistory";
import ConfirmationDialog from "@/components/ConfirmDialog";
import Background from "@/components/Background";
import Piece from "@/components/Piece";
import { useConst } from "@/hooks/useConst";
import { Chess, Move } from "chess.js";
import { SIZE } from "@/utils/chessUtils";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { timerFormat } from "@/utils/dateTimeFormat";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import ChatModal from "@/components/ChatModal";
import ChatBubble from "react-native-chat-bubble";

const { width } = Dimensions.get("window");

export default function PlayOnline() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const chess = useConst(() => new Chess());
  const [side, setSide] = useState<string>("");
  const [state, setState] = useState({
    player: "w",
    board: chess.board(),
  });
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [whiteTime, setWhiteTime] = useState<number>(10 * 60);
  const [blackTime, setBlackTime] = useState<number>(10 * 60);
  const [additionalTime, setAdditionalTime] = useState<number | null>(null);
  const [isChatVisible, setChatVisible] = useState<boolean>(false);
  const [chatBubble, setChatBubble] = useState<{
    player: string;
    message: string;
  } | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { player: string; message: string }[]
  >([]);

  const handleTimeSelection = (
    selectedTime: number,
    additionalTime?: number
  ) => {
    setWhiteTime(selectedTime);
    setBlackTime(selectedTime);
    setAdditionalTime(additionalTime || null);
  };

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
      if (state.player === "w") {
        setMoveHistory((prev) => [...prev, move]);
        setState({
          player: "b",
          board: chess.board(),
        });
      }
    },
    [chess, state.player]
  );

  const renderBoard = useMemo(() => {
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
            enabled={state.player === side && side !== ""}
          />
        );
      })
    );
  }, [state.board, side, chess, state.player]);

  const handleMessageSend = (message: string) => {
    if (message.trim() === "") return;

    setChatBubble({ player: state.player, message });
    setChatHistory((prev) => [...prev, { player: state.player, message }]);
    setChatVisible(false);

    setTimeout(() => {
      setChatBubble(null);
    }, 5000);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <SidePickerModal onSelectSide={setSide} /> */}
      <TimePickerModal onTimeSelect={handleTimeSelection} />
      <ChatModal
        visible={isChatVisible}
        setVisble={setChatVisible}
        chatHistory={chatHistory}
        onMessageSend={handleMessageSend}
      />
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
        <TouchableOpacity style={styles.refreshButton}>
          <Icon
            name="flag"
            size={24}
            color={Colors.DARKBLUE}
          />
        </TouchableOpacity>
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
        {chatBubble !== null && chatBubble?.player !== side && (
          <View style={styles.chatBubble}>
            <ChatBubble
              isOwnMessage={false}
              bubbleColor={Colors.GREY}
              tailColor={Colors.GREY}
              withTail={true}
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
        <Text style={styles.playerText}>Player 1</Text>
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
        {chatBubble !== null && chatBubble?.player !== side && (
          <View style={styles.chatBubble}>
            <ChatBubble
              isOwnMessage={false}
              bubbleColor={Colors.BLUE}
              tailColor={Colors.BLUE}
              withTail={true}
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
        <Text style={styles.playerText}>Player 2</Text>
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
