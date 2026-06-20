import requests from "./httpService";

const AttributeGroupServices = {

    addAttributeGroup: async (body) => {
        return requests.post("/attribute-group", body);
    },
    getAllAttributeGroup: async () => {
        return requests.get("/attribute-group");
    },
    
    getActiveAllAttributeGroup: async () => {
        return requests.get("/attribute-group/active");
    },

    deleteAttributeGroup: async (id) => {
        return requests.delete(`/attribute-group/${id}`);
    },

    getAttributeGroupById: async (id) => {
        return requests.get(`/attribute-group/${id}`);
    },
    
    updateAttributeGroup: async (id, data) => {
        return requests.put(`/attribute-group/${id}`, data);
    },

    syncAttributeGroup: async () => {
        return requests.get("/attribute-group/sync");
    },

};

export default AttributeGroupServices;
