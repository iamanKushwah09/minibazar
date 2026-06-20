const mongoose = require("mongoose");

const ParamSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});
const HeaderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const WhatsAppConfigSchema = new mongoose.Schema({

  whatsappUrl: {
    type: String,
    required: true,
  },
  requestMethod: {
    type: String,
    required: true,
    enum: ['GET', 'POST'],
    default: 'GET',
  },
  header: [HeaderSchema], // Array of headerId-value pairs
  params: [ParamSchema], // Array of paramId-value pairs
});

module.exports = mongoose.model("WhatsAppConfig", WhatsAppConfigSchema);
