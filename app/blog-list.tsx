import BlogCard from "@/components/BlogCard";
import { FlatList } from "react-native";
import { blogApi } from "@/api/blog.api";
import { useEffect, useState } from "react";

interface Blog {
  blogId: string;
  title: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    const response = await blogApi.getBlogsPublished();
    setBlogs(() =>
      response.data.map((blog: any) => {
        return {
          blogId: blog.post.id,
          title: blog.post.title,
          content: blog.post.content,
          time: blog.post.createdAt,
          likes: blog.likesCount,
          comments: blog.commentsCount,
        };
      })
    );
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <FlatList
      data={blogs}
      renderItem={({ item }) => <BlogCard blogInfo={item} />}
      keyExtractor={(item) => item.blogId}
    />
  );
}
