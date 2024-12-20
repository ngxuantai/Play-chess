import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { overlay } from "react-native-paper";

const UndoModal = ({
  visible,
  onUndo,
  onNext,
}: {
  visible: boolean;
  onUndo: () => void;
  onNext: () => void;
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.titleText}>Có một nước đi tốt hơn</Text>
          <Text style={styles.text}>
            Bạn muốn lặp lại hoặc chuyển sang câu đố tiếp theo?
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={onUndo}
              style={[styles.button, { backgroundColor: "#bd313a" }]}
            >
              <Icon
                name="reload"
                size={20}
                color="white"
              />
              <Text style={styles.textButton}>Thử lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onNext}
              style={styles.button}
            >
              <Text style={styles.textButton}>Đồng ý</Text>
              <Icon
                name="arrow-right"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  titleText: {
    width: "100%",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  text: {
    width: "100%",
    padding: 16,
    fontSize: 16,
    textAlign: "center",
  },
  buttonGroup: {
    width: "80%",
    marginHorizontal: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "green",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    elevation: 6,
  },
  textButton: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: "center",
    color: "white",
  },
});

export default UndoModal;
