import axiosInstance from "./axiosInstance";
import { OptionCreateRoom } from "@/types";

export const gameApi = {
  createGame: async (option: OptionCreateRoom) => {
    try {
      const response = await axiosInstance.post("/games", option);
      return response;
    } catch (error: any) {
      console.error("Error:", error);
      throw error.response.data;
    }
  },
};
