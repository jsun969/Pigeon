const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const router = express.Router();

const InviteCode = require("../models/inviteCode");

router.get("/invite_code/:count", (req, res) => {
  let randStrArr = [];
  for (i = 0; i < req.params.count; i++) {
    const randStr = crypto.randomBytes(20).toString("hex");
    const inviteCode = new InviteCode({
      code: randStr,
      username: null,
    });
    inviteCode.save().then(result => console.log(result).catch(err => console.error(err)));
    randStrArr.push(randStr);
  }
  console.log(randStrArr);
  res.sendStatus(200);
});

module.exports = router;
