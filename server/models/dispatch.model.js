const mongoose = require('mongoose');
const dispatchSchema = new mongoose.Schema({       
    name: { type: String, required: true },
    description: { type: String },
    // created_by: { type: String, required: false },
    created_date: { type: Date, default: Date.now },
    is_active: { type: Boolean, required: true, default: true },  
}, { timestamps: true });
module.exports = mongoose.model('Dispatch', dispatchSchema);
