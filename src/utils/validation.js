const validator = require("validator");

// Function to validate sign-up data
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and Last name are required.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please provide a valid email address.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please provide a strong password.");
  }
};

// Function to validate login data
const validateLoginData = (req) => {
  const { emailId, password } = req.body;
  if (!emailId || !password) {
    throw new Error("Email and Password are required for login.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please provide a valid email address.");
  }
};

module.exports = { validateSignUpData, validateLoginData };
