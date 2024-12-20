import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth.api";
import { LoginCredentials, RegisterCredentials } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginGoogleAction = createAsyncThunk(
  "auth/loginGoogle",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authApi.loginGoogle(token);

      await AsyncStorage.setItem("access_token", response.data.access_token);

      const userResponce = await authApi.getProfile();

      return {
        user: {
          id: userResponce.data.id,
          username: userResponce.data.username,
          email: userResponce.data.email,
          rating: userResponce.data.rating,
        },
        access_token: response.data.access_token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Đăng nhập thất bại");
    }
  }
);

export const loginAction = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);

      await AsyncStorage.setItem("access_token", response.data.access_token);

      const userResponce = await authApi.getProfile();

      return {
        user: {
          id: userResponce.data.id,
          username: userResponce.data.username,
          email: userResponce.data.email,
          rating: userResponce.data.rating,
        },
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

      await AsyncStorage.setItem("access_token", response.data.access_token);

      const userResponce = await authApi.getProfile();

      return {
        user: {
          id: userResponce.data.id,
          username: userResponce.data.username,
          email: userResponce.data.email,
          rating: userResponce.data.rating,
        },
        access_token: response.data.access_token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Đăng ký thất bại");
    }
  }
);

export const getProfileAction = createAsyncThunk(
  "auth/profile",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();

      return {
        token: token,
        user: {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          rating: response.data.rating,
        },
      };
    } catch (error: any) {
      return rejectWithValue("Lỗi lấy thông tin người dùng");
    }
  }
);

// Logout Thunk
export const logoutAction = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("access_token");

      return null;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);
