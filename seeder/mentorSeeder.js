const mongoose = require("mongoose");
const User = require("../models/user");
const Mentor = require("../models/mentor/mentor");

const mentors = [
  {
    username: "mentor11",
    password: "m",
    role: "mentor",
    expertise: ["Web Development", "JavaScript"],
    yearsOfExperience: 5,
    bio: "Web developer with expertise in React and Node.js",
    linkedIn: "https://linkedin.com/in/mentorjohn",
    twitter: "https://twitter.com/mentorjohn",
    github: "https://github.com/mentorjohn",
    portfolio: "https://mentorjohn.dev",
    availability: {
      type: "immediate",
      startTime: new Date(),
    },
  },
  {
    username: "mentor_jane11",
    password: "securepassword",
    role: "mentor",
    expertise: ["Data Science", "Python"],
    yearsOfExperience: 7,
    bio: "Data scientist with a focus on AI and ML.",
    linkedIn: "https://linkedin.com/in/mentorjane",
    availability: {
      type: "scheduled",
      startTime: new Date("2024-11-20T10:00:00"),
      endTime: new Date("2024-11-20T12:00:00"),
    },
  },
];

const seedMentors = async () => {
  try {
    // await User.deleteMany({ role: "mentor" }); // Clear existing mentor users
    // await Mentor.deleteMany(); // Clear existing mentor records
    console.log("Existing mentors removed.");

    for (const mentorData of mentors) {
      // Create a new User
      const user = new User({
        username: mentorData.username,
        role: mentorData.role,
      });

      await user.setPassword(mentorData.password); // Hash and set password
      await user.save();
      console.log(`User ${mentorData.username} created.`);

      // Create a new Mentor referencing the User
      const mentor = new Mentor({
        user: user._id,
        expertise: mentorData.expertise,
        yearsOfExperience: mentorData.yearsOfExperience,
        bio: mentorData.bio,
        linkedIn: mentorData.linkedIn,
        twitter: mentorData.twitter,
        github: mentorData.github,
        portfolio: mentorData.portfolio,
        availability: mentorData.availability,
      });

      await mentor.save();
      console.log(`Mentor ${mentorData.username} created.`);
    }
  } catch (err) {
    console.error("Error seeding mentors:", err);
  }
};

module.exports = seedMentors;
