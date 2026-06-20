import requests from "./httpService";

const SalesmanServices = {
  addSalesman: async (body) => {
    return requests.post("/salesman", body);
  },
  getAllSalesman: async (params = {}) => {
    const res = await requests.get("/salesman", { params });
    if (Array.isArray(res)) {
      return {
        salesmans: res,
        totalDoc: res.length,
        limits: params?.limit || 20,
        pages: params?.page || 1
      };
    }
    return {
      salesmans: res?.salesmans || [],
      totalDoc: res?.totalDoc || 0,
      limits: res?.limits || params?.limit || 20,
      pages: res?.pages || params?.page || 1
    };
  },
  activeAllSaleman: async (id) => {
    const activeSaleman = await requests.get(`/salesman/active`);
    return activeSaleman.data;
  },
  deleteSalesman: async (id) => {
    return requests.delete(`/salesman/${id}`);
  },
  deleteAllSalesman: async () => {
    return requests.delete("/salesman");
  },
  getSalesmanById: async (id) => {
    return requests.get(`/salesman/${id}`);
  },
  updateSalesman: async (id, data) => {
    return requests.put(`/salesman/${id}`, data);
  },
  refresh: async () => {
    return requests.get("/salesman/refresh");
  },
};

export default SalesmanServices;
