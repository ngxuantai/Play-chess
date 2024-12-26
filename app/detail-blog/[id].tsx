import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { blogApi } from "@/api/blog.api";
import Markdown from "react-native-markdown-display";
import CommentsSection from "@/components/CommentsSection";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-paper";

const DetailBlog = () => {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<any>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<number>(0);

  const fetchBlog = async () => {
    const response = await blogApi.getBlogById(Number(id));
    console.log("Blog response:", response.data);
    return response.data;
  };

  useEffect(() => {
    fetchBlog().then((data) => {
      setPost(data.post);
      setLiked(data.liked);
      setLikes(data.likesCount);
      setComments(data.commentsCount);
    });
  }, []);

  const handleLikeBlog = async () => {
    blogApi
      .likeBlog(Number(id))
      .then((response) => {
        if (response.data.liked) {
          setLikes((prev) => prev + 1);
          setLiked(true);
        } else {
          setLikes((prev) => prev - 1);
          setLiked(false);
        }
      })
      .catch((error) => {
        console.log("Error liking blog:", error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      {post?.content && (
        <>
          <Markdown style={markdownStyles}>{post.content}</Markdown>
        </>
      )}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.action}
          onPress={() => handleLikeBlog()}
        >
          <Icon
            name={liked ? "thumb-up" : "thumb-up-outline"}
            size={20}
            color={"gray"}
          />
          <Text style={styles.statisticText}>{likes}</Text>
        </TouchableOpacity>
        <View style={styles.action}>
          <Icon
            name="comment"
            size={20}
            color={"gray"}
          />
          <Text style={styles.statisticText}>{comments}</Text>
        </View>
      </View>
      <Divider />

      {post?.id && (
        <CommentsSection
          idBlog={post.id}
          countComments={() => {
            setComments((prev) => prev + 1);
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 20,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
  },
  actionContainer: {
    width: "100%",
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  action: {
    flexDirection: "row",
    gap: 5,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  statisticText: {
    fontSize: 18,
    color: "#333",
  },
});

const markdownStyles = {
  body: {
    color: "#333",
    fontSize: 16,
  },
  // paragraph: {
  //   marginBottom: 10,
  //   flexWrap: "wrap",
  //   flexDirection: "row",
  //   alignItems: "flex-start",
  //   justifyContent: "flex-start",
  // },
  heading1: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2a2a2a",
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  heading2: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2a2a2a",
    marginBottom: 8,
  },
  heading3: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2a2a2a",
    marginBottom: 8,
  },
  heading4: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2a2a2a",
    marginBottom: 8,
  },
  link: {
    color: "#0366d6",
    textDecorationLine: "none",
  },
  strong: {
    fontWeight: "bold",
    color: "#000",
  },
  em: {
    fontStyle: "italic",
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#ccc",
    paddingLeft: 16,
    marginBottom: 12,
    fontStyle: "italic",
    color: "#666",
  },
  code_inline: {
    backgroundColor: "#f4f4f4",
    fontFamily: "Courier",
    padding: 4,
    borderRadius: 4,
    color: "#d6336c",
  },
  code_block: {
    backgroundColor: "#272822",
    fontFamily: "Courier",
    color: "#f8f8f2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    lineHeight: 22,
  },
  list_item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bullet_list: {
    marginLeft: 16,
    marginBottom: 12,
  },
  ordered_list: {
    marginLeft: 16,
    marginBottom: 12,
  },
  image: {
    resizeMode: "contain",
  },
};

export default DetailBlog;
