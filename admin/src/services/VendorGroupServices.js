import requests from "./httpService";

const VendorGroupServices = {
  addVendorGroup: async (body) => {
    return requests.post("/vendor-group", body);
  },
  getAllVendorGroup: async () => {
    return requests.get("/vendor-group");
  },
  getActiveVendorGroup: async () => {
    return requests.get("/vendor-group/active");
  },
  deleteVendorGroup: async (id) => {
    return requests.delete(`/vendor-group/${id}`);
  },
  deleteAllVendorGroup: async () => {
    return requests.delete("/vendor-group");
  },
  getVendorGroupById: async (id) => {
    return requests.get(`/vendor-group/${id}`);
  },
  updateVendorGroup: async (id, data) => {
    return requests.put(`/vendor-group/${id}`, data);
  },
  refreshVendorGroup: async (id, data) => {
    return requests.get(`/vendor-group/refresh`);
  },
};

export default VendorGroupServices;
