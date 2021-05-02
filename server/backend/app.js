const cfg = require('./config.js');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const port = cfg.app.port;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRoutes = require('./routes/user.js');
const deviceRoutes = require('./routes/device.js');
app.use('/user', userRoutes);
app.use('/device', deviceRoutes);

mongoose.connect(
  cfg.db.username === ''
    ? `mongodb://${cfg.db.host}:${cfg.db.port}/${cfg.db.name}`
    : `mongodb://${cfg.db.username}:${cfg.db.password}@${cfg.db.host}:${cfg.db.port}/${cfg.db.name}`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;

// Socket通讯相关 无法放在路由文件中 以后会改
const User = require('./models/user');
const Device = require('./models/device');

const io = require('socket.io')(server, {
  cors: {
    origins: cfg.app.origins,
    credentials: true,
  },
});

// 在线设备缓存
let onlineDevice = [];
io.on('connection', socket => {
  console.log(`[ ${socket.id} ] connect`);
  // 设备上线
  socket.on('newDeviceCreated', ({ code }) => {
    socket.join(`${code}`);
    onlineDevice.push(code);
    console.log(`Device [ ${socket.id} ] created with code [ ${code} ]`);
  });
  // 用户上线
  socket.on('newUserCreated', ({ auth }) => {
    socket.join(`${auth}`);
    console.log(`User [ ${socket.id} ] created with auth [ ${auth} ]`);
  });
  // 添加新设备
  socket.on('addDevice', async ({ auth, code, remarkName }) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { fullName, username } = await User.findById(userId);
    // 给指定设备发送请求
    socket.to(`${code}`).emit('deviceAddReq', { fullName, remarkName, auth });
    console.log(`User [ ${username} ] want to connect Device [ ${code} ]`);
  });
  // 新设备是否同意被添加
  socket.on('allowAddDevice', async ({ result, code, remarkName, userAuth }) => {
    if (result) {
      const { userId } = jwt.verify(userAuth, cfg.token.secret);
      const { fullName, username } = await User.findById(userId);
      // 将用户姓名存入设备数据库
      await Device.findOneAndUpdate({ code }, { $push: { users: fullName } });
      // 将设备代码存入用户数据库
      await User.findByIdAndUpdate(userId, { $push: { devices: { code, name: remarkName } } });
      console.log(`Add Device [ ${code} ] by User [ ${username} ] successfully!`);
    } else {
      console.log(`Device [ ${code} ] reject User [ ${username} ] add request`);
    }
    socket.to(`${userAuth}`).emit('askDeviceRes', { result, code });
  });
  // 获取全部在线设备
  socket.on('getDevice', async ({ auth }, fn) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { devices, username } = await User.findById(userId);
    fn(devices.map(({ code, name }) => ({ code, name, status: onlineDevice.includes(code) ? 0 : 1 })));
    console.log(`User ${username} get devices successfully!`);
  });
});
