import requests from "./httpService";

const BrandServices = {
  addBrand: async (body) => {
    return requests.post("/brand", body);
  },
  getAllBrand: async () => {
    return requests.get("/brand");
  },

  getActiveBrand: async () => {
    return requests.get("/brand/active");
  },

  deleteBrand: async (id) => {
    console.log({ id });
    return requests.delete(`/brand/${id}`);
  },
  deleteAllBrand: async () => {
    return requests.delete("/brand");
  },
  getBrandById: async (id) => {
    return requests.get(`/brand/${id}`);
  },
  updateBrand: async (id, data) => {
    return requests.put(`/brand/${id}`, data);
  },

  syncBrand: async () => {
    return requests.post("/brand/sync");
  },
};

export default BrandServices;
