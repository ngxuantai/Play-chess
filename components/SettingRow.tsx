import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { useSound } from "@/context/SoundContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SettingRowProps = {
  icon: string;
  text: string;
  subtitle?: string;
  isToggle?: boolean;
  isVolume?: boolean;
  onToggle?: () => void;
  storageKey?: string;
  initialEnabled?: boolean;
};

const SettingRow = ({
  icon,
  text,
  subtitle,
  isToggle,
  isVolume,
  onToggle,
  storageKey,
  initialEnabled = false,
}: SettingRowProps) => {
  const maxVolume = 9;
  const [volume, setVolume] = useState(6);
  const { sound, isPlaying, setIsPlaying } = useSound();
  const [isEnabled, setIsEnabled] = useState(initialEnabled);

  useEffect(() => {
    const loadVolume = async () => {
      try {
        if (!storageKey) return;
        const storedVolume = await AsyncStorage.getItem(`${storageKey}_volume`);
        if (storedVolume !== null) {
          setVolume(JSON.parse(storedVolume));
        }
      } catch (error) {
        console.error(`Error loading ${storageKey}_volume:`, error);
      }
    };
    loadVolume();
  }, []);

  useEffect(() => {
    const loadState = async () => {
      try {
        if (!storageKey) return;
        const storedValue = await AsyncStorage.getItem(storageKey);
        if (storedValue !== null) {
          setIsEnabled(JSON.parse(storedValue));
        }
      } catch (error) {
        console.error(`Error loading ${storageKey}:`, error);
      }
    };
    loadState();
  }, [storageKey]);

  const handleToggle = async () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    if (onToggle) onToggle();

    try {
      if (storageKey)
        await AsyncStorage.setItem(storageKey, JSON.stringify(newState));
    } catch (error) {
      console.error(`Error saving ${storageKey}:`, error);
    }
  };

  const increaseVolume = async () => {
    if (volume < maxVolume) {
      const newVolume = volume + 1;
      setVolume(newVolume);
      await sound?.setVolumeAsync(newVolume / maxVolume);
      await AsyncStorage.setItem(
        `${storageKey}_volume`,
        JSON.stringify(newVolume)
      );
    }
  };

  const decreaseVolume = async () => {
    if (volume > 0) {
      const newVolume = volume - 1;
      setVolume(newVolume);
      await sound?.setVolumeAsync(newVolume / maxVolume);
      await AsyncStorage.setItem(
        `${storageKey}_volume`,
        JSON.stringify(newVolume)
      );
    }
  };

  return (
    <View style={styles.settingRow}>
      <Icon name={icon} size={24} color={Colors.DARKBLUE} />
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{text}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {isVolume && isEnabled && (
        <View style={styles.volumeContainer}>
          <TouchableOpacity onPress={decreaseVolume} style={styles.arrowButton}>
            <Icon name="less-than" size={24} color={Colors.DARKBLUE} />
          </TouchableOpacity>
          <Text style={styles.volumeText}>
            {volume}/{maxVolume}
          </Text>
          <TouchableOpacity onPress={increaseVolume} style={styles.arrowButton}>
            <Icon name="greater-than" size={24} color={Colors.DARKBLUE} />
          </TouchableOpacity>
        </View>
      )}
      {isToggle && (
        <View style={styles.switchContainer}>
          <Switch
            onValueChange={handleToggle}
            value={isEnabled}
            style={styles.switch}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.GREY,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
  },
  arrowButton: { paddingHorizontal: 5 },
  volumeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.GREY,
  },
  switchContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], // Scale the switch
  },
});

export default SettingRow;
