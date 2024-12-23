import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Comment } from "@/types/commentTypes";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/selectors/authSelectors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";

interface CommentsSectionProps {
  initialComments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  initialComments,
}) => {
  const { user, isAuthenticated } = useSelector(selectAuth);
  const router = useRouter();
  const { redirectTo } = useLocalSearchParams();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");
  const [activeCommentIds, setActiveCommentIds] = useState<string[]>([]);
  const [activeReplyInputId, setActiveReplyInputId] = useState<string | null>(
    null
  );

  const handleComment = () => {
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: Math.random().toString(), // Generate unique ID (use a better method in production)
      text: newCommentText,
      user: {
        id: user?.id ?? 0,
        username: user?.username || "Anonymous",
      },
    };

    setComments((prevComments) => [...prevComments, newComment]);
    setNewCommentText("");
  };

  const handleReply = (id: string) => {
    if (!replyText.trim()) return;

    const newComment: Comment = {
      id: Math.random().toString(), // Generate unique ID (use a better method in production)
      idParentCmt: id,
      text: replyText,
      user: {
        id: user?.id ?? 0,
        username: user?.username || "Anonymous",
      },
    };

    setComments((prevComments) => [...prevComments, newComment]);
    setReplyText("");
    setActiveReplyInputId(null);
  };

  const toggleCommentReplies = (id: string) => {
    setActiveCommentIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((cmtId) => cmtId !== id)
        : [...prevIds, id]
    );
  };

  const renderReplies = (parentId: string) => {
    return comments
      .filter((comment) => comment.idParentCmt === parentId)
      .map((reply) => (
        <View
          key={reply.id}
          style={styles.replyContainer}
        >
          <View style={styles.infoContainer}>
            <Icon
              name="account"
              size={30}
              color={Colors.LIGHTBLUE}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.usernameText}>{reply.user.username}</Text>
              <Text style={styles.time}>about 2 years ago</Text>
            </View>
          </View>
          <Text style={styles.text}>{reply.text}</Text>
        </View>
      ));
  };

  const renderComment = ({ item }: { item: Comment }) => {
    return (
      <View style={styles.commentContainer}>
        <View style={styles.infoContainer}>
          <Icon
            name="account"
            size={36}
            color={Colors.LIGHTBLUE}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.usernameText}>{item.user.username}</Text>
            <Text style={styles.time}>about 2 years ago</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text
            numberOfLines={5}
            ellipsizeMode="tail"
            style={styles.text}
          >
            {item.text}
          </Text>
        </View>
        <View style={styles.statisticContainer}>
          <TouchableOpacity
            style={{ flexDirection: "row", gap: 5 }}
            onPress={() => toggleCommentReplies(item.id)}
          >
            <Icon
              name="comment-outline"
              size={20}
              color={Colors.DARKBLUE}
            />
            <Text style={styles.statisticText}>
              {activeCommentIds.includes(item.id)
                ? "Ẩn phản hồi"
                : "Xem phản hồi"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              { flexDirection: "row", gap: 5 },
              !isAuthenticated ? { display: "none" } : {},
            ]}
            onPress={() =>
              setActiveReplyInputId((prev) =>
                prev === item.id ? null : item.id
              )
            }
          >
            <Icon
              name="reply-outline"
              size={20}
              color={Colors.DARKBLUE}
            />
            <Text style={styles.statisticText}>
              {activeReplyInputId === item.id ? "Huỷ" : "Phản hồi"}
            </Text>
          </TouchableOpacity>
        </View>
        {activeCommentIds.includes(item.id) && renderReplies(item.id)}
        {activeReplyInputId === item.id && isAuthenticated && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Viết phản hồi..."
              value={replyText}
              onChangeText={setReplyText}
            />
            <TouchableOpacity onPress={() => handleReply(item.id)}>
              <Icon
                name="send-outline"
                size={20}
                color={Colors.DARKBLUE}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bình luận (12)</Text>
      {!isAuthenticated ? (
        <Text
          style={{ fontSize: 14, textAlign: "center", paddingVertical: 20 }}
        >
          Vui lòng{" "}
          <Text
            style={{ color: Colors.DARKBLUE, fontWeight: "bold" }}
            onPress={() =>
              router.push({
                pathname: "/login",
                params: {
                  redirectTo: redirectTo,
                },
              })
            }
          >
            Đăng nhập
          </Text>{" "}
          để bình luận
        </Text>
      ) : (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Viết bình luận..."
            value={newCommentText}
            onChangeText={setNewCommentText}
          />
          <TouchableOpacity
            onPress={() => {
              handleComment();
            }}
          >
            <Icon
              name="send-outline"
              size={20}
              color={Colors.DARKBLUE}
            />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={comments.filter((comment) => !comment.idParentCmt)}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  commentContainer: {
    padding: 10,
    gap: 15,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    borderRadius: 20,
    backgroundColor: Colors.DARKBLUE,
  },
  usernameText: {
    fontSize: 18,
  },
  time: {
    fontSize: 14,
    opacity: 0.5,
  },
  contentContainer: {
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
  },
  statisticContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  statisticText: {
    fontSize: 14,
    color: Colors.BLACK,
    opacity: 0.5,
  },
  replyInputContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.GREY,
    padding: 8,
    marginBottom: 8,
    width: "95%",
  },
  replyContainer: {
    marginLeft: 10,
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: Colors.GREY,
    gap: 10,
  },
});

export default CommentsSection;
