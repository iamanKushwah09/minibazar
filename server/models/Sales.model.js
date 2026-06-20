const mongoose = require('mongoose');
const salesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    code:{ type: Number },
    app_code:{ type: Number },
    created_date: { type: Date, default: Date.now },
    is_active: { type: Boolean, required: true, default: true },  
}, { timestamps: true });
module.exports = mongoose.model('Salesman', salesSchema);
