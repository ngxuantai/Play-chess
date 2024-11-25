import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { Colors, backgroundTheme } from "@/constants/Colors";
import { Chess } from "chess.js";
import ColorThemeModal from "./ColorThemeModal";

interface RowProps {
  row: number;
}

interface SquareProps extends RowProps {
  col: number;
  piece: string | null;
  theme: string[];
}

const chess = new Chess();

const PIECES: Record<string, any> = {
  bk: require("@/assets/chess/bk.png"),
  bp: require("@/assets/chess/bp.png"),
  bn: require("@/assets/chess/bn.png"),
  bb: require("@/assets/chess/bb.png"),
  bq: require("@/assets/chess/bq.png"),
  br: require("@/assets/chess/br.png"),
  wk: require("@/assets/chess/wk.png"),
  wp: require("@/assets/chess/wp.png"),
  wn: require("@/assets/chess/wn.png"),
  wb: require("@/assets/chess/wb.png"),
  wq: require("@/assets/chess/wq.png"),
  wr: require("@/assets/chess/wr.png"),
};

// Khởi tạo bàn cờ 5x5 với quân cờ
const initializeBoard = () => {
  const board: (string | null)[][] = Array(5)
    .fill(null)
    .map(() => Array(5).fill(null));
  board[0][0] = "bn";
  board[0][1] = "bb";
  board[0][2] = "br";
  board[0][3] = "bq";
  board[0][4] = "bk";
  board[1][0] = "bp";
  board[1][1] = "bp";
  board[1][2] = "bp";
  board[1][3] = "bp";
  board[1][4] = "bp";
  board[3][0] = "wp";
  board[3][1] = "wp";
  board[3][2] = "wp";
  board[3][3] = "wp";
  board[3][4] = "wp";
  board[4][0] = "wn";
  board[4][1] = "wb";
  board[4][2] = "wr";
  board[4][3] = "wq";
  board[4][4] = "wk";
  return board;
};

const Square = ({ row, col, piece, theme }: SquareProps) => {
  const backgroundColor = (row + col) % 2 === 0 ? theme[0] : theme[1];
  //const color = (row + col) % 2 === 0 ? Colors.BLACK : Colors.WHITE;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        padding: 4,
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
      }}
    >
      {piece && (
        <Image
          source={PIECES[piece]}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const Row = ({
  row,
  board,
  theme,
}: RowProps & { board: any; theme: string[] }) => {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {board[row].map((piece: string | null, col: number) => (
        <Square key={col} row={row} col={col} piece={piece} theme={theme} />
      ))}
    </View>
  );
};

const BackgroundSetting = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [theme, setTheme] = useState([
    backgroundTheme[0].colors[0],
    backgroundTheme[0].colors[1],
  ]); // Màu mặc định

  return (
    <View>
      <ColorThemeModal
        onSelectTheme={(selectedTheme: string[]) => setTheme(selectedTheme)}
      />

      <View style={{ flex: 1, aspectRatio: 1, alignSelf: "center" }}>
        {board.map((_, row) => (
          <Row key={row} row={row} board={board} theme={theme} />
        ))}
      </View>
    </View>
  );
};

export default BackgroundSetting;
