import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { registerAction } from "@/redux/actions/authActions";
import { selectAuth } from "@/redux/selectors/authSelectors";
import { useRouter } from "expo-router";
import { Divider } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const signUpValidationSchema = Yup.object().shape({
  username: Yup.string().required("Không được để trống"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Không được để trống"),
  password: Yup.string()
    // .matches(/\w*[a-z]\w*/, "Password must have a small letter")
    // .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
    // .matches(/\d/, "Password must have a number")
    // .matches(
    //   /[!@#$%^&*()\-_"=+{}; :,<.>]/,
    //   "Password must have a special character"
    // )
    .min(8, ({ min }) => `Mật khẩu phải có ít nhất ${min} ký tự`)
    .required("Không được để trống"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
    .required("Không được để trống"),
});

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch({ type: "auth/clearError" });
  }, [dispatch]);

  const handleRegister = (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    dispatch(
      registerAction({
        username: values.username,
        email: values.email,
        password: values.password,
      })
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/images/welcome-image.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Đăng ký</Text>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={signUpValidationSchema}
        onSubmit={handleRegister}
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
                style={[
                  styles.input,
                  touched.username && errors.username && styles.errorInput,
                ]}
                placeholder="Username"
                value={values.username}
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                autoCapitalize="none"
              />
              {touched.username && errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  touched.email && errors.email && styles.errorInput,
                ]}
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    touched.password && errors.password && styles.errorInput,
                  ]}
                  placeholder="Mật khẩu"
                  secureTextEntry={!showPassword}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color={Colors.DARKBLUE}
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    touched.confirmPassword &&
                      errors.confirmPassword &&
                      styles.errorInput,
                  ]}
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry={!showConfirmPassword}
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color={Colors.DARKBLUE}
                  />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit as any}
            >
              <Text style={styles.buttonText}>
                {loading ? "Loading..." : "Đăng ký"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <View style={styles.otherOptionsContainer}>
        <TouchableOpacity style={styles.outlinedButton}>
          <Icon
            name="google"
            size={20}
            color={Colors.DARKBLUE}
          />
          <Text style={styles.outlinedButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlinedButton}>
          <Icon
            name="facebook"
            size={20}
            color={Colors.DARKBLUE}
          />
          <Text style={styles.outlinedButtonText}>Facebook</Text>
        </TouchableOpacity>
      </View>
      <Divider
        bold
        style={styles.divider}
      />
      <Text style={styles.footer}>
        Đã có tài khoản?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/login")}
        >
          Đăng nhập
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: { width: 160, height: 160 },
  title: { fontSize: 32, fontWeight: "bold", color: Colors.BLACK },
  formContainer: {
    marginTop: 32,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.LIGHTBLUE,
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 6,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.BLACK,
    fontWeight: "bold",
    width: "40%",
    textAlign: "center",
  },
  otherOptionsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    padding: 32,
  },
  outlinedButton: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.DARKBLUE,
    padding: 10,
    borderRadius: 20,
  },
  outlinedButtonText: {
    fontWeight: "bold",
  },
  footer: { margin: 20 },
  divider: {
    width: "40%",
  },
  link: { color: Colors.DARKBLUE, fontWeight: "bold" },
});
