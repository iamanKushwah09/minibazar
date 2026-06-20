
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  is_active: { type: Boolean, required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // Fixed reference
  is_parent_category: { type: Boolean, default: false },  
  image: { type: Object },
  status: {
    type: String,
    lowercase: true,
    enum: ['show', 'hide'], // Ensures only 'show' or 'hide' is allowed
    default: 'show',
  },
  created_by: { type: String },
  created_date: { type: Date, default: Date.now },
  modified_by: { type: String },
  modified_date: { type: Date, default: Date.now }
});

// Exporting with a corrected model name
module.exports = mongoose.model('Category', CategorySchema);
