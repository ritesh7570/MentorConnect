const mongoose = require("mongoose");
const Job = require("../models/job");
const JobReview = require("../models/jobReview");
const User = require("../models/user");

const { validateJobReview } = require("../schemas/jobReviewSchema");
const logger = require("../utils/logger")("jobReviewSeeder"); // Import logger

const reviewData = [
  { comment: "Great work environment and amazing learning opportunities." },
  { comment: "The salary was good, but work-life balance needs improvement." },
  { comment: "Excellent mentorship and team collaboration." },
  {
    comment:
      "Had some challenges with management but overall a good experience.",
  },
  { comment: "Fantastic team spirit and supportive colleagues." },
  { comment: "Opportunities for growth but long hours are common." },
  { comment: "Innovative projects and creative freedom." },
  { comment: "Good pay but lacking in job security." },
  { comment: "Positive work culture and team-building activities." },
  { comment: "Limited career progression but great company values." },
  { comment: "Great benefits and perks but high workload." },
  { comment: "Collaborative environment with diverse projects." },
  { comment: "Management is approachable but salary could be better." },
  { comment: "Supportive team and learning resources available." },
  { comment: "Challenging work but rewarding outcomes." },
  { comment: "Great location and flexible hours." },
  {
    comment: "Excellent training programs but office politics can be an issue.",
  },
  { comment: "Friendly colleagues but high turnover rate." },
  { comment: "Good work-life balance and interesting projects." },
  {
    comment: "Salary is competitive but advancement opportunities are limited.",
  },
  { comment: "Dynamic environment with lots of learning opportunities." },
  { comment: "Reasonable work hours and good team support." },
  { comment: "Great company culture but management can be inconsistent." },
  { comment: "Good project variety but work can be stressful." },
  {
    comment: "Excellent resources and tools but communication could be better.",
  },
  { comment: "Supportive managers but limited growth prospects." },
  { comment: "Great place to work if you're a self-starter." },
  { comment: "Diverse and inclusive workplace with strong values." },
  { comment: "Good work environment but compensation could be improved." },
  { comment: "Fantastic team dynamics and positive atmosphere." },
  { comment: "Challenges in project deadlines but rewarding work." },
  { comment: "Great mentorship and professional development." },
  { comment: "Supportive team but project management could use improvement." },
  { comment: "Innovative company with great leadership." },
  { comment: "Good benefits but long working hours." },
  { comment: "Collaborative culture with a focus on innovation." },
  { comment: "Flexible working hours but pay is average." },
  { comment: "Positive work environment with strong team spirit." },
  { comment: "Excellent career growth but high-pressure environment." },
  { comment: "Great leadership but limited resources for certain projects." },
  { comment: "Supportive management and good work-life balance." },
  { comment: "Challenging tasks and opportunities for advancement." },
  { comment: "Good team collaboration but sometimes lack of direction." },
  { comment: "Fantastic workplace culture with room for improvement in pay." },
  { comment: "Encouraging team but often heavy workloads." },
  {
    comment: "Positive atmosphere and professional development opportunities.",
  },
  { comment: "Good salary but limited scope for creativity." },
  { comment: "Excellent teamwork and project variety." },
  { comment: "Great benefits but occasional communication issues." },
  {
    comment: "Supportive environment but management decisions can be unclear.",
  },
  { comment: "Good opportunities for growth but work can be demanding." },
  { comment: "Positive work culture with a focus on employee wellbeing." },
  { comment: "Challenging projects and supportive colleagues." },
  { comment: "Great leadership and advancement opportunities." },
  { comment: "Collaborative team but sometimes lack of work-life balance." },
  { comment: "Innovative environment with a focus on personal growth." },
  { comment: "Good work culture but occasional high stress levels." },
  { comment: "Excellent team dynamics and supportive management." },
  { comment: "Great learning experience but work hours can be long." },
  { comment: "Positive workplace culture but occasional management issues." },
  { comment: "Supportive colleagues and strong team collaboration." },
  { comment: "Good pay and benefits but high workload." },
  { comment: "Great career prospects but office politics can be a challenge." },
  { comment: "Innovative projects with good team support." },
  {
    comment:
      "Positive environment but opportunities for advancement are limited.",
  },
  {
    comment:
      "Excellent work culture with a strong focus on employee satisfaction.",
  },
  { comment: "Good team dynamics but sometimes lack of clear direction." },
  { comment: "Supportive managers and good benefits package." },
  { comment: "Great work-life balance but compensation could be higher." },
  { comment: "Innovative workplace with strong leadership." },
  {
    comment: "Positive atmosphere with good career development opportunities.",
  },
  { comment: "Supportive team but project deadlines can be tight." },
  { comment: "Good pay and benefits but occasional stress." },
  { comment: "Great company culture and supportive work environment." },
  { comment: "Innovative projects and strong team collaboration." },
  {
    comment:
      "Positive work environment but opportunities for growth are limited.",
  },
  { comment: "Good benefits but work-life balance can be challenging." },
  { comment: "Supportive management and career development opportunities." },
  { comment: "Great team spirit but occasional work pressure." },
  { comment: "Excellent work environment with a focus on employee growth." },
  { comment: "Positive atmosphere but high workload at times." },
  { comment: "Supportive team and good career advancement opportunities." },
  { comment: "Good salary but work-life balance can be challenging." },
  { comment: "Innovative projects with strong leadership support." },
  { comment: "Positive work environment but occasional management issues." },
  { comment: "Great benefits and supportive colleagues." },
  { comment: "Good team collaboration but occasional high stress." },
  { comment: "Supportive management and excellent work culture." },
  {
    comment: "Great place to work with good career development opportunities.",
  },
  { comment: "Positive atmosphere and good benefits but high workload." },
  { comment: "Excellent team dynamics and support." },
  { comment: "Good pay and benefits but work hours can be long." },
  { comment: "Innovative workplace with strong support from management." },
  { comment: "Positive work culture with opportunities for growth." },
  { comment: "Supportive colleagues and good learning opportunities." },
  { comment: "Great career prospects but occasional high pressure." },
  { comment: "Positive environment and good benefits package." },
  { comment: "Good work-life balance and supportive management." },
  { comment: "Excellent workplace culture with strong team support." },
  { comment: "Great benefits but high workload at times." },
  { comment: "Supportive environment and good career growth opportunities." },
  { comment: "Positive atmosphere but work can be demanding." },
  { comment: "Innovative projects and good team collaboration." },
  { comment: "Good pay but work-life balance could be improved." },
  { comment: "Excellent work environment with strong team dynamics." },
  { comment: "Supportive management and good learning opportunities." },
  { comment: "Positive work culture with a focus on employee satisfaction." },
  { comment: "Good benefits and career development opportunities." },
  { comment: "Great place to work but high workload at times." },
  { comment: "Supportive colleagues and excellent work environment." },
  { comment: "Good pay and benefits but work pressure can be high." },
  { comment: "Innovative projects with a focus on personal growth." },
  { comment: "Positive atmosphere and good team support." },
  { comment: "Great benefits but work hours can be long." },
  { comment: "Supportive management and positive work environment." },
  { comment: "Good career growth opportunities and supportive team." },
  { comment: "Excellent work culture and benefits package." },
  { comment: "Positive work environment with some management challenges." },
  { comment: "Good pay and career advancement opportunities." },
  { comment: "Great team spirit and supportive colleagues." },
  { comment: "Positive atmosphere but work can be demanding." },
  { comment: "Supportive management and good benefits." },
  { comment: "Excellent career growth opportunities and team collaboration." },
  { comment: "Good work-life balance but occasional high stress." },
  { comment: "Innovative environment with strong leadership support." },
  { comment: "Positive work culture and good team dynamics." },
  { comment: "Great benefits but work hours can be long at times." },
  { comment: "Supportive colleagues and positive work environment." },
  { comment: "Good salary and career advancement opportunities." },
  { comment: "Excellent work environment with strong team support." },
  { comment: "Positive atmosphere and good learning opportunities." },
  { comment: "Good benefits and supportive management." },
  { comment: "Innovative projects with a focus on personal growth." },
  { comment: "Great career development opportunities and team collaboration." },
  { comment: "Positive work environment but work pressure can be high." },
  { comment: "Supportive management and good benefits package." },
  { comment: "Excellent workplace culture with opportunities for growth." },
  { comment: "Good pay and supportive colleagues but high workload." },
];

