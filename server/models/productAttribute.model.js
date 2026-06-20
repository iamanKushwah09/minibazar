// models/productAttribute.model.js
const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },  // Reference to the Item collection
    attribute_id_1: { type: mongoose.Schema.Types.ObjectId, ref: 'Attribute', default: null },  // Reference to Attribute 1
    attribute_id_2: { type: mongoose.Schema.Types.ObjectId, ref: 'Attribute', default: null },  // Reference to Attribute 2
    attribute_id_3: { type: mongoose.Schema.Types.ObjectId, ref: 'Attribute', default: null },  // Reference to Attribute 3
    attribute_value_1: { type: String, default: null },  // Value for attribute 1
    attribute_value_2: { type: String, default: null },  // Value for attribute 2
    attribute_value_3: { type: String, default: null },  // Value for attribute 3
    sale_price: { type: Number, default: null },  // Sale price of the product
    mrp: { type: Number, default: null },  // Maximum retail price
    stock: { type: Number, default: null },  // Stock available
    discount: { type: Number, default: null },  // Discount in percentage
    vendor_price: { type: Number, default: null },  // Vendor price for the product
    vendor_discount: { type: Number, default: null },  // Discount provided by the vendor
    image1: { type: String, default: null },  // Image 1 URL
    image2: { type: String, default: null },  // Image 2 URL
    image3: { type: String, default: null },  // Image 3 URL
    is_active: { type: Boolean, required: true, default: true },  // Whether the product attribute is active
    created_by: { type: String, default: null },  // Creator of the product attribute
    created_date: { type: Date, default: Date.now },  // Creation timestamp
    modified_by: { type: String, default: null },  // Modifier of the product attribute
    modified_date: { type: Date, default: Date.now }  // Last modification timestamp
}, { timestamps: true });

module.exports = mongoose.model('ProductAttribute', productAttributeSchema);
