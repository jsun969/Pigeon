const cfg = require('./config.js');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const port = cfg.app.port;

const whitelist = cfg.app.origins;
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) return callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
};
app.use(cors(corsOptions));

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
  console.log(`User[ ${socket.id} ] connect`);
  // 添加设备请求
  socket.on('addDevice', async ({ auth, code }) => {
    const { userId } = jwt.verify(auth, cfg.token.secret);
    const { fullName, username } = await User.findById(userId);
    console.log(`User [ ${username} ] want to connect Device [ ${code} ]`);
    // socket.emit('askDeviceAdd', { user, code });
  });
});
