const cfg = require('../config');

const express = require('express');
const crypto = require('crypto');

const router = express.Router();

const Device = require('../models/device');

router.get('/code', async (req, res) => {
  try {
    // 判断设备是否已注册
    const isPcIdDuplicate = await Device.findById(crypto.createHash('sha256').update(req.query.pcID).digest('hex'));
    if (isPcIdDuplicate) {
      res.json({ code: isPcIdDuplicate.code });
      console.log(`Device [ ${isPcIdDuplicate.code} ] open the client`);
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
        _id: crypto.createHash('sha256').update(req.query.pcID).digest('hex'),
        code,
      });
      const deviceRes = await device.save();
      res.json({ code });
      console.log(`Device [ ${deviceRes.code} ] register successfully!`);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/add', async (req, res) => {});

module.exports = router;
