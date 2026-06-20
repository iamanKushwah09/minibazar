const mongoose = require('mongoose');
const stateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: false
  },
  country_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  iso_code: {
    type: String,
    required: true,
    unique:false
  }
});
const State = mongoose.model('State', stateSchema);
module.exports = State;
