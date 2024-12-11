import axiosInstance from "./axiosInstance";
import { LoginCredentials, RegisterCredentials } from "@/types";

export const authApi = {
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
    const response = await axiosInstance.post("/auth/register", credentials);
    return response;
  },

  getProfile: async () => {
    const response = await axiosInstance.get("/auth/profile");
    return response;
  },

  getUserById: async (id: string) => {
    const response = await axiosInstance.get(`/players/${id}`);
    return response;
  },
};
