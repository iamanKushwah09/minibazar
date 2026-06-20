const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    bill_amount: { type: Number, default: null }, // Store in cents
    shipping_charge: { type: Number, default: null } // Store in cents
});

const Shipping = mongoose.model('Shipping', shippingSchema);
module.exports = Shipping;



