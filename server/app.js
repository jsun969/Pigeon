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
const adminRoutes = require('./routes/admin.js');
app.use('/user', userRoutes);
app.use('/device', deviceRoutes);
app.use('/admin', adminRoutes);

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
const Message = require('./models/message');

const io = require('socket.io')(server, {
  cors: {
    origins: cfg.app.origins,
    credentials: true,
  },
});

// 在线设备缓存
let onlineDevices = [];
let onlineUsers = [];
io.on('connection', (socket) => {
  console.log(`[ ${socket.id} ] connect`);

  // 设备上线
  socket.on('deviceCreated', async ({ code }) => {
    const codeStr = code.toString();
    socket.join(codeStr);
    onlineDevices.push({ code: codeStr, id: socket.id });
    const devicesDocs = await Device.findOne({ code });
    if (devicesDocs) {
      socket
        .to(devicesDocs.users.map(({ username }) => username))
        .emit('deviceOnline', { code });
    }
    console.log(`Device [ ${socket.id} ] created with code [ ${code} ]`);
  });

  // 用户上线
  socket.on('userCreated', async ({ auth }) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { username } = await User.findById(userId);
    socket.join(username);
    onlineUsers.push({ username, id: socket.id });
    console.log(`User [ ${socket.id} ] created with name [ ${username} ]`);
  });

  // 设备下线
  socket.on('disconnect', async () => {
    if (onlineDevices.some(({ id }) => id === socket.id)) {
      console.log(
        `Device [ ${
          onlineDevices.find(({ id }) => id === socket.id).code
        } ] destroy`
      );
      const { users } = await Device.findOne({
        code: onlineDevices.find(({ id }) => id === socket.id).code,
      });
      if (!users.length) {
        await Device.findOneAndRemove({
          code: onlineDevices.find(({ id }) => id === socket.id).code,
        });
        console.log(
          `Device [ ${
            onlineDevices.find(({ id }) => id === socket.id).code
          } ] destroy without user`
        );
      } else {
        socket.to(users.map(({ username }) => username)).emit('deviceOffline', {
          code: onlineDevices.find(({ id }) => id === socket.id).code,
        });
      }
      onlineDevices.splice(
        onlineDevices.findIndex(({ id }) => id === socket.id),
        1
      );
    } else if (onlineUsers.some(({ id }) => id === socket.id)) {
      onlineUsers.splice(
        onlineUsers.findIndex(({ id }) => id === socket.id),
        1
      );
    }
  });

  // 添加新设备
  socket.on('addDevice', async ({ auth, code, remarkName }) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { fullName, username } = await User.findById(userId);
    socket
      .to(code)
      .emit('deviceAddReq', { fullName, remarkName, id: userId, username });
    console.log(`User [ ${username} ] want to connect Device [ ${code} ]`);
  });

  // 新设备是否同意被添加
  socket.on('allowAddDevice', async ({ result, code, remarkName, id }) => {
    const { fullName, username } = await User.findById(id);
    if (result) {
      // 将用户姓名存入设备数据库
      await Device.findOneAndUpdate(
        { code },
        { $push: { users: { fullName, username } } }
      );
      // 将设备代码存入用户数据库
      await User.findByIdAndUpdate(id, {
        $push: { devices: { code, name: remarkName } },
      });
      console.log(
        `Add Device [ ${code} ] by User [ ${username} ] successfully!`
      );
    } else {
      console.log(`Device [ ${code} ] reject User [ ${username} ] add request`);
    }
    socket.to(username).emit('askDeviceRes', { result, code });
  });

  // 获取全部在线设备
  socket.on('getDevice', async ({ auth }, callback) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { devices, username } = await User.findById(userId);
    callback(
      devices
        .map(({ code, name }) => ({
          code,
          name,
          status: onlineDevices.some(({ code: codeTmp }) => codeTmp === code)
            ? 0
            : 1,
        }))
        .reverse()
    );
    console.log(`User [ ${username} ] get devices successfully!`);
  });

  // 设备删除绑定用户
  socket.on('removeUser', async ({ name, code }) => {
    await Device.updateOne({ code }, { $pull: { users: { username: name } } });
    await User.updateOne({ username: name }, { $pull: { devices: { code } } });
    socket.to(name).emit('removeUserHotUpdate', { code });
    console.log(`Device [ ${code} ] remove user [ ${name} ]`);
  });

  // 用户删除设备
  socket.on('removeDevice', async ({ auth, code }) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { username } = await User.findById(userId);
    await User.updateOne({ username }, { $pull: { devices: { code } } });
    await Device.updateOne({ code }, { $pull: { users: { username } } });
    socket.to(code).emit('removeDeviceHotUpdate', { name: username });
    console.log(`User [ ${username} ] remove device [ ${code} ]`);
  });

  // 发送消息
  socket.on(
    'sendMessage',
    async ({ auth, codes, message }, callbackDatabaseData) => {
      const { userId } = jwt.verify(auth, cfg.token.secret);
      const { username, fullName } = await User.findById(userId);
      const devices = await Promise.all(
        codes.map(async (code) => ({
          _id: await Device.findOne({ code }),
          code,
        }))
      );
      const messageDatabase = new Message({
        time: Date.now(),
        fullName,
        username,
        devices,
        message,
        status: true,
      });
      const { _id: id, time } = await messageDatabase.save();
      callbackDatabaseData({ id, time });
      socket
        .to(codes)
        .emit('sendMessageToDevice', { message, from: fullName, id, username });
      console.log(
        `User [ ${username} ] send [ ${message} ] to [ ${codes} ] with id [ ${id} ]`
      );
    }
  );

  // 关闭消息
  socket.on('messageClosed', async ({ id }) => {
    const { message, username } = await Message.findByIdAndUpdate(id, {
      status: false,
    });
    socket.to(username).emit('messageClosedToUser', { id });
    console.log(`Message [ ${message} ] is closed`);
  });

  // 修改姓名
  socket.on('changeFullName', async ({ auth, newFullName }) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { username, devices } = await User.findById(userId);
    await Message.updateMany({ username }, { fullName: newFullName });
    await Device.updateMany(
      { 'users.username': username },
      { $set: { 'users.$.fullName': newFullName } }
    );
    await User.findByIdAndUpdate(userId, { fullName: newFullName });
    socket
      .to(devices.map(({ code }) => code))
      .emit('changeFullNameHotUpdate', { username, newFullName });
    console.log(`User [ ${username} ] change full name successfully!`);
  });
});

