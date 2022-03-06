const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  time: Date,
  username: String,
  fullName: String,
  devices: [{ _id: String, code: String }],
  message: String,
  status: Boolean,
});

module.exports = mongoose.model('message', messageSchema);
