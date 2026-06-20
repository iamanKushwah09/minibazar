// models/order.model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    party_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', default: null },
    party_code: { type: String, default: null },
    order_date: { type: Date, default: null },
    order_no: { type: String, default: null },
    status: { type: String, default: null },
    payment_mode: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    created_by: { type: String, default: null },
    created_date: { type: Date, default: Date.now },
    modified_by: { type: String, default: null },
    modified_date: { type: Date, default: Date.now },
    customers_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'customers',require:true,} ,
    customers_type:{ type: String, require:true }    
}, { timestamps: true });

module.exports = mongoose.model('Orders', orderSchema);
