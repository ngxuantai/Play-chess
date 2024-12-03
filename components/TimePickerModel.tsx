import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

interface Option {
  id: number;
  label: string;
  timeText: string;
  additionalTimeText?: string;
  color: string;
  time: number;
  additionalTime?: number;
}

interface TimePickerModalProps {
  onTimeSelect: (time: number, additionalTime?: number) => void;
}

export const options: Option[] = [
  {
    id: 0,
    label: "Cổ điển",
    timeText: "10 min",
    color: "green",
    time: 10 * 60,
  },
  {
    id: 1,
    label: "Cổ điển",
    timeText: "20 min",
    color: "green",
    time: 20 * 60,
  },
  {
    id: 2,
    label: "Cổ điển",
    timeText: "30 min",
    color: "green",
    time: 30 * 60,
  },
  { id: 3, label: "Blitz", timeText: "3 min", color: "orange", time: 3 * 60 },
  {
    id: 4,
    label: "Blitz",
    timeText: "3 min",
    color: "orange",
    additionalTimeText: "+2s/di chuyển",
    time: 3 * 60,
    additionalTime: 2,
  },
  { id: 5, label: "Blitz", timeText: "5 min", color: "orange", time: 5 * 60 },
  { id: 6, label: "Bullet", timeText: "1 min", color: "red", time: 1 * 60 },
  {
    id: 7,
    label: "Bullet",
    timeText: "1 min",
    color: "red",
    additionalTimeText: "+1s/di chuyển",
    time: 1 * 60,
    additionalTime: 1,
  },
  {
    id: 8,
    label: "Bullet",
    timeText: "2 min",
    color: "red",
    additionalTimeText: "+1s/di chuyển",
    time: 2 * 60,
    additionalTime: 1,
  },
];

const TimePickerModal: React.FC<TimePickerModalProps> = ({ onTimeSelect }) => {
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(true);
  const [isSelectionVisible, setIsSelectionVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

  const onClose = () => {
    router.back();
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setIsSelectionVisible(false);
  };

  const handleTimeSelect = () => {
    onTimeSelect(selectedOption.time, selectedOption.additionalTime);
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
            <Text style={styles.title}>Chọn chế độ chơi</Text>
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
          <TouchableOpacity
            style={styles.selectContainer}
            onPress={() => setIsSelectionVisible(true)}
          >
            <Icon
              name="clock-outline"
              size={24}
              color={selectedOption?.color || "black"}
            />
            <Text style={styles.selectedText}>
              <Text style={styles.optionLabel}>{selectedOption.label} </Text>
              <Text style={styles.optionValue}>{selectedOption.timeText} </Text>
              {selectedOption.additionalTimeText && (
                <Text style={styles.optionDescription}>
                  {selectedOption.additionalTimeText}
                </Text>
              )}
            </Text>
            <Icon
              name="chevron-down"
              size={24}
              color="#000"
            />
          </TouchableOpacity>

          <Text style={styles.infoText}>
            🕒 Thời gian chơi cho một người chơi
          </Text>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleTimeSelect}
          >
            <Text style={[styles.optionText, { color: "white" }]}>
              Tiếp tục
            </Text>
          </TouchableOpacity>
        </View>
        {isSelectionVisible && (
          <Modal
            transparent
            animationType="fade"
            visible={isSelectionVisible}
            onRequestClose={() => setIsSelectionVisible(false)}
          >
            <View style={styles.overlay}>
              <View style={styles.optionsContainer}>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => handleOptionSelect(item)}
                    >
                      <Icon
                        name="clock-outline"
                        size={24}
                        color={item.color}
                      />
                      <View style={styles.optionContent}>
                        <Text style={styles.optionLabel}>{item.label}</Text>
                        <Text style={styles.optionValue}>{item.timeText}</Text>
                        {item.additionalTimeText && (
                          <Text style={styles.optionDescription}>
                            {item.additionalTimeText}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        )}
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
  optionText: {
    color: "black",
    fontWeight: 600,
  },
  infoText: {
    fontSize: 14,
    color: "gray",
    marginTop: 10,
    textAlign: "center",
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    width: "100%",
    borderBottomColor: Colors.BLACK,
    borderBottomWidth: 1,
  },
  selectedText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
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
  optionsContainer: {
    backgroundColor: "white",
    width: "90%",
    maxHeight: "70%",
    borderRadius: 10,
    padding: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionContent: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 5,
  },
  optionLabel: {
    fontSize: 18,
    marginHorizontal: 10,
    color: Colors.GREY,
    fontWeight: "900",
  },
  optionValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  optionDescription: {
    fontSize: 18,
    color: Colors.GREEN,
  },
});

export default TimePickerModal;
