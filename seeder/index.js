const mongoose = require("mongoose");
const mentorSeeder = require("./mentorSeeder");
const menteeSeeder = require("./menteeSeeder");
const adminSeeder = require("./adminSeeder");

// Use environment variable (for Railway or local)
const MONGO_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/mentorConnect3";

const runSeeders = async () => {
  try {
    // Avoid reconnecting if already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Seeder connected to MongoDB");
    }

    console.log("Starting the seeding process...");

    // Run each seeder as needed
    // await mentorSeeder();
    console.log("Mentor seeding completed.");

    // await menteeSeeder();
    console.log("Mentee seeding completed.");

    // await adminSeeder();
    console.log("Admin seeding completed.");

    console.log("All seeders executed successfully.");
  } catch (err) {
    console.error("Error running seeders:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Only run when called directly (not during deploy)
if (require.main === module) {
  runSeeders();
}
