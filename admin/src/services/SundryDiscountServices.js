import requests from "./httpService";

const SundryDiscountService = {
    getSundryDiscountsByPartyGroup: async (obj) => {
    return requests.post(`/sundry-discount/party-group` , obj);
  }
};
export default SundryDiscountService