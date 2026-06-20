const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VariantSchema = new Schema({
  quantity: { type: String },
  color: { type: String },
  size: { type: String },
  price: { type: Number },
  selling_price: { type: Number },
  stock: { type: Number },
  groupArrSelections: { type: Object },
  attribute_image: [{ type: Object }],
  checkedItems: { type: Object }
});

const ItemAttributeSchema = new Schema({
  gst_check: { type: String },
  gst: { type: String },
  offer: { type: String },
  color: { type: String },
  size: { type: String },
  checkedItems: { type: Object },
  groupArrSelections: { type: Object },
  variant: [VariantSchema]
});

const ItemSchema = new Schema({
  name: { type: String, required: true },
  // code: { type: String },
  alias: { type: String },
  print_name: { type: String },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
  item_group_id: { type: Schema.Types.ObjectId, ref: 'ItemGroup' },
  brand_id: { type: Schema.Types.ObjectId, ref: 'Brand' },
  unit_id: { type: Schema.Types.ObjectId, ref: 'Unit' },
  alternate_unit: { type: String },
  conversion_factor: { type: Number },
  tax_gst: { type: String },
  hsn_code: { type: String },
  sale_price: { type: Number },
  mrp: { type: Number },
  stock: { type: Number, default: 0 },
  discount: { type: Number },
  vendor_discount: { type: Number },
  short_description: { type: String },
  long_description: { type: String },
  specification: { type: String },
  item_code: { type: String },
  has_params: { type: Boolean, default: false },
  // image: { type: String },
  // image: [{ type: Map, of: String }],
  image: [{ type: Object }],
  default_image: { type: String },
  application_type: { type: String },
  is_active: { type: Boolean, required: true },
  item_attribute: ItemAttributeSchema,
  created_by: { type: String },
  created_date: { type: Date, default: Date.now },
  modified_by: { type: String },
  modified_date: { type: Date, default: Date.now },
});

// Single field indexes for frequently queried fields
ItemSchema.index({ category_id: 1 });
ItemSchema.index({ item_group_id: 1 });
ItemSchema.index({ brand_id: 1 });
ItemSchema.index({ unit_id: 1 });
ItemSchema.index({ is_active: 1 });
ItemSchema.index({ has_params: 1 });
ItemSchema.index({ item_code: 1 });
ItemSchema.index({ sale_price: 1 });
ItemSchema.index({ mrp: 1 });
ItemSchema.index({ stock: 1 });
ItemSchema.index({ tax_gst: 1 });
ItemSchema.index({ hsn_code: 1 });
ItemSchema.index({ created_date: -1 });
ItemSchema.index({ modified_date: -1 });

// Compound indexes for common query combinations
ItemSchema.index({ category_id: 1, is_active: 1 });
ItemSchema.index({ brand_id: 1, category_id: 1, is_active: 1 });
ItemSchema.index({ item_group_id: 1, is_active: 1 });
ItemSchema.index({ is_active: 1, sale_price: 1 });
ItemSchema.index({ is_active: 1, stock: 1 });

// Text indexes for search functionality
ItemSchema.index({
  name: 'text',
  alias: 'text',
  print_name: 'text',
  short_description: 'text',
  long_description: 'text',
  specification: 'text'
});

// Unique index for item_code if it's meant to be unique
ItemSchema.index({ item_code: 1 }, { unique: true, sparse: true });

// Index for variant pricing queries (if frequently queried)
ItemSchema.index({ 'item_attribute.variant.selling_price': 1 });
ItemSchema.index({ 'item_attribute.variant.stock': 1 });

// TTL index for auto-cleanup (optional - remove if not needed)
// ItemSchema.index({ created_date: 1 }, { expireAfterSeconds: 31536000 }); // 1 year


module.exports = mongoose.model('Item', ItemSchema);
