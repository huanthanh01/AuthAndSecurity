const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.error("MONGO_URL is NOT defined in environment variables.");
      return;
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database Connection Error: ", error);
  }
};

module.exports = connectDB;
