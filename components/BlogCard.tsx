import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-paper";
import { formatMinsToHour } from "@/utils/dateTimeFormat";

type BlogCardProps = {
  blogInfo: {
    blogId: string;
    title: string;
    subtitle: string;
    ownerName: string;
    avatar: any;
    thumbnail: any;
    time: string;
  };
  onReadBlog: () => void;
};

const BlogCard = ({ blogInfo, onReadBlog }: BlogCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <View style={styles.info}>
            <Image
              source={blogInfo.avatar}
              style={styles.avatar}
            />
            <Text style={styles.ownerName}>{blogInfo.ownerName}</Text>
          </View>
          <Text style={styles.title}>{blogInfo.title}</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.subtitle}
          >
            {blogInfo.subtitle}
          </Text>
        </View>

        <Image
          source={blogInfo.thumbnail}
          style={styles.thumbnail}
        />
      </View>
      <View style={styles.statistics}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Icon
            name="star-four-points"
            size={20}
            color={Colors.HIGHLIGHT}
          />
          <Text style={styles.statisticText}>{blogInfo.time}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Icon
            name="thumb-up-outline"
            size={20}
            color={Colors.DARKBLUE}
          />
          <Text style={styles.statisticText}>2.5K</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Icon
            name="comment"
            size={20}
            color={Colors.DARKBLUE}
          />
          <Text style={styles.statisticText}>1028</Text>
        </View>
      </View>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    padding: 20,
    gap: 15,
  },
  contentContainer: {
    flexDirection: "row",
    width: "100%",
  },
  content: {
    flexDirection: "column",
    gap: 10,
    width: "70%",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  ownerName: {
    fontSize: 14,
    color: Colors.BLACK,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  title: {
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
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  statistics: {
    flexDirection: "row",
    gap: 15,
  },
  statisticText: {
    fontSize: 14,
    color: Colors.BLACK,
    opacity: 0.5,
  },
});

export default BlogCard;
