import { useEffect, useState } from "react";
import { blogApi } from "@/api/blog.api";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoading } from "@/redux/selectors/loadingSelectors";
import { stopLoading } from "@/redux/slices/loadingSlice";
import { FlatList, View, StyleSheet } from "react-native";
import BlogCard from "@/components/BlogCard";
import GlobalLoading from "@/components/GlobalLoading";

interface Blog {
  blogId: string;
  title: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  thumbnail: string;
}

export default function BlogList() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    blogApi
      .getBlogsPublished()
      .then((response) => {
        setBlogs(() =>
          response.data.map((blog: any) => {
            return {
              blogId: blog.post.id,
              title: blog.post.title,
              content: blog.post.content,
              time: blog.post.createdAt,
              likes: blog.likesCount,
              comments: blog.commentsCount,
              thumbnail: blog.post.thumbnail,
            };
          })
        );
      })
      .catch((error) => {
        console.log("Error fetching blogs:", error);
      })
      .finally(() => {
        dispatch(stopLoading());
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (isLoading)
    return (
      <View style={styles.container}>
        <GlobalLoading />
      </View>
    );

  return (
    <FlatList
      data={blogs}
      renderItem={({ item }) => <BlogCard blogInfo={item} />}
      keyExtractor={(item) => item.blogId}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
