const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwtToken = require("jsonwebtoken");

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
      const token = await jwtToken.sign({ _id: user._id }, "TINDER@DEV$301");
      // Set the token in cookies
      res.cookie("token", token);
      console.log("Token generated : ", token);
      res.send("Login Successful...");
    }
  } catch (err) {
    res.status(400).send("Login Failed " + err.message);
  }
});

// Profile of logined in user
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    console.log("Cookies : ", cookies);
    const { token } = cookies;
    if (!token) {
      throw new Error("Please login first...");
    }
    const decodedMessage = jwtToken.verify(token, "TINDER@DEV$301");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found...");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed.");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills must not be more than 10..");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully.");
  } catch (err) {
    res.status(400).send("Update Failed " + err.message);
  }
});

app.get("/signup", (req, res) => {
  res.send("Data recived....");
});

// Finding user by emailId

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.send("User not found...");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(404).send("Something Went Worng....");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error recived" + err.message);
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
