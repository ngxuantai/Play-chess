import {View, Text, Dimensions, TouchableOpacity, StyleSheet, Image} from "react-native";
import React, {useCallback, useState} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Background from "@/components/Background";
import Piece from "@/components/Piece";
import {useConst} from "@/hooks/useConst";
import {Chess} from "chess.js";
import {SIZE} from "@/utils/chessUtils";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

const {width} = Dimensions.get("window");

export default function PlayWithBot() {
  const router = useRouter();
  const chess = useConst(() => new Chess());
  const [state, setState] = useState({
    player: "w",
    board: chess.board(),
  });

  const onTurn = useCallback(() => {
    setTimeout(() => {
      setState((prev) => ({
        player: prev.player === "w" ? "b" : "w",
        board: chess.board(),
      }));
    }, 200);
  }, [chess, state.player]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color={Colors.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkmate!</Text>
      </View>

      <View style={styles.status}>
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>Đang chờ hành động đầu tiên...</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={() => console.log("Refresh game")}>
          <Icon name="refresh" size={24} color="#2F80ED" />
        </TouchableOpacity>
      </View>

      <View style={styles.opponentInfo}>
        <Image source={require('../assets/chess/bk.png')} style={styles.playerIcon} />
        <Text style={styles.playerText}>Máy tính (200)</Text>
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

      <View style={styles.playerInfo}>
        <Image source={require('../assets/chess/wk.png')} style={styles.playerIcon} />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    color: Colors.BLACK,
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
    fontSize: 16,
    color: "#718096",
  },
  refreshButton: {
    backgroundColor: Colors.LIGHTBLUE,
    padding: 10,
    borderRadius: 50,
    marginLeft: "auto",
  },
  opponentInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.LIGHTBLUE,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  playerIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  playerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
  },
});
