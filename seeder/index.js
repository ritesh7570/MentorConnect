const mongoose = require("mongoose");
const mentorSeeder = require("./mentorSeeder");
const menteeSeeder = require("./menteeSeeder");
const adminSeeder = require("./adminSeeder");

// Database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/mentorConnect3"; // Replace with your DB URL

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit if connection fails
  });

// Run all seeders
const runSeeders = async () => {
  try {
    console.log("Starting the seeding process...");

    // Run each seeder here
    // await mentorSeeder();
    console.log("Mentor seeding completed.");

    // await menteeSeeder();
    console.log("Mentee seeding completed.");

    // await adminSeeder();
    // console.log("Admin seeding completed.");

    console.log("All seeders executed successfully.");
  } catch (err) {
    console.error("Error running seeders:", err);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the seeders
runSeeders();
