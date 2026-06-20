import requests from "./httpService";

const BannerServices = {

    addBanner: async (body) => {
        return requests.post("/banner", body);
    },
    getAllBanner: async () => {
        return requests.get("/banner");
    },
    deleteBanner: async (id) => {
        return requests.delete(`/banner/${id}`);
    },
    getBannerById: async (id) => {
        return requests.get(`/banner/${id}`);
    },
    updateBanner: async (id, data) => {
        return requests.put(`/banner/${id}`, data);
    },

};

export default BannerServices;
