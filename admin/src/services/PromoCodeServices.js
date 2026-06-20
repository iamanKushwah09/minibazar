import requests from "./httpService";

const PromoCodeServices = {

    addPromoCode: async (body) => {
        return requests.post("/promo-code", body);
    },
    getAllPromoCode: async () => {
        return requests.get("/promo-code");
    },
    deletePromoCode: async (id) => {
        return requests.delete(`/promo-code/${id}`);
    },
    getPromoCodeById: async (id) => {
        return requests.get(`/promo-code/${id}`);
    },
    updatePromoCode: async (id, data) => {
        return requests.put(`/promo-code/${id}`, data);
    },

};

export default PromoCodeServices;
