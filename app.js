require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const { PORT = 3000, PASSWORD_SALT, MONGO_URL } = process.env;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/info", (req, res) => {
  res.json({ message: "success" });
});

app.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;
    const password = bcrypt.hashSync(req.body.password);
    const createdUser = await User.create({ name, email, password });
    res.json(createdUser);
  } catch (e) {
    res.status(422).json({ e });
  }
});

(async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("DB connected.");
  } catch (error) {
    console.log("DB connection failed.");
    console.error(error);
  }
  app.listen(PORT, () => console.log("server listen on port " + PORT));
})();
