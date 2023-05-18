const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5021;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("toys Infinity is running server");
});

app.listen(port, () => {
  console.log(`toys is running on ${port}`);
});
