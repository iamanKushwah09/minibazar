const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
    coupon_code: { type: String, required: true },
    discount_percentage: { type: Number, default: null },
    max_discount_price: { type: Number, default: null },
    use_per_user: { type: Number, default: null },
    expiry_date: { type: Date, default: null },
    is_active: { type: Boolean, required: true },
    created_by: { type: String, default: null },
    created_date: { type: Date, default: Date.now },
    modified_by: { type: String, default: null },
    modified_date: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' } });

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);
module.exports = PromoCode;
