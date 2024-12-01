import React, { useEffect, useState } from "react";
import { useSound } from "@/context/SoundContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BackgroundMusic: React.FC<{ currentRoute: string | null }> = ({
  currentRoute,
}) => {
  const { sound, isPlaying, setIsPlaying } = useSound();

  useEffect(() => {
    const loadMusicState = async () => {
      if (!sound) return;
      try {
        const storedValue = await AsyncStorage.getItem("music_enabled");
        if (storedValue !== null) {
          setIsPlaying(JSON.parse(storedValue));
          if (isPlaying) {
            await sound.playAsync();
          }
        }
      } catch (error) {
        console.error("Error loading music_enabled:", error);
      }
    };
    loadMusicState();
  }, [sound, isPlaying, setIsPlaying]);

  useEffect(() => {
    const manageMusic = async () => {
      if (!sound) return;

      if (currentRoute === "play-with-bot") {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        }
      }
    };

    manageMusic();
  }, [currentRoute, sound, isPlaying, setIsPlaying]);

  return null;
};

export default BackgroundMusic;
