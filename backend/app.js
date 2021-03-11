const cfg = require("./config.js");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = cfg.app.port;

const whitelist = cfg.app.origin;
const corsOptions = {
  origin: (origin, callback) => (whitelist.indexOf(origin) !== -1 ? callback(null, true) : callback(new Error("Not allowed by CORS"))),
};
// app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRoutes = require("./routes/users.js");
app.use("/users", userRoutes);

mongoose.connect(
  cfg.db.username === ""
    ? `mongodb://${cfg.db.host}:${cfg.db.port}/${cfg.db.name}`
    : `mongodb://${cfg.db.username}:${cfg.db.password}@${cfg.db.host}:${cfg.db.port}/${cfg.db.name}`
);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
