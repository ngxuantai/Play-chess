import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";

interface BackgroundMusicProps {
  currentRoute: string | null;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ currentRoute }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/music/background-music.mp3")
    );
    setSound(sound);
    await sound.setIsLoopingAsync(true);
    console.log("Music loaded");
  };

  useEffect(() => {
    loadSound();
    return () => {
      sound?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    const manageMusic = async () => {
      if (!sound) return;

      if (currentRoute === "play-with-bot") {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        }
      } else {
        if (!isPlaying) {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    };

    manageMusic();
  }, [currentRoute, sound]);

  return null;
};

export default BackgroundMusic;
