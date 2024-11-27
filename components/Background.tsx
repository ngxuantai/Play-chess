import { View, Text } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import Row from "./Row";

interface BackgroundProps {
  flip: boolean;
}

const Background = React.memo(({ flip }: BackgroundProps) => {
  return (
    <View style={{ flex: 1, aspectRatio: 1, alignSelf: "center" }}>
      {new Array(8).fill(null).map((_, row) => (
        <Row key={row} row={flip ? 7 - row : row} flip={flip} />
      ))}
    </View>
  );
});

export default Background;
