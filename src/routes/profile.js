const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateUpdateProfileData } = require("../utils/validation");
const validator = require("validator");
const profileRouter = express.Router();

// Profile of logined in user
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

// Update Profile of logined in user
profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    // if (!validateUpdateProfileData(req)) {
    //   throw new Error("Invalid updates! You can only update allowed fields.");
    // }
    const { isValid, invalidFields } = validateUpdateProfileData(req);

    if (!isValid) {
      throw new Error(
        `You are not allowed to update: ${invalidFields.join(", ")}`
      );
    }
    const loggedInUser = req.user;
    const updates = Object.keys(req.body);
    updates.forEach((update) => (loggedInUser[update] = req.body[update]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile updated successfully...`,
      user: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

// Update Password of logined in user
profileRouter.patch("/profile/update/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { newPassword } = req.body;
    if (!newPassword) {
      throw new Error("New Password are required.");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please provide a strong password.");
    }
    const hashedPassword = await require("bcryptjs").hash(newPassword, 10);

    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your password updated successfully...`,
      user: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
