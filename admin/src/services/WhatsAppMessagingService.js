import requests from "./httpService";
import WhatsappSettingServices from "./WhatsappSettingServices";

const WhatsAppMessagingService = {
  // Send PDF to multiple vendors via WhatsApp
  sendPdfToVendors: async (phoneNumbers, catalogData) => {
    try {
      // Call the server endpoint to send catalog to vendors
      const response = await requests.post("/whatsapp-setting/send-catalog", {
        phoneNumbers,
        catalogData
      });

      return response;
    } catch (error) {
      console.error("Error sending PDF to vendors:", error);
      throw new Error("Failed to send PDF to vendors");
    }
  },

  // Send individual message to a vendor
  sendMessageToVendor: async (phoneNumber, message) => {
    try {
      const formattedPhone = phoneNumber.replace(/\s+/g, '');
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      
      return {
        success: true,
        whatsappUrl: whatsappUrl
      };
    } catch (error) {
      console.error("Error sending message to vendor:", error);
      throw new Error("Failed to send message to vendor");
    }
  },

  // Generate WhatsApp share link for catalog
  generateCatalogShareLink: (phoneNumber, catalogData) => {
    const message = `📋 *New Catalog Available*\n\n` +
      `*Item Groups:* ${catalogData?.item_group_id?.map(item => item.name).join(', ') || 'N/A'}\n` +
      `*Categories:* ${catalogData?.category_id?.map(item => item.name).join(', ') || 'N/A'}\n` +
      `*Sale Price:* ${catalogData?.sale_price || 'N/A'}\n` +
      `*Description:* ${catalogData?.description || 'N/A'}\n\n` +
      `Please check the catalog for complete details.`;

    const formattedPhone = phoneNumber.replace(/\s+/g, '');
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  }
};

export default WhatsAppMessagingService; 