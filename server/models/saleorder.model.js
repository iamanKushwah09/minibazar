const mongoose = require("mongoose");

const SaleOrderSchema = new mongoose.Schema(
  {
    voucherNo: {
      type: String,
      default: function () {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000);
        return `SO-${yyyy}${mm}${dd}-${random}`;
      }
    },
    saleType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SaleType',
      required: true
    },
    saleTypeCode: { type: String },
    matCentre: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    customerCode: { type: String },
    directCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DirectCustomer'
    },
    salesman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salesman',
      required: true
    },
    salesmanCode: { type: String },
    items: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
      },
      name: { type: String },
      hsn: { type: String },
      image: { type: String },
      listPrice: { type: Number },
      price: { type: Number },
      quantity: { type: Number },
      unit: { type: String },
      conversion_factor: { type: Number },
      discount: { type: Number },
      totalDiscount: { type: Number },
      amount: { type: Number },
      color: { type: String },
      size: { type: String },
      description: {
        type: String,
        default: '' // Make it explicitly optional with empty string default
      }
    }],
    netAmount: { type: Number },
    sundries: {
      SundriesDetail: [{
        Name: { type: String, required: true },
        DiscountAmount: { type: Number, default: 0 },
        DiscountPercent: { type: Number, default: 0 }
      }]
    },
    totalAmount: { type: Number },
    totalDiscountAmount: { type: Number },
    totalQuantity: { type: Number },
    status: {
      type: String,
      enum: ["Start", "Dispatched", "Processing", "Delivered", "Cancelled"],
      default: 'Start'
    },
    description: { type: String },
    grNo: { type: String },
    lotNo: { type: String },
    busyApiStatus: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'FAILED' },
    // image:{ type:String[] },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.SaleOrder || mongoose.model("SaleOrder", SaleOrderSchema);