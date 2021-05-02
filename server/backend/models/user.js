const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullName: String,
  username: String,
  password: String,
  devices: [{ code: Number, name: String }],
});

module.exports = mongoose.model('User', userSchema);
