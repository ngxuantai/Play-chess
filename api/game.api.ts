import axiosInstance from "./axiosInstance";

export const gameApi = {
  createGame: async () => {
    const response = await axiosInstance.post("/games");
    return response;
  },
};
