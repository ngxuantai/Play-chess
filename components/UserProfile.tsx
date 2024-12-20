import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { logoutAction } from "@/redux/actions/authActions";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { selectAuth } from "@/redux/selectors/authSelectors";
import { Colors } from "@/constants/Colors";
import ChangeUserInfoModal from "./ChangeUserInfoModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "@/redux/store";
import { getProfileAction } from "@/redux/actions/authActions";

const UserProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(selectAuth);
  const [changeUserInfoModalVisible, setChangeUserInfoModalVisible] =
    useState(false);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  const handleUserInfoChange = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token !== null) {
        store.dispatch(getProfileAction(token));
      }
    } catch (error) {
      console.log("Error loading token:", error);
    }
  };

  return (
    <View style={styles.profileContainer}>
      {isAuthenticated ? (
        <View style={styles.infoContainer}>
          <View>
            <ChangeUserInfoModal
              visible={changeUserInfoModalVisible}
              setVisible={setChangeUserInfoModalVisible}
              onSave={() => handleUserInfoChange()}
            />
          </View>
          <View
            style={{
              width: "30%",
              alignItems: "center",
            }}
          >
            <View>
              <Icon
                name="account-circle"
                size={70}
                color={Colors.DARKBLUE}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              paddingHorizontal: 10,
              gap: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.userNameText}
              >
                {user?.username}
              </Text>
              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={() => {
                  setChangeUserInfoModalVisible(true);
                }}
              >
                <Icon
                  name="square-edit-outline"
                  size={30}
                  color={Colors.DARKBLUE}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>Email: {user?.email}</Text>
            <Text style={styles.text}>Cấp độ: {user?.rating}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.avatarContainer}>
            <Icon
              name="account-circle"
              size={70}
              color={Colors.DARKBLUE}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.replace({
                pathname: "/login",
                params: {
                  redirectTo: "settings",
                },
              });
            }}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: "/register",
                params: {
                  redirectTo: "settings",
                },
              })
            }
          >
            <Text style={styles.registerText}>
              Bạn chưa có tài khoản? Đăng ký
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  profileContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userNameText: {
    maxWidth: "70%",
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
  },
  button: {
    alignItems: "center",
    backgroundColor: Colors.LIGHTBLUE,
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 6,
    width: "70%",
  },
  buttonText: {
    fontSize: 14,
    color: Colors.BLACK,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginText: {
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
