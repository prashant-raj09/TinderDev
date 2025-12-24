const mongoose = require("mongoose");

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
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 50,
      required: true,
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
    profile: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/12226/12226076.png",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
