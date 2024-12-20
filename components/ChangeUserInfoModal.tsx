import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
} from "react-native";
import { backgroundTheme, Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Formik } from "formik";
import * as Yup from "yup";
import { userApi } from "@/api/user.api";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/selectors/authSelectors";

const changeUserInfoValidationSchema = Yup.object().shape({
  username: Yup.string().required("Không được để trống"),
  password: Yup.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Mật khẩu không khớp"
  ),
});

interface ChangeUserInfoModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSave: () => void;
}

const ChangeUserInfoModal = ({
  visible,
  setVisible,
  onSave,
}: ChangeUserInfoModalProps) => {
  const { user } = useSelector(selectAuth);

  const handleSave = async (values: {
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (user) {
      try {
        if (values.password === "") {
          if (user.id) {
            await userApi.update(user.id.toString(), {
              username: values.username,
            });
            setVisible(false);
            onSave();
          }
        } else {
          if (user.id) {
            if (values.password === values.confirmPassword) {
              await userApi.update(user.id.toString(), {
                username: values.username,
                password: values.password,
              });
              setVisible(false);
              onSave();
            } else {
              console.log("Password does not match");
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("User is not found");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Thay đổi thông tin cá nhân</Text>
            </View>
            <Formik
              initialValues={{
                username: user?.username || "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={changeUserInfoValidationSchema}
              onSubmit={(values) => {
                handleSave(values);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Tên người dùng"
                      value={values.username}
                      onChangeText={handleChange("username")}
                      onBlur={handleBlur("username")}
                      style={styles.input}
                    />
                    {errors.username && touched.username && (
                      <Text style={styles.errorText}>{errors.username}</Text>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    Đổi mật khẩu
                  </Text>
                  <Text style={{ fontSize: 12, color: "gray" }}>
                    * Để trống nếu không muốn thay đổi
                  </Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Mật khẩu mới"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      style={styles.input}
                      secureTextEntry
                    />
                    {errors.password && touched.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Nhập lại mật khẩu"
                      value={values.confirmPassword}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      style={styles.input}
                      secureTextEntry
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={handleSubmit as any}
                      style={
                        errors.username ||
                        errors.password ||
                        errors.confirmPassword
                          ? styles.saveButtonError
                          : styles.saveButton
                      }
                    >
                      <Icon
                        name="content-save"
                        size={20}
                        color="white"
                      />
                      <Text style={styles.saveButtonText}>Lưu</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    paddingVertical: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 10,
    marginBottom: 20,
    position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 16,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    width: "80%",
    borderRadius: 20,
    color: Colors.BLACK,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    alignSelf: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    right: 30,
  },
  saveButtonError: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    backgroundColor: Colors.GREY,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    elevation: 6,
    width: "35%",
  },
  saveButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    backgroundColor: Colors.DARKBLUE,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    elevation: 6,
    width: "35%",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ChangeUserInfoModal;
