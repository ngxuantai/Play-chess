import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { backgroundTheme, Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ColorThemeModalProps {
  onSelectTheme: (theme: string[]) => void;
}

const ColorThemeModal = ({ onSelectTheme }: ColorThemeModalProps) => {
  const [visible, setVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>(
    backgroundTheme[0].name
  );

  const handleSelect = (colors: string[], name: string) => {
    onSelectTheme(colors);
    setSelectedTheme(name);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={{ fontSize: 14 }}>Bàn cờ vua</Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.themeName}>{selectedTheme}</Text>
          <Icon name="arrow-down" size={20} />
        </View>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={backgroundTheme}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.themeItem}
                  onPress={() => handleSelect(item.colors, item.name)}
                >
                  <View style={styles.colorPreview}>
                    <View
                      style={{
                        ...styles.colorBlock,
                        backgroundColor: item.colors[0],
                      }}
                    />
                    <View
                      style={{
                        ...styles.colorBlock,
                        backgroundColor: item.colors[1],
                      }}
                    />
                    <View
                      style={{
                        ...styles.colorBlock,
                        backgroundColor: item.colors[0],
                      }}
                    />
                    <View
                      style={{
                        ...styles.colorBlock,
                        backgroundColor: item.colors[1],
                      }}
                    />
                    <View
                      style={{
                        ...styles.colorBlock,
                        backgroundColor: item.colors[0],
                      }}
                    />
                    <View
                      style={{
                        ...styles.colorBlock,
                        backgroundColor: item.colors[1],
                      }}
                    />
                  </View>

                  <Text style={styles.themeName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ColorThemeModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  themeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  colorPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 130,
    height: 80,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  colorBlock: {
    width: 40,
    height: 40,
  },
  themeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
