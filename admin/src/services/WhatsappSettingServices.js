import requests from "./httpService";

const WhatsappSettingServices = {

  createWhatsappSetting: async (body) => {
    return requests.post("/whatsapp-setting", body);
  },

  getWhatsappSettings: async () => {
    return requests.get("/whatsapp-setting");
  }
};

export default WhatsappSettingServices;