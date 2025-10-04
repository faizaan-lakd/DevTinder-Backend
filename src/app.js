const express = require("express");
const connectDatabase = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDatabase()
  .then(() => {
    console.log("Connected to Database.");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000.");
    });
  })
  .catch(() => {
    console.error("Error connecting to Database!");
  });
