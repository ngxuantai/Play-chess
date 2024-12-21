import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";
import GameHistoryCard from "@/components/GameHistoryCard";
import { useRouter } from "expo-router";
import { gameApi } from "@/api/game.api";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/redux/selectors/authSelectors";

export default function RoomList() {
  // const router = useRouter();
  // const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [gamesData, setGamesData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchGamesHistory = async () => {
    const response = await gameApi.getListCompletedGames();
    setGamesData(() =>
      response.data.map((game: any) => {
        const isWhiteSide = game.whitePlayerId === user?.id;

        const sidePlayer = isWhiteSide ? game.whitePlayer : game.blackPlayer;
        const opponentPlayer = isWhiteSide
          ? game.blackPlayer
          : game.whitePlayer;

        return {
          gameId: game.id,
          sidePlayer: {
            id: sidePlayer.id,
            username: sidePlayer.username,
            rating: sidePlayer.rating,
            color: isWhiteSide ? "w" : "b", // Xác định màu sắc dựa trên bên
          },
          opponentPlayer: {
            id: opponentPlayer.id,
            username: opponentPlayer.username,
            rating: opponentPlayer.rating,
            color: isWhiteSide ? "b" : "w",
          },
          winner: game.winner,
          createdAt: game.createdAt,
        };
      })
    );
  };

  useEffect(() => {
    fetchGamesHistory();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchGamesHistory();
    setIsRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {gamesData.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 16, fontSize: 16 }}>
            Bạn chưa tham gia trận đấu nào
          </Text>
        ) : (
          gamesData.map((game: any, index: number) => (
            <GameHistoryCard
              key={index}
              gameInfo={game}
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
});
