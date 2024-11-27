import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

interface SidePickerModalProps {
  onSelectSide: (side: string) => void;
}

const SidePickerModal: React.FC<SidePickerModalProps> = ({ onSelectSide }) => {
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(true);
  const [side, setSide] = useState<string>("w");

  const onClose = () => {
    router.back();
  };

  const handleSelectSide = () => {
    if (side === "random") {
      const randomSide = Math.random() > 0.5 ? "w" : "b";
      onSelectSide(randomSide);
    } else {
      onSelectSide(side);
    }
    setVisible(false);
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Chọn bên cờ</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Icon
                name="close"
                size={26}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                side === "w" && styles.optionSelected,
                { borderRightWidth: 1 },
              ]}
              onPress={() => {
                setSide("w");
              }}
            >
              <Image
                source={require("../assets/chess/wp.png")}
                style={styles.optionImage}
              />
              <Text style={styles.optionText}>Trắng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                side === "random" && styles.optionSelected,
                { borderRightWidth: 1 },
              ]}
              onPress={() => {
                setSide("random");
              }}
            >
              <Icon
                name="shuffle"
                size={40}
              />
              <Text style={styles.optionText}>Ngẫu nhiên</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                side === "b" && styles.optionSelected,
              ]}
              onPress={() => {
                setSide("b");
              }}
            >
              <Image
                source={require("../assets/chess/bp.png")}
                style={styles.optionImage}
              />
              <Text style={styles.optionText}>Đen</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleSelectSide}
          >
            <Text style={[styles.optionText, { color: "white" }]}>Chơi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "gray",
    position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 90,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 45,
    overflow: "hidden",
  },
  optionButton: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: Colors.LIGHTBLUE,
  },
  optionImage: {
    width: 40,
    height: 40,
  },
  optionText: {
    color: "black",
    fontWeight: 600,
  },
  selectButton: {
    width: "35%",
    height: 50,
    backgroundColor: "#1154a6",
    padding: 10,
    borderRadius: 25,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SidePickerModal;
