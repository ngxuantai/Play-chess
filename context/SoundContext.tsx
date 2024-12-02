import React, { createContext, useContext, useState, useEffect } from "react";
import { Audio } from "expo-av";

type SoundContextType = {
  sound: Audio.Sound | null;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require("../assets/music/background-music.mp3")
        );
        setSound(newSound);
        await newSound.setIsLoopingAsync(true);
      } catch (error) {
        console.error("Failed to load sound:", error);
      }
    };

    loadSound();

    return () => {
      sound?.unloadAsync();
    };
  }, []);

  return (
    <SoundContext.Provider value={{ sound, isPlaying, setIsPlaying }}>
      {children}
    </SoundContext.Provider>
  );
};
