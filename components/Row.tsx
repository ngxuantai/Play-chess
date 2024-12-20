import { View, Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "@/redux/selectors/settingsSelectors";
import { selectShowCoordinates } from "@/redux/selectors/settingsSelectors";
import { SIZE } from "@/utils/chessUtils";
import { Colors } from "@/constants/Colors";

interface RowProps {
  row: number;
  flip: boolean;
  fromPosition: { x: number; y: number } | null;
  toPosition: { x: number; y: number } | null;
}

interface SquareProps extends RowProps {
  col: number;
}

const Square = ({ row, col, flip, fromPosition, toPosition }: SquareProps) => {
  const theme = useSelector(selectTheme);
  const showCoordinates = useSelector(selectShowCoordinates);

  const isLastMove =
    (fromPosition &&
      fromPosition.x === col * SIZE &&
      fromPosition.y === row * SIZE) ||
    (toPosition && toPosition.x === col * SIZE && toPosition.y === row * SIZE);

  const backgroundColor = isLastMove
    ? Colors.HIGHLIGHT
    : (row + col) % 2 === 0
    ? theme[0]
    : theme[1];
  const color = (row + col) % 2 === 0 ? Colors.WHITE : Colors.BLACK;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        padding: 4,
        justifyContent: "space-between",
      }}
    >
      {showCoordinates && (
        <Text
          style={{
            color,
            fontSize: 12,
            fontWeight: "500",
            opacity: (flip ? col < 7 : col > 0) ? 0 : 1,
          }}
        >
          {8 - row}
        </Text>
      )}
      {showCoordinates && (
        <Text
          style={{
            color,
            fontSize: 12,
            fontWeight: "500",
            alignSelf: "flex-end",
            opacity: (flip ? row > 0 : row < 7) ? 0 : 1,
          }}
        >
          {String.fromCharCode("a".charCodeAt(0) + col)}
        </Text>
      )}
    </View>
  );
};

const Row = ({ row, flip, fromPosition, toPosition }: RowProps) => {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {new Array(8).fill(null).map((_, col) => (
        <Square
          key={col}
          row={row}
          col={flip ? 7 - col : col}
          flip={flip}
          fromPosition={fromPosition}
          toPosition={toPosition}
        />
      ))}
    </View>
  );
};
export default Row;
