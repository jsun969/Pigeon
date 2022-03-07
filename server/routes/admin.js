const cfg = require('../config');

const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const router = express.Router();

const InviteCode = require('../models/inviteCode');
const Message = require('../models/message');

const auth = (req, res, next) => {
  let jwtResult;
  try {
    const token = req.headers.authorization;
    jwtResult = jwt.verify(token, cfg.token.secret);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (jwtResult.old !== 'pigeon') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

router.post('/login', (req, res) => {
  if (req.body.key !== cfg.admin.key) {
    return res.status(401).json({ message: 'WrongKey' });
  }
  const token = jwt.sign({ old: 'pigeon' }, cfg.token.secret, {
    expiresIn: cfg.token.maxAge,
  });
  return res.json({ token });
});

router.get('/init', auth, (req, res) => {
  return res.json({ status: true });
});

router.post('/invite-codes', auth, async (req, res) => {
  let inviteCodes = [];
  for (let i = 0; i < req.body.count; i++) {
    let isDuplicate, inviteCode;
    do {
      inviteCode = crypto.randomBytes(20).toString('hex');
      isDuplicate = await InviteCode.findById(inviteCode);
    } while (isDuplicate);
    const db = new InviteCode({
      _id: inviteCode,
      username: null,
    });
    await db.save();
    inviteCodes.unshift(inviteCode);
  }
  return res.status(201).json(inviteCodes);
});

router.get('/invite-codes', auth, async (req, res) => {
  const where = req.query.used && {
    username: req.query.used === 'true' ? { $ne: null } : null,
  };
  const data = await InviteCode.find(where)
    .sort({ createdAt: -1 })
    .select(['_id', 'username', 'updatedAt'])
    .limit(+req.query.take)
    .skip(+req.query.skip);
  const total = await InviteCode.countDocuments(where);
  return res.json({ data, total });
});

router.get('/messages', auth, async (req, res) => {
  const where = {};
  if (req.query.username) {
    where.username = req.query.username;
  }
  if (req.query.code) {
    where['devices.code'] = req.query.code;
  }
  console.log(where);
  const data = await Message.find(where)
    .sort({ time: -1 })
    .limit(+req.query.take)
    .skip(+req.query.skip);
  const total = await Message.countDocuments(where);
  return res.json({ data, total });
});

module.exports = router;
