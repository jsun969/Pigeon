const cfg = require('../config');

const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');
const Device = require('../models/device');
const Message = require('../models/message');

// 获取设备代号
router.get('/data', async (req, res) => {
  try {
    // 判断设备是否已注册
    const isPcIdDuplicate = await Device.findById(crypto.createHash('sha256').update(req.query.pcId).digest('hex'));
    if (isPcIdDuplicate) {
      const messageDocs = await Message.find();
      res.json({
        code: isPcIdDuplicate.code,
        messages: messageDocs
          .filter(({ devices }) =>
            devices.map(({ id }) => id).includes(crypto.createHash('sha256').update(req.query.pcId).digest('hex'))
          )
          .map(({ time, fullName, message, username }) => ({
            time,
            fullName,
            message,
            username,
          })),
        users: isPcIdDuplicate.users.map(({ fullName, username }) => ({ fullName, username })),
      });
      console.log(`Device [ ${isPcIdDuplicate.code} ] open the client and get messages`);
    } else {
      // 创建新设备
      let isCodeDuplicate, code;
      do {
        // 生成一个六位设备代码
        code = Math.floor(100000 + Math.random() * 900000);
        // 判断生成的设备代码是否重复
        isCodeDuplicate = await Device.findOne({ code });
      } while (isCodeDuplicate);
      const device = new Device({
        // 将客户端MAC地址+硬盘标识符生成的pcID加密
        _id: crypto.createHash('sha256').update(req.query.pcId).digest('hex'),
        code,
        users: [],
      });
      const deviceRes = await device.save();
      const messageDocs = await Message.find();
      res.json({
        code,
        messages: messageDocs
          .filter(({ devices }) =>
            devices.map(({ _id: id }) => id).includes(crypto.createHash('sha256').update(req.query.pcId).digest('hex'))
          )
          .map(({ time, fullName, message, username }) => ({
            time,
            fullName,
            message,
            username,
          })),
        users: [],
      });
      console.log(`Device [ ${deviceRes.code} ] register successfully!`);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// 修改设备备注名
router.patch('/remarkName', async (req, res) => {
  try {
    const { userId } = jwt.verify(req.headers.auth, cfg.token.secret);
    const { username } = await User.findById(userId);
    await User.updateOne({ _id: userId, 'devices.code': req.body.code }, { $set: { 'devices.$.name': req.body.name } });
    console.log(`User [ ${username} ] modify Device [ ${req.body.code} ] name to [ ${req.body.name} ]`);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
