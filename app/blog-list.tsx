import BlogCard from "@/components/BlogCard";
import { FlatList } from "react-native";

const blogs = [
  {
    blogId: "1",
    title: "How to know if you are really in love",
    subtitle:
      "This is the most important question you can ask yourself, and the answer is not what you think",
    ownerName: "Người viết 1",
    avatar: require("@/assets/chess/bb.png"),
    thumbnail: require("@/assets/images/home-image.png"),
    time: "Aug 20, 2021",
  },
  {
    blogId: "2",
    title: "Top 10 Microservices design patterns you should know",
    subtitle: "Because most of the signs they tell you are 'garbage'",
    ownerName: "Người viết 2",
    avatar: require("@/assets/chess/bb.png"),
    thumbnail: require("@/assets/images/home-image.png"),
    time: "Oct 10, 2020",
  },
  {
    blogId: "3",
    title: "How to write with AI without sounding like a robot",
    subtitle: "Can AI make you a better writer?",
    ownerName: "Người viết 3",
    avatar: require("@/assets/chess/bb.png"),
    thumbnail: require("@/assets/images/home-image.png"),
    time: "Sep 15, 2021",
  },
];

export default function BlogList() {
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
