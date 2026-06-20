import requests from "./httpService";

const catalogValueServices = {
  addCatalogValue: async (body) => {
    return requests.post("/catalog", body);
  },
  getCatalogValue: async () => {
    return requests.get("/catalog");
  },
  deleteCatalogValue: async (id) => {
    return requests.delete(`/catalog/${id}`);
  },
  deleteAllCatalogValues: async () => {
    return requests.delete("/catalog");
  },
  getCatalogValueById: async (id) => {
    return requests.get(`/catalog/${id}`);
  },
  updateCatalogValue: async (id, data) => {
    return requests.put(`/catalog/${id}`, data);
  },
};

export default catalogValueServices;
