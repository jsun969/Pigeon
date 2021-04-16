const mongoose = require("mongoose");

const inviteCodeSchema = mongoose.Schema({
  _id: String,
  username: String,
});

module.exports = mongoose.model("InviteCode", inviteCodeSchema);
