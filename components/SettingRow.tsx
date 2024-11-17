import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

type SettingRowProps = {
  icon: string;
  text: string;
  subtitle?: string;
  isToggle?: boolean;
  isVolume?: boolean;
  onPress?: () => void;
};

const SettingRow = ({
  icon,
  text,
  subtitle,
  isToggle,
  isVolume,
  onPress,
}: SettingRowProps) => {
  const maxVolume = 9;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);
  const [volume, setVolume] = useState(6);

  const increaseVolume = () => {
    if (volume < maxVolume) {
      setVolume(volume + 1);
    }
  };

  const decreaseVolume = () => {
    if (volume > 0) {
      setVolume(volume - 1);
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
            onValueChange={toggleSwitch}
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
