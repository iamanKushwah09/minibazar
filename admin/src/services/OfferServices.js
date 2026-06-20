import requests from "./httpService";

const OfferServices = {

  // our URL
  addOffer: async (body) => {
    return requests.post("/item-offer", body);
  },
  getAllOffer: async () => {
    return requests.get("/item-offer");
  },
  deleteOffer: async (id) => {
    return requests.delete(`/item-offer/${id}`);
  },
  getOfferById: async (id) => {
    console.log({ id })
    return requests.get(`/item-offer/${id}`);
  },
  updateOffer: async (id, data) => {
    return requests.put(`/item-offer/${id}`, data);
  },

};

export default OfferServices;
