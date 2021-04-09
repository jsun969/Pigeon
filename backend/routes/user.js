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
    res.json(randStrArr);
    console.log(randStrArr);
    console.log(`Generate ${req.query.count} invite codes successfully!`);
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
    res.json(docsArr);
    console.log('Get all invite codes successfully!');
  } catch (error) {
    res.status(500).send({ error });
    console.error(error);
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
        res.status(404).json({ error: 'InviteCodeNotFound' });
        console.log(`User [ ${req.body.username} ] try to register, but the invite code is wrong.`);
      } else if (codeDoc.username) {
        // 邀请码已被使用
        res.status(404).json({ error: 'InviteCodeIsUsed' });
        console.log(`User [ ${req.body.username} ] try to register, but the invite code has been used.`);
      } else {
        // 注册成功
        await InviteCode.findOneAndUpdate({ code: req.body.inviteCode }, { username: req.body.username });
        const user = new User({
          fullName: req.body.fullName,
          username: req.body.username,
          password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
        });
        userRes = await user.save();
        res.sendStatus(201);
        console.log(`User [ ${userRes.username} ] register successfully!`);
      }
    } else {
      // 用户名重复
      res.status(404).json({ error: 'DuplicateUsername' });
      console.log(`User [ ${req.body.username} ] has already registered.`);
    }
  } catch (error) {
    res.status(500).send({ error });
    console.error(error);
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
      const token = jwt.sign({ userId: doc._id }, cfg.token.secret, { expiresIn: cfg.token.maxAge });
      res.json({ token });
      console.log(`User [ ${req.body.username} ] login successfully.`);
    } else {
      res.status(404).json({ error: 'LoginError' });
      console.log(`User [ ${req.body.username} ] login error.`);
    }
  } catch (error) {
    res.status(500).send({ error });
    console.error(error);
  }
});

// 验证用户的Token
router.post('/token-verify', async (req, res) => {
  try {
    const { userId } = jwt.verify(req.body.auth, cfg.token.secret);
    const { username, fullName } = await User.findById(userId);
    res.json({ fullName });
    console.log(`User [ ${username} ] login with token successfully.`);
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
      await User.findByIdAndUpdate(userId, {
        password: crypto.createHash('sha256').update(req.body.newPassword).digest('hex'),
      });
      res.sendStatus(200);
      console.log(`User [ ${username} ] change password successfully.`);
    } else {
      // 旧密码错误
      res.status(404).json({ error: 'OldPasswordError' });
      console.log(`User [ ${username} ] try to change password but old password is wrong.`);
    }
  } catch (error) {
    res.status(500).send({ error });
    console.error(error);
  }
});

// 修改姓名
router.patch('/full-name', async (req, res) => {
  try {
    const { userId } = jwt.verify(req.headers.auth, cfg.token.secret);
    await User.findByIdAndUpdate(userId, { fullName: req.body.newFullName });
    const { username } = await User.findById(userId);
    res.sendStatus(200);
    console.log(`User [ ${username} ] change full name successfully.`);
  } catch (error) {
    res.status(500).send({ error });
    console.error(error);
  }
});

module.exports = router;
