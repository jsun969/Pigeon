const cfg = require('../config.js');

const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const router = express.Router();

const InviteCode = require('../models/inviteCode');
const User = require('../models/user');

// Generate invite codes
// Use '?count=<Number>' to provide quantity
router.put('/invite-codes', (req, res) => {
  let randStrArr = [];
  for (let i = 0; i < req.query.count; i++) {
    const randStr = crypto.randomBytes(20).toString('hex');
    const inviteCode = new InviteCode({
      code: randStr,
      username: null,
    });
    inviteCode.save().catch(error => {
      console.error(error);
      res.status(500).send({ error });
    });
    randStrArr.push(randStr);
  }
  console.log(`Generate ${req.query.count} invite codes successfully!`);
  console.log(randStrArr);
  res.json(randStrArr);
});

// Get all invite codes
router.get('/invite-codes', async (req, res) => {
  try {
    const docs = await InviteCode.find();
    const docsArr = docs.map(({ code, username }) => ({ code, username }));
    console.log('Get all invite codes successfully!');
    res.json(docsArr);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

// Register
router.post('/register', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(doc => {
      if (!doc) {
        InviteCode.findOneAndUpdate({ code: req.body.inviteCode }, { username: req.body.username })
          .then(doc => {
            if (!doc) {
              console.log(`User [ ${req.body.username} ] try to register, but the invite code is wrong.`);
              res.status(404).json({ error: 'InviteCodeNotFound' });
            } else if (doc.username) {
              console.log(`User [ ${req.body.username} ] try to register, but the invite code has been used.`);
              res.status(404).json({ error: 'InviteCodeIsUsed' });
            } else {
              const user = new User({
                username: req.body.username,
                password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
              });
              user
                .save()
                .then(result => {
                  console.log(`User [ ${result.username} ] register successfully!`);
                  res.sendStatus(200);
                })
                .catch(error => {
                  console.error(error);
                  res.status(500).send({ error });
                });
            }
          })
          .catch(error => {
            console.error(error);
            res.status(500).send({ error });
          });
      } else {
        console.log(`User [ ${req.body.username} ] has already registered.`);
        res.status(404).json({ error: 'DuplicateUsername' });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ error });
    });
});

// Login
router.post('/login', async (req, res) => {
  try {
    const doc = await User.findOne({
      username: req.body.username,
      password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
    });
    if (doc !== null) {
      console.log(`User [ ${req.body.username} ] login successfully.`);
      const token = jwt.sign({ userId: doc._id }, cfg.token.secret, { expiresIn: cfg.token.maxAge });
      res.json({ token });
    } else {
      console.log(`User [ ${req.body.username} ] login error.`);
      res.status(404).json({ error: 'LoginError' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

// Verify token of logged user
router.post('/token-verify', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.auth, cfg.token.secret);
    const { username } = await User.findById(decoded.userId);
    console.log(`User [ ${username} ] login with token successfully.`);
    res.json({ username });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

module.exports = router;
