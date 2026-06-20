const mongoose = require('mongoose');
const countrySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  iso_code: {
    type: String,
    required: true,
    unique: true
  },
  dial_code: {
    type: String,
    required: true
  }
});
const Country = mongoose.model('Country', countrySchema);
module.exports = Country;
