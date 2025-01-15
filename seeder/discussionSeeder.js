const mongoose = require("mongoose");
const Discussion = require("../models/discussion");
const User = require("../models/user");
const { validateDiscussion } = require("../schemas/discussionSchema"); // Import the validation function
const logger = require("../utils/logger")("discussionSeeder"); // Import the logger

const discussionData = [
  {
    title: "How to get started with Node.js?",
    description:
      "I'm new to backend development. Can someone guide me on how to get started with Node.js?",
    queryType: "Technical Query",
  },
  {
    title: "Looking for internship advice",
    description:
      "I'm currently in my final year and seeking advice on how to apply for internships in tech companies.",
    queryType: "Internship",
  },
  {
    title: "Sharing my first coding project",
    description:
      "I just completed my first coding project! Would love feedback and suggestions for improvement.",
    queryType: "Achievement",
  },
  {
    title: "Help needed with debugging",
    description: "I'm stuck with a bug in my Python code. Can anyone help?",
    queryType: "Help",
  },
  {
    title: "General life update",
    description: "Just wanted to share a life update with the community.",
    queryType: "Life Update",
  },
  {
    title: "Best way to learn React?",
    description:
      "What are the best resources to start learning React for frontend development?",
    queryType: "Technical Query",
  },
  {
    title: "Tips for remote internships?",
    description:
      "What are some best practices for handling a remote internship in tech?",
    queryType: "Internship",
  },
  {
    title: "Launched my first website!",
    description:
      "I just launched my personal website. Please give me some feedback on the design and user experience.",
    queryType: "Achievement",
  },
  {
    title: "Need assistance with CSS layout",
    description:
      "I'm having trouble with a CSS Flexbox layout. Any tips or suggestions?",
    queryType: "Help",
  },
  {
    title: "Moved to a new city for a job",
    description:
      "I recently relocated to a new city for my first job. Anyone have tips for adjusting?",
    queryType: "Life Update",
  },
  {
    title: "Which database to use for a small project?",
    description:
      "I'm building a small application and need advice on whether to use MySQL or MongoDB.",
    queryType: "Technical Query",
  },
  {
    title: "How to make a great resume for tech internships?",
    description:
      "What are the key things that stand out in a resume when applying for tech internships?",
    queryType: "Internship",
  },
  {
    title: "Won a hackathon!",
    description:
      "I participated in my first hackathon and won! Here's how I approached the challenge.",
    queryType: "Achievement",
  },
  {
    title: "JavaScript function not returning expected value",
    description:
      "My JavaScript function isn't behaving as expected. Can someone take a look?",
    queryType: "Help",
  },
  {
    title: "Graduated from college!",
    description:
      "I just graduated with a degree in computer science! Excited to see what's next.",
    queryType: "Life Update",
  },
  {
    title: "Understanding async/await in JavaScript",
    description:
      "I'm confused about how async/await works. Can anyone explain it in simple terms?",
    queryType: "Technical Query",
  },
  {
    title: "Interview tips for tech roles?",
    description:
      "What are some common questions asked during tech internship interviews?",
    queryType: "Internship",
  },
  {
    title: "Completed my first mobile app",
    description:
      "Just finished building my first mobile app. Would love some feedback before I publish it.",
    queryType: "Achievement",
  },
  {
    title: "Help with SQL JOIN query",
    description:
      "I’m having trouble with an SQL query that involves multiple JOINs. Any advice?",
    queryType: "Help",
  },
  {
    title: "Starting a new side project",
    description:
      "I’m beginning a new side project related to AI. Anyone want to collaborate?",
    queryType: "Life Update",
  },
  {
    title: "What is the best way to manage state in React?",
    description:
      "Should I use Redux, Context API, or something else to manage state in a React app?",
    queryType: "Technical Query",
  },
  {
    title: "Seeking advice on tech internship applications",
    description:
      "I’m applying to internships at tech startups. What should I focus on to stand out?",
    queryType: "Internship",
  },
  {
    title: "Built my own task management tool",
    description:
      "I developed a simple task management tool. Would love to get your thoughts on it.",
    queryType: "Achievement",
  },
  {
    title: "Node.js error: 'Cannot find module'",
    description:
      "I'm getting a 'Cannot find module' error in Node.js. What could be the issue?",
    queryType: "Help",
  },
  {
    title: "Started learning a new programming language",
    description:
      "I’ve just started learning Rust. It’s been a fun challenge so far!",
    queryType: "Life Update",
  },
  {
    title: "How to optimize React app performance?",
    description:
      "What are some tips and techniques for optimizing the performance of a React app?",
    queryType: "Technical Query",
  },
  {
    title: "How to prepare for a technical phone interview?",
    description:
      "Any tips on how to prepare for phone screens with tech companies?",
    queryType: "Internship",
  },
  {
    title: "Completed my first open-source contribution",
    description:
      "I contributed to an open-source project for the first time! It feels great.",
    queryType: "Achievement",
  },
  {
    title: "CSS animations not working as expected",
    description:
      "My CSS animations aren’t triggering when they should. What could be wrong?",
    queryType: "Help",
  },
  {
    title: "Switched careers to tech",
    description:
      "I recently switched from finance to tech. Excited for the change!",
    queryType: "Life Update",
  },
  {
    title: "Best practices for API design?",
    description:
      "What are some best practices to follow when designing an API for a web application?",
    queryType: "Technical Query",
  },
  {
    title: "How to get a remote internship?",
    description:
      "I want to apply for remote internships in software development. Any suggestions?",
    queryType: "Internship",
  },
  {
    title: "Deployed my first full-stack app!",
    description:
      "I just deployed my first full-stack app on Heroku! Looking forward to your feedback.",
    queryType: "Achievement",
  },
  {
    title: "Issues with Git merge conflicts",
    description:
      "I’m having trouble resolving merge conflicts in Git. What’s the best approach?",
    queryType: "Help",
  },
  {
    title: "Became a mentor for junior developers",
    description:
      "I just started mentoring junior developers in my organization. It’s a rewarding experience.",
    queryType: "Life Update",
  },
  {
    title: "Best Node.js libraries for building APIs?",
    description:
      "Can anyone suggest some useful Node.js libraries for building REST APIs?",
    queryType: "Technical Query",
  },
  {
    title: "How to negotiate an internship offer?",
    description:
      "I’ve received an internship offer and want to negotiate. Any advice?",
    queryType: "Internship",
  },
  {
    title: "Completed 100 days of coding challenge",
    description:
      "I just finished the #100DaysOfCode challenge. It’s been an incredible journey!",
    queryType: "Achievement",
  },
  {
    title: "Help with deploying a React app",
    description:
      "I’m trying to deploy a React app but keep encountering errors. Any ideas?",
    queryType: "Help",
  },
  {
    title: "Got my first job as a junior developer!",
    description:
      "I just got hired as a junior developer at a startup! Super excited to start.",
    queryType: "Life Update",
  },
  {
    title: "Understanding Docker for beginners",
    description:
      "I’m new to Docker. Can someone explain its basics and how to get started?",
    queryType: "Technical Query",
  },
  {
    title: "Applying for internships abroad",
    description:
      "I’m interested in applying for internships outside my home country. What should I consider?",
    queryType: "Internship",
  },
  {
    title: "Completed my first machine learning model",
    description:
      "I built my first ML model using Python. Looking for suggestions to improve it.",
    queryType: "Achievement",
  },
  {
    title: "Can't connect to MongoDB Atlas from Node.js",
    description:
      "I’m having issues connecting my Node.js app to MongoDB Atlas. Any troubleshooting tips?",
    queryType: "Help",
  },
  {
    title: "Started blogging about tech",
    description:
      "I’ve started writing technical blogs to share my learning. Loving the experience!",
    queryType: "Life Update",
  },
  {
    title: "What is the difference between OAuth and JWT?",
    description:
      "I’m confused about the difference between OAuth and JWT for authentication. Can someone clarify?",
    queryType: "Technical Query",
  },
  {
    title: "Best websites to find tech internships?",
    description:
      "Can anyone suggest websites that list internship opportunities in tech?",
    queryType: "Internship",
  },
  {
    title: "Won a coding competition at my university",
    description:
      "I just won a coding competition hosted by my university. It was a great experience!",
    queryType: "Achievement",
  },
  {
    title: "Help needed with SQL query optimization",
    description:
      "My SQL queries are running too slowly. How can I optimize them for better performance?",
    queryType: "Help",
  },
  {
    title: "Attended my first tech conference",
    description:
      "I attended my first tech conference last week. The networking opportunities were great!",
    queryType: "Life Update",
  },
  {
    title: "Best practices for securing a REST API?",
    description:
      "What are some best practices for securing a RESTful API in Node.js?",
    queryType: "Technical Query",
  },
  {
    title: "How to follow up after an internship interview?",
    description:
      "I recently had an interview for an internship and want to follow up. How should I do it?",
    queryType: "Internship",
  },
  {
    title: "Built a portfolio website!",
    description:
      "I just built and deployed my portfolio website. I’d appreciate your feedback.",
    queryType: "Achievement",
  },
  {
    title: "Can't get my Flask app to run on Heroku",
    description:
      "I’m trying to deploy my Flask app to Heroku but it’s not working. Can anyone help?",
    queryType: "Help",
  },
  {
    title: "Started a tech podcast!",
    description:
      "I recently launched a tech podcast where I interview developers and share insights.",
    queryType: "Life Update",
  },
  // Add more similar data units up to 100
];
async function discussionSeeder() {
  try {
    // Clear existing discussions
    await Discussion.deleteMany({});
    logger.info("Existing discussions cleared.");

    // Fetch all user IDs
    const users = await User.find({});
    const userIds = users.map((user) => user._id);

    if (userIds.length === 0) {
      logger.warn("No users found to assign discussions to.");
      return;
    }

    const discussionPromises = discussionData.map(async (discussion) => {
      try {
        validateDiscussion(discussion);
        discussion.owner = userIds[Math.floor(Math.random() * userIds.length)];

        const createdDiscussion = await Discussion.create(discussion);
        logger.info(`Discussion created: ${createdDiscussion.title}`);
        return createdDiscussion; // Return the created discussion
      } catch (error) {
        logger.error(`Error in discussion creation: ${error.message}`);
        throw error; // Propagate the error
      }
    });

    await Promise.all(discussionPromises);
    logger.info("Discussion data seeded successfully!");
  } catch (error) {
    logger.error("Error seeding discussion data:", error);
  }
}

module.exports = discussionSeeder;