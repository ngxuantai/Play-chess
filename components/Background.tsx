import { View } from "react-native";
import React from "react";
import Row from "./Row";
import { toTranslation } from "@/utils/chessUtils";

interface BackgroundProps {
  flip: boolean;
  lastMove: { from: string; to: string } | null;
}

const Background = React.memo(({ flip, lastMove }: BackgroundProps) => {
  const fromPosition = lastMove?.from
    ? toTranslation(lastMove.from, false)
    : null;
  const toPosition = lastMove?.to ? toTranslation(lastMove.to, false) : null;

  const rows = [];
  for (let row = 0; row < 8; row++) {
    rows.push(
      <Row
        key={row}
        row={flip ? 7 - row : row}
        flip={flip}
        fromPosition={fromPosition}
        toPosition={toPosition}
      />
    );
  }

  return (
    <View style={{ flex: 1, aspectRatio: 1, alignSelf: "center" }}>{rows}</View>
  );
});

export default Background;
