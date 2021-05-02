const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
  _id: String,
  code: Number,
  users: [String],
});

module.exports = mongoose.model('device', deviceSchema);
