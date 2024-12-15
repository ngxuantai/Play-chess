import { useCallback } from "react";
import { Audio } from "expo-av";

export function usePlaySound() {
  const playSound = useCallback(async (soundPath: any) => {
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
