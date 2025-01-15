const Mentee = require("../models/mentee/mentee");
const User = require("../models/user");
const DiscussionPost = require("../models/discussion"); // Assuming DiscussionPost model
const Event = require("../models/event"); // Assuming Event model

/**
 * Add a new mentee with user creation
 * @param {Object} menteeData - Mentee and user details
 * @returns {Promise<String>} - Created mentee's user ID
 */
async function addMentee({ username, email, password, ...menteeDetails }) {
  try {
    const user = new User({ username, email, password, role: "mentee" });
    const savedUser = await user.save();

    const mentee = new Mentee({ user: savedUser._id, ...menteeDetails });
    await mentee.save();

    return savedUser._id;
  } catch (error) {
    throw new Error("Error adding mentee: " + error.message);
  }
}

/**
 * Delete a mentee by their user ID
 * @param {String} menteeUserId - Mentee's user ID
 * @returns {Promise<Boolean>} - True if deleted, false otherwise
 */
async function deleteMenteeByMenteeUserId(menteeUserId) {
  try {
    const mentee = await Mentee.findOneAndDelete({ user: menteeUserId });
    if (!mentee) return false;

    await User.findByIdAndDelete(menteeUserId);
    return true;
  } catch (error) {
    throw new Error("Error deleting mentee: " + error.message);
  }
}

/**
 * Fetch mentee details by user ID
 * @param {String} menteeUserId - Mentee's user ID
 * @returns {Promise<Object>} - The mentee details
 */
async function getMenteeByMenteeUserId(menteeUserId) {
  try {
    return await Mentee.findOne({ user: menteeUserId }).populate("user");
  } catch (error) {
    throw new Error("Error fetching mentee details: " + error.message);
  }
}

/**
 * Update mentee details by their user ID
 * @param {String} menteeUserId - Mentee's user ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} - Updated mentee document
 */
async function updateMenteeByMenteeUserId(menteeUserId, updateData) {
  try {
    return await Mentee.findOneAndUpdate({ user: menteeUserId }, updateData, { new: true });
  } catch (error) {
    throw new Error("Error updating mentee details: " + error.message);
  }
}

/**
 * Fetch all discussion posts by a mentee
 * @param {String} menteeUserId - Mentee's user ID
 * @returns {Promise<Array>} - List of discussion posts
 */
async function getAllDiscussionPostByMenteeByMenteeUserId(menteeUserId) {
  try {
    return await DiscussionPost.find({ createdBy: menteeUserId });
  } catch (error) {
    throw new Error("Error fetching discussion posts: " + error.message);
  }
}

/**
 * Fetch all events attended or created by a mentee
 * @param {String} menteeUserId - Mentee's user ID
 * @returns {Promise<Array>} - List of events
 */
async function getAllEventByMenteeByMenteeUserId(menteeUserId) {
  try {
    return await Event.find({ attendees: menteeUserId });
  } catch (error) {
    throw new Error("Error fetching events: " + error.message);
  }
}

module.exports = {
  addMentee,
  deleteMenteeByMenteeUserId,
  getMenteeByMenteeUserId,
  updateMenteeByMenteeUserId,
  getAllDiscussionPostByMenteeByMenteeUserId,
  getAllEventByMenteeByMenteeUserId,
};
