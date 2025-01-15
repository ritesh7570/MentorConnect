const mongoose = require("mongoose");
// const mongoUrl = "mongodb://127.0.0.1:27017/connexus20";

// Mongoose Connection
// const MONGO_URL = process.env.MONGODB_URL;
const MONGO_URL = "mongodb://127.0.0.1:27017/mentorConnect3";


const logger = require("../utils/logger")("runAllSeeds"); // Import your logger

// Import seeders
const discussionSeeder = require("./discussionSeeder");
const discussionReviewSeeder = require("./discussionReviewSeeder");
const donationSeeder = require("./donationSeeder");
const groupSeeder = require("./groupSeeder");
const jobSeeder = require("./jobSeeder");
const jobReviewSeeder = require("./jobReviewSeeder");
const paymentSeeder = require("./paymentSeeder");
const quizSeeder = require("./quizSeeder");
const successSeeder = require("./successSeeder");
const successReviewSeeder = require("./successReviewSeeder");
const scheduleSeeder = require("./bookingSeeder");

async function runSeeds() {
  try {
    // Connect to MongoDB
    await mongoose
      .connect(MONGO_URL)
      .then(() => logger.info("Connectedd to MongoDB"))
      .catch((err) => logger.error("Error connecting to MongoDB:", err));

    logger.info("Connected to MongoDB");

    // Clear other collections
    await Promise.all([
      // require("../models/discussion").deleteMany({}),
      // require("../models/discussionReview").deleteMany({}),
      // require("../models/donation").deleteMany({}),
      // require("../models/group").deleteMany({}),
      // require("../models/job").deleteMany({}),
      // require("../models/jobReview").deleteMany({}),
      // require("../models/payment").deleteMany({}),
      // require("../models/quiz").deleteMany({}),
      // require("../models/success").deleteMany({}),
      // require("../models/successReview").deleteMany({}),
    ]);
    logger.info("Old data cleared.");
    console.log("old data cleared");

    // Seed in proper sequence
    await discussionSeeder();
    await discussionReviewSeeder();
    // await donationSeeder();
    // await groupSeeder();
    // await jobSeeder();
    // await jobReviewSeeder();
    // await paymentSeeder();
    // await quizSeeder();
    // await successSeeder();
    // await successReviewSeeder();
    // await scheduleSeeder();

    logger.info("Database successfully seeded!");
    console.log("Database successfully seeded!");
  } catch (error) {
    logger.error("Error running seeders:", error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
  }
}

runSeeds();