// 控制台输入
const readline = require('readline');
const crypto = require('crypto');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const InviteCode = require('./models/inviteCode');

rl.on('line', async (input) => {
  console.log('##############################');
  switch (input.split(' ')[0]) {
    case 'gen-icodes':
      // 生成邀请码
      const count = +input.split(' ')[1];
      let randStrArr = [];
      for (let i = 0; i < count; i++) {
        let isInviteCodeDuplicate, randStr;
        do {
          randStr = crypto.randomBytes(20).toString('hex');
          isInviteCodeDuplicate = await InviteCode.findById(randStr);
        } while (isInviteCodeDuplicate);
        const inviteCode = new InviteCode({
          _id: randStr,
          username: null,
        });
        await inviteCode.save();
        randStrArr.push(randStr);
      }
      console.log(randStrArr);
      break;
    case 'icodes':
      // 获取邀请码
      let docsArr = [];
      const docs = await InviteCode.find();
      if (input.split(' ')[1] === 'unused') {
        docsArr = docs
          .filter(({ username }) => username === null)
          .map(({ _id: code }) => code);
      } else if (input.split(' ')[1] === 'used') {
        docsArr = docs
          .filter(({ username }) => username !== null)
          .map(({ _id: code }) => code);
      } else {
        docsArr = docs.map(({ _id: code, username }) => ({ code, username }));
      }
      console.log(docsArr);
      break;
    case 'user':
      // 获取在线用户
      console.log(onlineUsers.map(({ username }) => username));
      break;
    case 'device':
      // 获取在线设备
      console.log(onlineDevices.map(({ code }) => code));
      break;
    default:
      console.log('Input not found');
      break;
  }
  console.log('##############################');
});
