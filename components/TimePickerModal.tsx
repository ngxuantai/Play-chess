import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { OptionCreateRoom } from "@/types";

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
  visible: boolean;
  onSelect: (option: OptionCreateRoom) => void;
  onCancel: () => void;
}

export const options: Option[] = [
  {
    id: 0,
    label: "Rapid",
    timeText: "10 min",
    color: "green",
    time: 10 * 60,
  },
  {
    id: 1,
    label: "Rapid",
    timeText: "20 min",
    color: "green",
    time: 20 * 60,
  },
  {
    id: 2,
    label: "Rapid",
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

const TimePickerModal = ({
  visible,
  onSelect,
  onCancel,
}: TimePickerModalProps) => {
  const router = useRouter();
  const [isSelectionVisible, setIsSelectionVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [customTime, setCustomTime] = useState<string>("");
  const [customAdditionalTime, setCustomAdditionalTime] = useState<string>("0");
  const [error, setError] = useState<string>("");

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setIsSelectionVisible(false);
  };

  const handleTimeSelect = () => {
    if (isCustomizing) {
      if (!customTime) {
        setError("Vui lòng nhập thời gian");
        return;
      }
      const time = parseInt(customTime);
      const additionalTime = parseInt(customAdditionalTime || "0");
      if (time > 120) {
        setError("Thời gian tối đa là 120 phút");
        return;
      } else if (additionalTime > 30) {
        setError("Thời gian + s/di chuyển tối đa là 30 giây");
        return;
      } else {
        setError("");
        onSelect({
          timeControl: time * 60,
          increment: additionalTime,
        });
      }
    } else {
      onSelect({
        timeControl: selectedOption.time,
        increment: selectedOption.additionalTime || 0,
      });
      setSelectedOption(options[0]);
    }
  };

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Chọn chế độ chơi</Text>
            <TouchableOpacity
              onPress={onCancel}
              style={styles.closeButton}
            >
              <Icon
                name="close"
                size={26}
              />
            </TouchableOpacity>
          </View>
          {!isCustomizing && (
            <TouchableOpacity
              style={styles.selectContainer}
              onPress={() => setIsSelectionVisible(true)}
            >
              <Icon
                name="clock-outline"
                size={32}
                color={selectedOption?.color || "black"}
              />
              <Text style={styles.selectedText}>
                <Text style={styles.optionLabel}>{selectedOption.label} </Text>
                <Text style={styles.optionValue}>
                  {selectedOption.timeText}{" "}
                </Text>
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
          )}
          <TouchableOpacity
            onPress={() => {
              if (isCustomizing) {
                setCustomTime("");
                setCustomAdditionalTime("");
              }
              setIsCustomizing((prev) => !prev);
            }}
          >
            <Text style={styles.customText}>Tùy chỉnh thời gian</Text>
          </TouchableOpacity>
          {isCustomizing && (
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "space-between",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <TextInput
                label="min"
                value={customTime}
                onChangeText={setCustomTime}
                onBlur={() => setError("")}
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  width: "45%",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                }}
                contentStyle={{ paddingLeft: 8 }}
                keyboardType="number-pad"
              />
              <TextInput
                label="+ s/di chuyển"
                value={customAdditionalTime}
                onChangeText={setCustomAdditionalTime}
                onBlur={() => setError("")}
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  width: "45%",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                }}
                contentStyle={{ paddingLeft: 8 }}
                keyboardType="number-pad"
              />
            </View>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
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
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={() => setIsSelectionVisible(false)}
            >
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
                        size={28}
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
            </TouchableOpacity>
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
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    width: "100%",
    borderBottomColor: Colors.BLACK,
    borderBottomWidth: 0.5,
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
    padding: 14,
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionContent: {
    flexDirection: "row",
    width: "100%",
  },
  optionLabel: {
    fontSize: 18,
    marginHorizontal: 10,
    color: "gray",
    fontWeight: "900",
  },
  optionValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  optionDescription: {
    fontSize: 18,
    color: "green",
  },
  customText: {
    margin: 12,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    width: "40%",
    borderRadius: 20,
    color: Colors.BLACK,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    alignSelf: "center",
  },
});

export default TimePickerModal;
