import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/slices/loadingSlice";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-paper";
import { format } from "date-fns";

interface Blog {
  blogId: string;
  title: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  thumbnail: string;
}

type BlogCardProps = {
  blogInfo: Blog;
};

const BlogCard = ({ blogInfo }: BlogCardProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [imageLink, setImageLink] = useState<string | null>(null);

  useEffect(() => {
    if (blogInfo.thumbnail) {
      setImageLink(blogInfo.thumbnail);
    } else {
      const imageRegex = /!\[.*?\]\((.*?)\)/;
      const content = blogInfo.content || "";
      const imageMatch = content.match(imageRegex);
      if (imageMatch) {
        setImageLink(imageMatch[1]);
      }
    }
  }, [blogInfo.content, blogInfo.thumbnail]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd-MM-yyyy");
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        dispatch(startLoading());
        router.push(`/detail-blog/${blogInfo.blogId}`);
      }}
    >
      {imageLink && (
        <Image
          source={{ uri: imageLink }}
          style={styles.thumbnail}
        />
      )}
      <Text
        style={styles.title}
        ellipsizeMode="tail"
        numberOfLines={3}
      >
        {blogInfo.title}
      </Text>
      <View style={styles.statistics}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Icon
            name="calendar"
            size={20}
            color={Colors.BLACK}
          />
          <Text style={styles.statisticText}>{formatDate(blogInfo.time)}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Icon
              name="thumb-up-outline"
              size={20}
              color={Colors.DARKBLUE}
            />
            <Text style={styles.statisticText}>{blogInfo.likes}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Icon
              name="comment"
              size={20}
              color={Colors.DARKBLUE}
            />
            <Text style={styles.statisticText}>{blogInfo.comments}</Text>
          </View>
        </View>
      </View>
      <Divider />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    gap: 8,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    width: "100%",
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.BLACK,
    opacity: 0.5,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  statistics: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statisticText: {
    fontSize: 14,
    color: Colors.BLACK,
  },
});

export default BlogCard;
