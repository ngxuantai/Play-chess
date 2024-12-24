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

  getBlogById: async (idBlog: number) => {
    try {
      const response = await axiosInstance.get(
        `/blog-posts/published/${idBlog}`
      );
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },

  likeBlog: async (idBlog: number) => {
    try {
      const response = await axiosInstance.post(`/blog-posts/${idBlog}/like`);
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },

  commentBlog: async (idBlog: number, text: string, parentId?: number) => {
    try {
      const response = await axiosInstance.post(
        `/blog-posts/${idBlog}/comments`,
        {
          content: text,
          parentId,
        }
      );
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },

  getListComments: async (idBlog: number) => {
    try {
      const response = await axiosInstance.get(
        `/blog-posts/${idBlog}/comments`
      );
      return response;
    } catch (error: any) {
      console.log("Error1111:", error);
      throw error.response.data;
    }
  },

  likeComment: async (idComment: number) => {
    try {
      const response = await axiosInstance.post(
        `/blog-posts/comments/${idComment}/like`
      );
      return response;
    } catch (error: any) {
      console.log("Error:", error);
      throw error.response.data;
    }
  },
};
