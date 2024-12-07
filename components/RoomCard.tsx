import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type RoomCardProps = {
  ownerName: string;
  roomId: string;
  onJoinRoom: () => void;
};

const RoomCard = ({ ownerName, roomId, onJoinRoom }: RoomCardProps) => {
  const avatarUrl = [
    require("@/assets/chess/bb.png"),
    require("@/assets/chess/bk.png"),
    require("@/assets/chess/bn.png"),
    require("@/assets/chess/bp.png"),
    require("@/assets/chess/bq.png"),
    require("@/assets/chess/br.png"),
    require("@/assets/chess/wb.png"),
    require("@/assets/chess/wk.png"),
    require("@/assets/chess/wn.png"),
    require("@/assets/chess/wp.png"),
    require("@/assets/chess/wq.png"),
    require("@/assets/chess/wr.png"),
  ];
  const randomAvatar = avatarUrl[Math.floor(Math.random() * avatarUrl.length)];

  return (
    <View style={styles.card}>
      <Image
        source={randomAvatar}
        style={styles.avatar}
      />

      <View style={styles.info}>
        <Text
          style={styles.ownerName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {ownerName}
        </Text>
        <Text style={styles.roomId}>ID: {roomId}</Text>

        <Text>
          <Icon
            name="account"
            size={16}
            color={Colors.BLACK}
          />
          <Text style={styles.memNumber}> 1/2</Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={onJoinRoom}
        style={styles.button}
      >
        <Icon
          name="login"
          size={24}
          color={Colors.LIGHTBLUE}
        />
        <Text style={styles.buttonText}>Vào phòng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.LIGHTBLUE,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 25,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  ownerName: {
    color: Colors.BLACK,
    fontSize: 16,
    fontWeight: "bold",
  },
  roomId: {
    color: Colors.BLACK,
    fontSize: 14,
  },
  memNumber: {
    color: Colors.BLACK,
    fontSize: 14,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.DARKBLUE,
    padding: 10,
  },
  buttonText: {
    color: Colors.LIGHTBLUE,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default RoomCard;
