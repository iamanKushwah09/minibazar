
import requests from "./httpService";
const DispatchServices = {

    addDispatch: async (body) => {
        return requests.post("/dispatch", body);
    },      
    getAllDispatch: async () => {
        return requests.get("/dispatch");
    },
    getDispatchItems: async () => {
        return requests.get("/dispatch/items");
    },
    deleteDispatch: async (id) => {
      console.log({id})
        return requests.delete(`/dispatch/${id}`);
    },
    getDispatchById: async (id) => {
        return requests.get(`/dispatch/${id}`);
    },
    updateDispatch: async (id, data) => {
        return requests.put(`/dispatch/${id}`, data);
    },
};

export default DispatchServices;
