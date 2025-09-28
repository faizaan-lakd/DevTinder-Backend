const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      minLength: [3, "First name must be at least {MINLENGTH} characters."],
      maxLength: [25, "First name cannot exceed {MAXLENGTH} characters."],
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      maxLength: [25, "Last name cannot exceed {MAXLENGTH} characters."],
      required: [true, "Last name is required."],
      minLength: [3, "Last name must be at least {MINLENGTH} characters."],
      maxLength: [25, "Last name cannot exceed {MAXLENGTH} characters."],
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: [true, "User already exists."],
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address.");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password is not strong enouth. Please include uppercase lowercase, number, and symbol in your passsword."
          );
        }
      },
    },
    age: {
      type: Number,
      min: [18, "Age must be at least {MIN}."],
      max: [150, "Age cannot exceed {MAX}."],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "Please enter a valid gender.",
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCpY5LtQ47cqncKMYWucFP41NtJvXU06-tnQ&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a deafault about section of the user.",
      maxLength: [
        200,
        "About section description cannot exceed {MAXLENGTH} characters.",
      ],
    },
    skills: {
      type: [String],
      validate: {
        validator: function (skillsArr) {
          const nonEmptySkillsArr = skillsArr.filter(
            (s) => s && s.trim() != ""
          );
          const uniqueSkillsArr = new Set(
            nonEmptySkillsArr.map((s) => s.trim().toLowerCase())
          );
          return (
            nonEmptySkillsArr.length === skillsArr.length &&
            uniqueSkillsArr.size === skillsArr.length
          );
        },
        message: "Skills must not be empty or contain duplicate values.",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "SAlt@123", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(
    userInputPassword,
    user.password
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
