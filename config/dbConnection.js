const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_STRING);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
