import requests from "./httpService";

const ItemDiscountServices = {
    getItemDiscountServices: async (data) => {
        return requests.post("/item-discount/get" , data);
    }
}
export default ItemDiscountServices;