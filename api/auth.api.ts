import axiosInstance from "./axiosInstance";
import { LoginCredentials, RegisterCredentials } from "@/types";

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await axiosInstance.post("/auth/register", credentials);
    return response;
  },
};
