
import requests from "./httpService";

const OrderServices = {

    addOrder: async (body) => {
        return requests.post("/order-details", body);
    },
    getAllOrder: async () => {
        // return requests.get("/order-details");
        return requests.get("/sale-order");
    },
    deleteOrder: async (id) => {
      console.log({id})
        return requests.delete(`/order-details/${id}`);
    },
    getOrderById: async (id) => {
        return requests.get(`/order-details/${id}`);
    },
    updateOrder: async (id, data) => {
        return requests.put(`/order-details/${id}`, data);
    },

    // Dashboard methods for sale orders
    getDashboardData: async () => {
        return requests.get("/admin/dashboard");
    },

    getSaleOrderDashboardData: async () => {
        return requests.get("/sale-order/dashboard/data");
    },

    // getDashboardRecentOrder: async ({ page = 1, limit = 8 }) => {
    //     return requests.get("/admin/dashboard");
    // },

    // getDashboardCount: async () => {
    //     return requests.get("/admin/dashboard");
    // },

    // getDashboardAmount: async () => {
    //     return requests.get("/admin/dashboard");
    // },

    // getBestSellerProductChart: async () => {
    //     return requests.get("/admin/dashboard");
    // },

};

export default OrderServices;



// import requests from "./httpService";

// const OrderServices = {
//   getAllOrders: async ({
//     body,
//     headers,
//     customerName,
//     status,
//     page = 1,
//     limit = 8,
//     day,
//     // source,
//     method,
//     startDate,
//     endDate,
//     // download = "",
//   }) => {
//     const searchName = customerName !== null ? customerName : "";
//     const searchStatus = status !== null ? status : "";
//     const searchDay = day !== null ? day : "";
//     // const searchSource = source !== null ? source : "";
//     const searchMethod = method !== null ? method : "";
//     const startD = startDate !== null ? startDate : "";
//     const endD = endDate !== null ? endDate : "";

//     return requests.get(
//       `/orders?customerName=${searchName}&status=${searchStatus}&day=${searchDay}&page=${page}&limit=${limit}&startDate=${startD}&endDate=${endD}&method=${searchMethod}`,
//       body,
//       headers
//     );
//   },

//   getAllOrdersTwo: async ({ invoice, body, headers }) => {
//     const searchInvoice = invoice !== null ? invoice : "";
//     return requests.get(`/orders/all?invoice=${searchInvoice}`, body, headers);
//   },

//   getRecentOrders: async ({
//     page = 1,
//     limit = 8,
//     startDate = "1:00",
//     endDate = "23:59",
//   }) => {
//     return requests.get(
//       `/orders/recent?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
//     );
//   },

//   getOrderCustomer: async (id, body) => {
//     return requests.get(`/orders/customer/${id}`, body);
//   },

//   getOrderById: async (id, body) => {
//     return requests.get(`/orders/${id}`, body);
//   },

//   updateOrder: async (id, body, headers) => {
//     return requests.put(`/orders/${id}`, body, headers);
//   },

//   deleteOrder: async (id) => {
//     return requests.delete(`/orders/${id}`);
//   },

//   getDashboardOrdersData: async ({
//     page = 1,
//     limit = 8,
//     endDate = "23:59",
//   }) => {
//     return requests.get(
//       `/orders/dashboard?page=${page}&limit=${limit}&endDate=${endDate}`
//     );
//   },

//   getDashboardAmount: async () => {
//     return requests.get("/orders/dashboard-amount");
//   },

//   getDashboardCount: async () => {
//     return requests.get("/orders/dashboard-count");
//   },

//   getDashboardRecentOrder: async ({ page = 1, limit = 8 }) => {
//     return requests.get(
//       `/orders/dashboard-recent-order?page=${page}&limit=${limit}`
//     );
//   },

//   getBestSellerProductChart: async () => {
//     return requests.get("/orders/best-seller/chart");
//   },
// };

// export default OrderServices;
