const mongoose = require("mongoose");
const Donation = require("../models/donation");
const User = require("../models/user");
const { validateDonation } = require("../schemas/donationSchema"); // Import validation function
const logger = require("../utils/logger")("donationSeeder"); // Import logger

const donationData = [
  {
    title: "Support for Education",
    description:
      "A donation to support education for underprivileged children.",
    isEmergency: false,
    fundraisingGoal: 5000, // New field
  },
  {
    title: "Medical Aid",
    description: "Emergency medical aid for a critical case.",
    isEmergency: true,
    fundraisingGoal: 20000,
  },
  {
    title: "Environmental Conservation",
    description: "Funding for a project aimed at environmental conservation.",
    isEmergency: false,
    fundraisingGoal: 15000,
  },
  // ... (add similar fields to all other donation objects)
  {
    title: "Support for Food Security Programs",
    description:
      "Funding programs that ensure food security in developing countries.",
    isEmergency: true,
    fundraisingGoal: 12000,
  },
];

async function donationSeeder() {
  try {
    await Donation.deleteMany({});
    logger.info("Existing donations cleared.");

    const users = await User.find({});
    const userIds = users.map((user) => user._id);

    const donationPromises = donationData.map(async (donation) => {
      try {
        validateDonation(donation);
        donation.owner = userIds[Math.floor(Math.random() * userIds.length)];
        await Donation.create(donation);
        logger.info(`Donation "${donation.title}" added.`);
      } catch (error) {
        logger.error(`Failed to process donation "${donation.title}": ${error.message}`);
      }
    });

    await Promise.all(donationPromises);
    logger.info("All donations seeded successfully!");
  } catch (error) {
    logger.error("Error seeding donation data:", error);
  }
}

module.exports = donationSeeder;
