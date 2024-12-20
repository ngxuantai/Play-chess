import { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectIsMoveSoundPlaying } from "@/redux/selectors/settingsSelectors";
import { Audio } from "expo-av";

const moveSoundPath = require("../assets/sound/move.mp3");
const captureSoundPath = require("../assets/sound/capture.mp3");

export function usePlaySound() {
  const isMoveSoundPlaying = useSelector(selectIsMoveSoundPlaying);

  if (!isMoveSoundPlaying) return () => {};

  const playSound = useCallback(async (soundType: any) => {
    let soundPath = null;
    if (soundType === "move") {
      soundPath = moveSoundPath;
    } else if (soundType === "captured") {
      soundPath = captureSoundPath;
    }
    const { sound } = await Audio.Sound.createAsync(soundPath);

    try {
      // await sound.setVolumeAsync(0.5);
      await sound.playAsync();

      return new Promise<void>((resolve) => {
        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.isLoaded && status.didJustFinish) {
            await sound.unloadAsync();
            resolve();
          }
        });
      });
    } catch (error) {
      console.log("Error playing sound:", error);
      await sound.unloadAsync();
    }
  }, []);

  return playSound;
}
