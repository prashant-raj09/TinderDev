const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwtToken = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
// Middleware -> From Postman we get data inthe form of JSON so this middleware convert the JSON in JS object
app.use(express.json());
app.use(cookieParser());
// Sign Up Route
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid login credentials.");
    } else {
      // Generate JWT token
      const token = await jwtToken.sign({ _id: user._id }, "TINDER@DEV$301", {
        expiresIn: "1d",
      });
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

// Profile of logined in user
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established....");

    app.listen(7777, () => {
      console.log("Server is runinng on port number 7777 ....");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!!");
    console.log(err);
  });
