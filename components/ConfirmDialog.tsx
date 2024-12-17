import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

type ConfirmationDialogProps = {
  text: string;
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationDialog = ({
  text,
  visible,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  return (
    <Modal
      transparent
      visible={visible}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.dialog}>
          <Text style={styles.dialogText}>{text}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={onCancel}
              style={styles.cancelButton}
            >
              <Text style={[styles.textButton, { color: "red" }]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={styles.confirmButton}
            >
              <Text style={[styles.textButton, { color: "white" }]}>
                Đồng ý
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  dialogText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    color: "red",
    marginRight: 10,
    padding: 10,
  },
  confirmButton: {
    backgroundColor: Colors.GREEN,
    borderRadius: 10,
    padding: 10,
    paddingInline: 20,
  },
  textButton: {
    fontSize: 16,
    fontWeight: 600,
  },
});

export default ConfirmationDialog;
