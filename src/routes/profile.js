const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
  validateProfileEditData,
  validateProfileEditPassword,
} = require("../utils/validations");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const validation = validateProfileEditData(req);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.send({
      message: loggedInUser.firstName + ", your profile has been updated.",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    const validation = validateProfileEditPassword(req);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const isCurrentPasswordValid = await loggedInUser.validatePassword(
      currentPassword
    );
    if (!isCurrentPasswordValid) {
      return res
        .status(400)
        .json({ message: "Current password is not valid." });
    }

    const isNewPasswordSameAsCurrent = await loggedInUser.validatePassword(
      newPassword
    );
    if (isNewPasswordSameAsCurrent) {
      return res
        .status(400)
        .json({ message: "New password cannot be same as old password." });
    }

    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();

    return res.json({ message: "Your password has been changed." });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
