const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("First name is required.");
  } else if (!lastName) {
    throw new Error("Last name is required.");
  } else if (!emailId) {
    throw new Error("Email ID is required.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password is not strong enouth. Please include uppercase lowercase, number, and symbol in your passsword."
    );
  }
};

module.exports = { validateSignUpData };
