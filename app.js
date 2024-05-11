const express = require("express");
const cors = require("cors");
const { PORT = 3000 } = process.env;

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

app.post("/register", (req, res) => {
  res.json(req.body);
});

app.listen(PORT, () => console.log("server listen on port " + PORT));
