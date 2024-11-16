import {Stack} from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="play-with-bot"
        options={{title: "Chơi với máy"}}
      />
    </Stack>
  );
}
