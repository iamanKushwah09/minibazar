const mongoose = require('mongoose');

const shippingRuleSchema = new mongoose.Schema({
  ruleType: {
    type: String,
    enum: ['distance', 'order', 'both'],
    required: true
  },
  startKm: { type: Number, default: null },
  endKm: { type: Number, default: null },
  startOrderPrice: { type: Number, default: null },
  endOrderPrice: { type: Number, default: null },
  shippingCharge: { type: Number, required: true },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

// Indexes
shippingRuleSchema.index({ ruleType: 1 });
shippingRuleSchema.index({ status: 1 });
shippingRuleSchema.index({ startKm: 1, endKm: 1 });
shippingRuleSchema.index({ startOrderPrice: 1, endOrderPrice: 1 });

module.exports = mongoose.model('ShippingRule', shippingRuleSchema);
