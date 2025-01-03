import { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/selectors/authSelectors";
import { getProfileAction } from "@/redux/actions/authActions";
import { setSetting } from "@/redux/slices/settingsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundMusic from "@/components/BackgroundMusic";

export default function RootLayout() {
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

  useEffect(() => {
    // const loadToken = async () => {
    //   try {
    //     const token = await AsyncStorage.getItem("access_token");
    //     if (token !== null) {
    //       store.dispatch(getProfileAction(token));
    //     }
    //   } catch (error) {
    //     console.log("Error loading token:", error);
    //   }
    // };
    const loadSettings = async () => {
      try {
        const settings = await AsyncStorage.getItem("settings");
        let parsedSettings;
        if (settings !== null) {
          parsedSettings = JSON.parse(settings);
          Object.entries(parsedSettings).forEach(([key, value]) => {
            store.dispatch(setSetting({ key, value }));
          });
        }
      } catch (error) {
        console.log("Error loading settings:", error);
      }
    };

    Promise.all([loadSettings()]);
  }, []);

  return (
    <Provider store={store}>
      <BackgroundMusic currentRoute={currentRoute} />
      <Stack
        screenListeners={{
          state: (e) => {
            // get current route name
            const current = e.data.state?.routes[e.data.state.index]?.name;
            setCurrentRoute(current || null);
          },
        }}
      >
        <Stack.Screen
          name="home"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="play-online/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="room-list"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="play-with-bot"
          options={{ title: "Chơi với máy" }}
        />
        <Stack.Screen
          name="play-puzzles"
          options={{ title: "Câu đố cờ vua" }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Cài đặt" }}
        />
        <Stack.Screen
          name="history-list"
          options={{ title: "Lịch sử đấu" }}
        />
        <Stack.Screen
          name="game-history/[id]"
          options={{ title: "Chi tiết ván đấu" }}
        />
        <Stack.Screen
          name="blog-list"
          options={{ title: "Danh sách bài viết" }}
        />
        <Stack.Screen
          name="detail-blog/[id]"
          options={{ title: "Bài viết" }}
        />
      </Stack>
    </Provider>
  );
}
