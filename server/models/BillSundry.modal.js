

const mongoose = require('mongoose');

const BillSundrySchema = new mongoose.Schema({
    code: { type: Number, required: true },
    name: { type: String, required: true },
    nature_type: { type: Number, required: true },
    discount: { type: Number, required: true },
    status: {
        type: String,
        lowercase: true,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, { timestamps: true });
const BillSundry = mongoose.model('BillSundry', BillSundrySchema);
module.exports = BillSundry;
