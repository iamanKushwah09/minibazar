import requests from "./httpService";

const BillSundryServices = {
  addBillSundry: async (body) => {
    return requests.post("/bill-sundry/add", body);
  },

  getAllBillSundries: async (params = {}) => {
    return requests.get("/bill-sundry", { params });
  },
};

export default BillSundryServices;