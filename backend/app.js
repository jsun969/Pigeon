const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRoutes = require("./routes/users.js");
app.use("/users", userRoutes);

mongoose.connect("mongodb://127.0.0.1/pigeon")

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
