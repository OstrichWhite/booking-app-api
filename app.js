require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { PORT = 3000, JWT_SECRET, MONGO_URL } = process.env;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/info", (req, res) => {
  res.json({ message: "success" });
});
const verify = ({ req, res, user }) => {
  const passOk = bcrypt.compareSync(req.body.password, user.password);
  if (passOk) {
    jwt.sign({ id: user._id }, JWT_SECRET, {}, (err, token) => {
      res.cookie("token", token).json({ message: "Login success.", user });
    });
  } else {
    res.status(422).json({ message: "Email or password is wrong." });
  }
};
const notFound = (res) => res.status(404).json({ message: "notFound" });
app.post("/login", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  user ? verify({ req, res, user }) : notFound(res);
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

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, JWT_SECRET, {}, async (err, user) => {
      if (err) throw err;
      const userData = await User.findById(user.id);
      res.json({ user: userData });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

const main = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("DB connected.");
  } catch (error) {
    console.log("DB connection failed.");
    console.error(error);
  }
  app.listen(PORT, () => console.log("server listen on port " + PORT));
};

main();
