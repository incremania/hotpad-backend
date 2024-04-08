require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const sendInfoRoute = require("./routes/sendInfo.js");
const User = require("./model/user");
const appNotFound = require("./appnotFound.js");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello this is from streetEasy");
});

app.use("/", sendInfoRoute);

mongoose.connect(process.env.MONGO_URI, {
  family: 4,
});



app.use(appNotFound);

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log("listening on port 3000");
});
