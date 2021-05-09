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
const Message = require('./models/message');

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
  socket.on('deviceCreated', async ({ code }) => {
    socket.join(code);
    onlineDevice.push({ code, id: socket.id });
    const { users } = await Device.findOne({ code });
    socket.to(users.map(({ username }) => username)).emit('deviceOnline', { code });
    console.log(`Device [ ${socket.id} ] created with code [ ${code} ]`);
  });

  // 用户上线
  socket.on('userCreated', async ({ auth }) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { username } = await User.findById(userId);
    socket.join(username);
    console.log(`User [ ${socket.id} ] created with name [ ${username} ]`);
  });

  // 设备下线
  socket.on('disconnect', async () => {
    if (onlineDevice.some(({ id }) => id === socket.id)) {
      console.log(`Device [ ${onlineDevice.find(({ id }) => id === socket.id).code} ] destroy`);
      const { users } = await Device.findOne({ code: onlineDevice.find(({ id }) => id === socket.id).code });
      socket
        .to(users.map(({ username }) => username))
        .emit('deviceOffline', { code: onlineDevice.find(({ id }) => id === socket.id).code });
      onlineDevice.splice(
        onlineDevice.findIndex(({ id }) => id === socket.id),
        1
      );
    }
  });

  // 添加新设备
  socket.on('addDevice', async ({ auth, code, remarkName }) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { fullName, username } = await User.findById(userId);
    socket.to(`${code}`).emit('deviceAddReq', { fullName, remarkName, auth, username });
    console.log(`User [ ${username} ] want to connect Device [ ${code} ]`);
  });

  // 新设备是否同意被添加
  socket.on('allowAddDevice', async ({ result, code, remarkName, userAuth }) => {
    const { userId } = jwt.verify(userAuth, cfg.token.secret);
    const { fullName, username } = await User.findById(userId);
    if (result) {
      // 将用户姓名存入设备数据库
      await Device.findOneAndUpdate({ code }, { $push: { users: { fullName, username } } });
      // 将设备代码存入用户数据库
      await User.findByIdAndUpdate(userId, { $push: { devices: { code, name: remarkName } } });
      console.log(`Add Device [ ${code} ] by User [ ${username} ] successfully!`);
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
          status: onlineDevice.some(({ code: codeTmp }) => codeTmp === code) ? 0 : 1,
        }))
        .reverse()
    );
    console.log(`User ${username} get devices successfully!`);
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
  socket.on('sendMessage', async ({ auth, codes, message }) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { username, fullName } = await User.findById(userId);
    const messagedb = new Message({
      time: Date.now(),
      username,
      devices: codes,
      message,
      // status: true,
    });
    const { _id: id } = await messagedb.save();
    socket.to(codes).emit('sendMessageToDevice', { message, from: fullName, id });
    console.log(`User [ ${username} ] send [ ${message} ] to [ ${codes} ] with id [ ${id} ]`);
  });
  // 消息被关闭 待完善
  // socket.on('messageClosed', async ({ id }) => {
  //   console.log(id);
  //   console.log(await Message.findById(id));
  // });
});
