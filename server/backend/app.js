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

const io = require('socket.io')(server, {
  cors: {
    origins: cfg.app.origins,
    credentials: true,
  },
});

io.on('connection', socket => {
  console.log(`[ ${socket.id} ] connect`);
  // 设备上线
  socket.on('newDeviceCreated', ({ code }) => {
    socket.join(`${code}`);
    console.log(`Device [ ${socket.id} ] created with code [ ${code} ]`);
  });
  // 用户上线
  socket.on('newUserCreated', ({ auth }) => {
    socket.join(`${auth}`);
    console.log(`User [ ${socket.id} ] created with auth [ ${auth} ]`);
  });
  // 添加新设备
  socket.on('addDevice', async ({ auth, code }) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { fullName, username } = await User.findById(userId);
    // 给指定设备发送请求
    socket.to(`${code}`).emit('deviceAddReq', { fullName, auth });
    console.log(`User [ ${username} ] want to connect Device [ ${code} ]`);
  });
  // 新设备是否同意被添加
  socket.on('allowAddDevice', ({ result, code, userAuth }) => {
    socket.to(`${userAuth}`).emit('askDeviceRes', { result, code });
  });
});
