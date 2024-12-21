import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { formatMinsToHour } from "@/utils/dateTimeFormat";

type RoomCardProps = {
  roomInfo: {
    roomId: string;
    ownerName: string;
    rating: number;
    timeControl: number;
    increment: number;
    avatar: any;
  };
  onJoinRoom: () => void;
};

const RoomCard = ({ roomInfo, onJoinRoom }: RoomCardProps) => {
  return (
    <View style={styles.card}>
      <Image
        source={roomInfo.avatar}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.roomId}>ID: {roomInfo.roomId}</Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: Colors.BLACK,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {roomInfo.ownerName}
        </Text>
        <Text style={styles.infoText}>
          <Icon
            name="clock"
            size={18}
            color={Colors.BLACK}
          />
          : {roomInfo.timeControl + " phút"}
          {roomInfo.increment > 0 && " + " + roomInfo.increment + "s/di chuyển"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text style={[styles.infoText, { width: 50 }]}>
            <Icon
              name="account"
              size={18}
              color={Colors.BLACK}
            />
            : 1/2
          </Text>
        </View>
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
  },
  info: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 2,
  },
  roomId: {
    color: Colors.BLACK,
    fontSize: 16,
    fontWeight: "bold",
  },
  infoText: {
    color: Colors.BLACK,
    fontSize: 14,
  },
  button: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.DARKBLUE,
    padding: 8,
    elevation: 10,
    overflow: "hidden",
  },
});

export default RoomCard;
