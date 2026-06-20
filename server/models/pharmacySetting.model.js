const mongoose = require('mongoose');

const pharmacySettingSchema = new mongoose.Schema({
  officeName: { type: String, required: true },
  officeAddress: { type: String, required: true },
  officeLatitude: { type: Number, required: true },
  officeLongitude: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('PharmacySetting', pharmacySettingSchema);
