const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, default: null },
    busy_group_id:{type:Number , default:0},
    discount: { type: Number, default: null, min: 0, max: 100 },
    is_active: { type: Boolean, required: true },
    is_parent_group: { type: Boolean },
    created_by: { type: String, default: null },
    created_date: { type: Date, default: Date.now },
    modified_by: { type: String, default: null },
    modified_date: { type: Date, default: Date.now },
    parent_id: { type: Schema.Types.ObjectId, ref: 'VendorGroup', required: false, default: null },
    salesman_id: { type: Schema.Types.ObjectId, ref: 'Salesman', required: false, default: null }
}, { timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' } });

module.exports = mongoose.models.VendorGroup || mongoose.model('VendorGroup', vendorGroupSchema);


// const mongoose = require('mongoose');

// const vendorGroupSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     code: { type: String, default: null },
//     discount: { type: Number, default: null, min: 0, max: 100 },
//     is_active: { type: Boolean, required: true },
//     is_parent_group: { type: Boolean },
//     parent_id: { type: String },
//     created_by: { type: String, default: null },
//     created_date: { type: Date, default: Date.now },
//     modified_by: { type: String, default: null },
//     modified_date: { type: Date, default: Date.now }
// }, { timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' } });

// const VendorGroup = mongoose.model('VendorGroup', vendorGroupSchema);
// module.exports = VendorGroup;
