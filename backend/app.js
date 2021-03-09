const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRoutes = require("./routes/users.js");
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