async function jobReviewSeeder() {
  try {
    // Clear existing job reviews
    await JobReview.deleteMany({});
    logger.info("Existing job reviews cleared.");

    // Fetch all jobs and mentees
    const jobs = await Job.find({});
    const mentees = await User.find({ role: "mentee" }); // Fetch only mentees
    const jobIds = jobs.map((job) => job._id);
    const menteeIds = mentees.map((mentee) => mentee._id);

    if (menteeIds.length === 0) {
      logger.warn("No mentees found. Cannot seed reviews without mentees.");
      return;
    }

    for (const review of reviewData) {
      // Validate the review data
      try {
        await validateJobReview({ jobReview: review });
      } catch (validationError) {
        logger.error(`Failed to validate review: ${validationError.message}`);
        continue; // Skip this review and move to the next one
      }

      // Pick a random job and mentee for the review
      const randomJob = jobIds[Math.floor(Math.random() * jobIds.length)];
      const randomMentee = menteeIds[Math.floor(Math.random() * menteeIds.length)];
      review.author = randomMentee;

      // Create the job review
      const newReview = await JobReview.create(review);
      logger.info(`Review added for Job ID "${randomJob}" by mentee ID "${randomMentee}".`);

      // Update the job with the new review
      await Job.findByIdAndUpdate(randomJob, {
        $push: { reviews: newReview._id },
      });
    }

    logger.info("Job reviews seeded successfully!");
  } catch (error) {
    logger.error("Error seeding job reviews:", error);
  }
}


module.exports = jobReviewSeeder;
