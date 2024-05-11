const express = require("express");
const { PORT = 3000 } = process.env;

const app = express();

app.get("/info", (req, res) => {
  res.json({ message: "success" });
});

app.listen(PORT, () => console.log("server listen on port " + PORT));
