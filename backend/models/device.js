const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
  _id: String,
  code: Number,
});

module.exports = mongoose.model('device', deviceSchema);
