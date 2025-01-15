const mongoose = require("mongoose");

const connectToDatabase = async () => {
  const MONGO_URL =
    process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/mentorConnect3";
  try {
    await mongoose.connect(MONGO_URL); // Removed deprecated options
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the application if the database connection fails
  }
};

module.exports = connectToDatabase;
