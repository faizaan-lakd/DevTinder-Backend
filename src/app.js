const express = require("express");
const connectDatabase = require("./config/database");
const { validateSignUpData } = require("./utils/validations");
const User = require("./models/user");

const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const user = new User({
      firstName,
      lastName,
      emailId,
      password,
    });
    await user.save();

    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send(err.message);
  }
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
