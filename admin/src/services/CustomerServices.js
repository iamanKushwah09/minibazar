import requests from "./httpService";

const CustomerServices = {
  addCustomer: async (body) => {
    return requests.post("/customer", body);
  },
  getAllCustomer: async (params = {}) => {

    const res = await requests.get("/customer", { params });
    if (Array.isArray(res)) {
      return {
        customers: res,
        totalDoc: res.length,
        limits: params?.limit || 20,
        pages: params?.page || 1
      };
    }
    return {
      customers: res?.data || [],
      totalDoc: res?.pagination?.total || 0,
      limits: res?.pagination?.limit || params?.limit || 20,
      pages: res?.pagination?.page || params?.page || 1
    };
  },
  activeCustomer: async (q = "", config = {}) => {
    const searchQuery = typeof q === "string" ? q : "";
    const res = await requests.get(`/customer/active?q=${searchQuery}`, config);
    return res;
  },
  deleteCustomer: async (id) => {
    return requests.delete(`/customer/${id}`);
  },
  deleteAllCustomer: async () => {
    return requests.delete("/customer");
  },
  getCustomerById: async (id) => {
    return requests.get(`/customer/${id}`);
  },
  updateCustomer: async (id, data) => {
    return requests.put(`/customer/${id}`, data);
  },
  getItemCustomer: async (id) => {
    return requests.get(`/dispatch/items/${id}`);
  },
  refreshCustomer: async () => {
    return requests.get("/customer/refresh");
  },
};

export default CustomerServices;
// import requests from "./httpService";

// const CustomerServices = {
//   getAllCustomers: async ({ searchText = "" }) => {
//     return requests.get(`/customer?searchText=${searchText}`);
//   },

//   addAllCustomers: async (body) => {
//     return requests.post("/customer/add/all", body);
//   },
//   // user create
//   createCustomer: async (body) => {
//     return requests.post(`/customer/create`, body);
//   },

//   filterCustomer: async (email) => {
//     return requests.post(`/customer/filter/${email}`);
//   },

//   getCustomerById: async (id) => {
//     return requests.get(`/customer/${id}`);
//   },

//   updateCustomer: async (id, body) => {
//     return requests.put(`/customer/${id}`, body);
//   },

//   deleteCustomer: async (id) => {
//     return requests.delete(`/customer/${id}`);
//   },
// };

// export default CustomerServices;
