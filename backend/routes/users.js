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
  console.log(`Generated ${req.params.count} invite codes successfully!`);
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
      if (doc) {
        const user = new User({
          username: req.body.username,
          password: crypto.createHash("sha256").update(req.body.password).digest("hex"),
        });
        user
          .save()
          .then(result => {
            console.log(`User [ ${result.username} ] registered successfully!`);
            res.json(result);
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ error: err });
          });
      } else {
        console.log(`User [ ${req.body.username} ] tried to register, but the invite code is wrong.`);
        res.status(500).json({ error: "Invite code not found" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

router.get("/username/:username", (req, res) => {
  User.find({ username: req.params.username })
    .then(doc => {
      if (doc.length !== 0) {
        console.log(doc);
        res.json({ haveUsername: true });
      } else {
        console.log(`User [ ${req.params.username} ] is not found.`);
        res.status(404).json({ haveUsername: false });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

router.post("/login", (req, res) => {
  User.find({ username: req.body.username, password: crypto.createHash("sha256").update(req.body.password).digest("hex") })
    .then(doc => {
      if (doc.length !== 0) {
        console.log(`User [ ${req.body.username} ] login successfully.`);
        res.sendStatus(200);
      } else {
        console.log(`User [ ${req.body.username} ] login error.`);
        res.sendStatus(404);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
