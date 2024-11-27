/* eslint-disable prefer-destructuring */
import { Position } from "chess.js";
import { Dimensions } from "react-native";
import { Vector } from "react-native-redash";

const { width } = Dimensions.get("window");
export const SIZE = width / 8;

export const toTranslation = (to: Position, flip: boolean) => {
  "worklet";
  // worklet don't support destructuring yet
  const tokens = to.split("");
  const col = tokens[0];
  const row = tokens[1];
  if (!col || !row) {
    throw new Error("Invalid notation: " + to);
  }
  const indexes = {
    x: col.charCodeAt(0) - "a".charCodeAt(0),
    y: parseInt(row, 10) - 1,
  };
  return {
    x: (flip ? 7 - indexes.x : indexes.x) * SIZE,
    y: (flip ? indexes.y : 7 - indexes.y) * SIZE,
  };
};

export const toPosition = ({ x, y }: Vector, flip: boolean) => {
  "worklet";
  const col = String.fromCharCode(
    97 + (flip ? 7 - Math.round(x / SIZE) : Math.round(x / SIZE))
  );
  const row = `${flip ? Math.round(y / SIZE) + 1 : 8 - Math.round(y / SIZE)}`;
  return `${col}${row}` as Position;
};
