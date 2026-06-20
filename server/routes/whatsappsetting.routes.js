const express = require("express");
const router = express.Router();
const whatsappSettingController = require("../controller/whatsappSetting.controller");

router.route("/")
  .post(whatsappSettingController.createWhatsappSetting) // Create a new WhatsApp setting
  .get(whatsappSettingController.getWhatsappSettings); // Get all WhatsApp settings

// Send catalog to vendors
router.route("/send-catalog")
  .post(whatsappSettingController.sendCatalogToVendors); // Send catalog to vendors

  
  module.exports = router;