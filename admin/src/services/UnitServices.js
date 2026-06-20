import requests from "./httpService";

const UnitServices = {
  syncUnit: async () => {
    return requests.get("/unit/sync");
  },
  addUnit: async (body) => {
    return requests.post("/unit", body);
  },
  getAllUnit: async () => {
    return requests.get("/unit");
  },

  getActiveUnit: async () => {
    return requests.get("/unit/active");
  },

  deleteUnit: async (id) => {
    console.log({ id });
    return requests.delete(`/unit/${id}`);
  },
  deleteAllUnit: async () => {
    return requests.delete(`/unit`);
  },
  getUnitById: async (id) => {
    return requests.get(`/unit/${id}`);
  },
  updateUnit: async (id, data) => {
    return requests.put(`/unit/${id}`, data);
  },
};

export default UnitServices;
