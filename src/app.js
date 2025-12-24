const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

// Middleware -> From Postman we get data inthe form of JSON so this middleware convert the JSON in JS object
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added succesfully..." + user);
  } catch (err) {
    res.status(400).send("Error occured" + err.message);
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
