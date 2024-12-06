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
import { Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { loginAction } from "@/redux/actions/authActions";
import { selectAuth } from "@/redux/selectors/authSelectors";

const LoginSchema = Yup.object().shape({
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
});

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch({ type: "auth/clearError" });
  }, [dispatch]);

  const handleLogin = (values: { email: string; password: string }) => {
    dispatch(
      loginAction({
        emailOrUsername: values.email,
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
      <Text style={styles.title}>Đăng nhập</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          resetForm,
        }) => (
          <View style={styles.formContainer}>
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
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit as any}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Loading..." : "Đăng nhập"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      {/* <Text style={{ marginTop: 10 }}>Lost password?</Text> */}
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
        Chưa có tài khoản?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/register")}
        >
          Đăng ký
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
    marginTop: 70,
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
    padding: 50,
  },
  outlinedButton: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.DARKBLUE,
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
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
