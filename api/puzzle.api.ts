import axiosInstance from "./axiosInstance";

export const puzzleApi = {
  getRandomPuzzles: async () => {
    try {
      const response = await axiosInstance.get("/puzzles/random");
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },

  postPuzzleCompleted: async (puzzleId: string) => {
    try {
      const response = await axiosInstance.post(
        `/puzzles/${puzzleId}/complete`
      );
      return response;
    } catch (error: any) {
      console.log("Error pi:", error);
      throw error.response.data;
    }
  },
};
