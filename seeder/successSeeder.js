const mongoose = require("mongoose");
const Success = require("../models/success");
const User = require("../models/user");
const logger = require("../utils/logger")("successSeeder"); // Import your logger
const { successValidate } = require("../schemas/successSchema");
const successData = [
  // Existing data
  {
    title: "Achieved Promotion at Work",
    description:
      "After years of hard work and dedication, I was promoted to a senior role at my company.",
    image: {
      url: "https://images.pexels.com/photos/3184305/pexels-photo-3184305.jpeg",
      filename: "promotion_work.jpg",
    },
  },
  {
    title: "Completed Marathon in Mumbai",
    description: "Ran the Mumbai Marathon and achieved a personal best time.",
    image: {
      url: "https://images.pexels.com/photos/2724747/pexels-photo-2724747.jpeg",
      filename: "mumbai_marathon.jpg",
    },
  },
  {
    title: "Launched a Startup in Bangalore",
    description:
      "Founded a tech startup in Bangalore focusing on AI solutions, and received initial funding within the first month.",
    image: {
      url: "https://images.pexels.com/photos/3183182/pexels-photo-3183182.jpeg",
      filename: "startup_bangalore.jpg",
    },
  },
  {
    title: "Created a Mobile App for Wellness Tracking",
    description:
      "Developed an app for tracking and improving overall wellness and health.",
    image: {
      url: "https://images.pexels.com/photos/4612294/pexels-photo-4612294.jpeg",
      filename: "wellness_tracking_app.jpg",
    },
  },
];

async function successSeeder() {
  try {
    // Clear existing success stories
    await Success.deleteMany({});
    logger.info("Existing success stories cleared.");

    // Fetch all users
    const users = await User.find({});
    const userIds = users.map((user) => user._id);

    if (userIds.length === 0) {
      logger.warn("No users found to assign success stories to.");
      return;
    }

    for (const successStory of successData) {
      // Pick a random user as the owner of the success story
      const randomUser = users[Math.floor(Math.random() * users.length)];
      successStory.owner = randomUser._id;

      // Randomly assign some users to like the success story
      const randomLikes = [];
      const numberOfLikes = Math.floor(Math.random() * userIds.length); // Random number of likes
      for (let i = 0; i < numberOfLikes; i++) {
        const randomLiker = userIds[Math.floor(Math.random() * userIds.length)];
        if (!randomLikes.includes(randomLiker)) {
          randomLikes.push(randomLiker);
        }
      }
      successStory.likes = randomLikes;

      // Create the success story
      const newSuccessStory = await Success.create(successStory);
      logger.info(
        `Success story "${successStory.title}" added, created by ${randomUser.username}.`
      );

      // Optionally, if you want to handle other relationships or further modifications, you can do so here.
    }

    logger.info("Success stories seeded successfully!");
  } catch (error) {
    logger.error("Error seeding success stories:", error);
  }
}

module.exports = successSeeder;
