import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

type SettingRowProps = {
  icon: string;
  text: string;
  subtitle?: string;
  state: boolean;
  onToggle: () => void;
};

const SettingRow = ({
  icon,
  text,
  subtitle,
  state = false,
  onToggle,
}: SettingRowProps) => {
  return (
    <View style={styles.settingRow}>
      <Icon
        name={icon}
        size={24}
        color={Colors.DARKBLUE}
      />
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{text}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={state}
          onValueChange={onToggle}
          style={styles.switch}
        />
      </View>
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
  switchContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
});

export default SettingRow;
