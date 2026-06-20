const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: false
  },
  country_id: {
    type: String,
    required: true
  },
  state_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: String, // You can use Number if you prefer storing it as a numeric type
    required: true
  },
  longitude: {
    type: String, // You can use Number if you prefer storing it as a numeric type
    required: true
  }
});

const City = mongoose.model('City', citySchema);
module.exports = City;
