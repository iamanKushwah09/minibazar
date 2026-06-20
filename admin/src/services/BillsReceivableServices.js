import requests from "./httpService";

const BillsReceivableServices = {
    getBillReceivable: async (body) => {
    return requests.post("/customer/bill-receivable", body);
  },
};

export default BillsReceivableServices;
