const mongoose = require("mongoose");

const inviteCodeSchema = mongoose.Schema({
  code: String,
  username: String,
});

module.exports = mongoose.model("InviteCode", inviteCodeSchema);
