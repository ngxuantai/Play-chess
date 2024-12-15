import React from "react";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { logoutAction } from "@/redux/actions/authActions";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { selectAuth } from "@/redux/selectors/authSelectors";
import { Colors } from "@/constants/Colors";

const UserProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(selectAuth);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <View style={styles.profileContainer}>
      {isAuthenticated ? (
        <View style={styles.infoContainer}>
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
              paddingInline: 10,
              gap: 10,
            }}
          >
            <Text style={styles.userNameText}>{user?.username}</Text>
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
                  redirectTo: "/settings",
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
                  redirectTo: "/settings",
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
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
