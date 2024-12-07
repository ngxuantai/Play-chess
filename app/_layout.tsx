import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import BackgroundMusic from "@/components/BackgroundMusic";

export default function RootLayout() {
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

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
          name="play-online/play-online"
          options={{ title: "Chơi trực tuyến" }}
        />
        <Stack.Screen
          name="play-online/room-list"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="play-with-bot"
          options={{ title: "Chơi với máy" }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Cài đặt" }}
        />
      </Stack>
    </Provider>
  );
}
