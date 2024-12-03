import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsAppSoundPlaying } from "@/redux/selectors/settingsSelectors";
import { Audio } from "expo-av";

const BackgroundMusic: React.FC<{ currentRoute: string | null }> = ({
  currentRoute,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const isAppSoundPlaying = useSelector(selectIsAppSoundPlaying);

  useEffect(() => {
    let isMounted = true;
    const loadSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require("../assets/music/background-music.mp3")
        );
        if (isMounted) setSound(newSound);
      } catch (error) {
        console.error("Failed to load sound:", error);
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      sound?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (!sound) return;

    const manageMusic = async () => {
      try {
        if (currentRoute === "play-with-bot") {
          await sound.pauseAsync();
        } else if (isAppSoundPlaying) {
          await sound.playAsync();
          await sound.setIsLoopingAsync(true);
          await sound.setVolumeAsync(0.5);
        } else {
          await sound.pauseAsync();
        }
      } catch (error) {
        console.error("Error managing music:", error);
      }
    };

    manageMusic();
  }, [sound, currentRoute, isAppSoundPlaying]);

  return null;
};

export default BackgroundMusic;
