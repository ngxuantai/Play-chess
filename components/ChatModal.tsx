import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/selectors/authSelectors";

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
  "Gotta go",
  "Oops",
  "Interesting",
  "Good game",
  "Bye",
];

interface ChatModalProps {
  visible: boolean;
  setVisble: (visible: boolean) => void;
  chatHistory: { playerId: number; message: string }[];
  onMessageSend: (message: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({
  visible = false,
  setVisble,
  chatHistory,
  onMessageSend,
}) => {
  const user = useSelector(selectUser);

  const [message, setMessage] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<"history" | "quickMessage">(
    "history"
  );
  const listRef = useRef(null);

  const onClose = () => {
    setVisble(false);
  };

  useEffect(() => {
    if (visible) {
      setMessage("");
      setCurrentTab("history");
    }
  }, [visible]);

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

          {currentTab === "history" ? (
            <View style={{ height: 300, width: "100%" }}>
              <FlatList
                data={chatHistory}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.messageBubble,
                      item.playerId === user?.id
                        ? styles.sideBubble
                        : styles.oppositeBubble,
                    ]}
                  >
                    <Text
                      style={
                        item.playerId === user?.id
                          ? styles.sideText
                          : styles.oppositeText
                      }
                    >
                      {item.message}
                    </Text>
                  </View>
                )}
                contentContainerStyle={[styles.historyContainer]}
              />
            </View>
          ) : (
            <>
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
            </>
          )}
          <View style={styles.messageContainer}>
            <TouchableOpacity
              onPress={() =>
                setCurrentTab((prev) =>
                  prev === "history" ? "quickMessage" : "history"
                )
              }
            >
              <Icon
                name="lightning-bolt"
                size={26}
              />
            </TouchableOpacity>
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
  historyContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
  },
  messageBubble: {
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  sideBubble: {
    alignSelf: "flex-end",
  },
  sideText: {
    width: "auto",
    color: "white",
    backgroundColor: "#0078FF",
    padding: 8,
    borderRadius: 10,
  },
  oppositeBubble: {
    alignSelf: "flex-start",
  },
  oppositeText: {
    color: "black",
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  emojiContainer: {
    marginVertical: 8,
  },
  emojiButton: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: 22,
  },
  quickMessageContainer: {
    marginVertical: 8,
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
    width: "75%",
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
