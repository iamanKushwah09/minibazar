const mongoose = require('mongoose');

const salesmanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    code: {
        type: Number,
        required: true
    },
    app_code: {
        type: Number,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.Salesman || mongoose.model('Salesman', salesmanSchema);