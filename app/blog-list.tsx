import BlogCard from "@/components/BlogCard";
import { FlatList } from "react-native";
import { blogApi } from "@/api/blog.api";
import { useEffect, useState } from "react";

interface Blog {
  blogId: string;
  title: string;
  content: string;
  time: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    const response = await blogApi.getBlogsPublished();
    setBlogs(() =>
      response.data.map((blog: any) => {
        return {
          blogId: blog.id,
          title: blog.title,
          content: blog.content,
          time: blog.createdAt,
        };
      })
    );
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const onReadBlog = (blogId: string) => {
    console.log("Read blog with id: ", blogId);
  };
  return (
    <FlatList
      data={blogs}
      renderItem={({ item }) => (
        <BlogCard
          blogInfo={item}
          onReadBlog={() => onReadBlog(item.blogId)}
        />
      )}
      keyExtractor={(item) => item.blogId}
    />
  );
}
