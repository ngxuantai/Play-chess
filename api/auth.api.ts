import axiosInstance from "./axiosInstance";
import { LoginCredentials, RegisterCredentials } from "@/types";

export const authApi = {
  loginGoogle: async (token: string) => {
    try {
      const response = await axiosInstance.post("/auth/google", { token });
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },

  login: async (credentials: LoginCredentials) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      const response = await axiosInstance.post("/auth/register", credentials);
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get("/auth/profile");
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },

  getUserById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/players/${id}`);
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },
};
