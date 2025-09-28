const express = require("express");
const connectDatabase = require("./config/database");

const app = express();

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

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
