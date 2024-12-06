import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth.api";
import { LoginCredentials, RegisterCredentials } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginAction = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);

      await AsyncStorage.setItem("userToken", response.data.access_token);

      return {
        user: response.data.user,
        access_token: response.data.access_token,
      };
    } catch (error: any) {
      return rejectWithValue(
        // error.message ||
        "Tên đăng nhập hoặc mật khẩu không đúng"
      );
    }
  }
);

export const registerAction = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.register(credentials);

      await AsyncStorage.setItem("userToken", response.data.access_token);

      return {
        user: response.data.user,
        access_token: response.data.access_token,
      };
    } catch (error: any) {
      return rejectWithValue(
        // error.message ||
        "Đăng ký thất bại"
      );
    }
  }
);

// Logout Thunk
export const logoutAction = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("userToken");

      return null;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);
