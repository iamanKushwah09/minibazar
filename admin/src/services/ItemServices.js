import requests from "./httpService";

const ItemServices = {

    // role
    syncItem: async () => {
        return requests.get("/items/sync");
    },
    syncStock: async () => {
        return requests.get("/items/sync-stock");
    },
    getItemCode: async (id) => {
        console.log("Fetching item code for ID:", id);
        return requests.get(`/items/${id}/code`);
    },
    getItemDiscount: async (body) => {
        return requests.post("/items/getItemDiscount", body);
    },
    addItem: async (body) => {
        return requests.post("/items", body);
    },
    deleteAllItems: async () => {
        console.log("Deleting all items... in ItemServices.js");
        return requests.delete("/items");
    },
    importItems: async (body) => {
        return requests.post("/items/import", body);
    },
    getAllItem: async (params = {}) => {
        // Filter out undefined/empty filter parameters
        const filteredParams = { ...params };
        
        // Remove empty filter values
        if (filteredParams.itemGroup === "") delete filteredParams.itemGroup;
        if (filteredParams.category === "") delete filteredParams.category;
        if (filteredParams.stockMin === "") delete filteredParams.stockMin;
        if (filteredParams.stockMax === "") delete filteredParams.stockMax;
        
        const res = await requests.get("/items", { params: filteredParams });
        if (Array.isArray(res)) {
            return {
                items: res,
                totalDoc: res.length,
                limits: params?.limit || 20,
                pages: params?.page || 1
            };
        }
        return {
            items: res?.items || [],
            totalDoc: res?.totalDoc || 0,
            limits: res?.limits || params?.limit || 20,
            pages: res?.pages || params?.page || 1
        };
    },
    getActiveItem: async () => {
        return requests.get("/items/active");
    },
    deleteItem: async (id) => {
        return requests.delete(`/items/${id}`);
    },
    getItemById: async (id) => {
        return requests.get(`/items/${id}`);
    },
    updateItem: async (id, data) => {
        return requests.put(`/items/${id}`, data);
    },

};

export default ItemServices;
