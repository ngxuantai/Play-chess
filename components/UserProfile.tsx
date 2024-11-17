import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

const UserProfile = () => {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.avatarContainer}>
        <Icon name="account-circle" size={60} color={Colors.DARKBLUE} />
      </View>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.registerText}>Bạn chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: Colors.DARKBLUE,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  loginButtonText: {
    color: Colors.WHITE,
    fontWeight: "bold",
    fontSize: 16,
  },
  registerText: {
    color: Colors.DARKBLUE,
    marginTop: 10,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default UserProfile;
