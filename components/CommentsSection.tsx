import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/selectors/authSelectors";
import { blogApi } from "@/api/blog.api";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { formatDateTimeVN } from "@/utils/dateTimeFormat";

interface CommentsSectionProps {
  idBlog: number;
  countComments: () => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  idBlog,
  countComments,
}) => {
  const { user, isAuthenticated } = useSelector(selectAuth);
  const router = useRouter();
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");
  const [activeCommentIds, setActiveCommentIds] = useState<string[]>([]);
  const [activeReplyInputId, setActiveReplyInputId] = useState<string | null>(
    null
  );
  const [loadingNewComment, setLoadingNewComment] = useState<boolean>(false);
  const [loadingReplyComment, setLoadingReplyComment] =
    useState<boolean>(false);

  const fetchListComments = async () => {
    const response = await blogApi.getListComments(idBlog);
    setComments(response.data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchListComments();
    }
  }, [isAuthenticated]);

  const handleLikeComment = (id: number, parentId?: number) => {
    console.log("Like comment:", id);
    blogApi
      .likeComment(id)
      .then((response) => {
        setComments((prevComments) =>
          prevComments.map((cmt) => {
            if (parentId) {
              return {
                ...cmt,
                replies: cmt.replies.map((reply: any) =>
                  reply.id === id
                    ? {
                        ...reply,
                        liked: response.data.liked,
                        likesCount: response.data.liked
                          ? reply.likesCount + 1
                          : reply.likesCount - 1,
                      }
                    : reply
                ),
              };
            } else {
              return cmt.id === id
                ? {
                    ...cmt,
                    liked: response.data.liked,
                    likesCount: response.data.liked
                      ? cmt.likesCount + 1
                      : cmt.likesCount - 1,
                  }
                : cmt;
            }
          })
        );
      })
      .catch((error) => {
        console.log("Error liking comment:", error);
      });
  };

  const handleComment = () => {
    if (!newCommentText.trim()) return;
    setLoadingNewComment(true);

    blogApi
      .commentBlog(idBlog, newCommentText)
      .then((response) => {
        const newComment = {
          id: response.data.id,
          content: response.data.content,
          updatedAt: response.data.updatedAt,
          parentId: response.data.parentId,
          author: {
            id: user?.id,
            username: user?.username,
          },
          replies: [],
          likesCount: 0,
        };
        setComments((prevComments) => [...prevComments, newComment]);
        countComments();
        setNewCommentText("");
        setLoadingNewComment(false);
      })
      .catch((error) => {
        console.log("Error commenting blog:", error);
        setLoadingNewComment(false);
      });
  };

  const handleReply = (item: any) => {
    if (!replyText.trim()) return;
    setLoadingReplyComment(true);

    blogApi
      .commentBlog(idBlog, replyText, item.id)
      .then((response) => {
        const newReply = {
          id: response.data.id,
          content: response.data.content,
          updatedAt: response.data.updatedAt,
          parentId: response.data.parentId,
          author: {
            id: user?.id,
            username: user?.username,
          },
          replies: [],
          likesCount: 0,
        };
        setComments((prevComments) =>
          prevComments.map((cmt) =>
            cmt.id === item.id
              ? { ...cmt, replies: [...cmt.replies, newReply] }
              : cmt
          )
        );
        countComments();
        setReplyText("");
        setActiveReplyInputId(null);
        setLoadingReplyComment(false);
        setActiveCommentIds((prevIds) =>
          prevIds.includes(item.id) ? prevIds : [...prevIds, item.id]
        );
      })
      .catch((error) => {
        console.log("Error replying comment:", error);
        setLoadingReplyComment(false);
      });
  };

  const toggleCommentReplies = (id: string) => {
    setActiveCommentIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((cmtId) => cmtId !== id)
        : [...prevIds, id]
    );
  };

  const renderReplies = (replyComments: any[]) => {
    return replyComments.map((reply) => (
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
            <Text style={styles.usernameText}>{reply.author?.username}</Text>
            <Text style={styles.time}>{formatDateTimeVN(reply.updatedAt)}</Text>
          </View>
        </View>
        <Text style={styles.text}>{reply.content}</Text>
        <View style={styles.statisticContainer}>
          <TouchableOpacity
            style={{ flexDirection: "row", gap: 5 }}
            onPress={() => handleLikeComment(reply.id, reply.parentId)}
          >
            <Icon
              name={reply.likesCount > 0 ? "thumb-up" : "thumb-up-outline"}
              size={20}
              color={Colors.DARKBLUE}
            />
            <Text style={styles.statisticText}>{reply.likesCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  const renderComment = ({ item }: { item: any }) => {
    return (
      <View
        key={item.id}
        style={styles.commentContainer}
      >
        <View style={styles.infoContainer}>
          <Icon
            name="account"
            size={36}
            color={Colors.LIGHTBLUE}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.usernameText}>{item.author?.username}</Text>
            <Text style={styles.time}>{formatDateTimeVN(item.updatedAt)}</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text
            numberOfLines={5}
            ellipsizeMode="tail"
            style={styles.text}
          >
            {item.content}
          </Text>
        </View>
        <View style={styles.statisticContainer}>
          <TouchableOpacity
            style={{ flexDirection: "row", gap: 5 }}
            onPress={() => handleLikeComment(item.id)}
          >
            <Icon
              name={item.liked > 0 ? "thumb-up" : "thumb-up-outline"}
              size={20}
              color={Colors.DARKBLUE}
            />
            <Text style={styles.statisticText}>{item.likesCount}</Text>
          </TouchableOpacity>
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
              {item.replies.length} phản hồi
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
        {activeCommentIds.includes(item.id) &&
          item.replies.length > 0 &&
          renderReplies(item.replies)}
        {activeReplyInputId === item.id && isAuthenticated && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Viết phản hồi..."
              value={replyText}
              onChangeText={setReplyText}
            />
            <TouchableOpacity onPress={() => handleReply(item)}>
              {loadingReplyComment ? (
                <ActivityIndicator size={20} />
              ) : (
                <Icon
                  name="send-outline"
                  size={20}
                  color={Colors.DARKBLUE}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <Text
          style={{
            fontSize: 14,
            textAlign: "center",
            paddingVertical: 20,
            marginBottom: 20,
          }}
        >
          Vui lòng{" "}
          <Text
            style={{ color: Colors.DARKBLUE, fontWeight: "bold" }}
            onPress={() =>
              router.push({
                pathname: "/login",
              })
            }
          >
            Đăng nhập
          </Text>{" "}
          để xem bình luận
        </Text>
      ) : (
        <>
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
              {loadingNewComment ? (
                <ActivityIndicator size={20} />
              ) : (
                <Icon
                  name="send-outline"
                  size={20}
                  color={Colors.DARKBLUE}
                />
              )}
            </TouchableOpacity>
          </View>
          {comments.map((comment) => renderComment({ item: comment }))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  commentContainer: {
    margin: 10,
    paddingBottom: 20,
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
    // justifyContent: "space-between",
    gap: 30,
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
