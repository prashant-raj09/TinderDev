const express = require("express");
const { validateSignUpData, validateLoginData } = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");

// Sign Up Route
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate incoming data
    validateSignUpData(req);

    // Destructure the request body
    const { firstName, lastName, emailId, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Send a success response
    res.send("User added successfully..." + user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});


// Login Route
authRouter.post("/login", async (req, res) => {
  try {
    // Validate incoming data
    validateLoginData(req);

    // Destructure the request body
    const { emailId, password } = req.body;

    // Find the user by emailId
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid login credentials.");
    }

    // Compare the provided password with the stored hashed password and validateaPassword is async function in user model
    const isPasswordMatch = await user.validatePassword(password);

    if (!isPasswordMatch) {
      throw new Error("Invalid login credentials.");
    } else {
      // Generate JWT token and getJWT is async function in user model
      const token = await user.getJWT();
      // Set the token in cookies
      res.cookie("token", token, {
        expires: new Date(Date.now() + 86400000),
        httpOnly: true,
      });

      res.send("Login Successful...");
    }
  } catch (err) {
    res.status(400).send("Login Failed " + err.message);
  }
});


module.exports = authRouter;