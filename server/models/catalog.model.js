const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
  catalog_name: { type: String, required: true },
  item_group_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ItemGroup' }],
  category_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],

  stock_quantity: { type: Number, required: true },
  stock_quantity_operator: { type: String, enum: ['>', '<='], default: '>' },

  sale_price: { type: Number, required: true },
  sale_price_operator: { type: String, enum: ['>', '<='], default: '>' },

  description: { type: String },
  image: { type: String },
  is_active: { type: Boolean, required: true },
  is_vendor_group: { type: Boolean },
  is_vendor: { type: Boolean },
  is_customer: { type: Boolean },

  vendor_group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorGroup',
    required: false,
    default: null
  },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false,
    default: null
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false,
    default: null
  },
});

const Catalog = mongoose.model('Catalog', catalogSchema);
module.exports = Catalog;
