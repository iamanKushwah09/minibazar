const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  discount: { type: Number },
  is_active: { type: Boolean, required: true },
  // item_id: { type: Schema.Types.ObjectId, ref: 'Item' },
  item: {
    type: Object,
    required: true
  },
  created_by: { type: String },
  created_date: { type: Date, default: Date.now },
  modified_by: { type: String },
  modified_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Offer', OfferSchema);

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const OfferSchema = new Schema({
//   item_id: { type: Schema.Types.ObjectId, ref: 'Item' },
//   discount: { type: Number },
//   is_active: { type: Boolean, required: true },
//   created_by: { type: String },
//   created_date: { type: Date, default: Date.now },
//   modified_by: { type: String },
//   modified_date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Offer', OfferSchema);
