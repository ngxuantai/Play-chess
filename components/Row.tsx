import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Colors, backgroundTheme } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RowProps {
  row: number;
  flip: boolean;
}

interface SquareProps extends RowProps {
  col: number;
}

const THEME_KEY = "user_theme";

const Square = ({ row, col, flip }: SquareProps) => {
  const [theme, setTheme] = useState([
    backgroundTheme[0].colors[0],
    backgroundTheme[0].colors[1],
  ]); // default theme

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (storedTheme) {
          setTheme(JSON.parse(storedTheme));
        }
      } catch (error) {
        console.error("Failed to fetch theme", error);
      }
    };
    fetchTheme();
  }, []);

  const backgroundColor = (row + col) % 2 === 0 ? theme[0] : theme[1];
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
    </View>
  );
};

const Row = ({ row, flip }: RowProps) => {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {new Array(8).fill(null).map((_, col) => (
        <Square key={col} row={row} col={flip ? 7 - col : col} flip={flip} />
      ))}
    </View>
  );
};

export default Row;
