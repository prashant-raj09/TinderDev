const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestsRouter = express.Router();

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const fromUserId = req.user._id;

      const ALLOWED_STATUS = ["ignored", "interested"];

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error(
          "Invalid status value. Allowed values are: " +
            ALLOWED_STATUS.join(", ")
        );
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res
          .status(404)
          .send("The user you are trying to connect with does not exist.");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send(
            "A connection request already exists between you and this user."
          );
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.status(201).json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        request: data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

requestsRouter.post(
  "/reques/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      const ALLOWED_STATUS = ["accepted", "rejected"];

      if (!ALLOWED_STATUS.includes(status)) {
        return res
          .status(400)
          .send(
            "Invalid status value. Allowed values are: " +
              ALLOWED_STATUS.join(", ")
          );
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .send(
            "No pending connection request found with the provided ID for review."
          );
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `You have ${status} the connection request.`,
        request: data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

module.exports = requestsRouter;
