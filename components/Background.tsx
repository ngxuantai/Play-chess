import {View, Text} from "react-native";
import React from "react";
import {Colors} from "@/constants/Colors";
import Row from "./Row";

const Background = () => {
  return (
    <View style={{flex: 1, aspectRatio: 1, alignSelf: "center"}}>
      {new Array(8).fill(null).map((_, row) => (
        <Row
          key={row}
          row={row}
        />
      ))}
    </View>
  );
};

export default Background;
