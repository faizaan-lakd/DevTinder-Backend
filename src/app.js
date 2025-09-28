const express = require("express");
const connectDatabase = require("./config/database");
const bcrypt = require("bcrypt");

const {
  validateSignUpData,
  validateLoginData,
} = require("./utils/validations");
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

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();

    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    validateLoginData(req);

    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login Successful!");
    } else {
      res.status(400).send("Invalid credentials.");
    }
  } catch (err) {
    res.status(400).send("Invalid credentials.");
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
