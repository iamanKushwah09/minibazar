const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    invoice: {
      type: Number,
      required: false,
    },
    cart: [{
      id: { type: String, required: true },
      title: { type: String, required: true },
      slug: { type: String },
      image: [{ type: String }],
      originalPrice: { type: Number },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      itemTotal: { type: Number, required: true },
      variant: {
        id: { type: String },
        title: { type: String },
        price: { type: Number },
        originalPrice: { type: Number },
        discount: { type: Number },
        quantity: { type: Number },
        barcode: { type: String },
        sku: { type: String },
        image: { type: String }
      },
      color: { type: String },
      size: { type: String },
      unit: { type: String },
      category: { type: String }
    }],
    user_info: {
      name: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      contact: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      zipCode: {
        type: String,
        required: false,
      },
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancel"],
    },
    deliveryAddress: {
      fullAddress: String,
      latitude: Number,
      longitude: Number,
      placeId: String,
    },
    distanceKm: Number,
    shippingStrategy: String,
    matchedRuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShippingRule' },
    grandTotal: Number,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);
module.exports = Order;
