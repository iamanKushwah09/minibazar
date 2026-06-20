import requests from "./httpService";

const RoleServices = {

    // role
    addRole: async (body) => {
        return requests.post("/role", body);
    },
    getAllRole: async () => {
        return requests.get("/role");
    },
    getActiveRole: async () => {
        return requests.get("/role/active");
    },
    deleteRole: async (id) => {
        return requests.delete(`/role/${id}`);
    },
    getRoleById: async (id) => {
        return requests.get(`/role/${id}`);
    },
    updateRole: async (id, data) => {
        return requests.put(`/role/${id}`, data);
    },

};

export default RoleServices;
