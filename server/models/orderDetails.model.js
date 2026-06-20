const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the schema
const orderDetailsSchema = new mongoose.Schema({
  variant: [
    {
      type: Map,
      of: String,
    },
  ],
  order_date: { type: String, default: null },
  order_no: { type: String, default: null },
  status: {
    type: String,
    default: 'Start',
    enum: ['Start', 'Dispatched', 'Processing', 'Delivered', 'Cancel'],
  },
  payment_mode: { type: String, default: null },
  shipping_charge: { type: Number, default: null },
  total_amount: { type: Number, default: null },
  total_qty: { type: Number, default: null },
  description: { type: String, default: null },
  is_active: { type: Boolean, default: true },
  created_by: { type: String, default: null },
  modified_by: { type: String, default: null },
  customers_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customers',
    required: true,
  },
  customers_type: { type: String, required: true },
  shippingOption: { type: String },
  paymentMethod: { type: String, required: true },
  subTotal: { type: Number, required: true },
  discount: { type: Number, default: 0, required: true },
  invoice: { type: Number }, // Auto-incremented
}, {
  timestamps: true, // Adds createdAt and updatedAt
});
// Auto-increment plugin for invoice
orderDetailsSchema.plugin(AutoIncrement, {
  inc_field: 'invoice',
  start_seq: 10000,
});
const Order = mongoose.model('OrderDetails', orderDetailsSchema);
module.exports = Order;
