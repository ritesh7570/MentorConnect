const Mentor = require("../models/mentor/mentor");
const User = require("../models/user");
const Group = require("../models/group"); // Assuming this model will be shared later
const SuccessStory = require("../models/success"); // Assuming SuccessStory model
const Mentee = require("../models/mentee/mentee"); // Assuming Mentee model
const Event = require("../models/event"); // Assuming Event model
const DiscussionPost = require("../models/discussion"); // Assuming DiscussionPost model

/**
 * Add a new mentor with user creation
 * @param {Object} mentorData - Mentor and user details
 * @returns {Promise<String>} - Created mentor's user ID
 */
async function addMentor({ username, email, password, ...mentorDetails }) {
  try {
    const user = new User({ username, email, password, role: "mentor" });
    const savedUser = await user.save();

    const mentor = new Mentor({ user: savedUser._id, ...mentorDetails });
    await mentor.save();

    return savedUser._id;
  } catch (error) {
    throw new Error("Error adding mentor: " + error.message);
  }
}

/**
 * Delete a mentor by their user ID
 * @param {String} mentorUserId - Mentor's user ID
 * @returns {Promise<Boolean>} - True if deleted, false otherwise
 */
async function deleteMentorByMentorUserId(mentorUserId) {
  try {
    const mentor = await Mentor.findOneAndDelete({ user: mentorUserId });
    if (!mentor) return false;

    await User.findByIdAndDelete(mentorUserId);
    return true;
  } catch (error) {
    throw new Error("Error deleting mentor: " + error.message);
  }
}

/**
 * Fetch mentor details by user ID
 * @param {String} mentorUserId - Mentor's user ID
 * @returns {Promise<Object>} - The mentor details
 */
async function getMentorByMentorUserId(mentorUserId) {
  try {
    return await Mentor.findOne({ user: mentorUserId }).populate("user");
  } catch (error) {
    throw new Error("Error fetching mentor details: " + error.message);
  }
}

/**
 * Update mentor details by their user ID
 * @param {String} mentorUserId - Mentor's user ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} - Updated mentor document
 */
async function updateMentorByMentorUserId(mentorUserId, updateData) {
  try {
    return await Mentor.findOneAndUpdate({ user: mentorUserId }, updateData, { new: true });
  } catch (error) {
    throw new Error("Error updating mentor details: " + error.message);
  }
}

/**
 * Fetch all groups created by a mentor
 * @param {String} mentorUserId - Mentor's user ID
 * @returns {Promise<Array>} - List of groups
 */
async function getAllGroupsCreatedByMentor(mentorUserId) {
  try {
    return await Group.find({ createdBy: mentorUserId });
  } catch (error) {
    throw new Error("Error fetching groups: " + error.message);
  }
}

/**
 * Fetch all success stories for a mentor, latest first
 * @param {String} mentorUserId - Mentor's user ID
 * @returns {Promise<Array>} - List of success stories
 */
async function getAllSuccessStoryByMentorLatestFirst(mentorUserId) {
  try {
    return await SuccessStory.find({ mentor: mentorUserId }).sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Error fetching success stories: " + error.message);
  }
}

/**
 * Fetch all connected mentees for a mentor, latest first
 * @param {String} mentorUserId - Mentor's user ID
 * @returns {Promise<Array>} - List of connected mentees
 */
async function getAllConnectedMenteeByMentorLatestFirst(mentorUserId) {
  try {
    const mentor = await Mentor.findOne({ user: mentorUserId }).populate({
      path: "connections",
      options: { sort: { createdAt: -1 } },
    });
    return mentor.connections;
  } catch (error) {
    throw new Error("Error fetching connected mentees: " + error.message);
  }
}

/**
 * Fetch all discussion posts by a mentor
 * @param {String} mentorUserId - Mentor's user ID
 * @returns {Promise<Array>} - List of discussion posts
 */
async function getAllDiscussionPostByMentorByMentorUserId(mentorUserId) {
  try {
    return await DiscussionPost.find({ createdBy: mentorUserId });
  } catch (error) {
    throw new Error("Error fetching discussion posts: " + error.message);
  }
}

/**
 * Fetch all events organized by a mentor
 * @param {String} mentorUserId - Mentor's user ID
 * @returns {Promise<Array>} - List of events
 */
async function getAllEventOrganisedByMentorByMentorUserId(mentorUserId) {
  try {
    return await Event.find({ organizedBy: mentorUserId });
  } catch (error) {
    throw new Error("Error fetching events: " + error.message);
  }
}

module.exports = {
  addMentor,
  deleteMentorByMentorUserId,
  getMentorByMentorUserId,
  updateMentorByMentorUserId,
  getAllGroupsCreatedByMentor,
  getAllSuccessStoryByMentorLatestFirst,
  getAllConnectedMenteeByMentorLatestFirst,
  getAllDiscussionPostByMentorByMentorUserId,
  getAllEventOrganisedByMentorByMentorUserId,
};