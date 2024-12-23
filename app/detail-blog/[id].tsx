import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, ScrollView } from "react-native";
import { blogApi } from "@/api/blog.api";
import Markdown from "react-native-markdown-display";

const DetailBlog = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);

  const fetchBlog = async () => {
    const response = await blogApi.getBlogById(id);
    return response.data;
  };

  useEffect(() => {
    fetchBlog().then((data) => {
      setData(data);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      {data?.content && (
        <Markdown style={markdownStyles}>{data.content}</Markdown>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 10,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
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
