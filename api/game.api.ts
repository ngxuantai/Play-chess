import axiosInstance from "./axiosInstance";
import { OptionCreateRoom } from "@/types";

export const gameApi = {
  createGame: async (option: OptionCreateRoom) => {
    try {
      const response = await axiosInstance.post("/games", option);
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },

  getListGames: async () => {
    try {
      const response = await axiosInstance.get("/games");
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },
};
