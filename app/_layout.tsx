import { useState } from "react";
import { Stack } from "expo-router";
import BackgroundMusic from "@/components/BackgroundMusic";

export default function RootLayout() {
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

  return (
    <>
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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="play-with-bot"
          options={{ title: "Chơi với máy" }}
        />
        <Stack.Screen name="settings" options={{ title: "Cài đặt" }} />
      </Stack>
    </>
  );
}
