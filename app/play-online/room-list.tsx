import React, { useState } from "react";
import { ScrollView, View, TextInput, StyleSheet } from "react-native";
import RoomCard from "@/components/RoomCard";
import { Colors } from "@/constants/Colors";

export default function RoomList() {
  const [searchText, setSearchText] = useState("");
  const [rooms, setRooms] = useState([
    {
      ownerName: "John Doe",
      roomId: "12345",
    },
    {
      ownerName: "Jane Smith",
      roomId: "67890",
    },
    {
      ownerName: "Alice Wonderland",
      roomId: "54321",
    },
  ]);

  const handleJoinRoom = (roomId: string) => {
    console.log("Joining room:", roomId);
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.ownerName.toLowerCase().includes(searchText.toLowerCase()) ||
      room.roomId.includes(searchText)
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm phòng theo ID..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      <ScrollView>
        {filteredRooms.map((room, index) => (
          <RoomCard
            key={index}
            ownerName={room.ownerName}
            roomId={room.roomId}
            onJoinRoom={() => handleJoinRoom(room.roomId)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    margin: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.DARKBLUE,
  },
});
