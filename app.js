require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected."));
app.get("/info", (req, res) => {
  res.json({ message: "success" });
});

app.post("/register", (req, res) => {
  res.json(req.body);
});

app.listen(PORT, () => console.log("server listen on port " + PORT));
