const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  is_active: { type: Boolean, required: true },
  created_by: { type: String },
  created_date: { type: Date, default: Date.now },
  modified_by: { type: String },
  modified_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Brand', BrandSchema);
