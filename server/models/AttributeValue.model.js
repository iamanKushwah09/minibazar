// models/attributeValue.model.js
const mongoose = require('mongoose');

const attributeValueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: null },
    attribute_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Attribute', default: null },
    is_active: { type: Boolean, required: true },
    created_by: { type: String, default: null },
    modified_by: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('AttributeValue', attributeValueSchema);
