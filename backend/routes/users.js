const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const router = express.Router();

const InviteCode = require("../models/inviteCode");
const User = require("../models/user");
const { response } = require("../app");

router.get("/invite_codes/:count", (req, res) => {
  let randStrArr = [];
  for (const i = 0; i < req.params.count; i++) {
    const randStr = crypto.randomBytes(20).toString("hex");
    const inviteCode = new InviteCode({
      code: randStr,
      username: null,
    });
    inviteCode.save().catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
    randStrArr.push(randStr);
  }
  console.log(`Generated ${req.params.count} invite codes successfully!!`);
  console.log(randStrArr);
  res.status(200).json(randStrArr);
});

router.get("/invite_codes", (req, res) => {
  let docsArr = [];
  InviteCode.find()
    .then(docs => {
      docsArr = docs.map(({ code, username }) => ({ code, username }));
      console.log(docsArr);
      res.json(docsArr);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

router.post("/register", (req, res) => {
  InviteCode.findOneAndUpdate({ code: req.body.inviteCode }, { username: req.body.username })
    .then(doc => {
      const user = new User({
        username: req.body.username,
        password: crypto.createHash("sha256").update(req.body.password).digest("hex"),
      });
      user
        .save()
        .then(result => {
          console.log(`User [ ${result.username} ] registered successfully!!`);
          res.json(result);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: err });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
