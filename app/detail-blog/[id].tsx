import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import CommentsSection from "@/components/CommentsSection";
import { Comment } from "@/types/commentTypes";

const DetailBlog = () => {
  const markdownContent = `
# Welcome to My Blog 🎉

## Why Blogging is Important?

Blogging helps you share knowledge, build a portfolio, and connect with like-minded people.

> "Blogging is not about publishing as much as you can. It’s about publishing as smart as you can." – Jon Morrow

Here is some code:

\`\`\`javascript
function sayHello() {
  console.log("Hello, Blog!");
}
\`\`\`

### Things to Remember:
. Write consistently.
. Be authentic.
. Always add value.

**Enjoy blogging!**

`;

  const sampleComments: Comment[] = [
    {
      id: "1",
      text: "If we're all living and dying honestly, companies hire for three reasons: skills, presentation, and credibility.",
      user: { id: 1, username: "Nick Lawrence" },
    },
    {
      id: "2",
      text: "Another main comment from User2",
      user: { id: 2, username: "zzz" },
    },
    {
      id: "3",
      idParentCmt: "1",
      text: "Hey thanks for sharing! I agree with your thoughts and you're spot on about going too deep into projects in a portfolio. Most of the time, any valuable information is under NDA or just wouldn't be shared out of the designer's own wish for privacy.",
      user: {
        id: 3,
        username: "User3",
      },
    },
    {
      id: "4",
      idParentCmt: "2",
      text: "Reply to comment 2 from User4",
      user: {
        id: 4,
        username: "User4",
      },
    },
    {
      id: "5",
      idParentCmt: "1",
      text: "Another reply to comment 1 from User5",
      user: {
        id: 5,
        username: "User5",
      },
    },
  ];

  return (
    <ScrollView>
      <Markdown style={markdownStyles}>{markdownContent}</Markdown>
      <CommentsSection initialComments={sampleComments} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f4f4f4",
    flexGrow: 1,
  },
});

const markdownStyles = {
  body: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    lineHeight: 24,
    color: "#333",
  },
  heading1: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2a2a2a",
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  heading2: {
    fontSize: 28,
    fontWeight: "600",
    color: "#3c3c3c",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 6,
  },
  heading3: {
    fontSize: 24,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: "#444",
    marginBottom: 12,
  },
  link: {
    color: "#1e90ff",
    textDecorationLine: "underline",
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
    marginVertical: 12,
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
    borderRadius: 8,
    marginVertical: 16,
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
};

export default DetailBlog;
