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

const validateLoginData = (req) => {
  const { emailId, password } = req.body;

  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email ID is not valid.");
  } else if (!password) {
    throw new Error("Password cannot be empty.");
  }
};

const validateProfileEditData = (req) => {
  if (!req.body || typeof req.body !== "object") {
    return { valid: false, message: "Request body is missing or invalid." };
  }

  const ALLOWED_EDIT_FIELDS = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "skills",
    "gender",
    "age",
  ];

  const bodyKeys = Object.keys(req.body);
  if (bodyKeys.length === 0) {
    return { valid: false, message: "No fields provided to update." };
  }

  const isEditAllowed = bodyKeys.every(
    (field) =>
      ALLOWED_EDIT_FIELDS.includes(field) &&
      req.body[field] !== null &&
      req.body[field] !== undefined &&
      req.body[field] !== ""
  );

  if (isEditAllowed) {
    return { valid: true };
  } else {
    return { valid: false, message: "Invalid edit request." };
  }
};

const validateProfileEditPassword = (req) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return { valid: false, message: "Required fields missing." };
  }

  if (!validator.isStrongPassword(newPassword)) {
    return { valid: false, message: "New password is not strong enough." };
  }

  return { valid: true };
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validateProfileEditData,
  validateProfileEditPassword,
};
