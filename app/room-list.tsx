import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import RoomCard from "@/components/RoomCard";
import TimePickerModal from "@/components/TimePickerModal";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { gameApi } from "@/api/game.api";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { OptionCreateRoom } from "@/types";

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

  const [option, setOption] = useState<OptionCreateRoom>({
    timeControl: 0,
    increment: 0,
  });
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRooms = async () => {
    const response = await gameApi.getListGames();
    const roomData = response.data.map((room: any) => ({
      roomId: room.id,
      ownerName: room.creator.username,
      rating: room.creator.rating,
      timeControl: room.timeControl,
      increment: room.increment,
      avatar: avatarUrl[room.id % avatarUrl.length],
    }));
    setRooms(roomData);
    setFilteredRooms(roomData);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRooms();
    setSearchText("");
    setIsRefreshing(false);
  };

  const handleCreateRoom = () => {
    setIsTimePickerVisible(true);
  };

  const handleSearch = () => {
    const filtered = rooms.filter((room: any) =>
      String(room.roomId).includes(searchText)
    );
    setFilteredRooms(filtered);
  };

  const handleJoinRoom = (roomId: string) => {
    dispatch(startLoading("Đang tham gia phòng..."));
    router.push(`/play-online/${roomId}`);
  };

  useEffect(() => {
    if (option.timeControl !== 0) {
      setIsTimePickerVisible(false);
      dispatch(startLoading("Đang tạo phòng..."));
      gameApi
        .createGame({
          timeControl: option.timeControl,
          increment: option.increment,
        })
        .then((response) => {
          router.push(`/play-online/${response.data.id}`);
        })
        .catch((error) => {
          console.log("Error creating room:", error);
          dispatch(stopLoading());
        });
      setOption({
        timeControl: 0,
        increment: 0,
      });
    }
  }, [option]);

  return (
    <View style={styles.container}>
      <TimePickerModal
        visible={isTimePickerVisible}
        onSelect={(option: OptionCreateRoom) => {
          setOption(option);
        }}
        onCancel={() => {
          setIsTimePickerVisible(false);
        }}
      />
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
          keyboardType="number-pad"
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

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {rooms.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 16, fontSize: 16 }}>
            Không có phòng nào
          </Text>
        ) : (
          filteredRooms.map((room: any, index: number) => (
            <RoomCard
              key={index}
              roomInfo={room}
              onJoinRoom={() => handleJoinRoom(room.roomId)}
            />
          ))
        )}
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
