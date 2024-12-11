import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableNativeFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const emojis = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😅",
  "😆",
  "😉",
  "😊",
  "😋",
  "😎",
  "😍",
  "😘",
  "😗",
  "😙",
  "😚",
  "😇",
  "🙂",
  "🙃",
  "😏",
  "😣",
  "😥",
  "😮",
  "🤐",
  "😯",
  "😪",
  "😫",
  "😴",
  "😌",
];

const quickMessages = [
  "Hello",
  "Good luck",
  "Thanks",
  "Sorry",
  "Good move",
  "Oops",
  "Interesting",
  "Good game",
  "Gotta go",
  "Bye",
];

interface ChatModalProps {
  visible: boolean;
  setVisble: (visible: boolean) => void;
  onMessageSend: (message: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({
  visible = false,
  setVisble,
  onMessageSend,
}) => {
  const [message, setMessage] = useState<string>("");
  const onClose = () => {
    setVisble(false);
  };

  useEffect(() => {
    if (visible) {
      setMessage("");
    }
  }, [visible, setMessage]);

  const handlePress = (message: string) => {
    onMessageSend(message);
    onClose();
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
            <TouchableOpacity onPress={onClose}>
              <Icon
                name="close"
                size={26}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Trò chuyện</Text>
            <TouchableOpacity>
              <Icon
                name="dots-vertical"
                size={26}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={emojis}
            numColumns={8}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.emojiButton}
                onPress={() => handlePress(item)}
              >
                <Text style={styles.emojiText}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.emojiContainer}
          />

          <FlatList
            data={quickMessages}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.quickMessageButton}
                onPress={() => handlePress(item)}
              >
                <Text style={styles.quickMessageText}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.quickMessageContainer}
          />
          <View style={styles.messageContainer}>
            <TextInput
              placeholder="Tin nhắn..."
              style={styles.messageInput}
              onChangeText={(text) => setMessage(text)}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: message.trim()
                    ? Colors.DARKBLUE
                    : Colors.GREY,
                },
              ]}
              onPress={() => handlePress(message)}
              disabled={!message.trim()}
            >
              <Icon
                name="send"
                size={26}
                color={message.trim() ? Colors.WHITE : "white"}
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
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  emojiContainer: {
    marginVertical: 10,
  },
  emojiButton: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: 24,
  },
  quickMessageContainer: {
    marginVertical: 10,
  },
  quickMessageButton: {
    backgroundColor: Colors.LIGHTBLUE,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    margin: 5,
  },
  quickMessageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  messageInput: {
    width: "82%",
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "gray",
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
});

export default ChatModal;
