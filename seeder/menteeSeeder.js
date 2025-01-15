const mongoose = require("mongoose");
const User = require("../models/user");
const Mentee = require("../models/mentee/mentee");

const mentees = [
  {
    username: "mentee",
    password: "m",
    role: "mentee",
    goals: "Learn full-stack web development and improve coding skills.",
    interests: ["Web Development", "React", "Node.js"],
    progress: "Not Started",
  },
  {
    username: "mentee_sara",
    password: "saraSecure123",
    role: "mentee",
    goals: "Improve data science skills and work on machine learning projects.",
    interests: ["Data Science", "Python", "Machine Learning"],
    progress: "In Progress",
  },
];

const seedMentees = async () => {
  try {
    await User.deleteMany({ role: "mentee" }); // Clear existing mentee users
    await Mentee.deleteMany(); // Clear existing mentee records
    console.log("Existing mentees removed.");

    for (const menteeData of mentees) {
      // Create a new User
      const user = new User({
        username: menteeData.username,
        role: menteeData.role,
      });

      await user.setPassword(menteeData.password); // Hash and set password
      await user.save();
      console.log(`User ${menteeData.username} created.`);

      // Create a new Mentee referencing the User
      const mentee = new Mentee({
        user: user._id,
        goals: menteeData.goals,
        interests: menteeData.interests,
        progress: menteeData.progress,
      });

      await mentee.save();
      console.log(`Mentee ${menteeData.username} created.`);
    }
  } catch (err) {
    console.error("Error seeding mentees:", err);
  }
};

module.exports = seedMentees;
