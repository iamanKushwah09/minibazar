import requests from "./httpService";

const SaleTypeServices = {
  getAllSaleType: async () => {
    return requests.get("/sale-type");
  },

  getSaleTypeById: async (id) => {
    return requests.get(`/sale-type/${id}`);
  },

  addSaleType: async (body) => {
    return requests.post("/sale-type/add", body);
  },

  getSomeSaleTypes: async () => {
    return requests.get("/sale-type/some");
  },

  updateSaleType: async (id, body) => {
    return requests.put(`/sale-type/${id}`, body);
  },

  updateStatus: async (id, body) => {
    return requests.put(`/sale-type/status/${id}`, body);
  },

  deleteSaleType: async (id, body) => {
    return requests.delete(`/sale-type/${id}`, body);
  },

  updateManySaleType: async (body) => {
    return requests.patch("/sale-type/update/many", body);
  },

  deleteManySaleType: async (body) => {
    return requests.patch("/sale-type/delete/many", body);
  },

  getActiveSaleType: async () => {
    return requests.get("/sale-type/active");
  }
};

export default SaleTypeServices;