const mongoose = require('mongoose');
 
const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true
    },
    created_by: {
        type: String,
        default: null
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    modified_by: {
        type: String,
        default: null
    },
    modified_date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});
 
module.exports = mongoose.model('Unit', unitSchema);