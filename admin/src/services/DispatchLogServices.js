import requests from "./httpService";

const dispatchLogServices = {
  addDispatchLog: async (body) => {
    return requests.post("/dispatchlog", body);
  },
  getAllDispatchLogs: async () => {
    return requests.get("/dispatchlog");
  },
  getLogsByOrderDetails: async (orderDetailsId) => {
    return requests.get(`/dispatchlog/order/${orderDetailsId}`);
  },
};

export default dispatchLogServices;