import requests from "./httpService";

const CategoryServices = {
  getAllCategory: async () => {
    return requests.get("/category");
  },

  getAllCategories: async () => {
    return requests.get("/category/all");
  },

  getCategoryById: async (id) => {
    return requests.get(`/category/${id}`);
  },

  addCategory: async (body) => {
    return requests.post("/category/add", body);
  },

  addAllCategory: async (body) => {
    return requests.post("/category/add/all", body);
  },

  updateCategory: async (id, body) => {
    return requests.put(`/category/${id}`, body);
  },

  updateStatus: async (id, body) => {
    return requests.put(`/category/status/${id}`, body);
  },

  deleteCategory: async (id, body) => {
    return requests.delete(`/category/${id}`, body);
  },
  deleteAllCategory: async () => {
    return requests.delete("/category");
  },

  updateManyCategory: async (body) => {
    return requests.patch("/category/update/many", body);
  },

  deleteManyCategory: async (body) => {
    return requests.patch("/category/delete/many", body);
  },

  // our URL
  addCategory1: async (body) => {
    return requests.post("/category", body);
  },
  getAllCategory1: async () => {
    return requests.get("/category");
  },
  deleteCategory1: async (id) => {
    return requests.delete(`/category/${id}`);
  },
  getCategoryById1: async (id) => {
    console.log({ id });
    return requests.get(`/category/${id}`);
  },
  updateCategory1: async (id, data) => {
    return requests.put(`/category/${id}`, data);
  },

  getActiveCategory: async () => {
    return requests.get("/category/active");
  },

  syncCategory: async () => {
    return requests.post("/category/sync");
  },
};

export default CategoryServices;
