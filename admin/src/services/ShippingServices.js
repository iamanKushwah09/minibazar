import requests from "./httpService";

const ShippingServices = {

    addShipping: async (body) => {
        return requests.post("/shipping", body);
    },
    getAllShipping: async () => {
        return requests.get("/shipping");
    },
    deleteShipping: async (id) => {
        return requests.delete(`/shipping/${id}`);
    },
    getShippingById: async (id) => {
        return requests.get(`/shipping/${id}`);
    },
    updateShipping: async (id, data) => {
        return requests.put(`/shipping/${id}`, data);
    },

};

export default ShippingServices;
