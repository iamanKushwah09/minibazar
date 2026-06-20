const mongoose = require('mongoose');

const sundryDiscountSchema = new mongoose.Schema({
    bill_sundry_code: { type: Number, required: false },
    bill_sundry_name: { type: String, required: false },
    party_group_code: { type: Number, required: false },
    party_group_name: { type: String, required: false },
    sr_no: { type: Number, required: false },
    discount: { type: Number, required: false },
    is_party_group_wise: { type: Boolean, required: false },
    status: {
        type: String,
        lowercase: true,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, { timestamps: true });
const SundryDiscount = mongoose.model('SundryDiscount', sundryDiscountSchema);
module.exports = SundryDiscount;
