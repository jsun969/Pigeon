const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
  _id: String,
  code: String,
  users: [String],
});

module.exports = mongoose.model('device', deviceSchema);
