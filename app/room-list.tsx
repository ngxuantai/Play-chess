import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import RoomCard from "@/components/RoomCard";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { gameApi } from "@/api/game.api";
import { useDispatch, useSelector } from "react-redux";
import { selectLoading } from "@/redux/selectors/authSelectors";

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

export default function RoomList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);

  const [searchText, setSearchText] = useState("");
  const [rooms, setRooms] = useState(() =>
    [
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
      {
        ownerName: "Bob Builder",
        roomId: "98765",
      },
      {
        ownerName: "Charlie Brown",
        roomId: "11223",
      },
      {
        ownerName: "Diana Prince",
        roomId: "44556",
      },
      {
        ownerName: "Eve Adams",
        roomId: "77889",
      },
      {
        ownerName: "Frank Castle",
        roomId: "99001",
      },
      {
        ownerName: "Grace Hopper",
        roomId: "22334",
      },
      {
        ownerName: "Hank Pym",
        roomId: "55667",
      },
      {
        ownerName: "Ivy League",
        roomId: "88900",
      },
      {
        ownerName: "Jack Ryan",
        roomId: "33445",
      },
    ].map((room) => ({
      ...room,
      avatar: avatarUrl[Math.floor(Math.random() * avatarUrl.length)],
    }))
  );

  const [filteredRooms, setFilteredRooms] = useState(rooms);

  const handleCreateRoom = () => {
    // dispatch(startLoading("Đang tạo phòng..."));
    // TODO: Create room
    // gameApi
    //   .createGame()
    //   .then((response) => {
    //     console.log("Room created:", response.data);
    //     router.push(`/play-online/${response.data.id}`);
    //   })
    //   .catch((error) => {
    //     console.error("Error creating room:", error);
    //   })
    //   .finally(() => {
    //     dispatch(stopLoading());
    //   });

    // test
    router.push(`/play-online/8`);
  };

  const handleJoinRoom = (roomId: string) => {
    router.push(`/play-online/${roomId}`);
  };

  const handleSearch = () => {
    const filtered = rooms.filter(
      (room) =>
        room.ownerName.toLowerCase().includes(searchText.toLowerCase()) ||
        room.roomId.includes(searchText)
    );
    setFilteredRooms(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon
            name="arrow-left"
            size={24}
            color={Colors.BLACK}
          ></Icon>
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>
          Danh sách phòng
        </Text>
        <TouchableOpacity
          style={styles.createRoomButton}
          onPress={handleCreateRoom}
        >
          <Icon
            name="plus"
            size={24}
            color={Colors.LIGHTBLUE}
          ></Icon>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm phòng theo ID..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch()}
        >
          <Icon
            name="magnify"
            size={24}
            color={Colors.DARKBLUE}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {filteredRooms.map((room, index) => (
          <RoomCard
            key={index}
            ownerName={room.ownerName}
            roomId={room.roomId}
            onJoinRoom={() => handleJoinRoom(room.roomId)}
            avatar={room.avatar}
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
  header: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    gap: 10,
  },
  createRoomButton: {
    backgroundColor: Colors.DARKBLUE,
    padding: 10,
    borderRadius: 10,
    marginLeft: "auto",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 15,
    gap: 10,
  },
  searchInput: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.DARKBLUE,
    width: "85%",
  },
  searchButton: {
    backgroundColor: Colors.LIGHTBLUE,
    borderRadius: 10,
    padding: 10,
  },
});
