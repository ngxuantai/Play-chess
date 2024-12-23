import axiosInstance from "./axiosInstance";

export const blogApi = {
  getBlogsPublished: async () => {
    try {
      const response = await axiosInstance.get("/blog-posts/published");
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },

  getBlogById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/blog-posts/published/${id}`);
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },
};
