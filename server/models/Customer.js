// const mongoose = require("mongoose");

// const customerSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     image: {
//       type: String,
//       required: false,
//     },
//     address: {
//       type: String,
//       required: false,
//     },
//     country: {
//       type: String,
//       required: false,
//     },
//     city: {
//       type: String,
//       required: false,
//     },
    // shippingAddress: {
    //   type: Object,
    //   required: false,
    //   name: {
    //     type: String,
    //     required: true,
    //   },
    //   contact: {
    //     type: String,
    //     required: true,
    //   },
    //   email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     lowercase: true,
    //   },

    //   address: {
    //     type: String,
    //     required: true,
    //   },
    //   country: {
    //     type: String,
    //     required: true,
    //   },
    //   city: {
    //     type: String,
    //     required: true,
    //   },
    //   area: {
    //     type: String,
    //     required: true,
    //   },
    //   zipCode: {
    //     type: String,
    //     required: true,
    //   },
    //   isDefault: {
    //     type: Boolean,
    //     required: true,
    //   },
    // },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     phone: {
//       type: String,
//       required: false,
//     },
    // password: {
    //   type: String,
    //   required: false,
    // },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Customer = mongoose.model("Customer", customerSchema);

// module.exports = Customer;



const mongoose = require('mongoose');

// Define Vendor Schema
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    code: { type: String, default: null },
    alias: { type: String, default: null },
    print_name: { type: String, default: null },
    address: { type: String, default: null },
    country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', default: null },
    state_id: { type: mongoose.Schema.Types.ObjectId, ref: 'State', default: null },
    city_id: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
    orderdetails: {type: mongoose.Schema.Types.ObjectId, ref:"customers"},
    group_type:{
      type: String,
      required: true,
      default: "Customer",
      enum: [
        "Customer",
        "vendor"
      ],
    },
    application_type: { type: String, default: null },
    gst_no: { type: String, default: null },
    aadhaar_no: { type: String, default: null },
    mobile: { type: String, default: null },
    tel_no: { type: String, default: null },
    contact_person: { type: String, default: null },
    bank_detail: { type: String, default: null },
    discount: { type: mongoose.Schema.Types.Decimal128, default: null },
    vendor_group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorGroup', default: null },
    salesman_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', default: null },
    dealer_type: { type: String, default: null },
    gst_type: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    created_by: { type: String, default: null },
    created_date: { type: Date, default: Date.now },
    modified_by: { type: String, default: null },
    modified_date: { type: Date, default: Date.now },
    shippingAddress: {
      type: Object,
      required: false,
      name: {
        type: String,
        required: true,
      },
      contact: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      address: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      isDefault: {
        type: Boolean,
        required: true,
      },
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});


module.exports = mongoose.models.Customer || mongoose.model("Customer", customerSchema);