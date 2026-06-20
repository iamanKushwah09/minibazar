const mongoose = require("mongoose");

const DirectCustomerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        print_name: { type: String },
        mobile: { type: String, required: true },
        email: { type: String },
        address: { type: String },
        country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
        state_id: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
        city_id: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
        pincode: { type: String },
        remarks: { type: String },
        is_active: { type: Boolean, default: true },
        is_guest: { type: Boolean, default: true }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.models.DirectCustomer || mongoose.model("DirectCustomer", DirectCustomerSchema);
