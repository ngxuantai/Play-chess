import {View, Text} from "react-native";
import React from "react";
import {Colors} from "@/constants/Colors";

interface RowProps {
  row: number;
}

interface SquareProps extends RowProps {
  col: number;
}

const Square = ({row, col}: SquareProps) => {
  const backgroundColor = (row + col) % 2 === 0 ? Colors.WHITE : Colors.GREEN;
  const color = (row + col) % 2 === 0 ? Colors.BLACK : Colors.WHITE;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        padding: 4,
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          color,
          fontSize: 12,
          fontWeight: "500",
          opacity: col > 0 ? 0 : 1,
        }}
      >
        {8 - row}
      </Text>
      <Text
        style={{
          color,
          fontSize: 12,
          fontWeight: "500",
          alignSelf: "flex-end",
          opacity: row < 7 ? 0 : 1,
        }}
      >
        {String.fromCharCode("a".charCodeAt(0) + col)}
      </Text>
    </View>
  );
};

const Row = ({row}: RowProps) => {
  return (
    <View style={{flex: 1, flexDirection: "row"}}>
      {new Array(8).fill(null).map((_, col) => (
        <Square
          key={col}
          row={row}
          col={col}
        />
      ))}
    </View>
  );
};

export default Row;
