import axiosInstance from "./axiosInstance";

export const userApi = {
  update: async (id: string, user: any) => {
    try {
      const response = await axiosInstance.patch(`/users/${id}`, user);
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },
};
