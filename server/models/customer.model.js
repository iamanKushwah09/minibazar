const mongoose = require('mongoose');

// Define Customer Schema
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, default: null },
    alias: { type: String, default: null },
    print_name: { type: String, default: null },
    address: { type: String, default: null },
    shipping_address: { type: String, default: null },
    country_id: { type: String, default: null },
    state_id: { type: String, default: null },
    city_id: { type: String, default: null },
    orderdetails: {type: mongoose.Schema.Types.ObjectId, ref:"customers"},
    vendor_group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorGroup', default: null },
    salesman_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', default: null },
    group_type: {
        type: String,
        default: "Customer",
        enum: ["Customer", "Vendor"],
    },
    is_credit_limit: { type: Boolean, default: false },
    amount: { type: Number, default: null },
    days: { type: Number, default: null },
    application_type: { type: String, default: null },
    pincode : { type: String, default: null },
    gst_no: { type: String, default: null },
    aadhaar_no: { type: String, default: null },
    email: { type: String, default: null },
    mobile: { type: String, default: null },
    tel_no: { type: String, default: null },
    contact_person: { type: String, default: null },
    bank_detail: { type: String, default: null },
    password: { type: String, default: null },
    view_password: { type: String, default: null },
    discount: { type: Number , default: null },//mongoose.Schema.Types.Decimal128
    dealer_type: { type: String, default: null },
    gst_type: {
        type: String,
        default: "Registered",
        enum: ["Registered", "Un-Registered", "Composition", "Govt. Body", "UIN Holder"],
        required: false
    },
    salesman_code:{ type:Number , default:null},
    is_active: { type: Boolean, required: true, default: true },
    created_by: { type: String, default: null },
    created_date: { type: Date, default: Date.now, immutable: true }, // Added immutable: true
    modified_by: { type: String, default: null },
    modified_date: { type: Date, default: Date.now },
    is_guest: { type: Boolean, default: false },
    shippingAddress: {
        type: Object,
        required: false,
        default: null
    },
    image: {
        type: String,
        required: false,
    },
    remarks: {
        type: String,
        default: null,
    },

}, {
    timestamps: false // Removed automatic timestamps
});

// Add middleware to only update modified_date when document is updated
customerSchema.pre('save', function(next) {
    if (this.isNew) {
        // Don't modify dates for new documents
        next();
    } else {
        // Only update modified_date when updating existing documents
        this.modified_date = new Date();
        next();
    }
});

module.exports = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
