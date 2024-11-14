import {View, Text, Dimensions} from "react-native";
import React, {useCallback, useState} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Background from "@/components/Background";
import Piece from "@/components/Piece";
import {useConst} from "@/hooks/useConst";
import {Chess} from "chess.js";
import {SIZE} from "@/utils/chessUtils";

const {width} = Dimensions.get("window");

export default function index() {
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
      <View
        style={{flex: 1, justifyContent: "center", backgroundColor: "black"}}
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
    </GestureHandlerRootView>
  );
}
