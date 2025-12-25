const jwtToken = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    if (!token) {
      throw new Error("Please login first...");
    }

    const decodedObj = await jwtToken.verify(token, "TINDER@DEV$301");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found...");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized : " + err.message);
  }
};

module.exports = { userAuth };