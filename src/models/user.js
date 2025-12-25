const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwtToken = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxLength: 50,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      maxLength: 50,
      trim: true,
    },
    emailId: {
      type: String,
      maxLength: 50,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong " + value);
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid...");
        }
      },
    },
    about: {
      type: String,
      default: "This is deafult about section....",
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/12226/12226076.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is invalid " + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Genearte JWT Token
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwtToken.sign({ _id: user._id }, "TINDER@DEV$301", {
    expiresIn: "1d",
  });
  return token;
};

// Validate Password
userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;
  const hashedPassword = user.password;
  const isPasswordMatch = await bcrypt.compare(inputPassword, hashedPassword);
  return isPasswordMatch;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
