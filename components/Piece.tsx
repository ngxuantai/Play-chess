import {View, Text, Image} from "react-native";
import React, {useCallback, useState} from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {Vector} from "react-native-redash";
import {SIZE, toPosition, toTranslation} from "@/utils/chessUtils";
import {Chess, Position} from "chess.js";

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

interface PieceProps {
  id: Piece;
  position: Vector;
  chess: Chess;
  onTurn: () => void;
  enabled: boolean;
}

const Piece = ({id, position, chess, onTurn, enabled}: PieceProps) => {
  const isGestureActive = useSharedValue(false);
  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);

  const [validMoves, setValidMoves] = useState([]);

  const piece = useAnimatedStyle(() => ({
    position: "absolute",
    width: SIZE,
    height: SIZE,
    zIndex: isGestureActive.value ? 100 : 10,
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: scale.value},
    ],
  }));

  const from = useAnimatedStyle(() => {
    return {
      position: "absolute",
      width: SIZE,
      height: SIZE,
      zIndex: 0,
      backgroundColor: isGestureActive.value
        ? "rgba(255, 255, 0, 0.5)"
        : "transparent",
      transform: [{translateX: offsetX.value}, {translateY: offsetY.value}],
    };
  });

  const to = useAnimatedStyle(() => {
    const position = toPosition({x: translateX.value, y: translateY.value});
    const translation = toTranslation(position);
    return {
      position: "absolute",
      width: SIZE,
      height: SIZE,
      zIndex: 0,
      backgroundColor: isGestureActive.value
        ? "rgba(255, 255, 0, 0.5)"
        : "transparent",
      transform: [{translateX: translation.x}, {translateY: translation.y}],
    };
  });

  const circleStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: SIZE * 1.5,
    height: SIZE * 1.5,
    borderRadius: (SIZE * 1.5) / 2,
    backgroundColor: "rgba(255, 0, 0, 0.3)",
    opacity: isGestureActive.value ? 1 : 0,
    transform: [
      {translateX: translateX.value - SIZE * 0.25},
      {translateY: translateY.value - SIZE * 0.25},
    ],
  }));

  const movePiece = useCallback(
    (from: Position, to: Position) => {
      const move = chess
        .moves({verbose: true})
        .find((m) => m.from === from && m.to === to);
      const {x, y} = toTranslation(move ? to : from);
      translateX.value = withTiming(x, {}, () => {
        offsetX.value = translateX.value;
      });
      translateY.value = withTiming(y, {}, () => {
        offsetY.value = translateY.value;
      });
      if (move) {
        chess.move(move);
        onTurn();
      }
      setValidMoves([]);
    },
    [chess, translateX, translateY, onTurn]
  );

  const getValidMoves = useCallback((from: Position) => {
    const moves = chess.moves({square: from, verbose: true});
    setValidMoves(moves.map((m) => m.to));
  }, []);

  const panGesture = enabled
    ? Gesture.Pan()
        .onBegin(() => {
          offsetX.value = translateX.value;
          offsetY.value = translateY.value;
          isGestureActive.value = true;
          scale.value = 1.3;
          runOnJS(getValidMoves)(
            toPosition({x: offsetX.value, y: offsetY.value})
          );
        })
        .onUpdate(({translationX, translationY}) => {
          translateX.value = offsetX.value + translationX;
          translateY.value = offsetY.value + translationY;
        })
        .onEnd(() => {
          runOnJS(movePiece)(
            toPosition({x: offsetX.value, y: offsetY.value}),
            toPosition({x: translateX.value, y: translateY.value})
          );
          scale.value = withTiming(1);
          isGestureActive.value = false;
        })
    : Gesture.Tap();
  return (
    <>
      {validMoves.map((move) => {
        const {x, y} = toTranslation(move);
        return (
          <Animated.View
            key={move}
            style={{
              position: "absolute",
              width: SIZE,
              height: SIZE,
              zIndex: 0,
              backgroundColor: "rgba(255, 0, 0, 0.3)",
              borderColor: "rgba(255, 0, 0, 0.5)",
              borderWidth: 1,
              transform: [{translateX: x}, {translateY: y}],
            }}
          />
        );
      })}
      <Animated.View style={from} />
      <Animated.View style={to} />
      <Animated.View style={circleStyle} />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={piece}>
          <Image
            source={PIECES[id]}
            style={{width: SIZE, height: SIZE}}
          />
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export default Piece;
