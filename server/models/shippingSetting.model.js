const mongoose = require('mongoose');

const shippingSettingSchema = new mongoose.Schema({
  shippingStrategy: {
    type: String,
    enum: ['distance', 'order', 'both'],
    default: 'both'
  }
}, { timestamps: true });

module.exports = mongoose.model('ShippingSetting', shippingSettingSchema);
