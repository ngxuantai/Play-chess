import React, { useEffect, useMemo, useRef } from "react";
import { Text, StyleSheet, ScrollView, View, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { Move } from "chess.js";

const pieceIcons: { [key: string]: { w: any; b: any } } = {
  k: {
    w: require("@/assets/chess/wk.png"),
    b: require("@/assets/chess/bk.png"),
  },
  q: {
    w: require("@/assets/chess/wq.png"),
    b: require("@/assets/chess/bq.png"),
  },
  r: {
    w: require("@/assets/chess/wr.png"),
    b: require("@/assets/chess/br.png"),
  },
  b: {
    w: require("@/assets/chess/wb.png"),
    b: require("@/assets/chess/bb.png"),
  },
  n: {
    w: require("@/assets/chess/wn.png"),
    b: require("@/assets/chess/bn.png"),
  },
};

const MoveHistory = ({ moveHistory }: { moveHistory: Move[] }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const formattedMoves = useMemo(() => {
    return moveHistory.map((move, index) => ({
      ...move,
      turn: Math.ceil((index + 1) / 2),
      isLastMove: index === moveHistory.length - 1,
    }));
  }, [moveHistory]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [moveHistory]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {formattedMoves.map((move, index) => (
        <View
          key={index}
          style={styles.item}
        >
          {move.color === "w" && (
            <Text style={styles.statusText}>{move.turn}.</Text>
          )}
          <View style={[styles.move, move.isLastMove && styles.lastMove]}>
            {move.piece !== "p" && pieceIcons[move.piece] && (
              <Image
                source={pieceIcons[move.piece][move.color]}
                style={styles.pieceIcon}
              />
            )}
            <Text style={styles.statusText}>{`${move.from}-${move.to}`}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    marginInlineEnd: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  move: {
    paddingInline: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    padding: 4,
    fontSize: 16,
  },
  lastMove: {
    borderColor: Colors.DARKBLUE,
    borderRadius: 10,
    borderWidth: 2,
  },
  pieceIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
});

export default MoveHistory;
