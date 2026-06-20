const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, default: null },
    is_active: { type: Boolean, required: true },
    created_by: { type: String, default: null },
    created_date: { type: Date, default: Date.now },
    modified_by: { type: String, default: null },
    modified_date: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' } });

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;
