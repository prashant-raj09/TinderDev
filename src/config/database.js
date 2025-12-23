/*
password : 4FrSQNUQSmqSMTMx
userName : prashantraj12313_db_user

mongodb+srv://prashantraj12313_db_user:4FrSQNUQSmqSMTMx@cluster0.fqfvyxl.mongodb.net/
mongodb+srv://prashantraj12313_db_user:<db_password>@cluster0.fqfvyxl.mongodb.net/
mongodb+srv://prashantraj12313_db_user:<db_password>@cluster0.fqfvyxl.mongodb.net/?appName=Cluster0
*/

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://prashantraj12313_db_user:4FrSQNUQSmqSMTMx@cluster0.fqfvyxl.mongodb.net/?appName=Cluster0"
  );
};
module.exports = connectDB;
