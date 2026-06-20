import requests from "./httpService";

const AttributeValueServices = {

    addAttributeValue: async (body) => {
        return requests.post("/attribute-value", body);
    },
    getAllAttributeValue: async () => {
        return requests.get("/attribute-value");
    },
    getByAttributeValueByValue: async () => {
        return requests.get("/attribute-value/group");
    },
    
    deleteAttributeValue: async (id) => {
        return requests.delete(`/attribute-value/${id}`);
    },

    getAttributeValueById: async (id) => {
        return requests.get(`/attribute-value/${id}`);
    },
    
    updateAttributeValue: async (id, data) => {
        return requests.put(`/attribute-value/${id}`, data);
    },

    syncAttributeValue: async () => {
        return requests.get("/attribute-value/sync");
    },

};

export default AttributeValueServices;
