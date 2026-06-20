const mongoose = require("mongoose");

const dispatchLogSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "Start",
      enum: ["Start", "Dispatched", "Processing", "Delivered", "Cancelled"],
    },
    orderDetails_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "saleorders",
      required: true,
    },
    updateDescription: { type: String },
    grNo: { type: String },
    lot: { type: String },
    images: [{ type: Object }],
  },
  { timestamps: true, collection: 'dispatchlog' }
);
module.exports = mongoose.model("DispatchLog", dispatchLogSchema);
