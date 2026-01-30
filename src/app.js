const express = require("express");
const connectDB = require("./config/database");
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");


// CORS Middleware -> If frontend and backend are on different domains or ports
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

// Middleware -> From Postman we get data in the form of JSON so this middleware convert the JSON in JS object
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

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
