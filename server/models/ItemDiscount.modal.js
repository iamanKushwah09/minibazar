const mongoose = require('mongoose');

const ItemDiscountSchema = new mongoose.Schema({
    partyCode: { type: Number, required: true },
    itemCode: { type: Number, required: true },
    discount1: { type: Number, default: 0.0 },
    discount2: { type: Number, default: 0.0 },
    discount3: { type: Number, default: 0.0 },
    discount4: { type: Number, default: 0.0 },
    status: {
        type: String,
        lowercase: true,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, { timestamps: true });

const ItemDiscount = mongoose.model('ItemDiscount', ItemDiscountSchema);
module.exports = ItemDiscount;