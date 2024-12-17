import { Image, TouchableOpacity, View, Modal, StyleSheet } from "react-native";
import React, { useCallback, useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Vector } from "react-native-redash";
import { SIZE, toPosition, toTranslation } from "@/utils/chessUtils";
import { Chess, Position, Move } from "chess.js";
import { useSelector } from "react-redux";
import { selectShowLegalMoves } from "@/redux/selectors/settingsSelectors";

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
  flip: boolean;
  onTurn: (move: Move) => void;
  enabled: boolean;
  isPuzzle?: boolean;
}

const Piece = React.memo(
  ({ id, position, chess, flip, onTurn, enabled, isPuzzle }: PieceProps) => {
    const isGestureActive = useSharedValue(false);
    const scale = useSharedValue(1);
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const translateX = useSharedValue(position.x);
    const translateY = useSharedValue(position.y);

    const [validMoves, setValidMoves] = useState([]);
    const [promotionMove, setPromotionMove] = useState<{
      from: Position;
      to: Position;
      color: Player;
      x: number;
      y: number;
    } | null>(null);
    const [isPromotionModalVisible, setPromotionModalVisible] = useState(false);

    const showLegalMoves = useSelector(selectShowLegalMoves);

    const piece = useAnimatedStyle(() => ({
      position: "absolute",
      width: SIZE,
      height: SIZE,
      zIndex: isGestureActive.value ? 100 : 0,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
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
        transform: [
          { translateX: offsetX.value },
          { translateY: offsetY.value },
        ],
      };
    });

    const to = useAnimatedStyle(() => {
      const position = toPosition(
        { x: translateX.value, y: translateY.value },
        flip
      );
      const translation = toTranslation(position, flip);
      return {
        position: "absolute",
        width: SIZE,
        height: SIZE,
        zIndex: 0,
        backgroundColor: isGestureActive.value
          ? "rgba(255, 255, 0, 0.5)"
          : "transparent",
        transform: [
          { translateX: translation.x },
          { translateY: translation.y },
        ],
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
        { translateX: translateX.value - SIZE * 0.25 },
        { translateY: translateY.value - SIZE * 0.25 },
      ],
    }));

    const movePiece = useCallback(
      (from: Position, to: Position) => {
        const move = chess
          .moves({ verbose: true })
          .find((m) => m.from === from && m.to === to);
        const { x, y } = toTranslation(move ? to : from, flip);
        translateX.value = withTiming(x, {}, () => {
          offsetX.value = translateX.value;
        });
        translateY.value = withTiming(y, {}, () => {
          offsetY.value = translateY.value;
        });
        if (move) {
          if (move.flags.includes("p")) {
            setPromotionMove({
              from,
              to,
              color: move.color as Player,
              x: x,
              y: y,
            });
            setPromotionModalVisible(true);
          } else {
            if (isPuzzle) {
              onTurn(move);
            } else {
              chess.move(move);
              onTurn(move);
            }
          }
        }
        setValidMoves([]);
      },
      [chess, translateX, translateY, onTurn]
    );

    const getValidMoves = useCallback(
      (from: Position) => {
        if (!showLegalMoves) {
          return;
        }
        const moves = chess.moves({ square: from, verbose: true });
        setValidMoves([...new Set(moves.map((m) => m.to))]);
      },
      [chess]
    );

    const handlePromotion = (promotion) => {
      if (promotionMove) {
        const move = chess.move({
          from: promotionMove.from,
          to: promotionMove.to,
          promotion,
        });
        onTurn(move);
        setPromotionModalVisible(false);
        setPromotionMove(null);
      }
    };

    const panGesture = enabled
      ? Gesture.Pan()
          .onBegin(() => {
            offsetX.value = translateX.value;
            offsetY.value = translateY.value;
            isGestureActive.value = true;
            scale.value = 1.3;
            runOnJS(getValidMoves)(
              toPosition({ x: offsetX.value, y: offsetY.value }, flip)
            );
          })
          .onUpdate(({ translationX, translationY }) => {
            translateX.value = offsetX.value + translationX;
            translateY.value = offsetY.value + translationY;
          })
          .onEnd(() => {
            runOnJS(movePiece)(
              toPosition({ x: offsetX.value, y: offsetY.value }, flip),
              toPosition({ x: translateX.value, y: translateY.value }, flip)
            );
            scale.value = withTiming(1);
            isGestureActive.value = false;
          })
      : Gesture.Tap();

    return (
      <>
        {validMoves.map((move) => {
          const { x, y } = toTranslation(move, flip);
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
                transform: [{ translateX: x }, { translateY: y }],
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
              style={{ width: SIZE, height: SIZE }}
            />
          </Animated.View>
        </GestureDetector>
        {promotionMove && (
          <View>
            <Modal
              transparent={true}
              visible={isPromotionModalVisible}
            >
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => setPromotionModalVisible(false)}
              >
                <View
                  style={[
                    styles.modalContainer,
                    {
                      left: promotionMove.x - SIZE * 4.5,
                      top: promotionMove.y + SIZE * 3,
                    },
                  ]}
                >
                  {(["q", "r", "n", "b"] as Type[]).map((piece) => (
                    <TouchableOpacity
                      key={piece}
                      onPress={() => handlePromotion(piece)}
                      style={styles.button}
                    >
                      <Image
                        source={PIECES[`${promotionMove.color}${piece}`]}
                        style={styles.imgButton}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
      </>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  modalContainer: {
    position: "absolute",
    flexDirection: "row",
    gap: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    padding: 5,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  imgButton: {
    width: SIZE * 0.8,
    height: SIZE * 0.8,
  },
});

export default Piece;
