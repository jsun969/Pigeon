const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullName: String,
  username: String,
  password: String,
  devices: [{ _id: Number, name: String }],
});

module.exports = mongoose.model('User', userSchema);
