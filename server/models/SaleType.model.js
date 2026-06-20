const mongoose = require('mongoose');

const saleTypeSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      lowercase: true,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.SaleType || mongoose.model('SaleType', saleTypeSchema);
