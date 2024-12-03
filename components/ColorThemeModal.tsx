import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
} from "react-native";
import { backgroundTheme, Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { setSetting } from "@/redux/slices/settingsSlice";
import { selectTheme } from "@/redux/selectors/settingsSelectors";

const ColorThemeModal = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const [visible, setVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>(
    backgroundTheme[0].name
  );

  const getThemeNameByColors = (colors: string[]): string => {
    const theme = backgroundTheme.find(
      (item) => item.colors[0] === colors[0] && item.colors[1] === colors[1]
    );
    return theme ? theme.name : "Unknown Theme";
  };

  useEffect(() => {
    const themeName = getThemeNameByColors(theme);
    setSelectedTheme(themeName);
  }, [theme]);

  const handleSelect = (colors: string[], name: string) => {
    dispatch(setSetting({ key: "theme", value: colors }));
    setSelectedTheme(name);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Text style={{ fontSize: 14, marginRight: 10 }}>Bàn cờ vua</Text>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={styles.inputContainer}
        >
          <TextInput
            editable={false}
            style={{ ...styles.themeName }}
          >
            {selectedTheme}
          </TextInput>
          <Icon
            name="chevron-down"
            size={20}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
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
        </TouchableWithoutFeedback>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    width: 120,
    borderColor: Colors.DARKBLUE,
    borderRadius: 8,
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
});
