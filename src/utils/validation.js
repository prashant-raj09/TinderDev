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

const validateUpdateProfileData = (req)=>{
  const UPDATE_ALLOWED_FIELDS = ["firstName","lastName","age","gender","about","photoUrl","skills"];
  const updates = Object.keys(req.body);
  // const isValidOperation = updates.every((update) =>
  //   UPDATE_ALLOWED_FIELDS.includes(update)
  // );
  
  // return isValidOperation;

  const invalidFields = updates.filter(
    (field) => !UPDATE_ALLOWED_FIELDS.includes(field)
  );

  return {
    isValid: invalidFields.length === 0,
    invalidFields,
  };
}

module.exports = { validateSignUpData, validateLoginData, validateUpdateProfileData };
