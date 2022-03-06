const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
  _id: String,
  code: String,
  users: [{ fullName: String, username: String }],
});

module.exports = mongoose.model('device', deviceSchema);
