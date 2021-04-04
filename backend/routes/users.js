const cfg = require('../config.js');

const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const router = express.Router();

const InviteCode = require('../models/inviteCode');
const User = require('../models/user');

// 生成邀请码 请求格式应为/?count=<个数>
router.put('/invite-codes', async (req, res) => {
  try {
    let randStrArr = [];
    for (let i = 0; i < req.query.count; i++) {
      const randStr = crypto.randomBytes(20).toString('hex');
      const inviteCode = new InviteCode({
        code: randStr,
        username: null,
      });
      await inviteCode.save();
      randStrArr.push(randStr);
    }
    console.log(`Generate ${req.query.count} invite codes successfully!`);
    console.log(randStrArr);
    res.json(randStrArr);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

// 获取所有邀请码及其注册用户名
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

// 注册(屎山)
router.post('/register', async (req, res) => {
  try {
    const nameDoc = await User.findOne({ username: req.body.username });
    if (!nameDoc) {
      const codeDoc = await InviteCode.findOne({ code: req.body.inviteCode });
      if (!codeDoc) {
        // 邀请码错误
        console.log(`User [ ${req.body.username} ] try to register, but the invite code is wrong.`);
        res.status(404).json({ error: 'InviteCodeNotFound' });
      } else if (codeDoc.username) {
        // 邀请码已被使用
        console.log(`User [ ${req.body.username} ] try to register, but the invite code has been used.`);
        res.status(404).json({ error: 'InviteCodeIsUsed' });
      } else {
        // 注册成功
        await InviteCode.findOneAndUpdate({ code: req.body.inviteCode }, { username: req.body.username });
        const user = new User({
          fullName: req.body.fullName,
          username: req.body.username,
          password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
        });
        userRes = await user.save();
        console.log(`User [ ${userRes.username} ] register successfully!`);
        res.sendStatus(201);
      }
    } else {
      // 用户名重复
      console.log(`User [ ${req.body.username} ] has already registered.`);
      res.status(404).json({ error: 'DuplicateUsername' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

// 登陆
router.post('/login', async (req, res) => {
  try {
    const doc = await User.findOne({
      username: req.body.username,
      password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
    });
    if (doc) {
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

// 验证用户的Token
router.post('/token-verify', async (req, res) => {
  try {
    const { userId } = jwt.verify(req.body.auth, cfg.token.secret);
    const { username, fullName } = await User.findById(userId);
    console.log(`User [ ${username} ] login with token successfully.`);
    res.json({ fullName });
  } catch (error) {
    res.status(403).send({ error });
  }
});

// 修改密码
router.patch('/password', async (req, res) => {
  try {
    const { userId } = jwt.verify(req.headers.auth, cfg.token.secret);
    const { password: oldPassword, username } = await User.findById(userId);
    if (oldPassword === crypto.createHash('sha256').update(req.body.oldPassword).digest('hex')) {
      await User.findByIdAndUpdate(userId, { password: crypto.createHash('sha256').update(req.body.newPassword).digest('hex') });
      console.log(`User [ ${username} ] change password successfully.`);
      res.sendStatus(200);
    } else {
      // 旧密码错误
      console.log(`User [ ${username} ] try to change password but old password is wrong.`);
      res.status(404).json({ error: 'OldPasswordError' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

// 修改姓名
router.patch('/full-name', async (req, res) => {
  try {
    const { userId } = jwt.verify(req.headers.auth, cfg.token.secret);
    await User.findByIdAndUpdate(userId, { fullName: req.body.newFullName });
    const { username } = await User.findById(userId);
    console.log(`User [ ${username} ] change full name successfully.`);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

module.exports = router;
