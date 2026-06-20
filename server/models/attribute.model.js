// models/attribute.model.js
const mongoose = require('mongoose');
const attributeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: null },
    is_active: { type: Boolean, required: true },
    created_by: { type: String, default: null },
    created_date: { type: Date, default: Date.now },
    modified_by: { type: String, default: null },
    modified_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Attributes', attributeSchema);
