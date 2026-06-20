const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemGroupSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String },
  alias: { type: String },
  moq: { type: Number, default: 6 }, // Minimum Order Quantity
  discount: { type: Number },
  image: { type: String },
  is_primary: { type: Boolean },
  is_active: { type: Boolean, required: true },
  is_parent_group: { type: Boolean, required: true },
  parent_id: { type: Schema.Types.ObjectId, ref: 'ItemGroup', required: false }, // Self-referencing field
  created_by: { type: String },
  created_date: { type: Date, default: Date.now },
  modified_by: { type: String },
  modified_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ItemGroup', ItemGroupSchema);


// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const ItemGroupSchema = new Schema({
//   name: { type: String, required: true },
//   code: { type: String },
//   alias: { type: String },
//   discount: { type: Number },
//   image: { type: String },
//   is_primary: { type: Boolean },
//   is_active: { type: Boolean, required: true },
//   is_parent_group: { type: Boolean, required: true },
//   parent_id: { type: String , required: true },
//   created_by: { type: String },
//   created_date: { type: Date, default: Date.now },
//   modified_by: { type: String },
//   modified_date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('ItemGroup', ItemGroupSchema);
